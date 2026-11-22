(function () {
  "use strict";

  var form = document.getElementById("uploadForm");
  var fileInput = document.getElementById("htmlFile");
  var titleInput = document.getElementById("testTitle");
  var subjectInput = document.getElementById("subject");
  var levelInput = document.getElementById("level");
  var preview = document.getElementById("filenamePreview");
  var fileInfo = document.getElementById("fileInfo");
  var message = document.getElementById("formMessage");
  var readyBox = document.getElementById("readyBox");
  var dropZone = document.getElementById("dropZone");
  var file = null;

  function slug(value) {
    return value.toLowerCase().normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 45).replace(/-+$/g, "") || "test";
  }

  function today() {
    var d = new Date();
    return d.getFullYear() + "-" +
      String(d.getMonth() + 1).padStart(2, "0") + "-" +
      String(d.getDate()).padStart(2, "0");
  }

  function outputName() {
    return subjectInput.value + "-" + levelInput.value + "-" +
      today() + "-" + slug(titleInput.value.trim()) + ".html";
  }

  function updateName() {
    preview.textContent = outputName();
    readyBox.hidden = true;
    message.textContent = "";
  }

  function showFile(selected) {
    file = selected || null;
    readyBox.hidden = true;
    message.textContent = "";
    if (!file) {
      fileInfo.textContent = "Hali fayl tanlanmagan.";
      return;
    }
    fileInfo.textContent = "Tanlangan fayl: " + file.name + " (" +
      (file.size / 1024).toFixed(0) + " KB)";
    if (!titleInput.value.trim()) {
      file.text().then(function (html) {
        if (file !== selected || titleInput.value.trim()) return;
        var m = html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i);
        if (m) {
          var textarea = document.createElement("textarea");
          textarea.innerHTML = m[1];
          var extracted = textarea.value.split(/\s*[|–—]\s*Zuxriddin Academy/i)[0].trim();
          if (extracted) titleInput.value = extracted.slice(0, 130);
          updateName();
        }
      }).catch(function () {});
    }
  }

  function escapeText(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  [titleInput, subjectInput, levelInput].forEach(function (el) {
    el.addEventListener("input", updateName);
    el.addEventListener("change", updateName);
  });

  fileInput.addEventListener("change", function () { showFile(fileInput.files[0]); });

  ["dragenter", "dragover"].forEach(function (type) {
    dropZone.addEventListener(type, function (event) {
      event.preventDefault();
      dropZone.classList.add("dragging");
    });
  });
  ["dragleave", "drop"].forEach(function (type) {
    dropZone.addEventListener(type, function (event) {
      event.preventDefault();
      dropZone.classList.remove("dragging");
    });
  });
  dropZone.addEventListener("drop", function (event) {
    var dropped = event.dataTransfer && event.dataTransfer.files;
    if (!dropped || !dropped.length) return;
    // File objects are kept in browser memory; nothing is uploaded to this page.
    showFile(dropped[0]);
  });

  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    readyBox.hidden = true;
    message.textContent = "";

    var title = titleInput.value.trim();
    if (!title) { message.textContent = "Test nomini kiriting."; titleInput.focus(); return; }
    if (!file) { message.textContent = "HTML test faylini tanlang."; fileInput.focus(); return; }
    if (!/\.html?$/i.test(file.name)) {
      message.textContent = "Faqat .html yoki .htm faylni tanlang."; return;
    }
    if (file.size > 10 * 1024 * 1024) {
      message.textContent = "Fayl 10 MB dan oshmasligi kerak."; return;
    }

    try {
      var html = await file.text();
      if (!/<html(?:\s|>)/i.test(html) || !/<\/head\s*>/i.test(html)) {
        message.textContent = "Bu to‘liq HTML faylga o‘xshamaydi. Unda html va head bo‘limlari bo‘lishi kerak.";
        return;
      }
      var htmlTitle = "<title>" + escapeText(title) + " | Zuxriddin Academy</title>";
      if (/<title\b[^>]*>[\s\S]*?<\/title>/i.test(html)) {
        html = html.replace(/<title\b[^>]*>[\s\S]*?<\/title>/i, htmlTitle);
      } else {
        html = html.replace(/<\/head\s*>/i, "  " + htmlTitle + "\n</head>");
      }
      var result = new Blob([html], {type: "text/html;charset=utf-8"});
      var href = URL.createObjectURL(result);
      var a = document.createElement("a");
      a.href = href;
      a.download = outputName();
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(function () { URL.revokeObjectURL(href); }, 1200);
      readyBox.hidden = false;
      readyBox.scrollIntoView({behavior:"smooth",block:"nearest"});
    } catch (error) {
      message.textContent = "Faylni tayyorlashda xatolik yuz berdi. Boshqa HTML faylni tanlang.";
    }
  });

  updateName();
})();
