const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000
const socketio = require('socket.io');
const http = require('http');

const server = http.createServer(app);
const io = socketio(server);

server.listen(port, () => {
    console.log(`Server is runnning on port ${port}`);
});

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", function (socket) {
    socket.on("send-location", function (data) {
        io.emit("recieve-location", {id: socket.id, ...data});
    });

    socket.on("disconnect", function() {
        io.emit("user-disconnected", socket.id);
    });
    console.log("Connected!");

});

app.get("/home", function(req, res) {
    res.render("index.ejs");
});

