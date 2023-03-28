const expreess = require("express");
const mongoose = require("mongoose");
const chekcLogin = require("../middleware/checkLogin");
const router = expreess.Router();
const todoSchema = require("../schema/todoSchema");
const userSchema = require("../schema/userSchema");
const Todo = new mongoose.model("Todo", todoSchema);
const User = new mongoose.model("User", userSchema);

// get all todo
router.get("/", chekcLogin, async (req, res) => {
  await Todo.find(
    {},

    {
      // data filtering
      _id: 0,
      __v: 0,
      date: 0,
    }
    // data limitation
    // { limit: 20 }
  )
    .populate("user", "name username -_id") // - sign for not show _id
    .then((response) => {
      res.status(200).json(response);
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
router.post("/", chekcLogin, async (req, res) => {
  const newTodo = new Todo({
    ...req.body,
    user: req.userId,
  });

  try {
    const todo = await newTodo;

    todo
      .save()
      .then(async () => {
        await User.updateOne(
          {
            _id: req.userId,
          },
          {
            $push: {
              todos: todo._id,
            },
          }
        );

        res.status(200).json({ message: "Todo was inserted successfull" });
      })
      .catch((error) => {
        console.log(error);
        res.status(406).json({ error: "There was server side problem" });
      });
  } catch (error) {
    console.log(error);
  }
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
