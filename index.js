import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

mongoose
.connect('mongodb+srv://admin:admin@atlascluster.2axeb9c.mongodb.net/?retryWrites=true&w=majority&appName=AtlasCluster')
.then(() => console.log("DB OK"))
.catch((err) => console.log('DB error', err));

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.post('/auth/login', (req, res) => {
    console.log(req.body);

    const token = jwt.sign({
        email: req.body.email,
        fullname: "Дмитро Дмитро"
    }, 'secret123');

    res.json({
        success: true,
        token,
    });
});

app.listen(4444, (err) => {
    console.log("Server started on port 4444");
});