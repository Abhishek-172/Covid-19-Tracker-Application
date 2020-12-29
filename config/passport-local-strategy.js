// Importing a Passport
const passport = require('passport');
// Importing a Passport Local Strategy for authentication
const LocalStrategy = require('passport-local').Strategy;
//Importing the user model 
const User = require('../models/users');

//Authentication Using Passport
passport.use(new LocalStrategy({
    usernameField: 'email',
    passReqToCallback: true
},
    function (req, email, password, done)
    {
        User.findOne({ email: email }, function (err, user)
            {
                if (err)
                {
                    //This will report an error to passport
                    return done(err);
                }
                if (!user || user.password != password)
                {
                    //This return done() will report to passport
                    //that there is no error but also the 
                    //authentication is not done.
                    return done(null, false);
                }
                return done(null, user);
                //This return message will tell the passport 
                //that there is no error, but we have find the
                //user.
        });
    }
));

//In manual authentication what we were doing?
//1. We were creating the session and storing the user.id in
//user_id
//2. Later, we were searching the user with the same user id


//So the same thing will be done by 2 functions
// 1. Serialize 
// 2. De-serialize

//Serializing the user to decide which key is to be kept in the
//cookies

passport.serializeUser(function(user, done)
{
    done(null, user.id);
});


//De-serializing the user from the key in the cookies

passport.deserializeUser(function(id, done)
{
    User.findById(id, function(err, user)
    {
        if(err)
        {
            console.log("Error in Finding the User");
            return done(err);
        }
        return done(null, user);
    });
});

// Scenario:
// What happened here?
// User came to website tries to Autheneticate with the entered 
// email id and the password.
// What we are doing?
// 1. Tring to serialize the user
// i.e. 
// When the user signs in , find the user id and send it to the 
// cookie, and the cookie is sent to the Browser.
// This was the working of serialize function
// All this is done by passport library
// now,
// What does the desirialize function does?
// now, when the browser request to the server that request Come
// along with cookie attached to it, 
// So when the request comes in, then deserialize function, deserialize
// it and find out the user out of it

//Check if the user is Authenticated or not?

passport.checkAuthentication = function (req, res, next)
{
    if (req.isAuthenticated())
    {
        console.log("User is Found, Wallah");
        // console.log(req);
        return next();
    }
    //if user is not signed in
    console.log("User is Not Found");
    return res.redirect('/users/signin');
}

/*
In the below function it is a middleware,
req.user contains the current signed in user from the session 
cookie and we are just sending this to the locals for the views.
One important thing,
passport appends the user object to the req object.
*/

passport.setAuthenticationUser = function (req, res, next)
{
    if (req.isAuthenticated())
    {
        res.locals.user = req.user;
    }
    next();
}


module.exports = passport;


