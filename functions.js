function exportSTL()
{
  orientSceneForExport();
  var str = exporter.parse( scene ); // Export the scene
  orientSceneAfterExport();
  var blob = new Blob( [str], { type : 'text/plain' } ); // Generate Blob from the string
  //saveAs( blob, 'file.stl' ); //Save the Blob to file.stl

  //Following code will help you to save the file without FileSaver.js
  var link = document.createElement('a');
  link.style.display = 'none';
  document.body.appendChild(link);
  link.href = URL.createObjectURL(blob);
  link.download = 'Scene.stl';
  link.click();
}

let fontSizeInput = document.getElementById("fontSlider");
fontSizeInput.addEventListener('input', changeFontSize);

let fontChoiceInput = document.getElementById("fontSelection");
fontChoiceInput.addEventListener('change', changeFont);

let textPosXInput = document.getElementById("textPosX");
textPosXInput.addEventListener('input', changeTextPosX);

let textPosYInput = document.getElementById("textPosY");
textPosYInput.addEventListener('input', changeTextPosY);

let textInput = document.getElementById("textbox");
textInput.addEventListener('input', updateStencil);

let backPlateXInput = document.getElementById("backPlateX");
backPlateXInput.addEventListener('input', changeBackPlateX);

let backPlateYInput = document.getElementById("backPlateY");
backPlateYInput.addEventListener('input', changeBackPlateY);

let backPlateZInput = document.getElementById("backPlateZ");
backPlateZInput.addEventListener('input', changeBackPlateZ);

function updateStencil()
{
  tempBackplate(); // put this call in deleteStencil() on refactor
  deleteStencil();
  window.textInput = textInput;
  updateText();
}

function changeFontSize()
{
  tempBackplate();
  deleteStencil();
  window.fontSizeInput = fontSizeInput;
  updateText();
}

function changeFont()
{
  tempBackplate();
  deleteStencil();
  window.fontChoiceInput = fontChoiceInput
  updateText();
}

function changeTextPosX()
{
  tempBackplate();
  deleteStencil();
  window.textPosXInput = textPosXInput;
  updateText();
}

function changeTextPosY()
{
  tempBackplate(); 
  deleteStencil();
  window.textPosYInput = textPosYInput;
  updateText();
}

function changeBackPlateX()
{
  tempBackplate(); 
  deleteStencil();
  window.backPlateXInput = backPlateXInput;
  updateText();
}

function changeBackPlateY()
{
  tempBackplate(); 
  deleteStencil();
  window.backPlateYInput = backPlateYInput;
  updateText();
}

function changeBackPlateZ()
{
  tempBackplate(); 
  deleteStencil();
  window.backPlateZInput = backPlateZInput;
  updateText();
}
