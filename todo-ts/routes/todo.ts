import express, {Request, Response} from 'express';
const { authenticateJwt, SECRET } = require("../middleware/index");
const { Todo } = require("../db");
const router = express.Router();

router.post('/todos', authenticateJwt, (req: Request, res: Response) => {
  const { title, description } = req.body;
  const done = false;
  const userId = req.headers.userId;

  const newTodo = new Todo({ title, description, done, userId });

  newTodo.save()
    .then((savedTodo: any) => {
      res.status(201).json(savedTodo);
    })
    .catch((err: any) => {
      res.status(500).json({ error: 'Failed to create a new todo' });
    });
});


router.get('/todos', authenticateJwt, (req: Request, res: Response) => {
  const userId = req.headers.userId;

  Todo.find({ userId })
    .then((todos: any) => {
      res.json(todos);
    })
    .catch((err: any) => {
      res.status(500).json({ error: 'Failed to retrieve todos' });
    });
});

router.patch('/todos/:todoId/done', authenticateJwt, (req: Request, res: Response) => {
  const { todoId } = req.params;
  const userId = req.headers.userId;

  Todo.findOneAndUpdate({ _id: todoId, userId }, { done: true }, { new: true })
    .then((updatedTodo: any) => {
      if (!updatedTodo) {
        return res.status(404).json({ error: 'Todo not found' });
      }
      res.json(updatedTodo);
    })
    .catch((err: any) => {
      res.status(500).json({ error: 'Failed to update todo' });
    });
});

export default router;