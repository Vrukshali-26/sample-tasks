const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

const port = 3000

app.get('/files', (req, res) => {
  fs.readdir('./files/', (err, files) => {
    if (err) {
        throw err
    } else {
        return res.status(200).send("Here are the files in given directory: " + files);
    }
  })
})


app.get('/files/:filename', (req, res) => {
    const { filename } = req.params;
    fs.readdir('./files/', (err, files) => {
        if (err) throw err;
        for (let file of files) {
            if (filename === file) {
                fs.readFile('./files/' + filename, 'utf-8', (err, data) => {
                    if (err) throw err; 
                    return res.status(200).send(data);
                })
            } 
        }
    })
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})





