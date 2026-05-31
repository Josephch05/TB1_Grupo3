let actividades = [];
let projectStartDate = null;
let unidadTiempo = "dias";

document.getElementById('fechaInicioProyecto').addEventListener('change', function() {
    projectStartDate = new Date(this.value);
});

document.getElementById('unidadTiempo').addEventListener('change', function() {
    unidadTiempo = this.value;
    calcularTodo();
});

function getLetra(id) {
    return String.fromCharCode(64 + id);
}

function agregarActividad() {
    const nombre = document.getElementById('actividad').value.trim();
    const duracion = parseInt(document.getElementById('duracion').value);
    const selected = Array.from(document.getElementById('dependencia').selectedOptions);
    const predecesoras = selected.map(opt => parseInt(opt.value));

    if (!nombre || !duracion || !projectStartDate) {
        alert("❌ Completa Nombre, Duración y Fecha de Inicio del proyecto");
        return;
    }

    actividades.push({
        id: actividades.length + 1,
        letra: getLetra(actividades.length + 1),
        nombre: nombre,
        duracion: duracion,
        predecesoras: predecesoras,
        ES: 0, EF: 0,
        LS: 0, LF: 0,
        holgura: 0,
        esCritica: false
    });

    actualizarSelectDependencias();
    calcularTodo();
}

function actualizarSelectDependencias() {
    const select = document.getElementById('dependencia');
    select.innerHTML = '';
    actividades.forEach(act => {
        const opt = document.createElement('option');
        opt.value = act.id;
        opt.textContent = `${act.letra} - ${act.nombre}`;
        select.appendChild(opt);
    });
}

// ==================== CÁLCULOS CPM ====================
function calcularTodo() {
    if (actividades.length === 0 || !projectStartDate) return;
    calcularForwardPass();
    calcularBackwardPass();
    calcularHolguraYCritica();
    renderTabla();
    renderGantt();
    mostrarRutaCritica();
}

function calcularForwardPass() {
    actividades.forEach(act => {
        let ES = 0;
        if (act.predecesoras && act.predecesoras.length > 0) {
            const preds = actividades.filter(a => act.predecesoras.includes(a.id));
            ES = Math.max(...preds.map(p => p.EF));
        }
        act.ES = ES;
        act.EF = ES + act.duracion;
    });
}

function calcularBackwardPass() {
    const duracionTotal = Math.max(...actividades.map(a => a.EF), 0);
    actividades.forEach(act => act.LF = duracionTotal);

    for (let i = actividades.length - 1; i >= 0; i--) {
        const act = actividades[i];
        const sucesores = actividades.filter(s => s.predecesoras && s.predecesoras.includes(act.id));
        if (sucesores.length > 0) {
            act.LF = Math.min(...sucesores.map(s => s.ES));
        }
        act.LS = act.LF - act.duracion;
    }
}

function calcularHolguraYCritica() {
    actividades.forEach(act => {
        act.holgura = act.LS - act.ES;
        act.esCritica = (act.holgura <= 0);
    });
}

// ==================== GANTT CORREGIDO ====================
function renderGantt() {
    const container = document.getElementById('ganttContainer');
    container.innerHTML = '';

    if (actividades.length === 0) {
        container.innerHTML = "<p style='text-align:center; padding:40px; color:#666;'>Agrega actividades para ver el Diagrama de Gantt</p>";
        return;
    }

    const startDate = new Date(projectStartDate);
    const maxDays = Math.max(...actividades.map(a => a.EF)) + 10;

    let html = `<table class="gantt-table" style="border-collapse: collapse; width: max-content; font-size: 0.9rem;">`;
    
    // Fila 1: Fecha de cada semana (empezando desde la fecha real)
    html += `<thead><tr><th style="width:320px; text-align:left; background:#f8fafc;">Actividad</th><th style="width:70px; background:#f8fafc;">Dur.</th>`;

    for (let i = 0; i < maxDays; i += 7) {
        const weekDate = new Date(startDate);
        weekDate.setDate(weekDate.getDate() + i);
        const dia = weekDate.getDate().toString().padStart(2, '0');
        const mes = (weekDate.getMonth() + 1).toString().padStart(2, '0');
        html += `<th colspan="7" style="background:#e0f2fe; font-weight:600; border:1px solid #bae6fd;">
                    ${dia}/${mes}/${weekDate.getFullYear()}
                 </th>`;
    }
    html += `</tr>`;

    // Fila 2: Día del mes
    html += `<tr><th></th><th></th>`;
    for (let i = 0; i < maxDays; i++) {
        const fecha = new Date(startDate);
        fecha.setDate(fecha.getDate() + i);
        html += `<th style="width:32px; background:#f1f5f9;">${fecha.getDate()}</th>`;
    }
    html += `</tr>`;

    // Fila 3: Día de la semana
    html += `<tr><th></th><th></th>`;
    for (let i = 0; i < maxDays; i++) {
        const fecha = new Date(startDate);
        fecha.setDate(fecha.getDate() + i);
        const dias = ['D', 'L', 'Ma', 'Mi', 'J', 'V', 'S'];
        html += `<th style="width:32px; background:#e2e8f0; font-size:0.85rem;">${dias[fecha.getDay()]}</th>`;
    }
    html += `</tr></thead><tbody>`;

    // Actividades
    actividades.forEach(act => {
        const colorBarra = act.esCritica ? '#1e40af' : '#60a5fa';

        html += `<tr>
            <td style="text-align:left; font-weight:600;">${act.letra} - ${act.nombre}</td>
            <td>${act.duracion}</td>`;

        for (let i = 0; i < maxDays; i++) {
            if (i >= act.ES && i < act.EF) {
                html += `<td style="background:${colorBarra}; border:1px solid #1e3a8a;"></td>`;
            } else {
                html += `<td style="border:1px solid #e2e8f0;"></td>`;
            }
        }
        html += `</tr>`;
    });

    html += `</tbody></table>`;
    container.innerHTML = html;
}

