const io = require('socket.io-client');
const HashMap = require('hashmap');

const mapper = (v, k) => ({v, k: Math.floor(Math.random() * 5) * k});

const initLocalStorage = () => {
    let start = parseInt(process.argv[2]);
    const end = parseInt(process.argv[3]);
    const storage = new HashMap();
    for (let i = start; i < end; i++) {
        storage.set(i, i);
    }
    return storage;
}

const local_storage = initLocalStorage();
const name = process.argv[4];

const processMapAndDistribute = (data, socket) => {
    socket.emit('transfer-start', {name})
    const promiseArray = [];
    local_storage.forEach((v, k) => {
        promiseArray.push(new Promise(resolve => socket.emit('data', mapper(v, k), resolve)))
    })
    Promise.all(promiseArray).then(() => socket.emit('transfer-end', {name}));
}

const socket = io.connect('http://localhost:8080/');
socket.on('map', (data) => {
    console.log("Got map command from the server with data:", data);
    processMapAndDistribute(local_storage, socket)
})
