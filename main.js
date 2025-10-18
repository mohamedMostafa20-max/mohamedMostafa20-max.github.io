// Typing animation
const nameEl = document.getElementById("typing-name");
const titleEl = document.getElementById("typing-title");
const nameText = "Mohamed Mostafa";
const titleText = "Civil / Steel Designer Engineer";

function typingSequence() {
  let nameIndex = 0;
  function typeName() {
    nameEl.textContent = nameText.slice(0, nameIndex++);
    if (nameIndex <= nameText.length) setTimeout(typeName, 150);
    else setTimeout(typeTitle, 500);
  }
  let titleIndex = 0;
  function typeTitle() {
    titleEl.textContent = titleText.slice(0, titleIndex++);
    if (titleIndex <= titleText.length) setTimeout(typeTitle, 150);
    else setTimeout(eraseTitle, 1500);
  }
  let eraseTitleIndex = titleText.length;
  function eraseTitle() {
    titleEl.textContent = titleText.slice(0, eraseTitleIndex--);
    if (eraseTitleIndex >= 0) setTimeout(eraseTitle, 80);
    else setTimeout(eraseName, 500);
  }
  let eraseNameIndex = nameText.length;
  function eraseName() {
    nameEl.textContent = nameText.slice(0, eraseNameIndex--);
    if (eraseNameIndex >= 0) setTimeout(eraseName, 80);
    else setTimeout(typingSequence, 500);
  }
  typeName();
}
typingSequence();

// ================================================
// ✅ Dynamic Image Loading + Lightbox System
// ================================================
const projectImagesMap = new Map(); // كل مشروع وليه مصفوفة صور خاصة
let currentProjectImages = []; // صور المشروع المفتوح حاليًا

// Check if image exists before loading
function checkImageExists(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = src;
  });
}

// Load images dynamically for each project folder
async function loadProjectImages(projectName, track) {
  const images = [];
  let i = 1;
  let consecutiveNotFound = 0;
  const maxConsecutiveNotFound = 10;

  while (consecutiveNotFound < maxConsecutiveNotFound) {
    const imagePath = `images/${projectName}${i}.jpg`;
    const exists = await checkImageExists(imagePath);

    if (exists) {
      const img = document.createElement("img");
      img.src = imagePath;
      img.style.width = "calc(100% / 3 - 10px)";
      img.style.height = "250px";
      img.style.objectFit = "cover";
      img.style.borderRadius = "8px";
      img.style.cursor = "pointer";
      img.style.transition = "transform 0.4s ease";

      img.addEventListener("mouseenter", () => (img.style.transform = "scale(1.05)"));
      img.addEventListener("mouseleave", () => (img.style.transform = "scale(1)"));
      img.addEventListener("click", () => {
        openLightbox(images, images.indexOf(img));
      });

      track.appendChild(img);
      images.push(img);
      consecutiveNotFound = 0;
    } else {
      consecutiveNotFound++;
    }

    i++;
  }

  projectImagesMap.set(projectName, images);
  return images;
}

// Initialize all carousels
const carousels = document.querySelectorAll(".carousel-container");
carousels.forEach(async (container) => {
  const track = container.querySelector(".carousel-track");
  const prev = container.querySelector(".prev");
  const next = container.querySelector(".next");
  const projectName = track.getAttribute("data-project");
  const images = await loadProjectImages(projectName, track);

  if (images.length === 0) {
    container.closest(".project-card").style.display = "none";
    return;
  }

  let index = 0;
  const total = images.length;
  const show = 3;

  if (total <= 3) {
    prev.style.display = "none";
    next.style.display = "none";
  } else {
    prev.addEventListener("click", () => {
      index = Math.max(index - 1, 0);
      track.style.transform = `translateX(-${
        (images[0].offsetWidth + 10) * index
      }px)`;
    });

    next.addEventListener("click", () => {
      index = Math.min(index + 1, total - show);
      track.style.transform = `translateX(-${
        (images[0].offsetWidth + 10) * index
      }px)`;
    });
  }
});

// ================================================
// ✅ Lightbox functionality (مربوط بالمشروع فقط)
// ================================================
let currentImageIndex = 0;
const lightbox = document.getElementById("lightbox");
const lightboxContent = document.querySelector(".lightbox-content");
const lightboxPrev = document.querySelector(".lightbox-prev");
const lightboxNext = document.querySelector(".lightbox-next");

