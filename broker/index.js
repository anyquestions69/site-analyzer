const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server,{
    cors: {
        origin: "*"
      }
});
var amqp = require('amqplib/callback_api');
var connection
var channel

amqp.connect('amqp://rabbitmq', function(error0, conn) {
    if (error0) {
        throw error0;
    }
    connection=conn
    connection.createChannel(function(error1, ch) {
        if (error1) {
            throw error1;
        }
        channel=ch
        
    });
});


io.on('connection', (socket) => {
    console.log('connected')
    socket.on('url', async(res)=>{
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
        
		
    })

})
  
  server.listen(3000, () => {
    console.log('listening on *:3000');
  });


function generateUuid() {
    return Math.random().toString() +
           Math.random().toString() +
           Math.random().toString();
  }