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
USERS = [];

app.get('/', (req, res) => {
  res.send('Course selling application!');
})

// authenticate based on JWT token - Admin
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


// authenticate based on JWT token - User
function authenticateUser (req, res, next) {
  const authToken = req.headers.authorization;

  if (authToken) {
    const token = authToken.split(" ")[1];

    jwt.verify(token, userSecret, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    })
  } else {
    return res.sendStatus(403);
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
  res.status(200).json(COURSE);
})

// POST /users/signup 
app.post('/users/signup', (req, res) => {
  let userBody = req.body;

  let user = USERS.find(u => u.username === userBody.username);
  if (user) {
    return res.sendStatus(401);
  } else {
    USERS.push(userBody);
    let userToken = jwt.sign({username: userBody.username}, userSecret);
    res.status(201).json({msg: "User created successfully.", userToken});
  }
})

// POST /users/login

app.post('/users/login', (req, res) => {
  let userHeaders = req.headers;

  let user = USERS.find(u => u.username === userHeaders.username);
  if (user) {
    let token = jwt.sign({username: userHeaders.username}, userSecret);
    res.status(201).json({msg: "Logged in successfully", token});
  } else {
    return res.sendStatus(401);
  }
})

// GET /users/courses
app.get('/users/courses', authenticateUser, (req, res) => {
  res.status(200).json({COURSE});
})

// POST /users/courses/:courseId
app.post('/users/courses/:courseId', authenticateUser, (req, res) => {
  const id = parseInt(req.params.courseId);
  const user = {...req.body, purchasedCourse: []};

  let course = COURSE.find(x => x.courseId === id);
  if (course) {
    Object.assign(USERS, user); 
    USERS.purchasedCourse.push(course);
    console.log(USERS);
    res.status(200).json({msg: "Course Purchased Successfully"});
  } else {
    return res.status(400).json({msg: "Enter valid course ID"});
  }
})

// GET /users/purchasedCourses 
app.get('/users/purchasedCourses', authenticateUser, (req, res) => {
  const purchasedCourse = USERS.purchasedCourse;
  res.status(200).json({purchasedCourse})
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})