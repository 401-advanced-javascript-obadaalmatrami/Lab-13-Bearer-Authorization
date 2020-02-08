const express = require('express');
const basicAuth = require('./src/basic-auth-middleware.js');
const users = require('./src/users.js');
const oauth = require('./src/oauth-middleware.js');
const bearerAuth = require('./src/bearer-auth-middleware.js');
const app = express();

app.use(express.static('./public'));
app.use(express.json());

app.post('/signup', (req, res) => {
    try {
        users.save(req.body)
            .then(user => {
                let token = users.generateToken(user);
                res.status(200).send(token);
            });

    } catch (error) {

        next(`ERROR: ${error.message}`);
    }

});

app.post('/signin', basicAuth, (req, res) => {
    res.status(200).send(req.token);
});

app.get('/users', basicAuth, (req, res) => {
    res.status(200).json(users.list());
});

app.get('/oauth', oauth, (req, res) => {
    res.status(200).send(req.token);
});


app.get('/user', bearerAuth, (req, res) => {

    res.status(200).json(req.user);

});



let PORT = 3000;
app.listen(PORT, () => console.log(`server listen on port ${PORT}`));