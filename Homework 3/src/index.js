const guestRouter = require("./controllers/guest");
const adminRouter = require("./controllers/admin");

const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const GuestRepository = require("./repository/GuestRepository");
const AdminRepository = require("./repository/AdminRepository");

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

app.use("*", (req, res) => {
  res.status(404).render("errorPage", { errMsg: "Bad request." });
});

app.listen(port, "localhost", () => {
  console.log(`http://localhost:${port}`);
});
