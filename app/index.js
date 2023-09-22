// Express
const express = require('express')
const app = express()
const connectDB = require('./config/database.js')
const siteRouter = require('./routers/siteRouter.js')
var WebSocketServer = require('ws').Server
, wss = new WebSocketServer({ port: 8000 });
var cookieParser = require('cookie-parser');
const jsonParser = express.json();
var amqp = require('amqplib/callback_api');
var connection
var channel

connectDB()

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

wss.on('connection', function connection(ws) 
{
    console.log('connected')
   ws.on('url', function incoming(res) 
   {
    let qmsg = JSON.stringify(res)
        console.log(qmsg)
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
                channel.consume(q.queue,function(msg,err) {
                    
                    if (msg.properties.correlationId === correlationId) {
                        console.log(' [.] По результатам теста %s', msg.content.toString());
                        socket.emit('response', msg.content.toString())
                    }
                    channel.cancel(ct);
                    
                }, {
                    consumerTag:ct, 
                    noAck: true
                });
                channel.sendToQueue('url_queue',
                    Buffer.from(qmsg), {
                        correlationId: correlationId,
                        replyTo: q.queue
                    });
            });
        }else{
            socket.emit('err', 'error')
        }
      console.log('received: %s', message);
   });
 
   ws.send('something');
}); 


function generateUuid() {
    return Math.random().toString() +
           Math.random().toString() +
           Math.random().toString();
  }