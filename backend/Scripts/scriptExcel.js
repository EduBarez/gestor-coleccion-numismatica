const xlsx = require("xlsx");
const fs = require("fs");

// Ruta al archivo Excel (ajusta si es necesario)
const excelFilePath = "./BD monedas plantilla.xlsx";

// Leer el archivo Excel y obtener la primera hoja (los encabezados se toman de la fila 1)
const workbook = xlsx.readFile(excelFilePath);
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];
const data = xlsx.utils.sheet_to_json(sheet);

// Carpeta donde se encuentran las imágenes (en Windows se usan dobles barras invertidas)Ç
const imageFolder = "H:\\TFG\\Fotos BD Monedas\\";

// Procesar cada registro para mantener todos los campos y reemplazar "Fotografía" por "imagen"
const formattedData = data.map(record => {
  // Clonamos el registro para no modificar el original
  let newRecord = { ...record };

  // Procesar el campo "Fotografía": se asume que contiene el nombre de la imagen sin extensión
  if (newRecord["Fotografía"]) {
    const fotoNombre = newRecord["Fotografía"].toString().trim();
    newRecord.imagen = imageFolder + fotoNombre + ".png";
  } else {
    newRecord.imagen = null;
  }
  
  // Eliminar el campo "Fotografía" ya que se ha convertido en "imagen"
  delete newRecord["Fotografía"];

  return newRecord;
});

// Escribir el JSON resultante en un archivo para pruebas o posterior inserción en MongoDB
const jsonOutputPath = "./monedas.json";
fs.writeFileSync(jsonOutputPath, JSON.stringify(formattedData, null, 2), "utf8");
console.log("Archivo JSON generado correctamente:", jsonOutputPath);
