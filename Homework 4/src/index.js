const guestRouter = require("./controllers/guest");
const adminRouter = require("./controllers/admin");
const path = require("path");
const client = require('../config/dbconfig');
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, "../public")));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use("/guest", guestRouter);
app.use("/admin", adminRouter);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("mainPage");
});

app.get('/hu', (req, res) => {
    const id = 1;
    client.query('')
})

app.use("*", (req, res) => {
  res.status(404).render("errorPage", { errMsg: "Bad request." });
});

client.connect()
    .then(() => {
        console.log('Connected to PostgreSQL database');
        app.listen(port, "localhost", () => {
            console.log(`http://localhost:${port}`);
        });
    })
    .catch((err) => {
        console.error('Error connecting to PostgreSQL database', err);
    });
