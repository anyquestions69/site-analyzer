const express = require('express')
const app = express()
const connectDB = require('./config/database.js')
const siteRouter = require('./routers/siteRouter.js')
const cors = require('cors')
var multer      = require('multer'); 
var cookieParser = require('cookie-parser');
const jsonParser = express.json();
const importXls = require('./importXls.js')
const Site = require('./models/user.js')

connectDB()

var storage = multer.diskStorage({  
  destination:(req,file,cb)=>{  
      cb(null,'./uploads');  
  },  
  filename:(req,file,cb)=>{  
      cb(null,file.originalname);  
  }  
});  
 
var upload = multer({storage:storage});  

app.use(function (req, res, next) {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.use(cors({origin: '*'}))
app.use(cookieParser());
app.use(jsonParser)

var amqp = require('amqplib/callback_api');
var connection
var channel

amqp.connect('amqp://rabbitmq', function(error0, conn) {
    if (error0) {
        throw error0;
    }
    console.log('connected to rabbitmq')
    connection=conn
    connection.createChannel(function(error1, ch) {
        if (error1) {
            throw error1;
        }
        channel=ch
    });
});
// Главная
app.get('/', async (req, res) => {
  let {url} = req.query
  let exist = await Site.findOne({url:url})
  if(exist)
    return res.send({category:exist.category, theme:exist.theme})
  if(channel){
    channel.prefetch(1, false);
    channel.assertQueue('', {
        exclusive: true,
        autoDelete:true
    }, function(error2, q) {
        if (error2) {
            throw error2;
        }
        var correlationId = generateUuid();
        var ct= generateUuid()
        channel.consume(q.queue,async function(msg,err) {
            if (msg.properties.correlationId === correlationId) {
                console.log('Ответ парсера: %s', msg.content.toString());
                channel.cancel(ct);
                let response = JSON.parse(msg.content.toString())
                await Site.create(response)
                return res.send({category:response.category, theme:response.theme})
            }
        }, {
            consumerTag:ct, 
            noAck: true
        });
        channel.sendToQueue('url_queue',
            Buffer.from(JSON.stringify({url:url})), {
                correlationId: correlationId,
                replyTo: q.queue
            });
    });
}else{
   return res.status(404).send({error:'errro'})
}
})

app.use('/sites', siteRouter)
app.post('/upload', upload.single('table'), importXls)

app.listen(3000, () => {
  console.log('Сервер запущен')
  console.log('server started')
})

function generateUuid() {
    return Math.random().toString() +
           Math.random().toString() +
           Math.random().toString();
  }