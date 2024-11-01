import { showSnackbar, validFilesLoad } from "./utils.js";

// Botones de carga
const selectMLModel = document.getElementById('selectMLModel');
const massiveLoadButton = document.getElementById('massiveLoadBtn');
const massiveLoadChooser = document.getElementById('massiveLoadChooser');
const fileNameCSV = document.getElementById('fileNameCSV');

// Botones de entrenamiento
const entrenarModelo = document.getElementById('trainModelBtn');
const predictButton = document.getElementById('predictBtn');
const trendsButton = document.getElementById('trendsBtn');
const patternsButton = document.getElementById('patternsBtn');


const csvToJson = (csv) => {
    const lines = csv.trim().split("\n");
    
    const headers = lines[0].split(",");
    
    const jsonData = lines.slice(1).map(line => {
        const values = line.split(",");
        const obj = {};
        
        headers.forEach((header, index) => {
            header = header.trim();
            obj[header] = Number(values[index]); // Convertimos los valores a números
        });
        
        return obj;
    });
    
    return jsonData;
}

const getDataParsed = () => {
    const fileContent = localStorage.getItem('fileContent');
    if (!fileContent) {
        showSnackbar('No se ha cargado ningún archivo', 'error');
        return;
    }
    const data = csvToJson(fileContent);
    console.log(data);
    return data;
}

// Modelos
const regresionLineal = () => {

    const data = getDataParsed();
    console.log(data);
}

const regresionPolynomial = () => {
    const data = getDataParsed();
    console.log(data);
}

const models = {
    'regresionPolynomial': regresionPolynomial,
    'regresionLineal': regresionLineal
}

// Acciones

massiveLoadButton.addEventListener('click', () => {
    massiveLoadChooser.click();
});

massiveLoadChooser.addEventListener('change', () => {
    const allowedExtensions = /(\.csv)$/i;
    const files = massiveLoadChooser.files;
    const isInvalidEntry = validFilesLoad(
        allowedExtensions,
        files
    )
    if (isInvalidEntry) {
        readJsonFile(files[0]);
        fileNameCSV.innerHTML = files[0].name;
        fileNameCSV.style.display = 'block';
    } else {
        showSnackbar('Archivo no permitido', 'error');
    }
});

const readJsonFile = (file) => {
    const reader = new FileReader();
    reader.readAsText(file, "UTF-8");
    reader.onload = () => {
        localStorage.setItem('fileContent', reader.result);
        console.log(reader.result);
    }
    reader.onerror = (error) => {
        console.log(error);
    }
}

// Botones de entrenamiento
entrenarModelo.addEventListener('click', () => {
    const model = selectMLModel.value;
    models[model]();
});

