const listEl = document.getElementById("complaintList");
const popup = document.getElementById("formPopup");
const addBtn = document.getElementById("addComplaint");
const closeBtn = document.getElementById("closeBtn");
const submitBtn = document.getElementById("submitBtn");

const nameEl = document.getElementById("name");
const roomEl = document.getElementById("room");
const issueEl = document.getElementById("issue");
const categoryEl = document.getElementById("category");

addBtn.onclick = () => popup.classList.remove("hidden");
closeBtn.onclick = () => popup.classList.add("hidden");

async function loadComplaints() {
  const res = await fetch("http://localhost:5000/complaints");
  const data = await res.json();
  updateStats(data);
  listEl.innerHTML = data.map(c => `
    <div class="complaint">
      <h3>${c.issue}</h3>
      <p><strong>${c.category}</strong> • ${c.room}</p>
      <p>${c.name} • ${c.date}</p>
      <span class="status ${c.status}">${c.status}</span>
    </div>
  `).join("");
}

function updateStats(data) {
  document.getElementById("total").textContent = `Total: ${data.length}`;
  document.getElementById("pending").textContent = `Pending: ${data.filter(c => c.status === "Pending").length}`;
  document.getElementById("progress").textContent = `In Progress: ${data.filter(c => c.status === "In Progress").length}`;
  document.getElementById("resolved").textContent = `Resolved: ${data.filter(c => c.status === "Resolved").length}`;
}

submitBtn.onclick = async () => {
  const newComplaint = {
    name: nameEl.value,
    room: roomEl.value,
    issue: issueEl.value,
    category: categoryEl.value
  };

  await fetch("http://localhost:5000/complaints", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newComplaint)
  });

  popup.classList.add("hidden");
  loadComplaints();
};

loadComplaints();
