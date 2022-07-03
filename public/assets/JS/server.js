const express = require("express");
const path = require("path");
const fs = require("fs");
const util = require('util');
const util = require("../../../db.json");

const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

const app = express();
const PORT = process.env.PORT || 5500;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("./public"));

app.get("/api/notes", function (req, res) {
  readFileAsync("../../../db.json", "utf8").then(function (data) {
    notes = [].concat(JSON.parse(data));
    res.json(notes);
  });
});

app.post("/api/notes", function (req, res) {
  const note = req.body;
  readFileAsync("../../../db.json", "utf8")
    .then(function (data) {
      const notes = [].concat(JSON.parse(data));
      note.id = notes.length + 1;
      notes.push(note);
      return notes;
    })
    .then(function (notes) {
      writeFileAsync("../../../db.json", JSON.stringify(notes));
      res.json(note);
    });
});

app.delete("/api/notes/:id", function (req, res) {
  const deleating = parseInt(req.params.id);
  readFileAsync("../../../db.json", "utf8")
    .then(function (data) {
      const notes = [].concat(JSON.parse(data));
      const newNotesInfo = [];
      for (let i = 0; i < notes.length; i++) {
        if (deleating !== notes[i].id) {
          newNotesInfo.push(notes[i]);
        }
      }
      return newNotesInfo;
    })
    .then(function (notes) {
      writeFileAsync("../../../db.json", JSON.stringify(notes));
      res.send("Note saved successfully");
    });
});

app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "/public/assets/html/notes.html"));
});
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "/public/assets/html/index.html"));
});
app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "/public/assets/html/index.html"));
});

app.listen(PORT, function () {
  console.log("App listening on port" + PORT);
});
