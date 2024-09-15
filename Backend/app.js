const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');
const socketio = require('socket.io');
const http = require('http');
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000

server.listen(port, () => {
    console.log(`Server is runnning on port ${port}`);
});

app.set("view engine", "ejs");
app.set("views", "../Frontend/views")
app.use(express.static(path.join(__dirname, "../Frontend/public")));

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

