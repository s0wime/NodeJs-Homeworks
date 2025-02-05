const path = require("path");
const express = require("express");
const app = express();
const port = 3000;

app.listen(port, "localhost", () => {
  console.log(`http://localhost:${port}`);
});
