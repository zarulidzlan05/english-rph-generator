const STORAGE_KEY = "my_rph_classes";

const DSKP_DATA = {
  Listening: {
    CS: "1.2 Understand meaning in a variety of familiar contexts.",
    LS: {
      1: "1.2.2 Understand with support specific information and details of very simple phrases.",
      2: "1.2.2 Understand with support specific information and details of simple sentences.",
      3: "1.2.2 Understand with support specific information and details of short simple texts.",
      4: "1.2.2 Understand with support specific information and details of longer simple texts.",
      5: "1.2.2 Understand with support specific information and details of longer simple texts on familiar topics.",
      6: "1.2.2 Understand with little or no support specific information and details of longer simple texts."
    }
  },
  Speaking: {
    CS: "2.1 Communicate simple information intelligibly.",
    LS: {
      1: "2.1.1 Give very basic personal information using fixed phrases.",
      2: "2.1.2 Ask for basic personal information using basic questions.",
      3: "2.1.1 Ask about and express basic opinions.",
      4: "2.1.4 Give a short sequence of basic directions.",
      5: "2.1.1 Give detailed information about themselves and others.",
      6: "2.1.1 Give detailed information about themselves and others clearly."
    }
  },
  Reading: {
    CS: "3.2 Understand a variety of linear and non-linear print and digital texts.",
    LS: {
      1: "3.2.2 Understand specific information and details of very simple phrases.",
      2: "3.2.2 Understand specific information and details of simple sentences.",
      3: "3.2.2 Understand specific information and details of short simple texts.",
      4: "3.2.2 Understand specific information and details of simple texts of 1-2 paragraphs.",
      5: "3.2.1 Understand the main idea of simple texts of two paragraphs or more.",
      6: "3.2.2 Understand specific information and details of simple texts of two paragraphs or more."
    }
  },
  Writing: {
    CS: "4.2 Communicate basic information intelligibly for a range of purposes.",
    LS: {
      1: "4.2.1 Give very basic personal information using fixed phrases.",
      2: "4.2.3 Describe objects using suitable words and phrases.",
      3: "4.3.1 Use capital letters, full stops, and question marks appropriately in guided writing.",
      4: "4.2.4 Describe people and objects using suitable statements.",
      5: "4.2.1 Give detailed information about themselves.",
      6: "4.2.3 Narrate factual and imagined past events and experiences."
    }
  },
  "Language Arts": {
    CS: "5.3 Express an imaginative response to literary texts.",
    LS: {
      1: "5.1.1 Demonstrate appreciation through non-verbal responses to rhymes/songs.",
      2: "5.2.1 Name people, things, or places of interest in illustrations accompanying texts.",
      3: "5.3.1 Respond imaginatively and intelligibly through creating simple action songs.",
      4: "5.2.1 Express key concepts from literary texts.",
      5: "5.3.1 Respond imaginatively through creating simple stories and poems.",
      6: "5.3.1 Respond imaginatively through creating simple stories and poems."
    }
  }
};

let savedClasses = [];

document.addEventListener("DOMContentLoaded", () => {
  loadClasses();
  updateDSKPOptions();
});

function loadClasses() {
  const data = localStorage.getItem(STORAGE_KEY);
  savedClasses = data ? JSON.parse(data) : [];
  renderClassList();
  renderClassDropdown();
}

function saveClassesToStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(savedClasses));
}

function renderClassList() {
  const tbody = document.getElementById("classListTable");
  tbody.innerHTML = "";

  if (savedClasses.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" class="text-center text-muted">No classes saved yet. Add one!</td></tr>`;
    return;
  }

  savedClasses.forEach((cls) => {
    tbody.innerHTML += `
      <tr>
        <td><strong>${cls.className}</strong></td>
        <td>Year ${cls.year}</td>
        <td>${cls.quantity}</td>
        <td>
          <button class="btn btn-sm btn-outline-primary me-1" onclick="editClass('${cls.id}')">Edit</button>
          <button class="btn btn-sm btn-outline-danger" onclick="deleteClass('${cls.id}')">Delete</button>
        </td>
      </tr>
    `;
  });
}

function renderClassDropdown() {
  const select = document.getElementById("selectSavedClass");
  select.innerHTML = `<option value="">-- Select Saved Class --</option>`;
  savedClasses.forEach((cls) => {
    select.innerHTML += `<option value="${cls.id}">${cls.className} (Year ${cls.year})</option>`;
  });
}

document.getElementById("classForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const id = document.getElementById("classId").value;
  const className = document.getElementById("classNameInput").value.trim();
  const year = document.getElementById("classYearInput").value;
  const quantity = document.getElementById("classQuantityInput").value;

  if (id) {
    const index = savedClasses.findIndex((c) => c.id === id);
    if (index !== -1) {
      savedClasses[index] = { id, className, year, quantity };
    }
  } else {
    const newClass = { id: Date.now().toString(), className, year, quantity };
    savedClasses.push(newClass);
  }

  saveClassesToStorage();
  loadClasses();
  resetClassForm();
});

