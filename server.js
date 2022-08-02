let express = require('express')
let app = express()
let bodyParser = require('body-parser')
let session = require('express-session')
let server = require("http").createServer(app)
let io = require('socket.io')(server)


let connected = [];


app.set('view engine', 'ejs')


// middlewares
app.use('/assets', express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}))
io.use(function(socket, next) {
    var handshakeData = socket.request;
    console.log("middleware:", handshakeData._query['foo']);
    next();
});


// routes
app.get('/', (req, res) => {
    res.render('pages/home')
})

app.post('/', (req, res) => {
    if (req.body.name === undefined || req.body.name.trim() === ""){
        req.session.name = "annonyme"
    }
    else {
        req.session.name = req.body.name
    }
   // connected.push(req.session.name)
   // io.emit('newUser', req.body.name)
    res.redirect("/chat")
})

app.get('/chat', (req, res) => {
   res.render('pages/chat', { connected: connected })
})


io.on('connection', (socket) => {
    let name = 'fackname'
    console.log('a user connected');
    connected.push(name)
    io.emit('user connect', (name))


    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });
    socket.on('disconnect', () => {
        console.log('a user disconnected')
        var index = connected.indexOf(name);
        if (index !== -1) {
            connected.splice(index, 1);
        }

        io.emit('user disconnect', (name))
    });
});


server.listen(3000)