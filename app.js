const express = require("express");
const { sequelize, User, Post } = require("./models");

const app = express();
// Use json middleware to make sure body received is in json format
app.use(express.json());

// API Add new user to database
app.post("/users", async (req, res) => {
  const { name, email, role } = req.body;

  try {
    const user = await User.create({ name, email, role });
    return res.json(user);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

// API to get all users from database
app.get("/users", async (req, res) => {
  try {
    const users = await User.findAll();
    return res.json(users);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Something got wrong" });
  }
});

// API to find individual user from database
app.get("/users/:uuid", async (req, res) => {
  const uuid = req.params.uuid;
  try {
    // include will include all the posts the user is associated with
    const user = await User.findOne({
      where: { uuid },
      include: "posts",
    });
    return res.json(user);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Something got wrong" });
  }
});

// APi to add posts
app.post("/posts", async (req, res) => {
  const { userUuid, body } = req.body;

  try {
    const user = await User.findOne({ where: { uuid: userUuid } });
    const post = await Post.create({ body, userId: user.id });
    return res.json(post);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

// API to get all posts with user details
app.get("/posts", async (req, res) => {
  try {
    // include is to include user mdoel details also in the response
    // model is name of model
    // as is the alias else in response original model name "User" would come as key. Now it would be "user"
    // const posts = await Post.findAll({
    //   include: [{ model: User, as: "user" }],
    // });

    // Below is the shortcut. We can use the alias name defined in association/relation (where foreignkey is mentioned)
    const posts = await Post.findAll({
      include: "user",
    });
    return res.json(posts);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

// creates listener for accepting requests
app.listen({ port: 5000 }, async () => {
  console.log("Server up on http://localhosT:5000");

  // Creates tables in database based on models we have
  // Will drop database everytime the app runs. So we need to change this. Hence commented
  // await sequelize.sync({ force: true });

  // This will just connect to database
  await sequelize.authenticate();
  console.log("Databse Connected");
});
