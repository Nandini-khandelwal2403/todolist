// const express = require('express');
// const app = express();

// app.use(express.static("public"));

// app.use(express.urlencoded({ extended: true }));

// app.set("view engine", "ejs");


// app.get('/', (req, res) => {
//     res.render("ToDo.ejs");
// })

// app.post('/', (req, res) => {
//     console.log(req.body);
// })

// app.listen(9000, function () {
//     console.log("listening to port 9000");
// })

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));
app.set("view engine", "ejs");

mongoose.connect(
    "mongodb+srv://nandinikh2403:atlas_todolist@cluster0.r6elewd.mongodb.net/?retryWrites=true&w=majority");

const taskSchema = {
    name: {
        type: String,
        required: true
    }
};

const Task = mongoose.model("Task", taskSchema);

app.post("/data/new", function (req, res) {
    const taskName = req.body.newTask;
    if (taskName) {
        const task = new Task({
            name: taskName,
        });
        task.save()
            .then(() => {
                res.redirect("/");
            });
    } else {
        res.redirect("/");
    }
});

app.post("/delete", function (req, res) {
    const checkedItemId = req.body.checkbox;
    Task.findByIdAndRemove(checkedItemId, function (err) {
        if (!err) {
            console.log("Successfully deleted checked item.");
            res.redirect("/");
        }
    });
});

app.get("/", function (req, res) {
    let today = new Date();
    let options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    };
    let day = today.toLocaleDateString("en-US", options);
    Task.find({}, function (err, foundTasks) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("index", { today: day, tasks: foundTasks });
        }
    })
});

app.listen(process.env.PORT || 9000, function () {
    console.log("listening to port 9000");
})