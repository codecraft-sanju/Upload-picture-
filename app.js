const express = require('express');
const app = express();
const path = require('path');
const multer = require('multer');
const userModel = require('./models/user.js');

// Set up view engine and middleware
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage });

// Routes
app.get('/', (req, res) => {
    res.render("index");
});

app.get('/read', async (req, res) => {
    let users = await userModel.find();
    res.render("read", { users });
});

app.get('/delete/:id', async (req, res) => {
    await userModel.findOneAndDelete({ _id: req.params.id });
    res.redirect("/read");
});

// Modify create route to handle image upload
app.post('/create', upload.single('image'), async (req, res) => {
    const { name, email } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : '';

    await userModel.create({
        name,
        email,
        image: imagePath
    });
    res.redirect("/read");
});

app.get('/edit/:id', async (req, res) => {
    let user = await userModel.findById(req.params.id);
    res.render("edit", { user });
});

// Update route for editing users
app.post('/update/:id', upload.single('image'), async (req, res) => {
    try {
        const { name, email } = req.body;
        
        // Check if a new image was uploaded
        const imagePath = req.file ? `/uploads/${req.file.filename}` : req.body.existingImage;

        // Update user
        await userModel.findByIdAndUpdate(req.params.id, {
            name,
            email,
            image: imagePath
        });
        
        res.redirect("/read");
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
});

// Start server
app.listen(5000, () => { console.log("Server started at port 5000") });
