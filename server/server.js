const express = require("express");
const fs = require("fs");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const env = require("dotenv");
const mongoose = require("mongoose");
const app = express();
const port = 8000;
env.config();
const corsOptions = {
  origin: "http://localhost:4200",
  optionsSuccessStatus: 204,
  methods: "GET, POST, PUT, DELETE",
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// MongoDB Connection
mongoose.connect(process.env.MONGO, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const User = mongoose.model("User", { email: String, password: String });

// Login Route
app.post("/api/login", async (req, res) => {
  console.log("here");
  const { email, password } = req.body;

  // Check if the user exists in the database
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  // Check if the password is correct
  if (user.password !== password) {
    return res.status(401).json({ error: "Invalid password" });
  }

  // Generate JWT token
  const token = jwt.sign({ email }, process.env.SECRET);
  res.status(200).json({ token });
});

// Registration Route
app.post("/api/register", async (req, res) => {
  const { email, password } = req.body;

  // Check if the user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ error: "User already exists" });
  }

  // Create a new user
  const newUser = new User({ email, password });
  await newUser.save();

  // Generate JWT token
  const token = jwt.sign({ email }, process.env.SECRET);
  res.status(201).json({ token });
});
// app.get("/clothes", (req, res) => {
//   const page = parseInt(req.query.page) || 0;
//   const perPage = parseInt(req.query.perPage) || 10;

//   fs.readFile("db.json", "utf8", (err, data) => {
//     if (err) {
//       console.log(err);
//       res.status(500).send("Internal Server Error");
//       return;
//     }

//     const jsonData = JSON.parse(data);

//     const start = page * perPage;
//     const end = start + perPage;

//     const result = jsonData.items.slice(start, end);

//     res.status(200).json({
//       items: result,
//       total: jsonData.items.length,
//       page,
//       perPage,
//       totalPages: Math.ceil(jsonData.items.length / perPage),
//     });
//   });
// });

app.get("/clothes", (req, res) => {
  try {
    const page = parseInt(req.query.page) || 0;
    const perPage = parseInt(req.query.perPage) || 10;
    const searchQuery = req.query.q; // Retrieve search query from query parameters

    fs.readFile("db.json", "utf8", (err, data) => {
      if (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
        return;
      }

      const jsonData = JSON.parse(data);

      // Filter items based on search query
      let filteredItems = jsonData.items;
      if (searchQuery) {
        filteredItems = filteredItems.filter((item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      const start = page * perPage;
      const end = start + perPage;
      const result = filteredItems.slice(start, end);

      res.status(200).json({
        items: result,
        total: filteredItems.length,
        page,
        perPage,
        totalPages: Math.ceil(filteredItems.length / perPage),
      });
    });
  } catch (error) {
    console.error("Error fetching clothes:", error);
    res.status(500).send("Internal Server Error");
  }
});
app.post("/clothes", (req, res) => {
  const { image, name, price, rating } = req.body;

  fs.readFile("db.json", "utf8", (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
      return;
    }

    const jsonData = JSON.parse(data);

    const maxId = jsonData.items.reduce(
      (max, item) => Math.max(max, item.id),
      0
    );

    const newItem = {
      id: maxId + 1,
      image,
      name,
      price,
      rating,
    };

    jsonData.items.push(newItem);

    fs.writeFile("db.json", JSON.stringify(jsonData), (err) => {
      if (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
        return;
      }

      res.status(201).json(newItem);
    });
  });
});

app.put("/clothes/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { image, name, price, rating } = req.body;

  fs.readFile("db.json", "utf8", (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
      return;
    }

    const jsonData = JSON.parse(data);

    const index = jsonData.items.findIndex((item) => item.id === id);

    if (index === -1) {
      res.status(404).send("Not Found");
      return;
    }

    jsonData.items[index] = {
      id,
      image,
      name,
      price,
      rating,
    };

    fs.writeFile("db.json", JSON.stringify(jsonData), (err) => {
      if (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
        return;
      }

      res.status(200).json(jsonData.items[index]);
    });
  });
});

app.delete("/clothes/:id", (req, res) => {
  const id = parseInt(req.params.id);

  fs.readFile("db.json", "utf8", (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
      return;
    }

    const jsonData = JSON.parse(data);

    const index = jsonData.items.findIndex((item) => item.id === id);

    if (index === -1) {
      res.status(404).send("Not Found");
      return;
    }

    jsonData.items.splice(index, 1);

    fs.writeFile("db.json", JSON.stringify(jsonData), (err) => {
      if (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
        return;
      }

      res.status(204).send();
    });
  });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
