import bodyParser from "body-parser";
import express from "express";
import fs from "fs";
import multer from "multer";

const app = express();
const mult = multer();
const PORT = 3000;

app.use(bodyParser.json());

app.use(mult.array());
app.use(express.static("public"));

let bigArr = [];

app.use((req, res, next) => {
  fs.readFile("blogs-database.txt", "utf-8", (err, data) => {
    if (data) {
      bigArr = JSON.parse(data);
    }

    next();
  });
});

app.post("/create-blog", (req, res) => {
  let id;

  if (bigArr.length == 0) {
    id = 1;
  } else {
    id = bigArr[bigArr.length - 1].id + 1;
  }

  let arr = { id: id, title: req.body.title, body: req.body.body };

  bigArr.push(arr);

  fs.writeFile("blogs-database.txt", JSON.stringify(bigArr), (err) => {
    if (err) {
      throw err;
    }
    console.log("Saved!");
    res.send("Successed");
  });
});

app.get("/get-blog", (req, res) => {
  if (!req.query.id) {
    console.log(req.query);
    res.status(400);
    res.send("Please Include the id of Your Blog");
  } else {
    let id = req.query.id;
    let blog;
    for (let i = 0; i < bigArr.length; i++) {
      if (bigArr[i].id == id) {
        blog = bigArr[i];
        break;
      }
    }
    if (!blog) {
      res.send("Sorry No Blog Found with that id");
    } else {
      res.send(blog);
    }
  }
});

app.delete("/delete-blog", (req, res) => {
  if (!req.query.id) {
    console.log(req.query);
    res.status(400);
    res.send("Please Include the id of Your Blog");
  } else {
    let id = req.query.id;
    let newbigArr;
    for (let i = 0; i < bigArr.length; i++) {
      if (bigArr[i].id == id) {
        newbigArr = bigArr.splice(i, 1);
        break;
      }
    }
    if (!newbigArr) {
      res.send("Sorry no blog with that id found");
    } else {
      fs.writeFile("blogs-database.txt", JSON.stringify(bigArr), (err) => {
        if (err) {
          throw err;
        }
        console.log("Succesfully removed the blog!");
        res.send("Successfully deleted the blog");
      });
    }
  }
});

app.delete("/remove-every-blog", (req, res) => {
  bigArr = [];

  fs.writeFile("blogs-database.txt", JSON.stringify(bigArr), (err) => {
    if (err) {
      throw err;
    }
    console.log("Removed Everything!");
    res.send("Removed Every Blog Successfully");
  });
});

app.get("/", (req, res) => {
  fs.readFile("blogs-database.txt", "utf-8", (err, data) => {
    console.log(data);
  });
  res.send("HELLO");
});

app.get("/get-blog-search", (req, res) => {
  if (!req.query.title) {
    res.status(400);
    res.send("Sorry Please Give a title to search for ");
  } else {
    let title = req.query.title;

    for (let i = 0; i < bigArr.length; i++) {
      if (bigArr[i].title === title) {
      }
    }
  }
});

app.listen(PORT, () => {
  console.log("Server Started Running on Port : " + PORT);
});
