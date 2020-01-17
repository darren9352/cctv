const cv = require('opencv4nodejs');
const express = require('express');
const path = require('path');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
require('dotenv').config();

const FPS = 30;

const wCap = new cv.VideoCapture(0);
wCap.set(cv.CAP_PROP_FRAME_WIDTH, 300);
wCap.set(cv.CAP_PROP_FRAME_HEIGHT, 300);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

setInterval(()=>{
    const frame = wCap.read();
    const image = cv.imencode('.jpg', frame).toString('base64');
    const request = require('request');
    const api_rul = 'https://naveropenapi.apigw.ntruss.com/vision/v1/face';
    const _formData = {
        image: 'image',
        image: cv.imencode('.jpg', frame)
    };
    request.post({url:api_rul, formData:_formData,
    headers:{'X-NCP-APIGW-API-KEY-ID': process.env.CLIENT_ID, 'X-NCP-APIGW-API-KEY': process.env.CLIENT_SECRET}}, function(err, httpResponse, body){
        console.log(body);
    })
    io.emit('image', image);
}, 1000 / FPS)

server.listen(3000);