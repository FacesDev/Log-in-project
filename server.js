const express = require('express');
const bodyParser = require('body-parser');
const mustache = require('mustache-express');
const expressValidator = require('express-validator');
const cookieParser = require('cookie-parser')
var application = express();

application.engine('mustache', mustache());

application.set('views', './views');
application.set('view engine', 'mustache');

var storage = {
    users: [{ email: 'admin', password: 'qwer1234' }],
    sessionId: 0,
    sessions: []
};
application.use(cookieParser());
application.use(bodyParser.urlencoded());

application.use((request, response, next) => {
    if (request.cookies.session !== undefined) {
        var sessionId = parseInt(request.cookies.session);
        var user = storage.sessions[sessionId];

        if (!user) {
            response.locals.user = { isAuthenticated: false };
            console.log("first");
        }
        else {
            response.locals.user = { isAuthenticated: true };
            console.log("second");
        }
    } else {
        response.locals.user = { isAuthenticated: false };
        console.log("third");
    }

    next();
});

application.get('/', (request, response) => {
    response.render('signin');
});

application.get('/index', (request, response) => {
    response.render('index');
});
application.get('/signin', (request, response) => {
    response.render("signin");
});

application.post('/signin', (request, response) => {


   var email = request.body.email;
    var password = request.body.password;

    var user = storage.users.find(user => { return user.email === email && user.password === password })
    
    if (!user) {
        response.render('signin', user);
           console.log("If conditional: ", user);
    } else {
        console.log('made it here:', user)
        var sessionId = storage.sessionId;
        storage.sessionId++;
        storage.sessions.push(user);

        response.cookie('session', sessionId);

        response.render('index', user);
    }

    storage.users.push(user);
    console.log("user info frompost ", user);
     console.log("user info frompost ", user.email);


  
    // response.redirect('/index');
});
// application.post('/', (request, response) => {
//     var email = request.body.email;
//     var password = request.body.password;

//     var user = storage.users.find(user => { return user.email === email && user.password === password })
//     console.log("second post email: ", email);
//      console.log("second post user: ", user);


//     if (!user) {
//         response.render('signin');
//            console.log(user);
//     } else {
//         var sessionId = storage.sessionId;
//         storage.sessionId++;
//         storage.sessions.push(user);

//         response.cookie('session', sessionId);

//         response.redirect('/index');
//     }
// });



application.listen(3000);