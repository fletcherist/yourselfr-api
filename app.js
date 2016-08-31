const express = require('express')
const fs = require('fs')
const path = require('path')
const mongojs = require('mongojs')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const passport = require('passport')
const compression = require('compression')
const config = require('../config')
const cors = require('cors')

mongoose.connect('mongodb://localhost/database')
require("./models/models.js")
require('./models/passport-init')(passport)

var session = require('express-session')
var MongoStore = require('connect-mongo')(session)

const app = express()

const http = require('http').Server(app)
const io = require('socket.io')(http)

var whitelist = ['http://localhost:3000', 'http://yourselfr.herokuapp.com']
var corsOptions = {
  origin: function(origin, callback){
    var originIsWhitelisted = whitelist.indexOf(origin) !== -1
    callback(null, originIsWhitelisted)
  },
  credentials: true
};

app.use(cors(corsOptions))

app.use(session({
	secret: 'asidhuidsahui32ue2378t7t8tt78t78',
	resave: false,
	saveUninitialized: true,
	maxAge: new Date(Date.now() + 3600000),
	store: new MongoStore({ mongooseConnection: mongoose.connection })
}))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(require('cookie-parser')())
app.use(passport.initialize())
app.use(passport.session())
app.use(require('connect-flash')())
app.use(compression({level: 9}))

const api = require('./routes/api')
const ui  = require('./routes/ui')
const authenticate = require('./routes/authenticate')(passport)
const upload = require('./models/upload')
const socket = require('./models/api/classSocket')

io.on('connection', socket)

http.listen(config.port, () => {
	console.log("Server is running on port "+ config.port)
})

app.use('/upload', express.static(__dirname +'/upload'))
app.use(express.static(__dirname + '/public'))

app.use('/api', api)

app.use('/auth', authenticate)
app.use('/upload', upload)
app.use(`/${encodeURIComponent('🌐')}`, (req, res) => {
	res.send('Hello world! 🌐')
})

app.use('', ui)