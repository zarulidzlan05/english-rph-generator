const STORAGE_KEY = "my_rph_ipg_classes";

const DSKP_DATABASE = {
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
  initSkillDropdowns();
  // Set default today's date
  document.getElementById("lessonDate").valueToDate = new Date();
  document.getElementById("lessonDate").value = new Date().toISOString().substring(0, 10);
});

function loadClasses() {
  const data = localStorage.getItem(STORAGE_KEY);
  savedClasses = data ? JSON.parse(data) : [
    { id: "1", className: "3 Arif", year: "3", quantity: "26" }
  ];
  renderClassList();
  renderClassDropdown();
}

function saveClassesToStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(savedClasses));
}

function renderClassList() {
  const tbody = document.getElementById("classListTable");
  tbody.innerHTML = "";
  savedClasses.forEach((cls) => {
    tbody.innerHTML += `
      <tr>
        <td><strong>${cls.className}</strong></td>
        <td>Year ${cls.year}</td>
        <td>${cls.quantity}</td>
        <td class="text-end">
          <button class="btn btn-sm btn-outline-primary me-1" onclick="editClass('${cls.id}')"><i class="bi bi-pencil"></i></button>
          <button class="btn btn-sm btn-outline-danger" onclick="deleteClass('${cls.id}')"><i class="bi bi-trash"></i></button>
        </td>
      </tr>
    `;
  });
}

