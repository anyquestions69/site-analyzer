var WebSocket = require('ws')
const http = require('http')
const express = require('express')
const app = express()


const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
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



wss.on('connection', function connection(ws) 
{
    console.log('connected')
   ws.on('message', function incoming(res) 
   {
        let qmsg = res
        console.log(Buffer.from(res))
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
                        ws.send( msg.content.toString())
                    }
                    channel.cancel(ct);
                    
                }, {
                    consumerTag:ct, 
                    noAck: true
                });
                channel.sendToQueue('url_queue',
                    Buffer.from(res), {
                        correlationId: correlationId,
                        replyTo: q.queue
                    });
            });
        }else{
            socket.emit('err', 'error')
        }
      console.log('received: %s', res);
   });
 
      
}); 

server.listen(8000, '0.0.0.0', () => {
    console.log(
      `Server running at http://0.0.0.0:8000/`
    )
})
function generateUuid() {
    return Math.random().toString() +
           Math.random().toString() +
           Math.random().toString();
  }