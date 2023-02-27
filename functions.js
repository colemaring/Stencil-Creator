// calls updateStencil() on input change
let fontSizeInput = document.getElementById("fontSlider");
fontSizeInput.addEventListener("input", function () {
  updateStencil(fontSizeInput);
});

let fontChoiceInput = document.getElementById("fontSelection");
fontChoiceInput.addEventListener("change", function () {
  updateStencil(fontChoiceInput);
});

let textPosXInput = document.getElementById("textPosX");
textPosXInput.addEventListener("input", function () {
  updateStencil(textPosXInput);
});

let textPosYInput = document.getElementById("textPosY");
textPosYInput.addEventListener("input", function () {
  updateStencil(textPosYInput);
});

let textInput = document.getElementById("textbox");
textInput.addEventListener("input", function () {
  updateStencil(textInput);
});

let backPlateXInput = document.getElementById("backPlateX");
backPlateXInput.addEventListener("input", function () {
  updateStencil(backPlateXInput);
});

let backPlateYInput = document.getElementById("backPlateY");
backPlateYInput.addEventListener("input", function () {
  updateStencil(backPlateYInput);
});

let backPlateZInput = document.getElementById("backPlateZ");
backPlateZInput.addEventListener("input", function () {
  updateStencil(backPlateZInput);
});

// exports the scene as an stl file
function exportSTL() {
  orientSceneForExport();
  var str = exporter.parse(scene);
  orientSceneAfterExport();

  var blob = new Blob([str], { type: "text/plain" });
  var link = document.createElement("a");
  link.style.display = "none";
  document.body.appendChild(link);
  link.href = URL.createObjectURL(blob);
  link.download = textInput.value + ".stl";
  link.click();
} 

// calls helper methods in main.js
function updateStencil(e)
{
  deleteStencil();
  window.e = e;
  updateText();
}
