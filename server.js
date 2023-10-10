const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const app = express();
dotenv.config();

app.use(express.static(path.join(__dirname, "build")));

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

// INFO: https://stackoverflow.com/questions/53234140/react-expressjs-backend-cant-serve-static-frontend
app.use("*", (req, res) =>
  res.sendFile(path.join(__dirname, "build", "index.html"))
);

app.listen(process.env.REACT_APP_FRONTEND_PORT, () => {
  console.log(
    `React app now listening to port ${process.env.REACT_APP_FRONTEND_PORT}`
  );
});