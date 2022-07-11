const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const socketio = require('socket.io');
const http = require('http');
const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());      // to parse json data sent through axios
app.use(express.static("public"));
app.set("view engine", "ejs");

mongoose.connect(
    "mongodb+srv://nandinikh2403:atlas_todolist@cluster0.r6elewd.mongodb.net/?retryWrites=true&w=majority");

io.sockets.on('connection', socket => {
    socket.on('joinRoom', (roomID) => {
        socket.join(roomID);
        console.log(roomID);
        socket.emit("joined Room");

    })
})

const taskSchema = {
    name: {
        type: String,
        required: true
    },
    roomID: {
        type: String
    }
};

const Task = mongoose.model("Task", taskSchema);

app.get('/:roomID', (req, res) => {
    let today = new Date();
    let options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    };
    let day = today.toLocaleDateString("en-US", options);
    Task.find({ roomID: req.params.roomID }, function (err, foundTasks) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("index", { today: day, tasks: foundTasks });
        }
    })

})

app.post("/data/new", function (req, res) {
    console.log(req.body);
    const taskName = req.body.newTask;
    const roomid = req.body.roomID;
    if (taskName) {
        const task = new Task({
            name: taskName,
            roomID: roomid
        });
        task.save()
            .then(() => {
                console.log('Data probably saved')
                res.redirect("/" + roomid);
            });
    } else {
        console.log("Data not saved");
        res.redirect("/" + roomid);
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
app.get('/', (req, res) => {
    var roomID = Math.floor(1000 + Math.random() * 9000);
    res.redirect('/' + roomID);
})
// app.get("/", function (req, res) {
//     let today = new Date();
//     let options = {
//         weekday: "long",
//         day: "numeric",
//         month: "long"
//     };
//     let day = today.toLocaleDateString("en-US", options);
//     Task.find({}, function (err, foundTasks) {
//         if (err) {
//             console.log(err);
//         }
//         else {
//             res.render("index", { today: day, tasks: foundTasks });
//         }
//     })
// });

app.listen(process.env.PORT || 9000, function () {
    console.log("listening to port 9000");
})