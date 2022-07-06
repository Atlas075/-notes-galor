const express = require("express");
const path = require("path");
const fs = require("fs");
const util = require("util");
const {} = require("constants");

const app = express();
const PORT = process.env.PORT || 3000;

const readFileSync = util.promisify(fs.readFile);
const writeFileSync = util.promisify(fs.writeFile);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

app.get("/api/notes", function (req, res) {
  readFileSync("./db/db.json", "utf8").then(function (data) {
    notes = [].concat(JSON.parse(data));
    res.json(notes);
  });
});

app.post("/api/notes", function (req, res) {
  const note = req.body;
  readFileSync("./db/db.json", "utf8")
    .then(function (data) {
      const notes = [].concat(JSON.parse(data));
      note.id = notes.length + 1;
      notes.push(note);
      return notes;
    })
    .then(function (notes) {
      writeFileSync("./db/db.json", JSON.stringify(notes));
      res.json(note);
    });
});

app.delete("/api/notes/:id", function(req, res) {
const idDelete = parseInt(req.params.id)
readFileSync("./db/db.json", "utf8").then(function(data) {
  const notes = [].concat(JSON.parse(data))
  const newNoteData = []
  for (let i = 0; i < notes.length; i++) {
    if(idDelete !== notes[i].id) {
      newNoteData.push(notes[i])
    }
  }
  return newNoteData
}).then(function(notes) {
  writeFileSync("./db/db.json", JSON.stringify(notes))
  res.send('Updated Successfully')
})
});

app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});
app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.listen(PORT, () => {
  console.log("App listening on port " + PORT);
});
