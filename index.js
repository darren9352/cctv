const cv = require('opencv4nodejs');
const express = require('express');
const path = require('path');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
require('dotenv').config();

const FPS = 10;

const wCap = new cv.VideoCapture(0);
wCap.set(cv.CAP_PROP_FRAME_WIDTH, 300);
wCap.set(cv.CAP_PROP_FRAME_HEIGHT, 300);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});
this.idx = 0;
setInterval(()=>{
    this.idx += 1;
    const frame = wCap.read();
    const image = cv.imencode('.jpg', frame).toString('base64');
    const request = require('request');
    const api_rul = 'https://naveropenapi.apigw.ntruss.com/vision/v1/face';
    const _formData = {
        image: 'image',
        image: cv.imencode('.jpg', frame)
    };
    if(this.idx % 100 == 0){
        request.post({url:api_rul, formData:_formData,
            headers:{'X-NCP-APIGW-API-KEY-ID': process.env.CLIENT_ID, 'X-NCP-APIGW-API-KEY': process.env.CLIENT_SECRET}}, function(err, httpResponse, body){
                const timezoneOffset = new Date().getTimezoneOffset() * 60000;
                const timezoneDate = new Date(Date.now() - timezoneOffset);

                let options = {
                    uri: `http://${process.env.ELASTIC_HOST}:9200/customer/external/` + timezoneDate.toISOString(),
                    method: 'POST',
                    body:JSON.parse(body),
                    json:true //json으로 보낼경우 true로 해주어야 header값이 json으로 설정됩니다.
                };
                request.post(options,function(er,res,bod){
                    console.log(bod);
                })
                console.log(body);
        });
        this.idx = 0;
    }

    io.emit('image', image);
}, 1000 / FPS)

server.listen(3000);