const express = require("express");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

// middleware thi sff
app.use(cors());
app.use(express.json());

// user : geniususer
// pass : S7bweOgq9YUoxJFD

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.p3m2s.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("genius");
    const servicesCollection = database.collection("services");
    // post api data create koro
    app.post("/services", async (req, res) => {
      const newService = req.body;
      //   console.log("hitted", newService);
      const result = await servicesCollection.insertOne(newService);
      res.json(result);
      //   console.log(result);
    });

    // data read korbo ui te dekhanor jonno
    app.get("/services", async (req, res) => {
      const cursor = servicesCollection.find({});
      const services = await cursor.toArray();
      res.send(services);
    });

    // get api show the single service data on the ui
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await servicesCollection.findOne(query);
      res.send(result);
    });

    // delete api delete service on the ui
    app.delete("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await servicesCollection.deleteOne(query);
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Running genius car machinics");
});

app.get("/hello", (req, res) => {
  res.send("hello heroku how are you");
});

app.listen(port, () => {
  console.log("Listening to port ", port);
});
