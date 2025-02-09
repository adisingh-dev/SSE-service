const express = require('express');
const app = express();

app.set('view engine', 'ejs');
app.set('views', './');
app.use(express.static('./'));

app.get('/', (req, res) => {
    res.status(200).render('index');
});

let clients = [];
app.get('/events', (req, res) => {
    res.set({
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache'
    });

    clients.push({res, req});
});

app.post('/events', (req, res) => {
    clients[0].res.write('data: SSE service triggered\n\n');

    let counter = 1;
    const workload = setInterval(() => {
        if(counter > 5) {
            clearInterval(workload);
            clients[0].res.write('data: SSE service closed\n\n');
            clients[0].res.write('event: close\n'); 
            clients[0].res.on('close', () => {
                clients[0].res.end();
            });
            return res.status(200).json({
                status: 200,
                message: "user created successfully"
            });

        } else {
            clients[0].res.write(`data: Message Number ${counter}\n\n`);
            counter++;
        }

    }, 2000);
});

app.listen(4000, () => {
    console.log('server running @4000');
});