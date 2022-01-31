const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const port = process.env.PORT || 5000


// middle wear
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.va22h.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        // console.log('Database connected successfully')
        const database = client.db('btcCompany');
        const showroomsCollection = database.collection('showrooms');
        const usersCollection = database.collection('users')

        app.get('/showrooms', async (req, res) => {
            const email = req.query.email;
            const date = new Date(req.query.date).toLocaleDateString();
            console.log(date);
            const query = { email: email, date: date };
            // console.log(query)
            const cursor = showroomsCollection.find(query);
            const showrooms = await cursor.toArray();
            res.json(showrooms);
        })

        app.post('/showrooms', async (req, res) => {
            const showroom = req.body;
            const result = await showroomsCollection.insertOne(showroom);
            console.log(result)
            res.json(result)
        });
        app.post('/users', async (req, res) => {
            const user = req.body;
            console.log(user)
            const result = await usersCollection.insertOne(user);
            console.log(result)
            res.json(result);
        })


    } finally {
        // await client.close();
    }
}
run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('Hello world BTC Company')
})

app.listen(port, () => {
    console.log(`Running port ${port}`)
})