// Resto de funciones
function mostrarRutaCritica() {
    const criticas = actividades.filter(a => a.esCritica).sort((a,b) => a.ES - b.ES);
    let ruta = "Inicio";
    criticas.forEach(act => ruta += ` → ${act.letra}`);
    ruta += " → Final";

    document.getElementById('rutaCritica').innerHTML = `
        <strong>RUTA CRÍTICA</strong><br><br>
        ${ruta}<br><br>
        <strong>Duración Total: ${Math.max(...actividades.map(a => a.EF), 0)} ${unidadTiempo}</strong>
    `;
}

function renderTabla() {
    const tbody = document.getElementById('tablaActividades');
    tbody.innerHTML = '';

    actividades.forEach(act => {
        const preds = act.predecesoras && act.predecesoras.length > 0 
            ? act.predecesoras.map(id => getLetra(id)).join(", ") 
            : '-';

        const tr = document.createElement('tr');
        tr.style.backgroundColor = act.esCritica ? '#ffe6e6' : '';
        tr.innerHTML = `
            <td>${act.letra}</td>
            <td>${act.nombre}</td>
            <td>${act.duracion} ${unidadTiempo}</td>
            <td>${preds}</td>
            <td>${act.ES}</td>
            <td>${act.EF}</td>
            <td>${act.LS}</td>
            <td>${act.LF}</td>
            <td style="font-weight:bold; color:${act.holgura===0 ? 'red' : 'blue'}">${act.holgura}</td>
            <td>${act.esCritica ? '🔴 CRÍTICA' : ''}</td>
            <td><button onclick="eliminarActividad(${act.id})">Eliminar</button></td>
        `;
        tbody.appendChild(tr);
    });
}

function eliminarActividad(id) {
    if (confirm("¿Eliminar esta actividad?")) {
        actividades = actividades.filter(a => a.id !== id);
        actualizarSelectDependencias();
        calcularTodo();
    }
}

function exportarCSV() {
    let csv = "Letra,Actividad,Duracion,Predecesoras,ES,EF,LS,LF,Holgura,Critica\n";
    actividades.forEach(act => {
        const preds = act.predecesoras ? act.predecesoras.map(id => getLetra(id)).join(";") : '';
        csv += `${act.letra},${act.nombre},${act.duracion},${preds},${act.ES},${act.EF},${act.LS},${act.LF},${act.holgura},${act.esCritica}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'Cronograma.csv';
    a.click();
}

function calcularEVM() {
    const pv = parseFloat(document.getElementById('pv').value) || 0;
    const ev = parseFloat(document.getElementById('ev').value) || 0;
    const ac = parseFloat(document.getElementById('ac').value) || 0;

    document.getElementById('cpi').textContent = ac ? (ev/ac).toFixed(2) : '0.00';
    document.getElementById('spi').textContent = pv ? (ev/pv).toFixed(2) : '0.00';
    document.getElementById('cv').textContent = (ev - ac).toLocaleString('es-PE');
    document.getElementById('sv').textContent = (ev - pv).toLocaleString('es-PE');
}