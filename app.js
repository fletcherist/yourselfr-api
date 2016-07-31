var express = require('express'),
	fs = require('fs'),
	path = require('path'),
	mongojs = require('mongojs'),
	mongoose = require('mongoose'),
	cookieParser = require('cookie-parser'),
	bodyParser = require('body-parser'),
	passport = require('passport'),
	flash = require('connect-flash'),
	compression = require('compression')

mongoose.connect('mongodb://localhost/database')
require("./models/models.js")

var app = express()

var session = require('express-session')
var MongoStore = require('connect-mongo')(session)

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
app.use(cookieParser())
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.use(compression({level: 9}))

var api = require('./routes/api'),
	ui  = require('./routes/ui'),
	authenticate = require('./routes/authenticate')(passport),
	upload = require('./models/upload')

var port = 80
var initPassport = require('./models/passport-init')
initPassport(passport)

app.listen(port, () => {
	console.log("Server is running on port "+ port)
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