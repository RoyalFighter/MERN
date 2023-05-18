// 4emcaHwpMEBs3TJ2
import express from 'express';
import mongoose from 'mongoose';
import Cards from './dbCards.js';
import cors from 'cors';
// app config
const app = express();
const port = process.env.PORT || 9000;
 const connection_url="mongodb+srv://admin:4emcaHwpMEBs3TJ2@cluster0.6zou9zm.mongodb.net/?retryWrites=true&w=majority"



// middlewares
app.use(cors());
app.use(express.json());


// DB config to connect with database
mongoose.connect(connection_url, {
    useNewUrlParser: true, 

    useUnifiedTopology: true 
    
    
    });



// // // api routes
app.get('/', (req, res) => res.status(200).send('hello World isubham dude'));
app.post("/tinder/cards", (req, res) => {
    const dbCard = req.body;

    Cards.create(dbCard, (err, data) => {
        if (err) {
            res.status(500).send(err)
        }
        else {
            res.status(201).send(data)
        }
    })
});
app.get("/tinder/cards", (req, res) => {
    Cards.find((err, data) => {
        if (err) {
            res.status(500).send(err)
        }
        else {
            res.status(200).send(data)
        }
    })
});

// listener
app.listen(port, () => console.log(`listening on localhost: ${port}`));