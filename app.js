document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("lessonDate").valueAsDate = new Date();
  generateRPH(); // Auto-populate on load
});

function generateRPH() {
  const className = document.getElementById("className").value || "3 Arif";
  
  // Header Info
  document.getElementById("pYear").innerText = document.getElementById("classYear").value;
  document.getElementById("pNumStudents").innerText = document.getElementById("classQty").value;
  document.getElementById("pDate").innerText = document.getElementById("lessonDate").value;
  document.getElementById("pTime").innerText = document.getElementById("lessonTime").value;
  document.getElementById("pThemeTopic").innerText = document.getElementById("themeTopic").value;
  document.getElementById("pSkillFocus").innerText = document.getElementById("skillFocus").value;
  document.getElementById("pPriorKnowledge").innerText = document.getElementById("priorKnowledge").value;

  // DSKP
  document.getElementById("pMainSkillTitle").innerText = document.getElementById("mainSkill").value;
  document.getElementById("pCompSkillTitle").innerText = document.getElementById("compSkill").value;
  document.getElementById("pMainCS").innerText = document.getElementById("mainCS").value;
  document.getElementById("pMainLS").innerText = document.getElementById("mainLS").value;
  document.getElementById("pCompCS").innerText = document.getElementById("compCS").value;
  document.getElementById("pCompLS").innerText = document.getElementById("compLS").value;

  // Learning Outcomes (4-column format)
  document.getElementById("pLoKnowledge").innerText = document.getElementById("loKnowledge").value;
  document.getElementById("pLoSkill").innerText = document.getElementById("loSkill").value;
  document.getElementById("pLoValue").innerText = document.getElementById("loValue").value;

  // Objectives
  document.getElementById("pObjHeader").innerText = `By the end of the lesson, ${className} pupils should be able to:`;
  const objText = document.getElementById("objectives").value;
  document.getElementById("pObjList").innerHTML = objText ? objText.replace(/\n/g, '<br>') : '';
  
  const scText = document.getElementById("successCriteria").value;
  document.getElementById("pScList").innerHTML = scText ? scText.replace(/\n/g, '<br>') : '';

  // Elements
  document.getElementById("pTS").innerText = document.getElementById("elemTS").value;
  document.getElementById("pCCE").innerText = document.getElementById("elemCCE").value;
  document.getElementById("pICT").innerText = document.getElementById("elemICT").value;
  document.getElementById("pTLM").innerText = document.getElementById("elemTLM").value;
  document.getElementById("pAED").innerText = document.getElementById("elemAED").value;
  document.getElementById("pSS").innerText = document.getElementById("elemSS").value;
  document.getElementById("p21CPP").innerText = document.getElementById("elem21CPP").value;
  document.getElementById("pDS").innerText = document.getElementById("elemDS").value;
}

function exportToWord() {
  generateRPH(); // Ensure data is current

  // Word Document Wrapping (Includes proper table styling for Word/WPS)
  const header = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>RPH Export</title>
      <style>
        @page WordSection1 { size: A4 portrait; margin: 1.0in 1.0in 1.0in 1.0in; }
        div.WordSection1 { page: WordSection1; font-family: Arial, sans-serif; font-size: 11pt; }
        table { border-collapse: collapse; width: 100%; margin-bottom: 12px; font-family: Arial, sans-serif; font-size: 11pt; }
        th, td { border: 1px solid black; padding: 5px; vertical-align: top; }
        .bold-label { font-weight: bold; }
        .text-center { text-align: center; }
        h3 { font-family: Arial, sans-serif; font-size: 12pt; text-align: center; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class='WordSection1'>
  `;
  const footer = "</div></body></html>";
  const content = document.getElementById("documentContent").innerHTML;
  const sourceHTML = header + content + footer;
  
  // Create Blob & Download Link
  const blob = new Blob(['\ufeff', sourceHTML], { type: 'application/msword' });
  const url = URL.createObjectURL(blob);
  const downloadLink = document.createElement("a");
  
  downloadLink.href = url;
  downloadLink.download = "RPH_Lesson_Plan.doc"; // Saves as .doc for WPS
  
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  URL.revokeObjectURL(url);
}
