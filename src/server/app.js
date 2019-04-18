const bodyParser = require('body-parser')
const passport = require('passport')
const session = require("express-session")
const LocalStrategy = require('passport-local').Strategy
const path = require('path');
const express = require('express')
const { getMenu, deleteMenuItem, addMenuItem, getOneMenuItem, updateMenuItem } = require('./db/cafeteria-menu')
const Users = require('./db/users');
const authApi = require('./routes/auth-api')
const app = express();
const ews = require('express-ws')(app);
const WebSocket = require('ws');


app.use(bodyParser.json())

app.use(session({
    secret: 'a secret used to encrypt the session cookies',
    resave: false,
    saveUninitialized: false
}))

app.use(express.static('public'))

passport.use(new LocalStrategy(
    {
        usernameField: 'userId',
        passwordField: 'password'
    },
    function (userId, password, done) {

        const ok = Users.verifyUser(userId, password);

        if (!ok) {
            return done(null, false, {message: 'Invalid username/password'});
        }

        const user = Users.getUser(userId);
        return done(null, user);
    }
));

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {

    const user = Users.getUser(id);

    if (user !== null) {
        done(null, user);
    } else {
        done(null, false);
    }
});

app.use(passport.initialize());
app.use(passport.session());
app.use('/api', authApi)

/* WEBSOCKET CHAT */
let counter = 0
const messages = []

app.ws('/', (ws, req) => {
    console.log("Websocket connection established")

    ws.send(JSON.stringify(messages))

    ws.on('message', fromClient => {
        const data = JSON.parse(fromClient)
        const id = counter++
        const msg = {id: id, author: data.author, text: data.text}

        messages.push(msg)

        ews.getWss().clients.forEach((client) => {
            if(client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify([msg]))
            }
        })
    })
})


app.get('/api/cafeteriaMenu', (req, res) => {
    res.json(getMenu())
})

app.get('/api/cafeteriaMenu/:id', (req, res) => {
    const menuItem = getOneMenuItem(req.params.id)

    if(menuItem === undefined || menuItem === null) {
        res.status(404)
        res.send()
    } else {
        res.json(menuItem)
    }
})

app.delete('/api/cafeteriaMenu/:id', (req, res) => {
    const deleted = deleteMenuItem(req.params.id)
    if (deleted) {
        res.status(204);
    } else {
        res.status(404);
    }
    res.send();
})

app.post('/api/cafeteriaMenu', (req, res) => {
    const data = req.body

    const id = addMenuItem(data.dishName, data.ingredientsList, data.allergiesList, data.price)

    res.status(201)
    res.header("location", "/api/cafeteriaMenu/" + id)
    res.send()
})

app.put('/api/cafeteriaMenu/:id', (req, res) => {
    if(req.params.id !== req.body.id){
        res.status(409);
        res.send();
        return;
    }

    const updated = updateMenuItem(req.body);

    if (updated) {
        res.status(204);
    } else {
        res.status(404);
    }
    res.send();
});

app.use((req, res, next) => {
    res.sendFile(path.resolve(__dirname, '..', '..', 'public', 'index.html'));
});



module.exports = {app};
