// أوصاف المشاريع
const projectDescriptions = [
  "Structural design of heavy and light steel projects in Saudi Arabia, including MBC Studios, Six Flags Qiddiya (Al Nahda – Seven Group), and fuel station canopies. All projects were designed from scratch in compliance with the American code",
  "Structural design and 3D modeling of complex steel frameworks for the Porto Cruise Alamein project, including roof trusses and special architectural steel systems. Work involved analytical modeling, load optimization, and ensuring compliance with design codes for stability and constructability.",
  "ولبحرية.",
  "Structural design and modeling of several steel projects, including warehouses, hangars, and architectural frames. All designs were developed from scratch according to American and Egyptian codes, ensuring strength, stability, and safety.",
  "Development of customized Excel sheets for structural analysis, load calculations, and steel design automation, enhancing accuracy, speed, and overall design efficiency.",
];

// اختر كل البوكسات الخاصة بالمشاريع
const projectCards = document.querySelectorAll(".project-card");

projectCards.forEach((card, idx) => {
  // إنشاء عنصر <p> جديد لكل مشروع
  const p = document.createElement("p");
  p.className = "project-description";
  p.style.marginTop = "25px";
  p.style.color = "#ffffff";
  p.style.fontSize = "1rem";
  p.style.lineHeight = "1.4";
  p.style.minHeight = "30px";
  p.style.textAlign = "center";
  card.appendChild(p);

  // Show description instantly with no animation
  p.textContent = projectDescriptions[idx];
});