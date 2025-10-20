const express = require("express");
const fs = require("fs");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const FILE_PATH = "./complaints.json";

function readComplaints() {
  if (!fs.existsSync(FILE_PATH)) return [];
  const data = fs.readFileSync(FILE_PATH);
  return JSON.parse(data || "[]");
}

function saveComplaints(complaints) {
  fs.writeFileSync(FILE_PATH, JSON.stringify(complaints, null, 2));
}

app.get("/complaints", (req, res) => {
  const complaints = readComplaints();
  res.json(complaints);
});

app.post("/complaints", (req, res) => {
  const complaints = readComplaints();
  const newComplaint = {
    id: Date.now(),
    name: req.body.name,
    room: req.body.room,
    issue: req.body.issue,
    category: req.body.category || "General",
    status: "Pending",
    date: new Date().toISOString().split("T")[0],
  };
  complaints.push(newComplaint);
  saveComplaints(complaints);
  res.status(201).json(newComplaint);
});

app.put("/complaints/:id", (req, res) => {
  const complaints = readComplaints();
  const complaint = complaints.find(c => c.id == req.params.id);
  if (!complaint) return res.status(404).json({ message: "Not found" });

  complaint.status = req.body.status;
  saveComplaints(complaints);
  res.json(complaint);
});

app.listen(5000, () => console.log("✅ Server running on port 5000"));
