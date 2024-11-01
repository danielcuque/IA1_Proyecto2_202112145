import { showSnackbar, validFilesLoad, showLinearGraph } from "./utils.js";

// Botones de carga
const selectMLModel = document.getElementById('selectMLModel');
const massiveLoadButton = document.getElementById('massiveLoadBtn');
const massiveLoadChooser = document.getElementById('massiveLoadChooser');
const fileNameCSV = document.getElementById('fileNameCSV');

const commonParamsContainer = document.getElementById('commonParams');
console.log(commonParamsContainer, fileNameCSV);

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
    return {
        xValues: data.map(d => d.x),
        yValues: data.map(d => d.y)
    };
}

// Modelos
const regresionLineal = (accion) => {

    const { xValues, yValues } = getDataParsed();

    const linearModel = new LinearRegression();
    linearModel.fit(xValues, yValues);
    console.log(linearModel);

    if (accion === 'entrenar') {
        showSnackbar('Modelo entrenado', 'success');
        return;
    }

    if (accion === 'predicciones') {
        const predictions = linearModel.predict(xValues);
        showLinearGraph(xValues, predictions);
        return;
    }

    console.log(data);
}

const regresionPolynomial = (accion) => {
    const { xValues, yValues } = getDataParsed();

    const polynomialModel = new PolynomialRegression();
    const degreeValue = document.getElementById('degree').value;
    polynomialModel.fit(xValues, yValues, degreeValue);

    if (accion === 'entrenar') {
        showSnackbar('Modelo entrenado', 'success');
        return;
    }

    if (accion === 'predicciones') {
        const predictions = linearModel.predict(xValues);
        showLinearGraph(xValues, predictions);
        return;
    }

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

selectMLModel.addEventListener('change', () => {

    // Limpiamos el fileNameCSV
    fileNameCSV.innerHTML = '';
    fileNameCSV.style.display = 'none';
    localStorage.removeItem('fileContent');

    // De entrada, borrar parámetros extra
    const existingDegreeDiv = document.getElementById('degreeDiv');
    if (existingDegreeDiv) {
        existingDegreeDiv.remove();
    }

    const existingPercentDiv = document.getElementById('percentDiv');
    if (existingPercentDiv) {
        existingPercentDiv.remove();
    }

    const inputClassName = "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline";
    const labelClassName = "block mb-2 text-sm font-medium text-gray-900";

    // Si es polynomial, agregar parámetro de grado polinomial
    if (selectMLModel.value === 'regresionPolynomial') {
        // Crear contenedor
        const degreeDiv = document.createElement('div');
        degreeDiv.id = 'degreeDiv';

        // Crear label e input
        const degreeLabel = document.createElement('label');
        degreeLabel.htmlFor = 'degree';
        degreeLabel.textContent = 'Grado del polinomio';
        degreeLabel.className = labelClassName;

        const degreeInput = document.createElement('input');
        degreeInput.type = 'number';
        degreeInput.id = 'degree';
        degreeInput.name = 'degree';
        degreeInput.value = 10;
        degreeInput.className = inputClassName;

        // Agregar label e input al div
        degreeDiv.appendChild(degreeLabel);
        degreeDiv.appendChild(degreeInput);

        // Agregar div al contenedor de parámetros
        commonParamsContainer.appendChild(degreeDiv);
    }
    
    // Si es lineal, agregar porcentaje de entrenamiento
    if (selectMLModel.value === 'regresionLineal') {
        // Crear contenedor
        const percentDiv = document.createElement('div');
        percentDiv.id = 'percentDiv';

        // Crear label e input
        const percentLabel = document.createElement('label');
        percentLabel.htmlFor = 'percent';
        percentLabel.textContent = 'Porcentaje de entrenamiento';
        percentLabel.className = labelClassName;

        const percentInput = document.createElement('input');
        percentInput.type = 'number';
        percentInput.id = 'percent';
        percentInput.name = 'percent';
        percentInput.value = 0.7;
        percentInput.className = inputClassName;

        // Agregar label e input al div
        percentDiv.appendChild(percentLabel);
        percentDiv.appendChild(percentInput);

        // Agregar div al contenedor de parámetros
        commonParamsContainer.appendChild(percentDiv);
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
    models[model]('entrenar');
});

