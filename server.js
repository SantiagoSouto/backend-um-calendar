import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express()

// Constants
const PORT = 3000;

// Install middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());

app.get('/', (req, res) => {
    res.send("Hello World!");
})

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));