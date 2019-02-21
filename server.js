const HashMap = require('hashmap');
const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const data_collection = [];
const nodes_transfering = new HashMap();
let reducingInProcess = false;

const mapper = (v, k) => ({v, k: Math.floor(Math.random() * 5) * k});
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
    });
    return map_.entries().map(([k, v]) => ({k, v: reduceFunc(v)}))
};

app.get('/start-map', (req, res) => {
    if (!reducingInProcess) {
        const promiseArray = Object.keys(io.sockets.sockets)
            .map(s_id => new Promise(resolve => io.sockets.sockets[s_id].emit('map', {f: mapper+''}, resolve)))
        Promise.all(promiseArray).then(() => {
            res.send("Starting map");
            reducingInProcess = true;
        }).catch(console.error)
    } else {
        res.send("Reducing in process")
    }
});

io.on("connection", (socket) => {
    socket.on("data", (data, cb) => {
        data_collection.push(data);
        cb()
    });
    socket.on("transfer-start", ({name}) => {
        nodes_transfering.set(name, true)
    });
    socket.on("transfer-end", ({name}) => {
        console.log("Transfer-end from :", name);
        nodes_transfering.set(name, false);
        if (!nodes_transfering.values().some((el) => el)) {
            console.log(doMapReduce(data_collection, reducer));
            reducingInProcess = false;
        }
    })
});

server.listen(8080);
