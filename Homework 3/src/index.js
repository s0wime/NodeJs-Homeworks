const guestRouter = require("./controllers/guest");
const adminRouter = require("./controllers/admin");

const path = require("path");
const express = require("express");
const bodyParses = require("body-parser");
const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, "../public")));

app.use(bodyParses.urlencoded({ extended: true }));

app.use("/guest", guestRouter);
app.use("/admin", adminRouter);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.listen(port, "localhost", () => {
  console.log(`http://localhost:${port}`);
});
