const { getUser } = require("./users");
const path = require("path");
const express = require("express");
const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, "public")));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.get("/getUser", function (req, res) {
  const id = req.query.id;
  const user = getUser(id);
  res.render("index", { user });
});

app.get("/getHTML", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get("/getImage", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/image.jpg"));
});

app.listen(port, "localhost", () => {
  console.log(`http://localhost:${port}`);
});
