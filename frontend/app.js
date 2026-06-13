let datosGlobales = [];
let gridApi;
let tatamiChart;

document.addEventListener('DOMContentLoaded', async () => {
    configurarBotonesVista();
    await cargarDatos();

    document.getElementById('btn-refresh-tatamis-global').addEventListener('click', async () => {
        await cargarDatos();
    });
});

async function cargarDatos() {
    try {
        // Leemos el archivo generado por tu scraper local
        const response = await fetch('datos.json');
        if (!response.ok) throw new Error("No se pudo cargar el JSON");
        
        datosGlobales = await response.json();
        
        // Actualizar UI
        actualizarTarjetas();
        actualizarTabla();
        actualizarGrafica();
        
        // Llamada a la función del archivo camel-race.js
        if(typeof actualizarCarrera === 'function') {
            actualizarCarrera(datosGlobales);
        }

        // Indicadores de estado
        const badge = document.getElementById('connection-badge');
        badge.className = 'badge badge-connected';
        badge.innerText = 'Conectado';
        document.getElementById('last-update').innerText = new Date().toLocaleTimeString();

    } catch (error) {
        console.error("Error leyendo datos.json:", error);
        const badge = document.getElementById('connection-badge');
        badge.className = 'badge badge-disconnected';
        badge.innerText = 'Sin datos.json';
    }
}

function actualizarTarjetas() {
    const contenedor = document.getElementById('summary-cards');
    const totalTatamis = datosGlobales.length;
    const totalPendientes = datosGlobales.reduce((sum, item) => sum + (item.pendientes || 0), 0);

    contenedor.innerHTML = `
        <div class="card"><h3>Tatamis Activos</h3><p>${totalTatamis}</p></div>
        <div class="card"><h3>Combates Totales Pendientes</h3><p>${totalPendientes}</p></div>
    `;
}

function actualizarTabla() {
    const gridDiv = document.querySelector('#grid');
    
    // Si la tabla no existe, la creamos. Si existe, actualizamos los datos.
    if (!gridApi) {
        const gridOptions = {
            rowData: datosGlobales,
            columnDefs: [
                { field: "tatami", headerName: "Tatami", sortable: true, filter: true },
                { field: "categoria", headerName: "Categoría", flex: 1, filter: true },
                { field: "pendientes", headerName: "Pendientes", sortable: true },
                { field: "estado", headerName: "Estado", sortable: true }
            ],
            pagination: true,
            paginationPageSize: 15
        };
        gridApi = agGrid.createGrid(gridDiv, gridOptions);
    } else {
        gridApi.setGridOption('rowData', datosGlobales);
    }
}

function actualizarGrafica() {
    const ctx = document.getElementById('tatami-chart').getContext('2d');
    const etiquetas = datosGlobales.map(d => d.tatami);
    const datos = datosGlobales.map(d => d.pendientes);

    if (tatamiChart) {
        tatamiChart.data.labels = etiquetas;
        tatamiChart.data.datasets[0].data = datos;
        tatamiChart.update();
    } else {
        tatamiChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: etiquetas,
                datasets: [{
                    label: 'Combates Pendientes',
                    data: datos,
                    backgroundColor: 'rgba(52, 152, 219, 0.7)',
                    borderColor: '#2980b9',
                    borderWidth: 1
                }]
            },
            options: { responsive: true, scales: { y: { beginAtZero: true } } }
        });
    }
}

function configurarBotonesVista() {
    const btnChart = document.getElementById('btn-chart-view');
    const btnRace = document.getElementById('btn-race-view');
    const chartView = document.getElementById('chart-view');
    const raceView = document.getElementById('race-view');

    btnChart.addEventListener('click', () => {
        btnChart.classList.add('active');
        btnRace.classList.remove('active');
        chartView.classList.remove('hidden');
        raceView.classList.add('hidden');
    });

    btnRace.addEventListener('click', () => {
        btnRace.classList.add('active');
        btnChart.classList.remove('active');
        raceView.classList.remove('hidden');
        chartView.classList.add('hidden');
    });
}