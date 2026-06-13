document.addEventListener('DOMContentLoaded', async () => {
    
    // Función para cargar los datos del JSON
    async function cargarDatos() {
        try {
            const respuesta = await fetch('datos.json');
            const datosKarate = await respuesta.json();
            return datosKarate;
        } catch (error) {
            console.error("Error cargando los datos:", error);
            return []; // Devuelve un array vacío si falla
        }
    }

    const datosKarate = await cargarDatos();

    // Actualizar tarjetas de resumen
    const totalMatches = datosKarate.reduce((sum, item) => sum + item.pendientes, 0);
    document.getElementById('total-matches').innerText = totalMatches;
    document.getElementById('last-update').innerText = new Date().toLocaleTimeString();

    // ... (El resto de la configuración de AG Grid y Chart.js se mantiene igual, 
    // usando la variable datosKarate que acabamos de cargar) ...

    // 2. CONFIGURACIÓN DE AG GRID
    const gridOptions = {
        rowData: datosKarate,
        columnDefs: [
            { field: "tatami", headerName: "Tatami", sortable: true, filter: true },
            { field: "categoria", headerName: "Categoría", flex: 1, filter: true },
            { field: "pendientes", headerName: "Combates Pendientes", sortable: true },
            { field: "estado", headerName: "Estado", sortable: true }
        ],
        pagination: true,
        paginationPageSize: 10
    };

    const gridDiv = document.querySelector('#grid');
    new agGrid.Grid(gridDiv, gridOptions);

    // 3. CONFIGURACIÓN DE CHART.JS
    const ctx = document.getElementById('tatami-chart').getContext('2d');
    
    // Preparamos los datos para el gráfico
    const etiquetasTatamis = datosKarate.map(d => d.tatami);
    const datosPendientes = datosKarate.map(d => d.pendientes);

    const tatamiChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: etiquetasTatamis,
            datasets: [{
                label: 'Combates Pendientes',
                data: datosPendientes,
                backgroundColor: 'rgba(52, 152, 219, 0.6)',
                borderColor: 'rgba(41, 128, 185, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true }
            }
        }
    });

    // 4. LÓGICA DEL BOTÓN RECARGAR
    document.getElementById('btn-refresh-tatamis-global').addEventListener('click', () => {
        // Aquí podrías añadir lógica para volver a leer un .json si lo tuvieras
        document.getElementById('last-update').innerText = new Date().toLocaleTimeString();
        alert("Datos recargados (Versión local)");
    });
});
