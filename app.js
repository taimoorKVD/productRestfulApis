require('dotenv').config()
require('express-async-errors')

const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const notFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')
const connectDB = require('./db/connect')
const productRoute = require('./routes/products')

app.use(express.json())

//*** Allowing X-domain request ***//
var allowCrossDomain = function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Cache-Control");

    //*** intercept OPTIONS method ***//
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
};
app.use(allowCrossDomain);

//*** routes ***//
app.get('/', (req, res) => {
    res.send('<h1>Store Api</h1> <a href="/api/v1/products">Products Route</a>')
})

//*** product api routes ***//
app.use('/api/v1/products', productRoute)

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)


const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port, console.log(`Server is up on port: ${port}`))
    } catch (error) {
        console.log(error)
    }
}
start()