function openLightbox(images, index) {
  currentProjectImages = images;
  currentImageIndex = index;
  lightbox.style.display = "flex";
  lightboxContent.src = currentProjectImages[index].src;
  updateNavigationButtons();
  document.body.style.overflow = "hidden";

  setTimeout(() => {
    lightboxContent.classList.add("fade-out");
    setTimeout(() => lightboxContent.classList.remove("fade-out"), 10);
  }, 10);
}

function closeLightbox() {
  lightboxContent.classList.add("fade-out");
  setTimeout(() => {
    lightbox.style.display = "none";
    lightboxContent.classList.remove("fade-out");
    document.body.style.overflow = "auto";
  }, 300);
}

function showPreviousImage() {
  if (currentImageIndex > 0) {
    lightboxContent.classList.add("slide-right");
    setTimeout(() => {
      currentImageIndex--;
      lightboxContent.src = currentProjectImages[currentImageIndex].src;
      lightboxContent.classList.remove("slide-right");
      lightboxContent.classList.add("slide-left");
      setTimeout(() => lightboxContent.classList.remove("slide-left"), 50);
      updateNavigationButtons();
    }, 150);
  }
}

function showNextImage() {
  if (currentImageIndex < currentProjectImages.length - 1) {
    lightboxContent.classList.add("slide-left");
    setTimeout(() => {
      currentImageIndex++;
      lightboxContent.src = currentProjectImages[currentImageIndex].src;
      lightboxContent.classList.remove("slide-left");
      lightboxContent.classList.add("slide-right");
      setTimeout(() => lightboxContent.classList.remove("slide-right"), 50);
      updateNavigationButtons();
    }, 150);
  }
}

function updateNavigationButtons() {
  lightboxPrev.style.display = currentImageIndex > 0 ? "block" : "none";
  lightboxNext.style.display =
    currentImageIndex < currentProjectImages.length - 1 ? "block" : "none";
}

// Event listeners
lightboxPrev.addEventListener("click", showPreviousImage);
lightboxNext.addEventListener("click", showNextImage);
document.querySelector(".close").addEventListener("click", closeLightbox);

lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});

// Keyboard navigation (للمشروع المفتوح فقط)
document.addEventListener("keydown", (e) => {
  if (lightbox.style.display === "flex") {
    if (e.key === "ArrowLeft") showPreviousImage();
    if (e.key === "ArrowRight") showNextImage();
    if (e.key === "Escape") closeLightbox();
  }
});

// Scroll navigation (بالمشروع المفتوح فقط)
let scrollTimeout;
document.addEventListener(
  "wheel",
  (e) => {
    if (lightbox.style.display === "flex") {
      e.preventDefault();
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        if (e.deltaY > 0) showNextImage();
        else if (e.deltaY < 0) showPreviousImage();
      }, 50);
    }
  },
  { passive: false }
);

// Touch swipe navigation
// ================================================
// ✅ تحسين دعم اللمس (Swipe + Zoom)
// ================================================
// Touch swipe + zoom + drag
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;
let initialDistance = 0;
let currentScale = 1;

let currentX = 0;
let currentY = 0;
let startX = 0;
let startY = 0;

let lastTapTime = 0;

lightbox.addEventListener("touchstart", (e) => {
  if (lightbox.style.display === "flex") {
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTapTime;

    // double tap لإرجاع الصورة للوضع الطبيعي
    if (tapLength < 300 && e.touches.length === 1) {
      currentScale = 1;
      currentX = 0;
      currentY = 0;
      lightboxContent.style.transition = "transform 0.3s ease";
      lightboxContent.style.transform = `translate(0px,0px) scale(1)`;
      setTimeout(() => (lightboxContent.style.transition = ""), 300);
    }
    lastTapTime = currentTime;

    if (e.touches.length === 1) {
      startX = e.touches[0].clientX - currentX;
      startY = e.touches[0].clientY - currentY;
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    } else if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      initialDistance = Math.sqrt(dx * dx + dy * dy);

      // midpoint بين الإصبعين
      startX = (e.touches[0].clientX + e.touches[1].clientX) / 2 - currentX;
      startY = (e.touches[0].clientY + e.touches[1].clientY) / 2 - currentY;
    }
  }
}, { passive: false });

