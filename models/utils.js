export const showSnackbar = (message, type) => {
    const snackbar = document.createElement("div");
    snackbar.classList.add(
        "flex",
        "items-center",
        "w-full",
        "max-w-xs",
        "p-4",
        "mb-4",
        "text-gray-500",
        "bg-white", "rounded-lg",
        "shadow",
        "fixed", "top-2",
        "right-2",
        "transform", "-translate-y-full",
        "transition-transform",
        "duration-300"
    );


    switch (type) {
        case 'error':
            snackbar.innerHTML = `
                <div class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-red-500 bg-red-100 rounded-lg">
                    <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clip-rule="evenodd"></path>
                    </svg>
                    <span class="sr-only">Error icon</span>
                </div>
        <div class="ml-3 text-sm font-normal">${message}</div>`

            break;
        case 'success':
            snackbar.innerHTML = `
            <div class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg">
        <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
        <span class="sr-only">Check icon</span>
    </div>
    <div class="ml-3 text-sm font-normal">
    ${message}
    </div>
            `
            break;
        case 'warning':
            snackbar.innerHTML = `
            <div class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-orange-500 bg-orange-100 rounded-lg">
        <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>
        <span class="sr-only">Warning icon</span>
    </div>
    <div class="ml-3 text-sm font-normal">${message}</div>
            `
            break;
        default:
            snackbar.innerHTML = `
            <div class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-blue-500 bg-blue-100 rounded-lg">
        <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clip-rule="evenodd"></path></svg>
        <span class="sr-only">Fire icon</span>
    </div>
            <div class="ml-3 text-sm font-normal">${message} </div>
            `
            break;
    }

    document.body.appendChild(snackbar);

    setTimeout(() => {
        snackbar.classList.remove("opacity-0");
        snackbar.classList.add("translate-y-0");
    }, 100);

    setTimeout(() => {
        snackbar.classList.add("opacity-0");
        snackbar.classList.remove("translate-y-0");
        setTimeout(() => {
            snackbar.remove();
        }, 300);
    }, 3000);

}

export const showLinearGraph = (xValues, yValues) => {
    const ctx = document.getElementById("myChart").getContext("2d");

    // Si el gráfico ya existe, destrúyelo
    if (myChart) {
        myChart.destroy(); // Destruir el gráfico existente
    }

    // Calcular R^2
    const r2Value = calculateR2(predictions, yValues);

    // Crear gráfico de regresión lineal
    myChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: xValues,
            datasets: [
                {
                    label: "Predicciones Lineales",
                    data: predictions,
                    borderColor: "rgba(75, 192, 192, 1)",
                    borderWidth: 2,
                    fill: false,
                },
                {
                    label: "Valores Reales",
                    data: yValues,
                    borderColor: "rgba(255, 99, 132, 1)",
                    borderWidth: 2,
                    fill: false,
                },
            ],
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: "X",
                    },
                },
                y: {
                    title: {
                        display: true,
                        text: "Y",
                    },
                },
            },
            plugins: {
                // Plugin para mostrar R^2 en la gráfica
                beforeDraw: (chart) => {
                    const ctx = chart.ctx;
                    ctx.save();
                    ctx.font = "16px Arial";
                    ctx.fillStyle = "black";
                    ctx.fillText(`R^2: ${r2Value.toFixed(2)}`, 10, 30);
                    ctx.restore();
                },
            },
        },
    });
}


export const validFilesLoad = (allowedExtensions, files) => {
    const invalidFiles = [];
    Array.from(files).forEach((file) => {
        if (!allowedExtensions.test(file.name)) {
            invalidFiles.push(file);
        }
    });
    if (invalidFiles.length > 0) {
        return false;
    }
    return true;
}
