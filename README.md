## Basic node.js implementation of distributed Map/Reduce

The implementation includes the example of Map/Reduce operation in a Master/Slave setup.\
Each slave node has the data represented as HashMap<key, value> and the function to map it to.
Master/reduce node gathers the data from all connected nodes, does the groupby Key op.
and reduces the values for the same key.
The output is a HashMap<key, reduced_value>.

Each node has a name and the data passed through shell arguments when running the process.
For the sake of simplicity data is represented as 
values in `range(from, to)` (see in Docs sec.)

#### Docs

`node client.js FROM TO NODE_NAME` - serves the data storage slave node
- FROM/TO -- setups the data of a node - range of values from FROM to TO inclusive;
- NODE_NAME -- the name of the node in interprocess communication;

`node server.js` - serves master/reduce node

#### E.x. Run:
1. `npm install` # to install the dependencies
2. `node server.js` # to start a Reducer server
3. `node client.js 10 50 Cat` # Node1
4. `node client.js 40 80 Dog` # Node2
5. Make a GET request to `http://localhost:8080/start-map/`
