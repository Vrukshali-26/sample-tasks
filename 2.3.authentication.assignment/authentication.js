const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(bodyParser.json());


allUsers = [];


app.post('/signup', (req, res) => {

    let users = req.body;
    let userExist = false;

    for (let i=0; i<allUsers.length; i++) {
        if (allUsers[i].username === users.username) {
            userExist = true;
            break;
        }
    }

    if (userExist) {
        return res.status(400).send("User already exist!")
    } else {
        allUsers.push(users);
        res.status(201).send("User created successfully!")
    }
    
    console.log(allUsers);
})


app.post('/login', (req, res) => {
    let user = req.body;
    let userFound = null;

    for (let i=0; i<allUsers.length; i++) {
        if (allUsers[i].username === user.username && allUsers[i].password == user.password) {
            userFound = allUsers[i];
            break;
        } 
    }

    if (userFound) {
        res.status(200).json({
                "firstName": userFound.firstName, 
                "lastName": userFound.lastName
        })
    } else {
        res.status(401).send("Check the credentials again.")
    }
})


app.get('/data', (req, res) => {
    res.status(200).json(allUsers);
})


app.all('*', (req, res) => {
  res.status(404).send('Route not found');
});


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
})