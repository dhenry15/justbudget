const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const passport = require('passport');
const users = require('./routes/api/users');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(
    bodyParser.urlencoded({extended: false})
);
app.use(bodyParser.json());

const db = require("./config/keys").mongoURI;

mongoose.connect(
    db,
    {useNewUrlParser: true}
).then(
    () => console.log('MongoDB connection successful')
).catch(
    err => console.log(err.message)
);

app.use(passport.initialize());

require('./config/passport')(passport);

app.use('/api/users', users);


const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}...`));





