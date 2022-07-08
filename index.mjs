import express from 'express';
import cors from 'cors';
import { router } from './routes/router.mjs';
import { Server } from "socket.io";
import fs from 'fs';

const app = express();
app.use(cors());
app.use('/public', express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', router);


const server=app.listen(6415, () => {
    console.log(`listening on port 6415`);
})

const io = new Server(server, { /* options */ });

io.on("connection", (client) => {
    console.log("Connected  "+client.id);
    client.on('onCall', (data)=> {
        console.log(data)
        io.emit('onCall', data);
    });
});

app.get('/socket-test', function(req, res) {
    const html=fs.readFileSync('public/index.html', 'utf8');
    res.send(html);
});



export const socket_io = io;
