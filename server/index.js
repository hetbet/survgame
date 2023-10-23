const express = require("express");
const path = require("path");
require("dotenv").config();
require("./database").keepalive();
require("./socket/socket").registerListeners();

const app = express();

// Plugins
require("express-ws")(app);

// Middlewares
app.use("/media", express.static("assets"));
app.use("/static", express.static("client"));
app.use(express.json());
app.use(require("./session").parser);

// API Routes
app.use(require("./routes/register"));
app.use(require("./routes/login"));
app.use(require("./routes/logout"));
app.use(require("./routes/delete"));
app.use(require("./routes/profile"));

app.use(require("./socket/router"));

// Static Routes
app.get("/", async (req, res) => {
    if (req.username == null) {
        res.redirect("/register");
    } else {
        res.redirect("/dash");
    }
});

app.get("/attributions", async (req, res) => {
    res.sendFile(path.resolve("./client/attributions/index.html"));
});

app.get("/register", async (req, res) => {
    res.sendFile(path.resolve("./client/register/index.html"));
});

app.get("/login", async (req, res) => {
    res.sendFile(path.resolve("./client/login/index.html"));
});

app.get("/dash", async (req, res) => {
    if (req.username == null) {
        return res.redirect("/login");
    }
    res.sendFile(path.resolve("./client/dash/index.html"));
});

app.get("/play", async (req, res) => {
    res.redirect("/dash");
});

app.get("/play/:roomCode", async (req, res) => {
    if (req.username == null) {
        return res.redirect("/login");
    }
    res.sendFile(path.resolve("./client/play/index.html"));
});

// 404 Route
app.get("/404", async (req, res) => {
    res.sendFile(path.resolve("./client/unfound/index.html"));
})

app.use(async (req, res) => {
    res.redirect("/404");
});

// Listening
app.listen(process.env.EXPRESS_PORT, async () => {
    console.log("Server running on port " + process.env.EXPRESS_PORT);
});