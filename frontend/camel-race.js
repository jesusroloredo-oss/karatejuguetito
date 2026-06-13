function actualizarCarrera(datos) {
    const pista = document.getElementById('camel-race-track');
    const comentarista = document.getElementById('commentator-text');
    
    if (!datos || datos.length === 0) return;

    // Encontramos el número máximo de pendientes para calcular el porcentaje de la pista
    const maxPendientes = Math.max(...datos.map(d => d.pendientes), 1);
    
    pista.innerHTML = ''; // Limpiamos la pista
    let lider = null;
    let minPendientes = Infinity;

    datos.forEach(tatami => {
        // Si hay menos combates, el camello avanza más (está más cerca del 100%)
        // Hacemos que si pendientes = 0, el camello esté al 100%
        let progreso = 100 - ((tatami.pendientes / maxPendientes) * 100);
        
        // Evitamos que se salga por la izquierda
        if(progreso < 0) progreso = 0;

        if (tatami.pendientes < minPendientes) {
            minPendientes = tatami.pendientes;
            lider = tatami.tatami;
        }

        const carril = document.createElement('div');
        carril.className = 'track-lane';
        
        carril.innerHTML = `
            <div class="track-name">${tatami.tatami}</div>
            <div class="track-progress">
                <div class="camel" style="left: calc(${progreso}% - 24px);">🐪</div>
                <div class="finish-line"></div>
            </div>
            <div style="width: 40px; text-align: right; font-weight: bold;">${tatami.pendientes}</div>
        `;
        
        pista.appendChild(carril);
    });

    // Actualizamos al comentarista
    if (minPendientes === 0) {
        comentarista.innerHTML = `🎤 ¡El <b>${lider}</b> ha terminado todos sus combates! ¡Imparables!`;
    } else {
        comentarista.innerHTML = `🎤 ¡Increíble! El <b>${lider}</b> lidera la carrera de rendimiento con solo ${minPendientes} combates pendientes.`;
    }
}