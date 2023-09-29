// Express
const express = require('express')
const app = express()
const cors = require('cors')
var cookieParser = require('cookie-parser');
const jsonParser = express.json();

app.use(cors({origin: '*'}))
app.use('/static', express.static('public'));
app.use(cookieParser());
app.use(jsonParser)

// Главная
app.get('/', (_req, res) => {
  res.sendFile(__dirname+'/login.html')
})
app.get('/:uid', (_req, res) => {
    res.sendFile(__dirname+'/blank.html')
  })
app.listen(80, '0.0.0.0', () => {
  console.log('Сервер запущен')
  console.log('server started')
})

