const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const Schema = mongoose.Schema;

const app = express();
const PORT = 3000;

app.use(bodyParser.json())

const adminSecret = "ADMIN_SECRET_KEY";
const userSecret = "USER_SECRET_KEY";

const mongoDB = "MONGODB_URL";


main().catch((err) => console.log(err));
async function main() {
    await mongoose.connect(mongoDB);
}

// Defining Admin schemas
const adminSchema = new Schema({
    username: String,
    password: Number
});

const courseSchema = new Schema({
    title: String,
    description: String,
    price: Number,
    published: Boolean
});

const userSchema = new Schema({
    username: String,
    password: Number,
    purchasedCourses: [{type: mongoose.Schema.Types.ObjectId, ref: 'Course'}]
});

const Admin = mongoose.model('Admin', adminSchema);
const Course = mongoose.model('Course', courseSchema);
const User = mongoose.model('User', userSchema);


// authenticate based on JWT token - Admin
function authenticateAdmin(req, res, next) {
    const authToken = req.headers.authorization;
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


app.get('/', (req, res) => {
    res.send("My course app!")
})


// POST /admin/signup
app.post('/admin/signup', async (req, res) => {
    console.log(req.body);
    const {username, password} = req.body;
    const admin = await Admin.findOne({username});
    if (admin) {
        return res.json({msg: "Admin already created.."});
    } else {
        const newAdmin = new Admin({username, password});
        await newAdmin.save();
        if (newAdmin) {
           let token = jwt.sign({username}, adminSecret, {expiresIn: '1h'});
            return res.status(201).json({msg: "Admin created successfully!", token});
        }
    }
    res.status(500).json({msg: "internal server error"})
})


// POST /admin/login
app.post('/admin/login', async (req,res) => {
    const {username, password} = req.headers;
    const admin = await Admin.findOne({username, password});
    
    if (admin) {
        let token = jwt.sign({username}, adminSecret, {expiresIn: '1h'});
        res.status(201).json({msg: "Admin logged in successfully!", token});
    } else {
            res.status(403).json({ msg: "Authentication failed"})
    }
})


// POST /admin/courses
app.post('/admin/courses', authenticateAdmin, async (req, res) => {
    const newCourse = new Course(req.body);
    await newCourse.save();
    res.status(200).json({msg: "Course created successfully!"});
})


// PUT /admin/courses/:courseId 
app.put('/admin/courses/:courseId', authenticateAdmin, async(req, res) => {
    const course = await Course.findByIdAndUpdate(req.params.courseId, req.body, {new: true});
    if (course) {
        res.json({msg: "Course Updated Successfully"})
    } else {
        res.json({msg: "Course not found.."})
    }
})


// GET /admin/courses
app.get('/admin/courses', authenticateAdmin, async (req, res) => {
    const courses = await Course.find();
    // console.log(courses);
    res.json(courses);
})


// Users
// POST /users/signup 
app.post('/users/signup', async (req, res) => {
    const {username, password} = req.body;
    const user = await User.findOne({username});
    
    if (user) {
        return res.json({msg: "User already created."});
    } else {
        const newUser = new User({username, password});
        await newUser.save();
        if (newUser) {
            const userToken = jwt.sign({username}, userSecret);
            res.status(201).json({msg: "User created successfully.", userToken});
        }
    // res.status(500).json({msg: "Internal server error"});    
  }
})


// POST /users/login
app.post('/users/login', async (req, res) => {
    const {username, password} = req.headers;
    const user = await User.findOne({username, password});
    if (user) {
        const token = jwt.sign({username}, userSecret);
        res.status(201).json({msg: "Logged in successfully", token});
    } else {
        return res.json({msg: "Wrong credentials"});
    }
})


// POST /users/courses/:courseId
app.post('/users/courses/:courseId', authenticateUser, async (req, res) => {
    const course = await Course.findById(req.params.courseId);
    if (course) {
        const user = await User.findOne({username: req.user.username})
        if (user) {
            user.purchasedCourses.push(course);
            await user.save();
            res.json({msg: "Course purchased successfully"});
        } else {
            res.json({msg: "No user found"});
        }
    } else {
        res.json({msg: "No course found"})
    }
})


// GET /users/courses
app.get('/users/courses', authenticateUser, async (req, res) => {
    const course = await Course.find();
    res.json(course);
})


// GET /users/purchasedCourses 
app.get('/users/purchasedCourses', authenticateUser, async (req, res) => {
    const user = await User.findOne({username: req.user.username}).populate('purchasedCourses');
    if (user) {
        res.json(user.purchasedCourses);
    } else {
        res.json({msg: "User not found"});
    }
})


app.listen(PORT, () => {
    console.log("Listening on port",`${PORT}`)
})