function editClass(id) {
  const cls = savedClasses.find((c) => c.id === id);
  if (!cls) return;

  document.getElementById("classId").value = cls.id;
  document.getElementById("classNameInput").value = cls.className;
  document.getElementById("classYearInput").value = cls.year;
  document.getElementById("classQuantityInput").value = cls.quantity;

  document.getElementById("classFormTitle").innerText = "Edit Class";
  document.getElementById("saveClassBtn").innerText = "Update Class";
  document.getElementById("cancelEditBtn").classList.remove("d-none");
}

function deleteClass(id) {
  if (confirm("Are you sure you want to delete this class?")) {
    savedClasses = savedClasses.filter((c) => c.id !== id);
    saveClassesToStorage();
    loadClasses();
  }
}

function resetClassForm() {
  document.getElementById("classId").value = "";
  document.getElementById("classForm").reset();
  document.getElementById("classFormTitle").innerText = "Add New Class";
  document.getElementById("saveClassBtn").innerText = "Save Class";
  document.getElementById("cancelEditBtn").classList.add("d-none");
}

function onClassSelect() {
  const selectedId = document.getElementById("selectSavedClass").value;
  if (!selectedId) return;

  const cls = savedClasses.find((c) => c.id === selectedId);
  if (cls) {
    updateDSKPOptions();
  }
}

function updateDSKPOptions() {
  const selectedClassId = document.getElementById("selectSavedClass").value;
  const selectedSkill = document.getElementById("mainSkillSelect").value;
  const csSelect = document.getElementById("csSelect");
  const lsSelect = document.getElementById("lsSelect");

  let currentYear = "1";
  if (selectedClassId) {
    const cls = savedClasses.find((c) => c.id === selectedClassId);
    if (cls) currentYear = cls.year;
  }

  const skillData = DSKP_DATA[selectedSkill];

  csSelect.innerHTML = `<option value="${skillData.CS}">${skillData.CS}</option>`;
  lsSelect.innerHTML = `<option value="${skillData.LS[currentYear]}">${skillData.LS[currentYear]}</option>`;
}

function generateRPH() {
  const teacher = document.getElementById("teacherName").value || "Cikgu Name";
  const selectedClassId = document.getElementById("selectSavedClass").value;

  if (!selectedClassId) {
    alert("Please select a saved class first!");
    return;
  }

  const cls = savedClasses.find((c) => c.id === selectedClassId);
  const date = document.getElementById("lessonDate").value;
  const day = document.getElementById("lessonDay").value;
  const time = document.getElementById("lessonTime").value || "08:00 - 09:00 AM";
  const topic = document.getElementById("lessonTopic").value || "World of Knowledge";

  const skill = document.getElementById("mainSkillSelect").value;
  const cs = document.getElementById("csSelect").value;
  const ls = document.getElementById("lsSelect").value;

  const bcd1 = document.getElementById("bcd1").value;
  const bcd2 = document.getElementById("bcd2").value;
  const criteria = document.getElementById("successCriteria").value;

  const starter = document.getElementById("actStarter").value;
  const main = document.getElementById("actMain").value;
  const plenary = document.getElementById("actPlenary").value;

  const emk = document.getElementById("emkInput").value;
  const bbb = document.getElementById("bbbInput").value;

  document.getElementById("previewTeacher").innerText = teacher;
  document.getElementById("previewClass").innerText = cls.className;
  document.getElementById("previewQuantity").innerText = `${cls.quantity} pupils`;
  document.getElementById("previewDateDay").innerText = `${date} (${day})`;
  document.getElementById("previewTime").innerText = time;
  document.getElementById("previewTopic").innerText = topic;

  document.getElementById("previewSkill").innerText = skill;
  document.getElementById("previewCS").innerText = cs;
  document.getElementById("previewLS").innerText = ls;

  // STRICT OBJECTIVE FORMAT: "By the end of the lesson, [Class Name] pupils should be able to:"
  document.getElementById("previewAudienceHeader").innerText = `By the end of the lesson, ${cls.className} pupils should be able to:`;

  const objList = document.getElementById("previewObjectivesList");
  objList.innerHTML = `<li>${bcd1}</li>`;
  if (bcd2.trim() !== "") {
    objList.innerHTML += `<li>${bcd2}</li>`;
  }

  document.getElementById("previewCriteria").innerText = criteria || "-";
  document.getElementById("previewStarter").innerText = starter;
  document.getElementById("previewMain").innerText = main;
  document.getElementById("previewPlenary").innerText = plenary;

  document.getElementById("previewEMK").innerText = emk;
  document.getElementById("previewBBB").innerText = bbb;

  document.getElementById("previewReflection").innerText = `___ / ${cls.quantity} pupils achieved the learning objectives. Remedial activity was given to pupils who needed guidance.`;
}
