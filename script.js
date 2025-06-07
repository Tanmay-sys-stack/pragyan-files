let generatedProjectContent = "";

// Use Puter.js for free AI generation (no API key needed)
document.getElementById('generateContentBtn').addEventListener('click', async () => {
  const prompt = document.getElementById('aiPrompt').value.trim();
  const status = document.getElementById('aiStatus');

  if (!prompt) {
    alert("Please enter a project topic.");
    return;
  }

  status.textContent = "Generating content with AI... Please wait ⏳";

  try {
    const fullPrompt = `Write a detailed CBSE-style school project report on the topic: "${prompt}". 
- Divide it into proper sections with markdown headings like ## Introduction, ## Objective, etc.
- Use markdown for formatting and add 1 relevant image per section in this format: ![caption](image-url).
- Use image links only from Wikimedia, Unsplash or Pexels.`;

    const result = await puter.ai.chat(fullPrompt, { model: "gpt-4.1" });
    generatedProjectContent = result.message.content;
    status.textContent = "✅ Project content generated and ready to export!";
  } catch (err) {
    console.error(err);
    status.textContent = "❌ AI generation failed. Try again later.";
  }
});

document.getElementById('projectForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const name = document.getElementById('name').value;
  const className = document.getElementById('class').value;
  const subject = document.getElementById('subject').value;
  const teacher = document.getElementById('teacher').value;
  const type = document.getElementById('type').value;

  const indexList = window.indexList || [];

  // Load and place logo
  const logo = new Image();
  logo.src = "logo.png";

  logo.onload = async function () {
    // Title Page
    doc.setFontSize(30);
    doc.text(subject.toUpperCase(), 105, 50, null, null, 'center');
    doc.text(type.toUpperCase(), 105, 70, null, null, 'center');
    doc.text("PROJECT", 105, 90, null, null, 'center');
    doc.addImage(logo, 'PNG', 80, 100, 50, 50);

    doc.setFontSize(16);
    doc.text(`Submitted to:`, 30, 180);
    doc.text(`${teacher}`, 30, 188);
    doc.text(`(${subject} Teacher)`, 30, 196);
    doc.text(`Submitted by:`, 140, 180);
    doc.text(`${name}`, 140, 188);
    doc.text(`Class ${className}`, 140, 196);

    // Acknowledgement
    doc.addPage();
    doc.setFontSize(22);
    doc.text("ACKNOWLEDGEMENT", 105, 30, null, null, 'center');
    doc.setFontSize(16);
    const ackText = `It was a wonderful experience researching and compiling this project on ${subject}.

The project was completed under the valuable guidance of my teacher ${teacher}. I’m sincerely thankful for the support and constant encouragement.

I also extend my gratitude to my family and friends for their help.`;
    doc.text(ackText, 20, 50, { maxWidth: 170, lineHeightFactor: 1.5 });

    // Certificate
    doc.addPage();
    doc.setFontSize(22);
    doc.text("CERTIFICATE", 105, 30, null, null, 'center');
    doc.setFontSize(16);
    const certText = `This is to certify that ${name} of class ${className} of Pragyan School, Greater Noida has successfully completed this ${subject} ${type} under my guidance.

The work is original and aligns with CBSE guidelines.`;
    doc.text(certText, 20, 50, { maxWidth: 170, lineHeightFactor: 1.5 });

    doc.setFontSize(13);
    doc.text(`${teacher}`, 30, 250);
    doc.text("Ms. Ruchika Sharma", 130, 250);
    doc.text(`(${subject} Dept.)`, 30, 258);
    doc.text("(Principal)", 130, 258);

    // Index
    if (indexList.length > 0) {
      doc.addPage();
      doc.setFontSize(22);
      doc.text("INDEX", 105, 30, null, null, 'center');
      doc.setFontSize(16);

      const startX = 20;
      const startY = 50;
      const rowHeight = 10;

      doc.setFont(undefined, 'bold');
      doc.text("S. No.", startX, startY);
      doc.text("Topic", startX + 30, startY);
      doc.text("Page No.", startX + 140, startY);
      doc.setFont(undefined, 'normal');

      indexList.forEach((item, i) => {
        const y = startY + rowHeight * (i + 1);
        doc.text(`${i + 1}`, startX, y);
        doc.text(item.topic, startX + 30, y);
        doc.text(item.page, startX + 140, y);
      });

      const endY = startY + rowHeight * (indexList.length + 1);
      doc.setDrawColor(0);
      doc.rect(startX - 5, startY - 7, 175, endY - startY + 14);
    }

    // AI-generated content with image & heading handling
    if (generatedProjectContent) {
      const lines = generatedProjectContent.split('\n');
      let y = 30;
      doc.addPage();
      for (const line of lines) {
        if (!line.trim()) continue;

        // Image handling
        const imageMatch = line.match(/!\[.*?\]\((.*?)\)/);
        if (imageMatch) {
          const imageUrl = imageMatch[1];
          try {
            const imageBlob = await fetch(imageUrl).then(r => r.blob());
            const base64Img = await new Promise(res => {
              const reader = new FileReader();
              reader.onloadend = () => res(reader.result);
              reader.readAsDataURL(imageBlob);
            });
            if (y > 220) { doc.addPage(); y = 30; }
            doc.addImage(base64Img, 'JPEG', 20, y, 100, 60);
            y += 70;
          } catch (err) {
            console.warn("Image failed to load:", imageUrl);
          }
          continue;
        }

        // Heading
        if (line.startsWith("## ")) {
          if (y > 250) { doc.addPage(); y = 30; }
          doc.setFontSize(18);
          doc.setFont(undefined, 'bold');
          doc.text(line.replace("## ", "").toUpperCase(), 20, y);
          y += 10;
          continue;
        }

        // Normal text
        doc.setFontSize(14);
        doc.setFont(undefined, 'normal');
        const splitText = doc.splitTextToSize(line, 170);
        if (y + splitText.length * 8 > 280) {
          doc.addPage();
          y = 30;
        }
        doc.text(splitText, 20, y);
        y += splitText.length * 8;
      }
    }

    doc.save(`${subject}_${type}_by_${name}.pdf`);
  };
});