function renderClassDropdown() {
  const select = document.getElementById("selectSavedClass");
  select.innerHTML = `<option value="">-- Select Saved Class --</option>`;
  savedClasses.forEach((cls) => {
    select.innerHTML += `<option value="${cls.id}">${cls.className} (Year ${cls.year} - ${cls.quantity} pupils)</option>`;
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
    if (index !== -1) savedClasses[index] = { id, className, year, quantity };
  } else {
    savedClasses.push({ id: Date.now().toString(), className, year, quantity });
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
  document.getElementById("classFormTitle").innerText = "Edit Class Profile";
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
  document.getElementById("classFormTitle").innerText = "Add New Class Profile";
  document.getElementById("saveClassBtn").innerText = "Save Class";
  document.getElementById("cancelEditBtn").classList.add("d-none");
}

function initSkillDropdowns() {
  const mainSelect = document.getElementById("mainSkillSelect");
  const compSelect = document.getElementById("compSkillSelect");
  
  mainSelect.innerHTML = "";
  compSelect.innerHTML = "";

  Object.keys(DSKP_DATABASE).forEach((skill) => {
    mainSelect.innerHTML += `<option value="${skill}">${skill}</option>`;
    compSelect.innerHTML += `<option value="${skill}">${skill}</option>`;
  });

  mainSelect.value = "Listening";
  compSelect.value = "Speaking";
  updateDSKP();
}

function onClassSelect() {
  updateDSKP();
  generateRPH();
}

function updateDSKP() {
  const selectedClassId = document.getElementById("selectSavedClass").value;
  let year = "1";
  if (selectedClassId) {
    const cls = savedClasses.find((c) => c.id === selectedClassId);
    if (cls) year = cls.year;
  }

  const mainSkill = document.getElementById("mainSkillSelect").value;
  const compSkill = document.getElementById("compSkillSelect").value;

  document.getElementById("mainCS").value = DSKP_DATABASE[mainSkill].CS;
  document.getElementById("mainLS").value = DSKP_DATABASE[mainSkill].LS[year];

  document.getElementById("compCS").value = DSKP_DATABASE[compSkill].CS;
  document.getElementById("compLS").value = DSKP_DATABASE[compSkill].LS[year];
}

function generateRPH() {
  const selectedClassId = document.getElementById("selectSavedClass").value;
  let className = "3 Arif";
  let year = "1";
  let quantity = "26";

  if (selectedClassId) {
    const cls = savedClasses.find((c) => c.id === selectedClassId);
    if (cls) {
      className = cls.className;
      year = cls.year;
      quantity = cls.quantity;
    }
  }

  // Bind Admin Fields
  document.getElementById("pYear").innerText = year;
  document.getElementById("pNumStudents").innerText = quantity;
  document.getElementById("pDate").innerText = document.getElementById("lessonDate").value || "-";
  document.getElementById("pTime").innerText = document.getElementById("lessonTime").value || "-";
  document.getElementById("pThemeTopic").innerText = document.getElementById("lessonThemeTopic").value || "-";
  document.getElementById("pSkillFocus").innerText = document.getElementById("lessonSkillFocus").value || "-";
  document.getElementById("pPriorKnowledge").innerText = document.getElementById("priorKnowledge").value || "-";

  // Bind DSKP
  document.getElementById("pMainSkillTitle").innerText = document.getElementById("mainSkillSelect").value;
  document.getElementById("pCompSkillTitle").innerText = document.getElementById("compSkillSelect").value;
  document.getElementById("pMainCS").innerText = document.getElementById("mainCS").value;
  document.getElementById("pMainLS").innerText = document.getElementById("mainLS").value;
  document.getElementById("pCompCS").innerText = document.getElementById("compCS").value;
  document.getElementById("pCompLS").innerText = document.getElementById("compLS").value;

  // Bind LO
  document.getElementById("pLoKnowledge").innerText = document.getElementById("loKnowledge").value || "-";
  document.getElementById("pLoSkill").innerText = document.getElementById("loSkill").value || "-";
  document.getElementById("pLoValue").innerText = document.getElementById("loValue").value || "-";

  // STRICT OBJECTIVE AUDIENCE HEADER
  document.getElementById("pObjHeader").innerText = `By the end of the lesson, ${className} pupils should be able to:`;

  const bcd1 = document.getElementById("bcd1").value;
  const bcd2 = document.getElementById("bcd2").value;
  const objList = document.getElementById("pObjList");
  objList.innerHTML = `<li>${bcd1}</li>`;
  if (bcd2.trim() !== "") objList.innerHTML += `<li>${bcd2}</li>`;

  // Success Criteria
  const sc1 = document.getElementById("sc1").value;
  const sc2 = document.getElementById("sc2").value;
  const sc3 = document.getElementById("sc3").value;
  const sc4 = document.getElementById("sc4").value;
  let scHtml = "";
  if (sc1) scHtml += `<div>${sc1}</div>`;
  if (sc2) scHtml += `<div>${sc2}</div>`;
  if (sc3) scHtml += `<div>${sc3}</div>`;
  if (sc4) scHtml += `<div>${sc4}</div>`;
  document.getElementById("pScList").innerHTML = scHtml || "1. Complete assigned worksheet task.";

  // CBA
  document.getElementById("pCbaOral").innerText = document.getElementById("cbaOral").checked ? "√" : "";
  document.getElementById("pCbaObs").innerText = document.getElementById("cbaObs").checked ? "√" : "";
  document.getElementById("pCbaWritten").innerText = document.getElementById("cbaWritten").checked ? "√" : "";
  document.getElementById("pCbaInst").innerText = document.getElementById("cbaInstruments").value || "-";

  // Elements
  document.getElementById("pTS").innerText = document.getElementById("elemTS").value || "-";
  document.getElementById("pCCE").innerText = document.getElementById("elemCCE").value || "-";
  document.getElementById("pICT").innerText = document.getElementById("elemICT").value || "-";
  document.getElementById("pTLM").innerText = document.getElementById("elemTLM").value || "-";
  document.getElementById("pAED").innerText = document.getElementById("elemAED").value || "-";
  document.getElementById("pSS").innerText = document.getElementById("elemSS").value || "-";
  document.getElementById("p21CPP").innerText = document.getElementById("elem21CPP").value || "-";
  document.getElementById("pDS").innerText = document.getElementById("elemDS").value || "-";

  // Stages
  document.getElementById("pPreContent").innerText = document.getElementById("preContent").value;
  document.getElementById("pPreAct").innerText = document.getElementById("preAct").value;

  document.getElementById("pStg1Content").innerText = document.getElementById("stg1Content").value;
  document.getElementById("pStg1Act").innerText = document.getElementById("stg1Act").value;

  document.getElementById("pStg2Content").innerText = document.getElementById("stg2Content").value;
  document.getElementById("pStg2Act").innerText = document.getElementById("stg2Act").value;

  document.getElementById("pStg3Content").innerText = document.getElementById("stg3Content").value;
  document.getElementById("pStg3Act").innerText = document.getElementById("stg3Act").value;

  document.getElementById("pPostContent").innerText = document.getElementById("postContent").value;
  document.getElementById("pPostAct").innerText = document.getElementById("postAct").value;

  // Standard Remarks Text Tag Generator
  const remarkTemplate = `
    <b>CBA:</b> ${document.getElementById("cbaInstruments").value || "Checklist"}<br>
    <b>TS:</b> ${document.getElementById("elemTS").value}<br>
    <b>CCE:</b> ${document.getElementById("elemCCE").value}<br>
    <b>T&LM:</b> ${document.getElementById("elemTLM").value}
  `;

  document.getElementById("pPreRemarks").innerHTML = remarkTemplate;
  document.getElementById("pStg1Remarks").innerHTML = remarkTemplate;
  document.getElementById("pStg2Remarks").innerHTML = remarkTemplate;
  document.getElementById("pStg3Remarks").innerHTML = remarkTemplate;
  document.getElementById("pPostRemarks").innerHTML = remarkTemplate;
}
