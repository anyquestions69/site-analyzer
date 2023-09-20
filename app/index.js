// Express
const express = require('express')
const app = express()
const connectDB = require('./config/database.js')
const siteRouter = require('./routers/siteRouter.js')
//const authRouter = require('./routers/authRouter.js')
connectDB()

var cookieParser = require('cookie-parser');
const jsonParser = express.json();
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