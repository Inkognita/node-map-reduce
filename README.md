## Basic node.js implementation of distributed Map/Reduce

The implementation includes the example Map/Reduce operation with multiple nodes
containing the data.


E.x. Setup:

1. `npm install`
2. `node server.js`
3. `node client.js 10 50 Cat`
4. `node client.js 40 80 Dog`
5. Make a GET request to `http://localhost:8080/start-map/`