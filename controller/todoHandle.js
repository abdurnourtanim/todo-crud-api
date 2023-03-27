const expreess = require("express");
const mongoose = require("mongoose");
const router = expreess.Router();
const todoSchema = require("../schema/todoSchema");
const Todo = new mongoose.model("Todo", todoSchema);

// get all todo
router.get("/", async (req, res) => {
  await Todo.find(
    req.body,
    {
      // data filtering
      _id: 0,
      __v: 0,
      date: 0,
    },
    // data limitation
    { limit: 2 }
  )
    .then((response) => {
      res.status(200).json({ todos: response });
    })
    .catch((error) => {
      console.log(error);
      res.status(404).json({ error: "Todos not found!" });
    });
});

// get active todo
router.get("/active", async (req, res) => {
  const todo = new Todo();
  await todo
    .findActive()
    .then((response) => {
      res.status(200).json({ todo: response });
    })
    .catch((error) => {
      res.status(404).json(error);
    });
});

// get js title todo
router.get("/js", async (req, res) => {
  await Todo.findByJS()
    .then((response) => {
      res.status(200).json({ todo: response });
    })
    .catch((error) => {
      res.status(404).json(error);
    });
});

// get todo by language
router.get("/language", async (req, res) => {
  await Todo.find()
    .byLanguage("react")
    .then((response) => {
      res.status(200).json({ todo: response });
    })
    .catch((error) => {
      res.status(404).json(error);
    });
});

// get todo  by id
router.get("/:id", async (req, res) => {
  await Todo.findById(req.params.id)
    .then((response) => {
      res.status(200).json({ todo: response });
    })
    .catch((error) => {
      console.log(error);
      res.status(404).json({ error: "Todo not found!" });
    });
});

// post todo
router.post("/", async (req, res) => {
  const newTodo = new Todo(req.body);
  await newTodo
    .save()
    .then(() => {
      res.status(200).json({ message: "Todo was inserted successfull" });
    })
    .catch((error) => {
      console.log(error);
      res.status(406).json({ error: "There was server side problem" });
    });
});

// post multiple todo
router.post("/all", async (req, res) => {
  await Todo.insertMany(req.body)
    .then(() => {
      res.status(200).json({ message: "Multiple todo inserted successfull" });
    })
    .catch((error) => {
      console.log(error);
      res.status(406).json({ error: "There was server side problem!" });
    });
});

// update todo
router.put("/:id", async (req, res) => {
  await Todo.findByIdAndUpdate(
    { _id: req.params.id },
    {
      $set: {
        status: req.body.status,
      },
    },
    { new: true }
  )
    .then((response) => {
      console.log(response);
      res.status(200).json({ message: "todo update successfull" });
    })
    .catch((error) => {
      console.log(error);
      res.status(406).json({ error: "There was server side problem!" });
    });
});

// delete todo
router.delete("/:id", async (req, res) => {
  await Todo.deleteOne({ _id: req.params.id })
    .then(() => {
      res.status(200).json({ message: "Todo delete successfully" });
    })
    .catch((error) => {
      console.log("Todo not delete!");
      res.status(500).json({ error });
    });
});

module.exports = router;
