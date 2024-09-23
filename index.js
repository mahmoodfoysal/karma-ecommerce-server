const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId, Collection } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.da6po2r.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    // ***************************code write here*************************** 
    const database = client.db("karma-ecommerce");
    const cardCategoryCollection = database.collection("card-category");

    // ########################## all post api are write here ###############################
    app.post('/card-category', async (req, res) => {
      const data = req.body;
      try {
        if (data._id) {
          const userId = data._id;
          delete data._id;
    
          const result = await cardCategoryCollection.updateOne(
            { 
              _id: new ObjectId(userId) 
            },
            { 
              $set: data 
            }
          );
          if (result.matchedCount === 0) {
            return res.status(404).send({ error: 'User not found' });
          }
          res.send(result);
        } else {
          const result = await cardCategoryCollection.insertOne(data);
          res.status(201).send(result);
        }
      } catch (error) {
        res.status(500).send({ error: 'Failed to create or update user' });
      }
    });

    app.get('/card-category', async(req, res) => {
        const getCategory = cardCategoryCollection.find();
        const result = await getCategory.toArray();
        res.send(result);
    });

  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Server Running...!!!')
})

app.listen(port, () => {
  console.log(`Express Server Running ${port}`)
})