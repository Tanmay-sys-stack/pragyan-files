document.getElementById('projectForm').addEventListener('submit', async function(e) {
    e.preventDefault();
  
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
  
    const name = document.getElementById('name').value;
    const className = document.getElementById('class').value;
    const subject = document.getElementById('subject').value;
    const teacher = document.getElementById('teacher').value;
    const type = document.getElementById('type').value;
  
    const img = new Image();
    img.src = "logo.png"; // Make sure logo.png exists
  
    img.onload = function () {
      // PAGE 1 - TITLE PAGE
      doc.setFontSize(30);
      doc.text(subject.toUpperCase(), 105, 50, null, null, 'center');
      doc.text(type.toUpperCase(), 105, 70, null, null, 'center');
      doc.text("PROJECT", 105, 90, null, null, 'center');
  
      doc.addImage(img, 'PNG', 80, 100, 50, 50); // logo below heading
  
      doc.setFontSize(16);
      doc.text(`Submitted to:`, 30, 180);
      doc.text(`${teacher}`, 30, 188);
      doc.text(`(${subject} Teacher)`, 30, 196);
  
      doc.text(`Submitted by:`, 140, 180);
      doc.text(`${name}`, 140, 188);
      doc.text(`Class ${className}`, 140, 196);
  
      // PAGE 2 - ACKNOWLEDGEMENT
      doc.addPage();
      doc.setFontSize(22);
      doc.text("ACKNOWLEDGEMENT", 105, 30, null, null, 'center');
      doc.setFontSize(17);
      const ackText = `It was a wonderful experience researching, compiling, and writing this investigatory project of ${subject}.
  
  The file has achieved its completion under the supervision of my teacher, ${teacher}. I am highly indebted to him/her for his/her able guidance, valuable suggestions, and the constant encouragement during the course of the work.
  
  I also express my gratitude and sincere thanks to my family and friends who supported me in this endeavour.`;
      doc.text(ackText, 20, 50, { maxWidth: 170 });
  
      // PAGE 3 - CERTIFICATE
      doc.addPage();
      doc.setFontSize(22);
      doc.text("CERTIFICATE", 105, 30, null, null, 'center');
      doc.setFontSize(17);
      const certText = `This is to certify that ${name} of class ${className} of Pragyan School, Greater Noida has completed her/his ${subject} ${type} under my supervision.
  
  I certify that this activity file is up to my expectation and as per guidelines issued by CBSE.`;
      doc.text(certText, 20, 50, { maxWidth: 170 });
  
      // Signatures at bottom
      doc.setFontSize(16);
      doc.text(`${teacher}`, 30, 250);
      doc.text("Ms. Ruchika Sharma", 130, 250);
      doc.text(`(${subject} Dept.)`, 30, 258);
      doc.text("(Principal)", 130, 258);
  
      doc.save(`${subject}_${type}_by_${name}.pdf`);
    };
  });
  