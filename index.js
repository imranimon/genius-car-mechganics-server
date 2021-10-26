const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ug28d.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("carMechanics");
        const servicesCollection = database.collection('services');

        //Get Api
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({})
            const services = await cursor.toArray();
            res.json(services)

        })

        //Get single service
        app.get('/services/:serviceId', async (req, res) => {
            const id = req.params.serviceId;
            const query = { _id: ObjectId(id) }
            const result = await servicesCollection.findOne(query);
            console.log(result);
            res.json(result)
        })

        // Post Api
        app.post('/services', async (req, res) => {
            const service = req.body
            const result = await servicesCollection.insertOne(service);
            console.log(result);
            res.json(result)
        })

        //Delete Api
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await servicesCollection.deleteOne(query);
            res.json(result)
        })


    } finally {
        // await client.close()
    }

}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Genius Car Mechanic Server Running')
})

app.get('/api', (req, res) => {
    const api = {
        '/services': 'To GET all the services',
        '/services/:id': 'A GET or DELETE a single service by its id'
    }
    res.json(api)
})

app.listen(port, () => {
    console.log('Running Genius Server on port', port);
});