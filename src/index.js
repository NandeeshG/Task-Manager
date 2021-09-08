const express = require("express");
require("./db/mongoose");
const userRouter = require("./routes/user").module;
const taskRouter = require("./routes/task").module;

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

//404s --------------------------------------------

app.get("*", (req, res) => {
  res.status(404).send("404!");
});

app.listen(PORT, () => console.log(`Started on http://127.0.0.1:${PORT}`));
