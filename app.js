const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors"); // <-- Step 11
const { PORT = 3001 } = process.env;

const app = express();

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(console.error);

app.use(cors()); // <-- Step 11: enable CORS
app.use(express.json());

const mainRouter = require("./routes/index");
app.use("/", mainRouter);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
