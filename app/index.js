// Express
const express = require('express')
const app = express()
const connectDB = require('./config/database.js')
const siteRouter = require('./routers/siteRouter.js')
const cors = require('cors')
var cookieParser = require('cookie-parser');
const jsonParser = express.json();

connectDB()
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.use(cors({origin: '*'}))
app.use(cookieParser());
app.use(jsonParser)

// Главная
app.get('/', (_req, res) => {
  res.status(200).json({
    message: 'ping',
  })
})

app.use('/sites', siteRouter)

app.listen(3000, () => {
  console.log('Сервер запущен')
  console.log('server started')
})

