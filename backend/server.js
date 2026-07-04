const express = require("express");
const cors = require("cors");
require("dotenv").config();

const chatRoute = require("./routes/chat");

const app = express();
app.use(cors());
app.use(express.json()); //lets server read json req bodies

app.use("/api/chat", chatRoute); //any res to /api/chat gets handled by this router.

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
