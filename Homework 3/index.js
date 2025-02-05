const guestRouter = require("./controllers/guest");

const path = require("path");
const express = require("express");
const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, "public")));

app.use("/guest", guestRouter);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.listen(port, "localhost", () => {
  console.log(`http://localhost:${port}`);
});
