const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const port = 8005;
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');

//For Session Cookie
const session = require('express-session');

//Requiring Passport and the Strategy
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');

//Requiring Mongo
const connectMongo = require('connect-mongo');
const MongoStore = require('connect-mongo')(session);

//For Reading Form Data
app.use(express.urlencoded());
//For Cookies
app.use(cookieParser());

//To access the static files
app.use(express.static('./assets'));

//We are telling our app to use express Layouts
app.use(expressLayouts);

// extract style and scripts from sub pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

//Set up the View Engine
app.set('view engine', 'ejs');
app.set('views', './views');

//Using a middleware that reads cookie and encrypts it.

app.use(session({
    name: 'codeial',
    // TODO change the secret before deployment in production mode
    secret: 'blahsomething',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)
    },
    store: new MongoStore(
        {
            mongooseConnection: db,
            autoRemove: 'disabled'
        }),
        function(err)
        {
            console.log(err || 'connect-mongodb setup is okay');
        }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticationUser);

//Set up the Route
app.use('/', require('./routes/index'));

app.listen(port, function(err)
{
    if(err)
    {
        console.log("Error Encountered", err);
    }
    else
    {
        console.log("Server is up and running on port", port);
    }
});