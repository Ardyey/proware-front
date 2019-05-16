process.env.PWD = process.cwd();

const express = require("express");
const session = require('express-session');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const knex = require('knex');
const path = require('path');
const ejs = require('ejs');
const multer = require('multer');
const fs = require('fs');
const cors = require('cors');
const moment = require('moment');
const proxy = require('http-proxy-middleware');
const { createLogger, format, transports } = require('winston');
require('winston-daily-rotate-file');
const logDir = 'log';
const KnexSessionStore = require('connect-session-knex')(session);
const env = process.env.NODE_ENV || 'development';

// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const dailyRotateFileTransport = new transports.DailyRotateFile({
  filename: `${logDir}/%DATE%-results.log`,
  datePattern: 'YYYY-MM-DD'
});

const logger = createLogger({
  // change level if in dev environment versus production
  level: env === 'development' ? 'verbose' : 'info',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
  ),
  transports: [
    new transports.Console({
      level: 'info',
      format: format.combine(
        format.colorize(),
        format.printf(
          info => `${info.timestamp} ${info.level}: ${info.message}`
        )
      )
    }),
    dailyRotateFileTransport
  ]
});

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const register = require('./controllers/register');
const signin = require('./controllers/login');
const home = require('./controllers/home');
const product = require('./controllers/product');
const transaction = require('./controllers/transaction');
const cart_add = require('./controllers/cart/addItem');
const cart_delete = require('./controllers/cart/deleteItem');
const cart_view = require('./controllers/cart/view');
const payment = require('./controllers/payment/payment');
const search = require('./controllers/search');

const { routes } = require('./config.json');

//Change this on deployment
const db = knex({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: true
  }
});

const store = new KnexSessionStore({
    knex: db,
    createtable: true
});


app.use(express.static(process.env.PWD + '/node_modules'));
app.use(express.static(process.env.PWD + '/bower_components'));
app.use(express.static(process.env.PWD + '/public'));
app.use(express.static(process.env.PWD + '/assets'));
app.use(express.static(process.env.PWD + '/views'));
app.use(express.static('https://tranquil-forest-40707.herokuapp.com' + '/public'));

//Change this on deployment
app.use(session({
  name: 'front_session',
	secret: 'front_secret',
	resave: false,
	saveUninitialized: false,
  cookie: {
    maxAge: 43200000
  },
  store: store
}));


//http proxy middleware options
for (route of routes) {
    app.use(route.route,
        proxy({
            target: route.address,
            pathRewrite: (path, req) => {
                return path.split('/').slice(2).join('/'); 
            }
        })
    );
}

const checkSignIn = (req, res, next) => {
   if(req.session.user){
        next();     //If session exists, proceed to page
     } else {
        logger.info("User trying to access unauthorized page!");
        res.render('pages/error-404'); //Error, trying to access unauthorized page!
     }
}

app.get('/signout', (req, res) => {
    req.session.destroy(function(){
      logger.info("User Logged out.");
      console.log("user logged out.");
   });
   res.redirect('/');
});

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.use(cors());

app.set('view engine', 'ejs');


app.use((req, res, next) => {
    if (req.path.substr(-1) == '/' && req.path.length > 1) {
        var query = req.url.slice(req.path.length);
        res.redirect(301, req.path.slice(0, -1) + query);
    } else {
        next();
    }
});

app.get('/', (req, res) => {
	res.render('pages/login.ejs');
});

app.get('/signup', (req, res) => register.initializeFields(req, res, db, logger));

app.post('/register', (req, res) => register.handleSignup(req, res, db, logger));

app.post('/auth', (req, res) => signin.handleSignin(req, res, db, logger));

app.get('/all_products', checkSignIn, (req, res) => home.allList(req, res, db, logger));

app.get('/uniform_products', checkSignIn, (req, res) => home.uniformList(req, res, db, logger));

app.get('/proware_products', checkSignIn, (req, res) => home.prowareList(req, res, db, logger));

app.get('/book_products', checkSignIn, (req, res) => home.bookList(req, res, db, logger));

app.get('/search_results', checkSignIn, (req, res) => home.searchList(req, res, db, logger));

app.get('/product_page', checkSignIn, (req, res) => product.displayPage(req, res, db, logger));

app.get('/trx.json', checkSignIn, (req, res) => transaction.getTransaction(req, res, db, logger));

app.post('/add_citem', checkSignIn, (req, res) => cart_add.dbAddCartItem(req, res, db, logger));

app.post('/delete_citem', checkSignIn, (req, res) => cart_delete.dbDeleteCartItem(req, res, db, logger));

app.get('/cart', checkSignIn, (req, res) => cart_view.viewCart(req, res, db, logger));

app.post('/cart_cquantity', checkSignIn, (req, res) => cart_view.changeQuantity(req, res, db, logger));

app.get('/total_price.json', checkSignIn, (req, res) => cart_view.viewTotalPrice(req, res, db, logger));

app.get('/checkout', checkSignIn, (req, res) => payment.viewPayment(req, res, db, logger));

app.get('/payment_final', checkSignIn, (req, res) => payment.viewPaymentFinal(req, res, db, logger, moment));

app.get('/curuser', (req, res) => {
  db.select('fullname').from('student_view').where('student_id', '=', req.session.student_id)
  .then(data => {
    res.json(data)
  })
  .catch(err => {
    console.log(err);
    logger.error(err);
    res.render('pages/error-500');
  })
});

app.get('/search_orders', checkSignIn, (req, res) => {
  res.render('pages/search-orders', {
    id: req.session.student_id
  });
})
app.get('/view_items', checkSignIn, (req, res) => {
  res.render('pages/search-view', {
    id: req.session.student_id
  });
})

app.get('/orders.json', checkSignIn, (req, res) => search.getOrders(req, res, db, logger));
app.get('/items.json', checkSignIn, (req, res) => search.viewItems(req, res, db, logger));
server.listen(process.env.PORT || 3002,() => {
  console.log(`Live at Port ${process.env.PORT}`);
});