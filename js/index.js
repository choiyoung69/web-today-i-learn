const tilForm = document.querySelector("#til-form");
const tilList = document.querySelector("#til-list");
const tilDateInput = document.querySelector("#til-date");
const tilTitleInput = document.querySelector("#til-title");
const tilContentInput = document.querySelector("#til-content");
const navLinks = document.querySelectorAll(".nav-links a");
const galleryImages = document.querySelectorAll(".gallery-grid img");
const workImages = document.querySelectorAll(".work-thumbnail img");
const workVideos = document.querySelectorAll(".work-thumbnail iframe");

if (tilDateInput) {
  tilDateInput.value = new Date().toISOString().split("T")[0];
}

if (tilForm && tilList && tilDateInput && tilTitleInput && tilContentInput) {
  tilForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const date = tilDateInput.value;
    const title = tilTitleInput.value.trim();
    const content = tilContentInput.value.trim();

    if (!date || !title || !content) {
      window.alert("날짜, 제목, 내용을 모두 입력해주세요.");
      return;
    }

    const tilItem = document.createElement("article");
    tilItem.className = "til-item";

    const time = document.createElement("time");
    time.dateTime = date;
    time.textContent = date;

    const heading = document.createElement("h3");
    heading.textContent = title;

    const paragraph = document.createElement("p");
    paragraph.textContent = content;

    tilItem.append(time, heading, paragraph);
    tilList.prepend(tilItem);

    tilForm.reset();
    tilDateInput.value = new Date().toISOString().split("T")[0];
    tilTitleInput.focus();
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href");

    if (!targetId || !targetId.startsWith("#")) {
      return;
    }

    const targetSection = document.querySelector(targetId);

    if (!targetSection) {
      return;
    }

    event.preventDefault();
    targetSection.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

function createOverlay() {
  const overlay = document.createElement("div");

  overlay.style.position = "fixed";
  overlay.style.inset = "0";
  overlay.style.display = "flex";
  overlay.style.alignItems = "center";
  overlay.style.justifyContent = "center";
  overlay.style.padding = "24px";
  overlay.style.backgroundColor = "rgba(20, 45, 70, 0.82)";
  overlay.style.cursor = "zoom-out";
  overlay.style.zIndex = "1000";

  overlay.addEventListener("click", () => {
    overlay.remove();
  });

  return overlay;
}

function showImageOverlay(image) {
  const overlay = createOverlay();
  const enlargedImage = document.createElement("img");

  enlargedImage.src = image.src;
  enlargedImage.alt = image.alt;
  enlargedImage.style.width = "min(92vw, 820px)";
  enlargedImage.style.maxHeight = "88vh";
  enlargedImage.style.objectFit = "contain";
  enlargedImage.style.borderRadius = "20px";
  enlargedImage.style.boxShadow = "0 24px 48px rgba(0, 0, 0, 0.28)";

  overlay.appendChild(enlargedImage);
  document.body.appendChild(overlay);
}

function showVideoOverlay(video) {
  const overlay = createOverlay();
  const videoFrame = document.createElement("iframe");

  videoFrame.src = video.src;
  videoFrame.title = video.title;
  videoFrame.allow =
    "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
  videoFrame.allowFullscreen = true;
  videoFrame.style.width = "min(92vw, 960px)";
  videoFrame.style.aspectRatio = "16 / 9";
  videoFrame.style.border = "none";
  videoFrame.style.borderRadius = "20px";
  videoFrame.style.boxShadow = "0 24px 48px rgba(0, 0, 0, 0.28)";
  videoFrame.style.backgroundColor = "#000";
  videoFrame.style.cursor = "auto";

  videoFrame.addEventListener("click", (event) => {
    event.stopPropagation();
  });

  overlay.appendChild(videoFrame);
  document.body.appendChild(overlay);
}

[...galleryImages, ...workImages].forEach((image) => {
  image.addEventListener("click", () => {
    showImageOverlay(image);
  });
});

workVideos.forEach((video) => {
  video.addEventListener("click", () => {
    showVideoOverlay(video);
  });
});
