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
  const maxConsecutiveNotFound = 20;

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
let touchStartY = 0;
let touchEndY = 0;

lightbox.addEventListener(
  "touchstart",
  (e) => {
    if (lightbox.style.display === "flex") {
      touchStartY = e.changedTouches[0].screenY;
    }
  },
  { passive: true }
);

lightbox.addEventListener(
  "touchend",
  (e) => {
    if (lightbox.style.display === "flex") {
      touchEndY = e.changedTouches[0].screenY;
      handleSwipe();
    }
  },
  { passive: true }
);

function handleSwipe() {
  const swipeThreshold = 50;
  const swipeDistance = touchStartY - touchEndY;

  if (Math.abs(swipeDistance) > swipeThreshold) {
    if (swipeDistance > 0) showNextImage();
    else showPreviousImage();
  }
}
