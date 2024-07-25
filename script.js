document.addEventListener("DOMContentLoaded", () => {
  const dropArea = document.getElementById("drop-area");
  const fileInput = document.getElementById("input-file");
  const filePreview = document.getElementById("file-preview");
  const dropFilesHeading = document.getElementById("no-drop-files-heading");
  const insertDriveFileImg = document.querySelector("#drop-area img");
  const submitButton = document.querySelector(".buttons3");
  const fileCountElement = document.getElementById("file-count");

  // Define file type icons (but we will use png-icon for all)
  const fileIcons = {
    "image/png": "Style/img/png-icon.png",
    "image/jpeg": "Style/img/png-icon.png",
    "application/pdf": "Style/img/png-icon.png",
    "text/plain": "Style/img/png-icon.png",
    "application/zip": "Style/img/png-icon.png",
    default: "Style/img/png-icon.png",
    trash: "Style/img/trash-icon.png",
  };

  // Handle drag events
  dropArea.addEventListener("dragover", (event) => {
    event.preventDefault();
    event.stopPropagation();
    dropArea.classList.add("dragging");
  });

  dropArea.addEventListener("dragleave", (event) => {
    event.preventDefault();
    event.stopPropagation();
    dropArea.classList.remove("dragging");
  });

  dropArea.addEventListener("drop", (event) => {
    event.preventDefault();
    event.stopPropagation();
    dropArea.classList.remove("dragging");

    const files = event.dataTransfer.files;
    handleFiles(files);
  });

  // Handle file input change
  fileInput.addEventListener("change", (event) => {
    const files = event.target.files;
    handleFiles(files);
  });

  function handleFiles(files) {
    filePreview.innerHTML = "";
    insertDriveFileImg.style.display = "none";

    if (files.length === 0) {
      showInitialView();
    } else {
      dropArea.classList.remove("drop-area-dashed");
      dropArea.classList.add("drop-area-no-border");
      dropFilesHeading.style.display = "none";
      submitButton.classList.add("show-submit-button");
      fileInput.style.display = "none";
    }

    updateFileCount(files.length);

    for (const file of files) {
      const fileContainer = document.createElement("div");
      fileContainer.className = "file-item";
      fileContainer.dataset.name = file.name;

      const fileIcon = document.createElement("img");
      fileIcon.className = "file-icon";
      fileIcon.src = fileIcons["image/png"]; // Always use png-icon.png

      const fileName = document.createElement("p");
      fileName.textContent = file.name;

      const removeButton = document.createElement("img");
      removeButton.className = "remove-icon";
      removeButton.src = fileIcons["trash"];
      removeButton.alt = "Remove";
      removeButton.addEventListener("click", (event) => {
        event.stopPropagation();
        fileContainer.remove();
        updateFileInput();
        if (filePreview.children.length === 0) {
          showInitialView();
        }
        updateFileCount(filePreview.children.length);
      });

      fileContainer.appendChild(fileIcon);
      fileContainer.appendChild(fileName);
      fileContainer.appendChild(removeButton);

      filePreview.appendChild(fileContainer);
    }
  }

  function updateFileCount(count) {
    if (count > 0) {
      fileCountElement.textContent = `Files Uploaded: ${count}`;
      fileCountElement.style.display = "block"; // Show file count
    } else {
      fileCountElement.style.display = "none"; // Hide file count
    }
  }

  function updateFileInput() {
    const dataTransfer = new DataTransfer();
    Array.from(filePreview.getElementsByClassName("file-item")).forEach(
      (fileItem) => {
        const fileName = fileItem.querySelector("p").textContent;
        const file = Array.from(fileInput.files).find(
          (f) => f.name === fileName
        );
        if (file) {
          dataTransfer.items.add(file);
        }
      }
    );

    fileInput.files = dataTransfer.files;

    if (dataTransfer.files.length === 0) {
      fileInput.style.display = "block";
    }
  }

  function showInitialView() {
    insertDriveFileImg.style.display = "block";
    dropArea.classList.add("drop-area-dashed");
    dropArea.classList.remove("drop-area-no-border");
    dropFilesHeading.style.display = "block";
    submitButton.classList.remove("show-submit-button");
    fileInput.style.display = "block";
    updateFileCount(0); // Ensure file count is hidden initially
  }
});
