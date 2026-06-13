const puppeteer = require('puppeteer');
const fs = require('fs');

async function extraerDatosKarate() {
    console.log("Iniciando el navegador...");
    // Lanzamos el navegador invisible
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    console.log("Navegando a la URL...");
    await page.goto('https://cloud.karatescoring.com/tournaments/FGK2026_FinalLiga/', {
        waitUntil: 'networkidle2' // Espera a que la página cargue completamente
    });

    console.log("Extrayendo datos...");
    // Aquí es donde "leemos" la web. 
    // NOTA: Los selectores exactos dependerán de la estructura HTML de esa web específica.
    const datosExtraidos = await page.evaluate(() => {
        const resultados = [];
        
        // Ejemplo hipotético: buscamos todas las tarjetas o filas de tatamis
        // Tendrás que inspeccionar la web original para poner las clases correctas aquí
        const filasTatami = document.querySelectorAll('.tatami-row-class'); 
        
        filasTatami.forEach(fila => {
            resultados.push({
                tatami: fila.querySelector('.tatami-name')?.innerText || "Desconocido",
                categoria: fila.querySelector('.category-name')?.innerText || "-",
                pendientes: parseInt(fila.querySelector('.pending-matches')?.innerText || "0"),
                estado: fila.querySelector('.status')?.innerText || "En curso"
            });
        });

        return resultados;
    });

    // Guardamos los datos en un archivo JSON local
    fs.writeFileSync('datos.json', JSON.stringify(datosExtraidos, null, 2));
    console.log("¡Datos guardados con éxito en datos.json!");

    await browser.close();
}

extraerDatosKarate();
