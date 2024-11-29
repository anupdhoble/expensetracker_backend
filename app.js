const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const bodyParser = require('body-parser');
const cors = require('cors'); // Import cors

const app = express();
app.use(bodyParser.json());//parser text from body really helpfull
app.use(cors());
const PORT = process.env.PORT || 5000;



mongoose.connect(process.env.MONGO_STRING).then(() => {
    console.log('App connected to database');
    app.listen(PORT, () => {
        console.log(`App is running on port:${PORT}`);
    });
}).catch((error) => {
    console.log(error);
});

app.get('/', (req, res) => {
    res.send('Hello World');
});
app.use('/user',require('./routes/user.js'));
app.use('/expense',require('./routes/expense'));


