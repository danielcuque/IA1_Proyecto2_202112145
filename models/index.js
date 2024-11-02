import { showSnackbar, validFilesLoad } from "./utils.js";

// Inicializar gráficos
google.charts.load('current', { packages: ['corechart'] });
// google.charts.setOnLoadCallback(initialize);

// Botones de carga
const selectMLModel = document.getElementById('selectMLModel');
const massiveLoadButton = document.getElementById('massiveLoadBtn');
const massiveLoadChooser = document.getElementById('massiveLoadChooser');
const fileNameCSV = document.getElementById('fileNameCSV');
const modelParams = document.getElementById('modelParams')

// Botones de entrenamiento
const entrenarModelo = document.getElementById('trainModelBtn');
const predictButton = document.getElementById('predictBtn');
const trendsButton = document.getElementById('trendsBtn');
const patternsButton = document.getElementById('patternsBtn');

const results = document.getElementById('results');


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

const getModelParams = () => {
    const params = modelParams.value;
    params = params.split(';');
    params = params.map(param => {
        const [key, value] = param.split('=');
        return { key, value };
    });
    return params;
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

    const predictions = linearModel.predict(xValues);

    if (accion === 'entrenar') {
        // mostrar resultados de entrenamiento
        const resultadoLineal = document.createElement('resultadoLineal');
        results.innerHTML = '';

        resultadoLineal.innerHTML = `
            <div class="">
            B: ${linearModel.b} M:${linearModel.m}
            </div>
            `;

        results.appendChild(resultadoLineal);

        showSnackbar('Modelo entrenado', 'success');
        return;
    }

    if (accion === 'predicciones') {
        const options = {
            title: 'Regresión Lineal',
            seriesType: 'scatter',
            series: {1: {type: 'line'}},
            hAxis: { title: 'X' },
            vAxis: { title: 'Y' }
        };

        const dataArray = [['X', 'Y real', 'Predicción']];
        xValues.forEach((x, i) => {
            dataArray.push([x, yValues[i], predictions[i]]);
        });
        console.log(dataArray);

        const dataTable = google.visualization.arrayToDataTable(dataArray);

        console.log(dataTable);

        const chart = new google.visualization.ComboChart(document.getElementById('chart'));
        chart.draw(dataTable, options);
    }
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

predictButton.addEventListener('click', () => {
    const model = selectMLModel.value;
    models[model]('predicciones');
});

trendsButton.addEventListener('click', () => {
    const model = selectMLModel.value;
    models[model]('tendencias');
});

patternsButton.addEventListener('click', () => {
    const model = selectMLModel.value;
    models[model]('patrones');
});

