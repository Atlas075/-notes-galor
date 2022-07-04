const express = require("express");
const path = require("path");
const fs = require("fs");
const uuid = require("uuid");
const { DH_CHECK_P_NOT_SAFE_PRIME } = require("constants");
const notes = require("../../../db/db.json");

const app = express();
const PORT = process.env.PORT || 5500;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

app.get("/Develop/public/notes.html", (req, res) => {
  res.sendFile(path.join(__dirname, "/db/db.json"));
});

app.post("/Develop/public/notes.html", (req, res) => {
  const notes = JSON.parse(fs.readFileSync("/db/db.json"));
  const newNotes = req.body;
  newNotes.id = uuid.v4();
  notes.push(newNotes);
  fs.writeFileSync("/db/db.json", stringify(notes));
  res.json(notes);
});

app.delete("/Develop/public/notes.html/:id", (req, res) => {
  const notes = JSON.parse(fs.readFileSync("/db/db.json"));
  const deleteNotes = notes.filter((rmvNote) => rmvNote.id !== req.params.id);
  fs.fstat.writeFileSync("/db/db.json", JSON.stringify(deleteNotes));
  res.json(deleteNotes);
});

app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "/Develop/public/notes.html"));
});
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "/Develop/public/index.html"));
});
app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "/Develop/public/index.html"));
});

app.listen(PORT, function () {
  console.log("App listening on port" + PORT);
});
