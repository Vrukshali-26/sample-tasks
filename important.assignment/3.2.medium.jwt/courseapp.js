const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();
const port = 3000;

app.use(bodyParser.json())

const adminSecret = "ADMIN_SECRET_KEY";
const userSecret = "USER_SECRET_KEY";

ADMINS = [];
COURSE = [];

app.get('/', (req, res) => {
  res.send('Course selling application!');
})

// authenticate based on JWT token
function authenticateAdmin(req, res, next) {
  const authToken = req.headers.authorization;

  // console.log(authToken);

  if (authToken) {
    const token = authToken.split(" ")[1];
    
    jwt.verify(token, adminSecret, (err, user) => {
      if (err) {
        return res.status(403);
      }
      req.user = user;
      next();
    });
  } else {
    return res.send(403);
  }
}

// POST /admin/signup
app.post('/admin/signup',(req, res) => {
  console.log(req.body);
  const adminBody = req.body;
  let admin = ADMINS.find(u => u.username === adminBody.username);
  if (admin) {
    res.status(411).json("Admin already created..");
  } else {
    ADMINS.push(adminBody);
    let token = jwt.sign({username: adminBody.username}, adminSecret, {expiresIn: '1h'});
    res.status(201).json({msg: "Admin created successfully!", token});
  }
})

// POST /admin/login
app.post('/admin/login',(req,res) => {
  const adminBody = req.headers;
  let admin = ADMINS.find(u => u.username === adminBody.username);

  if (admin) {
    let token = jwt.sign({username: adminBody.username}, adminSecret, {expiresIn: '1h'});
    res.status(201).json({msg: "Admin logged in successfully!", token});
  } else {
    res.status(403).json({ msg: "Authentication failed"})
  }
})

// POST /admin/courses
app.post('/admin/courses', authenticateAdmin, (req, res) => {
  let courseId = Math.floor(Math.random() * 10000000);

  const course = {courseId: courseId, ...req.body};
  // console.log(courseId);
  console.log(course);
  COURSE.push(course);

  res.status(200).json({courseId: course.courseId,msg: "Course created successfully!"});
})

// PUT /admin/courses/:courseId 
app.put('/admin/courses/:courseId', authenticateAdmin,(req, res) => {
  const id = parseInt(req.params.courseId);
  const updateBody = req.body;

  let index = COURSE.findIndex(x => x.courseId === id);
  // console.log(id, index);
  // console.log(COURSE);
  if (index === -1) {
    return res.sendStatus(411);
  } 
  // console.log(updateBody);
  Object.assign(COURSE[index], updateBody);
  // console.log(COURSE);
  res.status(201).json({message: "Course Updated Successfully!"})

})

// GET /admin/courses
app.get('/admin/course', authenticateAdmin, (req, res) => {
  res.status(200).send(COURSE);
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})