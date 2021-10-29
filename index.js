const express = require('express');
const { MongoClient } = require("mongodb");
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');
require("dotenv").config();

const app = express();
const port = 5000;


// middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('server is loading');
})
// oFjxLRzrXoPIoKAa
// mehedidbcar

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vukhj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true,});

async function run() {
    try {
    
        await client.connect();
        const database = client.db("carMechanic");
        const serviceCollection = database.collection('services');
  
        // GET API
        
        app.get('/services', async (req, res) => {
            const cursor = serviceCollection.find({});
            const services = await cursor.toArray();
            res.send(services)
             
        });
        
        // GET SINGLE SERVICE
        
        app.get('/services/:id', async(req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            console.log('getting id', id);
            const service = await serviceCollection.findOne(query);
            res.json(service);
        })
        
        
        // POST API
        
        app.post('/services', async (req, res) => {
            
            const service = req.body;
            console.log("hit the apissss", service);
            const result = await serviceCollection.insertOne(service); 
            res.json(result)
        });
        
        // DELETE API 
        
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await serviceCollection.deleteOne(query);
            res.json(result)
        })
        
        
        
    }
    finally {
        // await client.close();
    }
    
}

run().catch(console.dir);



app.listen(port, () => {
    console.log('Running Genius Server on port', port);
})