lightbox.addEventListener("touchmove", (e) => {
  if (lightbox.style.display === "flex") {
    e.preventDefault();

    if (e.touches.length === 1 && currentScale === 1) {
      // سحب الصورة قبل الزووم
      const deltaX = e.touches[0].clientX - startX - currentX;
      lightboxContent.style.transform = `translateX(${deltaX}px) scale(1)`;
    } else if (e.touches.length === 2) {
      // pinch zoom
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const newDistance = Math.sqrt(dx * dx + dy * dy);
      const scale = Math.min(Math.max(newDistance / initialDistance, 1), 3);
      currentScale = scale;

      const midpointX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
      const midpointY = (e.touches[0].clientY + e.touches[1].clientY) / 2;

      const deltaX = midpointX - startX;
      const deltaY = midpointY - startY;

      lightboxContent.style.transform = `translate(${currentX + deltaX}px, ${currentY + deltaY}px) scale(${currentScale})`;
    } else if (e.touches.length === 1 && currentScale > 1) {
      // سحب الصورة بعد الزووم
      const deltaX = e.touches[0].clientX - touchStartX;
      const deltaY = e.touches[0].clientY - touchStartY;
      lightboxContent.style.transform = `translate(${currentX + deltaX}px, ${currentY + deltaY}px) scale(${currentScale})`;
    }
  }
}, { passive: false });

lightbox.addEventListener("touchend", (e) => {
  if (lightbox.style.display === "flex") {
    if (currentScale > 1 && e.changedTouches.length > 0) {
      const touch = e.changedTouches[0];
      currentX += touch.clientX - touchStartX;
      currentY += touch.clientY - touchStartY;
    }

    if (currentScale === 1 && e.changedTouches.length === 1) {
      touchEndX = e.changedTouches[0].clientX;
      const swipeDistance = touchStartX - touchEndX;
      const swipeThreshold = 50;
      if (Math.abs(swipeDistance) > swipeThreshold) {
        if (swipeDistance > 0) showNextImage();
        else showPreviousImage();
      }
    }

    // إعادة الصورة للوضع الطبيعي لو scale = 1
    if (currentScale === 1) {
      lightboxContent.style.transition = "transform 0.2s ease";
      lightboxContent.style.transform = `translate(0px,0px) scale(1)`;
      currentX = 0;
      currentY = 0;
      setTimeout(() => (lightboxContent.style.transition = ""), 200);
    }

    startX = 0;
    startY = 0;
  }
}, { passive: false });


function handleSwipe() {
  const swipeThreshold = 50;
  const swipeDistance = touchStartX - touchEndX;

  if (Math.abs(swipeDistance) > swipeThreshold) {
    if (swipeDistance > 0) showNextImage();
    else showPreviousImage();
  }
}





  function updateClock() {
    const clock = document.getElementById("clock");
    const now = new Date();

    const day = now.toLocaleDateString("en-GB", { weekday: "short" });
    const date = now.toLocaleDateString("en-GB");
    const time = now.toLocaleTimeString("en-GB");

    clock.textContent = `${day} | ${date} | ${time}`;
  }

  setInterval(updateClock, 1000);
  updateClock();
  const skills = document.querySelectorAll('.skills li');

const skillItems = document.querySelectorAll('.skills li');

skillItems.forEach((skill, index) => {
  // الحالة المبدئية
  skill.style.opacity = 0;
  skill.style.transform = 'translateY(40px) scale(0.9)';
  skill.style.transition = 'transform 0.8s ease-out, opacity 0.8s ease-out, filter 0.3s ease';

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        setTimeout(() => {
          skill.style.opacity = 1;
          skill.style.transform = 'translateY(0) scale(1)';
          skill.style.filter = 'drop-shadow(0 0 6px rgba(0,0,0,0.15))';
        }, index * 200);
      } else {
        skill.style.opacity = 0;
        skill.style.transform = 'translateY(40px) scale(0.9)';
        skill.style.filter = 'none';
      }
    });
  }, { threshold: 0.4 });

  observer.observe(skill);
});

// الهوفر هنا شغال من CSS عادي ومش بيتعارض مع الأنيميشن
// مثال:
document.querySelectorAll('.skills li').forEach(li => {
  li.addEventListener('mouseenter', () => {
    li.style.transform = 'scale(1.05) translateY(-5px)';
  });
  li.addEventListener('mouseleave', () => {
    li.style.transform = 'scale(1) translateY(0)';
  });
});

