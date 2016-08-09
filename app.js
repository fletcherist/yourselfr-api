const express = require('express')
const fs = require('fs')
const path = require('path')
const mongojs = require('mongojs')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const passport = require('passport')
const compression = require('compression')
const config = require('../config')

mongoose.connect('mongodb://localhost/database')
require("./models/models.js")
require('./models/passport-init')(passport)

var session = require('express-session')
var MongoStore = require('connect-mongo')(session)

const app = express()

const http = require('http').Server(app)
const io = require('socket.io')(http)

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')
    res.setHeader('Access-Control-Allow-Credentials', true)
    next()
})

app.use(session({
	secret: 'foo',
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