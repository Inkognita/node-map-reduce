const io = require('socket.io-client');
const HashMap = require('hashmap');

const initLocalStorage = () => {
    let start = parseInt(process.argv[2]);
    const end = parseInt(process.argv[3]);
    const storage = new HashMap();
    for (let i = start; i < end; i++) {
        storage.set(i, i);
    }
    return storage;
};

const local_storage = initLocalStorage();
const name = process.argv[4];

const processMapAndDistribute = (data, socket, map_func) => {
    socket.emit('transfer-start', {name});
    const promiseArray = [];
    local_storage.forEach((v, k) => {
        promiseArray.push(new Promise(resolve => socket.emit('data', map_func(v, k), () => {
            resolve();
        })))
    });
    Promise.all(promiseArray).then(() => {
        socket.emit('transfer-end', {name})
    }).catch(console.error);
};

const socket = io.connect('http://localhost:8080/');
socket.on('map', ({f}, cb) => {
    processMapAndDistribute(local_storage, socket, eval(f));
    cb()
});
