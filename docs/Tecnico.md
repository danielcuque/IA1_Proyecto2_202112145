# Manual Técnico

Este documento proporciona una guía técnica para el uso y funcionalidad de los módulos y funciones principales del archivo JavaScript.

## Índice

1. [Importación de utilidades](#importación-de-utilidades)
2. [Inicialización de Gráficos](#inicialización-de-gráficos)
3. [Manejo de Eventos](#manejo-de-eventos)
4. [Funciones de Preprocesamiento](#funciones-de-preprocesamiento)
5. [Funciones de Gráficos](#funciones-de-gráficos)
6. [Modelos de Aprendizaje Automático](#modelos-de-aprendizaje-automático)
7. [Funciones de Árbol de Decisión](#funciones-de-árbol-de-decisión)

---

## Importación de Utilidades

```javascript
import { showSnackbar, validFilesLoad } from "./utils.js";
```

Estas utilidades se utilizan para mostrar notificaciones (`showSnackbar`) y para validar la carga de archivos (`validFilesLoad`).

---

## Inicialización de Gráficos

Google Charts se carga con el paquete `corechart` para habilitar el uso de gráficos básicos.

```javascript
google.charts.load('current', { packages: ['corechart'] });
```

---

## Manejo de Eventos

### Elementos de la Interfaz de Usuario

```javascript
const selectMLModel = document.getElementById('selectMLModel');
const massiveLoadButton = document.getElementById('massiveLoadBtn');
const massiveLoadChooser = document.getElementById('massiveLoadChooser');
const fileNameCSV = document.getElementById('fileNameCSV');
const modelParams = document.getElementById('modelParams');
const log = document.getElementById('log');
const entrenarModelo = document.getElementById('trainModelBtn');
const predictButton = document.getElementById('predictBtn');
const trendsButton = document.getElementById('trendsBtn');
const patternsButton = document.getElementById('patternsBtn');
const results = document.getElementById('results');
```

### Eventos de Carga Masiva y Selección de Modelo

```javascript
massiveLoadButton.addEventListener('click', () => {
    massiveLoadChooser.click();
});

massiveLoadChooser.addEventListener('change', () => {
    // Validación y lectura de archivo CSV
});

selectMLModel.addEventListener('change', () => {
    // Reseteo de visualización de archivo y limpieza de contenido
});
```

### Eventos de Entrenamiento y Predicción de Modelos

```javascript
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
```

---

## Funciones de Preprocesamiento

### Conversión de CSV a JSON

```javascript
const csvToJson = (csv, isNumeric = true) => {
    // Convierte un archivo CSV en un array de objetos JSON
};
```

### Obtención de Parámetros del Modelo

```javascript
const getModelParams = () => {
    // Obtiene los parámetros del modelo a partir de una entrada de texto
};
```

### Análisis de Datos

```javascript
const getDataParsed = () => {
    // Convierte el contenido del archivo CSV almacenado en localStorage a un formato JSON.
};
```

---

## Funciones de Gráficos

### Mostrar Tendencia

```javascript
const showTrend = (xValues, yValues) => {
    // Calcula la tendencia en los datos y muestra una alerta.
};
```

### Dibujo de Gráfico de Tendencia

```javascript
const drawTrendChart = (trendData, slope) => {
    // Dibuja un gráfico de dispersión con línea de tendencia.
};
```

### Mostrar Patrones

```javascript
const showPatterns = () => {
    // Muestra los patrones de los datos en un gráfico de líneas.
};
```

### Dibujo de Gráfico de Patrones

```javascript
const drawPatternChart = (patternData) => {
    // Dibuja un gráfico de líneas basado en los patrones de datos.
};
```

---

## Modelos de Aprendizaje Automático

### Regresión Lineal

```javascript
const regresionLineal = (accion) => {
    // Ejecuta el modelo de regresión lineal.
};
```

#### Acciones Disponibles

1. `entrenar`: Entrena el modelo de regresión lineal.
2. `predicciones`: Realiza predicciones usando el modelo entrenado.
3. `tendencias`: Muestra la tendencia de los datos.
4. `patrones`: Muestra patrones en los datos.

### Regresión Polinomial

```javascript
const regresionPolynomial = (accion) => {
    // Ejecuta el modelo de regresión polinomial.
};
```

#### Acciones Disponibles

1. `entrenar`: Entrena el modelo de regresión polinomial con el grado especificado.
2. `predicciones`: Realiza predicciones usando el modelo entrenado.
3. `tendencias`: Muestra la tendencia de los datos.
4. `patrones`: Muestra patrones en los datos.

---

## Funciones de Árbol de Decisión

### Mostrar Gráfico de Árbol de Decisión

```javascript
const showDecisionTreeGraph = (dotStr) => {
    // Convierte un archivo DOT a un gráfico jerárquico.
};
```

### Entrenamiento y Predicción de Árbol de Decisión

```javascript
const arbolDecision = (accion) => {
    // Crea, entrena y predice utilizando un árbol de decisión.
};
```

#### Acciones Disponibles

1. `entrenar`: Entrena el modelo de árbol de decisión.
2. `predicciones`: Realiza predicciones usando el modelo entrenado.

---

## Estructura de Modelos

```javascript
const models = {
    'regresionPolynomial': regresionPolynomial,
    'regresionLineal': regresionLineal,
    'arbolDecision': arbolDecision
};
```

Esta estructura permite seleccionar y ejecutar el modelo adecuado en función de la acción seleccionada.

---

## Notas y Observaciones

- **Almacenamiento Local**: Algunos datos se almacenan en `localStorage` para persistencia.
- **Google Charts**: Los gráficos dependen de Google Charts, que requiere conexión a Internet.
- **Notificaciones**: `showSnackbar` se utiliza para notificar al usuario de errores o éxitos.
- **Validación de Archivos**: `validFilesLoad` verifica que los archivos cargados sean en formato `.csv`.
