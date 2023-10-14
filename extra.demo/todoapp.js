const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.json());

allTodos = [];

// app.get('/', (req, res) => {
//   return res.send('This is a todo app!')
// })

app.get('/todos', (req, res) => {
    if (allTodos.length !== 0) {
        return res.status(200).send(allTodos);
    }
    return res.status(404).send("You have no todos..")
});

app.get('/todos/:id', (req, res) => {
    const id = req.params.id;
    // console.log(req.params);

    for (let i=0; i<allTodos.length; i++) {
        // console.log(allTodos[i].id == id);
        if (allTodos[i].id === Number(id)) {
            return res.status(200).json(allTodos[i]);
        } 
    }

    return res.status(404).send("Provide a valid id..")
})

app.post('/todos', (req, res) => {
    let id = Math.floor(Math.random() * 100);
    let title = req.body.title;
    let description = req.body.description;

    console.log(title);
    console.log(description);

    let todo = {
        "id": id,
        "title": title,
        "description": description,
        "completed": false
    }

    allTodos.push(todo);
    return res.status(201).send("Created the todo");
});

app.delete('/todos/:id', (req, res) => {
    const { id } = req.params;

    for (let i=0; i<allTodos.length; i++) {
        if (Number(id) === allTodos[i].id) {
            allTodos.splice(id, 1);
            return res.send("Removed the todo");
        }
    }
    return res.status(404).send("Provide a valid ID..")
})

app.put("/todos/:id", (req, res) => {
    const { id } = req.params;
    let todoStatus = req.body.completed;
    let new_description = req.body.description;

    for (let i=0; i<allTodos.length; i++) {
        if (Number(id) === allTodos[i].id) {
            allTodos[i].description = new_description;
            allTodos[i].completed = todoStatus;
            return res.send("Information has been updated.")
        }
    }
    return res.send("Provide a valid id..")
})

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + "/index.html"));
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})