const express = require('express');
const app = express();
const cookieParser = require('cookie-parser')
const cors = require('cors')

const auth = require('./routes/auth');
const disaster = require('./routes/disaster');
const area = require('./routes/area');
const tool = require('./routes/tool');

app.use(cors())
app.use(express.json({limit:'50mb'}));
app.use(express.urlencoded({limit: "50mb", extended: true }));
app.use(cookieParser());


app.use('/api/v1', auth);
app.use('/api/v1', disaster);
app.use('/api/v1', area);
app.use('/api/v1', tool);




module.exports = app