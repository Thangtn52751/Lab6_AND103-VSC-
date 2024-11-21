const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();
const port = 3000;

const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const fileExtension = path.extname(file.originalname);
        const allowedExtensions = ['.jpg', '.jpeg', '.png'];
        if (!allowedExtensions.includes(fileExtension.toLowerCase())) {
            return cb(new Error('Invalid file type'), false);
        }
        const filename = `${Date.now()}${fileExtension}`;
        cb(null, filename);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            cb(new Error("Not an image!"), false);
        }
    }
});

const mongoose = require('mongoose');
const cakeModel = require('./cakeModel');
const COMMON = require('./COMMON');
const uri = COMMON.uri;

async function connectToDatabase() {
    if (mongoose.connection.readyState === 0) {
        try {
            await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
            console.log("Connected to MongoDB successfully.");
        } catch (err) {
            console.error("Failed to connect to MongoDB:", err);
            throw new Error("Database connection failed.");
        }
    }
}

app.post('/add_cake', upload.single('image'), async (req, res) => {
    try {
        await connectToDatabase();
        const { name, description, price, distributor } = req.body;
        if (!name || !price || !distributor) {
            return res.status(400).send({ error: "Name, price, and distributor are required." });
        }
        if (!req.file) {
            return res.status(400).send({ error: "Image file is required." });
        }
        const imageUrl = `/uploads/${req.file.filename}`;
        const newCake = new cakeModel({
            name,
            description,
            price,
            distributor,
            image: imageUrl,
        });
        const result = await newCake.save();
        console.log("Cake added:", result);
        res.status(201).send(result);
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: "An error occurred while adding the cake." });
    }
});

app.get('/', async (req, res) => {
    try {
        await connectToDatabase();
        const cakes = await cakeModel.find();
        res.status(200).send(cakes);
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: "An error occurred while fetching cakes." });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
