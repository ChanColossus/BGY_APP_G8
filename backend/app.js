const express = require('express');
const app = express();
const cookieParser = require('cookie-parser')
const cors = require('cors')
//  const services = require('./routes/service');
// const auth = require('./routes/auth');
// const member = require('./routes/members');
// const portfolio = require('./routes/portfolio');

// const order = require('./routes/order');

app.use(cors())
app.use(express.json({limit:'50mb'}));
app.use(express.urlencoded({limit: "50mb", extended: true }));
app.use(cookieParser());
// app.use(express.json());
// app.use('/api/v1', services);
// // app.use('/api/v1', products);
// app.use('/api/v1', auth);
// app.use('/api/v1', member);
// app.use('/api/v1', portfolio);
// app.use('/api/v1', order);




module.exports = app