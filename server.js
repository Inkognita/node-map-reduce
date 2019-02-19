const HashMap = require('hashmap');
const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const data_collection = [];
const nodes_transfering = new HashMap();
let reducingInProcess = false;

const reducer = data_ => {
    return data_.reduce((a, b) => a + b)
};
const doMapReduce = (input, reduceFunc) => {
    const map_ = new HashMap();
    input.forEach(({k, v}) => {
        if (!map_.has(k)) {
            map_.set(k, [])
        }
        map_.get(k).push(v)
    })
    return map_.entries().map(([k, v]) => ({k, v: reduceFunc(v)}))
}

app.get('/start-map', (req, res) => {
    if (!reducingInProcess) {
        io.emit('map');
        res.send("Starting map");
        reducingInProcess = true;
    } else {
        res.send("Reducing in process")
    }
})

io.on("connection", (socket) => {
    socket.on("data", (data) => {
        data_collection.push(data)
        console.log("Data")
    })
    socket.on("transfer-start", ({name}) => {
        nodes_transfering.set(name, true)
    })
    socket.on("transfer-end", ({name}) => {
        nodes_transfering.set(name, false)
        if (!nodes_transfering.values().some((el) => el)) {
            console.log(doMapReduce(data_collection, reducer))
            reducingInProcess = false;
        }
    })
});

server.listen(8080);
