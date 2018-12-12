const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const Schema = mongoose.Schema;
const server = express();
server.use(express.json());
server.use(cors());

const url = 'mongodb://admin:root1234@ds117913.mlab.com:17913/rolanddatabase';
  
mongoose.connect(url, { useNewUrlParser: true, useCreateIndex: true, }, (err, db) => {
    err ? console.log(err) : console.log('connected to server');
});

const UserSchema = new Schema ({
    username: {
        type: String,
        lowercase: true,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    todo: [
        { type: String }
    ]
})

const User = mongoose.model('UserSchema', UserSchema);

const error = (stat, res, str) => {
    res.status(stat).send({ failed: str });
}

server.get('/', (req, res) => {
    res.send('this is a server');
})

server.post('/newUser', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return error(400, res, 'input username or password');
    }
    const newUser = new User();
    newUser.username = username;
    newUser.password = password;
    newUser.save((err, data) => {
        if (err) return error(401, res, err.errmsg);
        res.status(200).json({ success: data });
    });
});

server.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return error(401, res, 'must input username and password')
    User.findOne({ username })
        .then(data => {
            if (data.password !== password || !data) return error(400, res, 'incorrect username or password');
            res.status(200).json({ success: data });
        })
        .catch(err => error(400, res, 'incorrect username or password'));
})

server.put('/newTodo', (req, res) => {
    const { name, username } = req.body;
    if (!name || !username) return error(400, res, 'must input a new todo');
    User.findOneAndUpdate({ username }, { $push: { todo: name }})
        .then(data => {
            res.status(200).json({ success: data });
        })
        .catch(err => error(401, res, err.errmsg));
});

server.post('/getTodo', (req, res) => {
    const { username } = req.body;
    User.findOne({ username })
        .then(data => {
            return res.status(200).send({ success: data });
        })
        .catch(err => {
            return err(400, res, err.errmsg);
        })
})

server.post('/renameTodo', (req, res) => {
    const { username, rename } = req.body;
    User.findOneAndUpdate({ username }, )
})


server.listen(3030, () => {
    console.log('server is running on port 3030');
});