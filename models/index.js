import { showSnackbar, validFilesLoad } from "./utils.js";

// Inicializar gráficos
google.charts.load('current', { packages: ['corechart'] });

// Botones de carga
const selectMLModel = document.getElementById('selectMLModel');
const massiveLoadButton = document.getElementById('massiveLoadBtn');
const massiveLoadChooser = document.getElementById('massiveLoadChooser');
const fileNameCSV = document.getElementById('fileNameCSV');
const modelParams = document.getElementById('modelParams');
const log = document.getElementById('log');

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
    const value = modelParams.value;
    console.log(value);
    
    const params = value.split(';');

    console.log(params);

    const result = {};

    params.forEach(param => {
        const [key, value] = param.split('=');
        result[key] = value;
    });

    return result;
}

const getDataParsed = () => {
    const fileContent = localStorage.getItem('fileContent');
    if (!fileContent) {
        showSnackbar('No se ha cargado ningún archivo', 'error');
        return;
    }
    const data = csvToJson(fileContent);
    return {
        xValues: data.map(d => d.x),
        yValues: data.map(d => d.y)
    };
}

const showTrend = (xValues, yValues) => {
    if (xValues.length > 1 && yValues.length > 1) {
        const trendData = [];

        const slope = (yValues[yValues.length - 1] - yValues[0]) / (xValues[xValues.length - 1] - xValues[0]);
        const trendText = slope > 0 ? "La tendencia es ascendente." : "La tendencia es descendente.";
        
        log.innerHTML = `<div class="alert alert-success" role="alert">${trendText}</div>`;

        // Preparar los datos para el gráfico
        for (let i = 0; i < xValues.length; i++) {
            trendData.push([xValues[i], yValues[i]]);
        }

        google.charts.setOnLoadCallback(() => drawTrendChart(trendData, slope));
    } else {
        showSnackbar('No hay suficientes datos para determinar la tendencia.', 'error');
    }
};

const drawPatternChart = (patternData) => {
    const dataTable = new google.visualization.DataTable();
    dataTable.addColumn('number', 'X');
    dataTable.addColumn('number', 'Y');
    dataTable.addRows(patternData);

    const options = {
        title: 'Patrones de Datos',
        hAxis: { title: 'X' },
        vAxis: { title: 'Y' },
        legend: 'none'
    };

    const chart = new google.visualization.LineChart(document.getElementById('chart'));
    chart.draw(dataTable, options);
};

const showPatterns = () => {
    // Obtener los datos de entrenamiento
    const { xValues, yValues } = getDataParsed();

    if (xValues.length > 1 && yValues.length > 1) {
        // Preparar los datos para el gráfico de patrones
        const patternData = xValues.map((x, index) => [x, yValues[index]]);

        // Configurar y cargar el gráfico de patrones
        google.charts.load('current', { 'packages': ['corechart'] });
        google.charts.setOnLoadCallback(() => drawPatternChart(patternData));
    } else {
        showSnackbar('Primero carga y entrena un modelo con datos suficientes.', 'error');
    }
}

// Función para dibujar el gráfico de tendencia
const drawTrendChart = (trendData, slope) => {
    const data = new google.visualization.DataTable();
    data.addColumn('number', 'X');
    data.addColumn('number', 'Y');
    data.addRows(trendData);

    const options = {
        title: 'Tendencia de Datos',
        hAxis: { title: 'X' },
        vAxis: { title: 'Y' },
        legend: 'none',
        trendlines: { 0: { type: 'linear', lineWidth: 2, opacity: 0.7 } } // Configura la línea de tendencia
    };

    const chart = new google.visualization.ScatterChart(document.getElementById('chart'));
    chart.draw(data, options);
}

// Modelos
const regresionLineal = (accion) => {

    const { xValues, yValues } = getDataParsed();

    if (xValues.length < 2) {
        showSnackbar('No hay suficientes datos para el modelo', 'error');
        return;
    }

    const linearModel = new LinearRegression();

    linearModel.fit(xValues, yValues);

    const predictions = linearModel.predict(xValues);

    const options = {
        title: 'Regresión Lineal',
        seriesType: 'scatter',
        series: { 1: { type: 'line' } },
        hAxis: { title: 'X' },
        vAxis: { title: 'Y' }
    };

    if (accion === 'entrenar') {
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
        const dataArray = [['X', 'Y real', 'Predicción']];
        xValues.forEach((x, i) => {
            dataArray.push([x, yValues[i], predictions[i]]);
        });

        const dataTable = google.visualization.arrayToDataTable(dataArray);

        const chart = new google.visualization.ComboChart(document.getElementById('chart'));
        chart.draw(dataTable, options);
    }

    if (accion === 'tendencias') {
        showTrend(xValues, yValues); // Llamada a la nueva función de tendencia
    }

    if (accion === 'patrones') {
        showPatterns();
    }
}

const regresionPolynomial = (accion) => {
    const { xValues, yValues } = getDataParsed();
    if (xValues.length < 2) {
        showSnackbar('No hay suficientes datos para el modelo', 'error');
        return;
    }

    const polynomialModel = new PolynomialRegression();

    const { degree = 2 } = getModelParams();

    polynomialModel.fit(xValues, yValues, degree);
    const predictions = polynomialModel.predict(xValues);


    if (accion === 'entrenar') {
        const resultadoPolinomial = document.createElement('resultadoPolinomial');
        results.innerHTML = '';

        console.log(polynomialModel);

        resultadoPolinomial.innerHTML = `
            <div class="">
            Degree: ${degree} <br>
            Soluciones: ${JSON.stringify(polynomialModel.solutions.join(', '))}
            Error: ${polynomialModel.error}
            </div>
            `;

        results.appendChild(resultadoPolinomial);

        showSnackbar('Modelo entrenado', 'success');
        return;
    }

    if (accion === 'predicciones') {

        const options = {
            title: 'Regresión Polinomial',
            seriesType: 'scatter',
            series: { 1: { type: 'line' } },
            hAxis: { title: 'X' },
            vAxis: { title: 'Y' }
        };

        const dataArray = [['X', 'Y real', 'Predicción']];
        xValues.forEach((x, i) => {
            dataArray.push([x, yValues[i], predictions[i]]);
        });

        const dataTable = google.visualization.arrayToDataTable(dataArray);

        const chart = new google.visualization.ComboChart(document.getElementById('chart'));
        chart.draw(dataTable, options);
        
        return;
    }

    if (accion === 'tendencias') {
        showTrend(xValues, yValues); // Llamada a la nueva función de tendencia
    }

    if (accion === 'patrones') {
        showPatterns();
    }
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

