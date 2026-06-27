/* TB1 - Joseph - CI579 */

let actividades = [];
let projectStartDate = null;
let unidadTiempo = 'dias';
let modoAvance = 'planeado';
let idioma = 'es';
let moneda = 'S/.';
let periodosEVM = [];
let chartCurvaS = null;
let chartEscenarios = null;
let sumaPeriodo = [];
let sumaAcumulada = [];
let diaCorte = 1;
let escenarioETC = 'probable';
let holguraPorcentaje = false;
let calendarioActivo = false;
let diasLaborables = [1, 2, 3, 4, 5];
let anioFeriados = new Date().getFullYear();
let feriadosCache = [];
let diasNoLaborablesCustom = [];
let bitacoraHtml = '';
let tabActual = 0;
let mapaCalendario = [];
let diasCalendarioGantt = [];
let chartInformeCurvaS = null;
let chartInformeEscenarios = null;
let autoSaveTimer = null;
const STORAGE_KEY = 'tb1_proyecto';
const BITACORA_KEY = 'tb1_bitacora';

const traducciones = {
    es: {
        appTitle: 'Planificador de Obras Civiles - TB1',
        appSubtitle: 'Planificación y Control de Obras - CI579',
        tabSchedule: 'Cronograma + Gantt', tabEVM: 'Valor Ganado + Análisis',
        tabInforme: 'Informe Ejecutivo', tabBitacora: 'Bitácora',
        projectData: 'Datos del Proyecto', projectName: 'Nombre del Proyecto',
        startDate: 'Fecha de Inicio', timeUnit: 'Unidad de Tiempo',
        days: 'Días', weeks: 'Semanas', months: 'Meses',
        advanceMode: 'Modo de % en Gantt',
        plannedMode: '% Avance Planificado (suma 100%)',
        realMode: '% Avance Real (va al Valor Ganado)',
        language: 'Idioma', currency: 'Moneda',
        activityRegister: 'Registro de Actividades', activityName: 'Nombre de la Actividad',
        duration: 'Duración', budget: 'Presupuesto Parcial (BAC actividad)',
        predecessors: 'Predecesoras (Ctrl + Click)', predecessorsHint: 'Ctrl para varias',
        addActivity: '+ Agregar Actividad', deleteAll: 'Eliminar todas',
        scheduleTitle: 'Cronograma del Proyecto',
        colActivity: 'Actividad', colDuration: 'Duración', colBudget: 'Presupuesto',
        colPredecessors: 'Predecesoras', colStartDate: 'Fecha Inicio', colEndDate: 'Fecha Fin',
        colSlack: 'Holgura', colStatus: 'Estado', colPctTotal: '% Total', colActions: 'Acc.',
        ganttTitle: 'Diagrama de Gantt',
        ganttHintPlanned: 'Modo planificado: los % distribuyen el presupuesto y deben sumar 100% por actividad.',
        ganttHintReal: 'Modo avance real: ingrese el % físico de avance. Se sincroniza automáticamente al Valor Ganado.',
        legendWork: 'Trabajo', legendSlack: 'Holgura',
        criticalPath: 'Ruta Crítica', criticalPathEmpty: 'Agrega actividades...',
        exportExcel: 'Exportar Excel', savePDF: 'Guardar PDF', print: 'Imprimir',
        pdfCronograma: 'TB1_Cronograma.pdf', pdfEVM: 'TB1_ValorGanado.pdf',
        evmTable: 'Seguimiento EVM por Periodo',
        evmTableHint: 'Ingrese Avance % y Costo Incurrido Parcial. Ppto Parcial y Trabajo Realizado se calculan solos.',
        cutoffLabel: 'Analizar hasta (periodo de corte)',
        evmNeedActivities: 'Primero agregue actividades en Cronograma.',
        colTime: 'Tiempo', colAdvance: 'Avance %',
        colPptoParcial: 'Ppto Parcial (PV)', colPptoAcum: 'PV Acumulado',
        colCostoParcial: 'Costo Incurrido Parcial (AC)', colCostoAcum: 'AC Acumulado',
        colTrabajoParcial: 'Trabajo Realizado Parcial (EV)', colTrabajoAcum: 'EV Acumulado',
        sCurve: 'Curva S',
        sCurveHint: 'PV muestra el plan completo. EV y AC se grafican solo hasta el periodo de corte seleccionado.',
        evmIndicators: 'Indicadores al Periodo de Corte',
        analysisSchedule: 'Análisis de Cronograma',
        analysisCost: 'Análisis de Costo',
        analysisProjections: 'Proyecciones (ETC / EAC)',
        etcScenarioLabel: 'Escenario ETC a utilizar',
        etcAtypical: 'Atípico (BAC - EV)',
        etcTypical: 'Típico (BAC - EV) / CPI',
        etcProbable: 'Más probable (BAC - EV) / (CPI × SPI)',
        scenarioComparison: 'Comparación de Escenarios',
        confirmDeleteAll: '¿Eliminar TODAS las actividades?',
        confirmDeleteOne: '¿Eliminar actividad?',
        alertFillFields: 'Complete nombre, duración, presupuesto y fecha inicio.',
        alertNoActivities: 'No hay actividades para exportar.',
        alertNoEVM: 'No hay periodos EVM para exportar.',
        alertNoPDF: 'No se cargó la librería PDF.',
        alertNoExcel: 'No se cargó la librería Excel.',
        statusCritical: 'CRÍTICA', statusNormal: 'Normal',
        start: 'Inicio', end: 'Final', totalDuration: 'Duración total',
        ganttEmpty: 'Agrega actividades', sumPeriod: 'Suma del', accumulated: 'Acumulada',
        noCostIfZeroAdvance: 'No puede ingresar costo si avance es 0%',
        slackAsPercent: 'Mostrar holgura como % de duración del proyecto',
        saveProject: 'Guardar proyecto', loadProject: 'Cargar proyecto',
        exportJSON: 'Exportar JSON', loadExample: 'Cargar ejemplo',
        calendarTitle: 'Calendario Laboral',
        calendarHint: 'Activo solo con unidad «Días». Omite fines de semana, feriados y días personalizados.',
        calendarActive: 'Activar calendario laboral', holidayYear: 'Año de feriados',
        holidayDepts: 'Departamentos (feriados regionales)', workDays: 'Días laborables de la semana:',
        daySun: 'Dom', dayMon: 'Lun', dayTue: 'Mar', dayWed: 'Mié', dayThu: 'Jue', dayFri: 'Vie', daySat: 'Sáb',
        customNonWorkDate: 'Fecha no laborable', customNonWorkDesc: 'Descripción', addNonWorkDay: '+ Agregar',
        validationTitle: 'Validaciones del proyecto', validationOk: 'Proyecto válido. Sin errores.',
        legendCritical: 'Ruta crítica', legendNonWork: 'No laborable',
        editActivity: 'Editar Actividad', cancel: 'Cancelar', save: 'Guardar', close: 'Cerrar',
        exportExcelFull: 'Excel completo', savePDFPro: 'PDF profesional',
        tcpiBacHint: 'Rendimiento requerido para cumplir BAC',
        tcpiEacHint: 'Rendimiento requerido según EAC proyectado',
        scheduleAdvancePct: 'Avance cronograma %', costOverrunPct: 'Sobrecosto %',
        executiveReport: 'Informe Ejecutivo',
        executiveReportHint: 'Resumen gerencial automático con indicadores, gráficos y recomendaciones.',
        refreshReport: 'Actualizar informe',
        bitacoraHint: 'Registro de observaciones, incidencias y decisiones. Se guarda automáticamente.',
        exportBitacoraTXT: 'Exportar TXT', exportBitacoraPDF: 'Exportar PDF', exportBitacoraWord: 'Exportar Word',
        valNoStartDate: 'Falta fecha de inicio del proyecto.',
        valNoActivities: 'No hay actividades registradas.',
        valCyclicDeps: 'Dependencias cíclicas detectadas.',
        valInvalidPred: 'Predecesora inválida en actividad',
        valPctNot100: '% no suma 100% en actividad',
        valSaved: 'Proyecto guardado.', valLoaded: 'Proyecto cargado.',
        alertNoJsPDF: 'No se cargó jsPDF.'
    },
    en: {
        appTitle: 'Civil Works Planner - TB1',
        appSubtitle: 'Planning and Control - CI579',
        tabSchedule: 'Schedule + Gantt', tabEVM: 'Earned Value + Analysis',
        tabInforme: 'Executive Report', tabBitacora: 'Logbook',
        projectData: 'Project Data', projectName: 'Project Name',
        startDate: 'Start Date', timeUnit: 'Time Unit',
        days: 'Days', weeks: 'Weeks', months: 'Months',
        advanceMode: 'Gantt % Mode',
        plannedMode: 'Planned Advance % (sums 100%)',
        realMode: 'Real Advance % (syncs to EVM)',
        language: 'Language', currency: 'Currency',
        activityRegister: 'Activity Register', activityName: 'Activity Name',
        duration: 'Duration', budget: 'Partial Budget (activity BAC)',
        predecessors: 'Predecessors (Ctrl + Click)', predecessorsHint: 'Ctrl for multiple',
        addActivity: '+ Add Activity', deleteAll: 'Delete all',
        scheduleTitle: 'Project Schedule',
        colActivity: 'Activity', colDuration: 'Duration', colBudget: 'Budget',
        colPredecessors: 'Predecessors', colStartDate: 'Start', colEndDate: 'End',
        colSlack: 'Slack', colStatus: 'Status', colPctTotal: '% Total', colActions: 'Act.',
        ganttTitle: 'Gantt Chart',
        ganttHintPlanned: 'Planned mode: % distribute budget, must sum 100% per activity.',
        ganttHintReal: 'Real mode: enter physical progress %. Auto-syncs to Earned Value.',
        legendWork: 'Work', legendSlack: 'Slack',
        criticalPath: 'Critical Path', criticalPathEmpty: 'Add activities...',
        exportExcel: 'Export Excel', savePDF: 'Save PDF', print: 'Print',
        pdfCronograma: 'TB1_Schedule.pdf', pdfEVM: 'TB1_EarnedValue.pdf',
        evmTable: 'EVM Tracking by Period',
        evmTableHint: 'Enter Advance % and Actual Cost. Budget and Work Performed are auto-calculated.',
        cutoffLabel: 'Analyze until (cutoff period)',
        evmNeedActivities: 'Add activities in Schedule tab first.',
        colTime: 'Time', colAdvance: 'Advance %',
        colPptoParcial: 'Partial Budget (PV)', colPptoAcum: 'Accum. PV',
        colCostoParcial: 'Partial Actual Cost (AC)', colCostoAcum: 'Accum. AC',
        colTrabajoParcial: 'Partial Work (EV)', colTrabajoAcum: 'Accum. EV',
        sCurve: 'S-Curve',
        sCurveHint: 'PV shows full plan. EV and AC are plotted only up to the selected cutoff period.',
        evmIndicators: 'Indicators at Cutoff Period',
        analysisSchedule: 'Schedule Analysis',
        analysisCost: 'Cost Analysis',
        analysisProjections: 'Projections (ETC / EAC)',
        etcScenarioLabel: 'ETC scenario to use',
        etcAtypical: 'Atypical (BAC - EV)',
        etcTypical: 'Typical (BAC - EV) / CPI',
        etcProbable: 'Most probable (BAC - EV) / (CPI × SPI)',
        scenarioComparison: 'Scenario Comparison',
        confirmDeleteAll: 'Delete ALL activities?',
        confirmDeleteOne: 'Delete activity?',
        alertFillFields: 'Fill name, duration, budget and start date.',
        alertNoActivities: 'No activities to export.',
        alertNoEVM: 'No EVM periods to export.',
        alertNoPDF: 'PDF library not loaded.',
        alertNoExcel: 'Excel library not loaded.',
        statusCritical: 'CRITICAL', statusNormal: 'Normal',
        start: 'Start', end: 'End', totalDuration: 'Total duration',
        ganttEmpty: 'Add activities', sumPeriod: 'Sum of', accumulated: 'Accumulated',
        noCostIfZeroAdvance: 'Cannot enter cost if advance is 0%',
        slackAsPercent: 'Show slack as % of project duration',
        saveProject: 'Save project', loadProject: 'Load project',
        exportJSON: 'Export JSON', loadExample: 'Load example',
        calendarTitle: 'Work Calendar',
        calendarHint: 'Active only with «Days» unit. Skips weekends, holidays and custom days.',
        calendarActive: 'Enable work calendar', holidayYear: 'Holiday year',
        holidayDepts: 'Departments (regional holidays)', workDays: 'Work days of the week:',
        daySun: 'Sun', dayMon: 'Mon', dayTue: 'Tue', dayWed: 'Wed', dayThu: 'Thu', dayFri: 'Fri', daySat: 'Sat',
        customNonWorkDate: 'Non-work date', customNonWorkDesc: 'Description', addNonWorkDay: '+ Add',
        validationTitle: 'Project validations', validationOk: 'Project valid. No errors.',
        legendCritical: 'Critical path', legendNonWork: 'Non-work',
        editActivity: 'Edit Activity', cancel: 'Cancel', save: 'Save', close: 'Close',
        exportExcelFull: 'Full Excel', savePDFPro: 'Professional PDF',
        tcpiBacHint: 'Performance required to meet BAC',
        tcpiEacHint: 'Performance required per projected EAC',
        scheduleAdvancePct: 'Schedule advance %', costOverrunPct: 'Cost overrun %',
        executiveReport: 'Executive Report',
        executiveReportHint: 'Automatic managerial summary with indicators, charts and recommendations.',
        refreshReport: 'Refresh report',
        bitacoraHint: 'Log of observations, incidents and decisions. Auto-saved.',
        exportBitacoraTXT: 'Export TXT', exportBitacoraPDF: 'Export PDF', exportBitacoraWord: 'Export Word',
        valNoStartDate: 'Project start date missing.',
        valNoActivities: 'No activities registered.',
        valCyclicDeps: 'Cyclic dependencies detected.',
        valInvalidPred: 'Invalid predecessor in activity',
        valPctNot100: '% does not sum 100% in activity',
        valSaved: 'Project saved.', valLoaded: 'Project loaded.',
        alertNoJsPDF: 'jsPDF library not loaded.'
    }
};

function t(k) { return traducciones[idioma][k] || k; }

function getUnidadLabel() {
    return { es: { dias: 'días', semanas: 'semanas', meses: 'meses' }, en: { dias: 'days', semanas: 'weeks', meses: 'months' } }[idioma][unidadTiempo];
}

function getEtiquetaTiempo(n) {
    const m = { es: { dias: 'Día', semanas: 'Semana', meses: 'Mes' }, en: { dias: 'Day', semanas: 'Week', meses: 'Month' } };
    return `${m[idioma][unidadTiempo]} ${n}`;
}

function getLabelSumaPeriodo() {
    const m = { es: { dias: 'día', semanas: 'semana', meses: 'mes' }, en: { dias: 'day', semanas: 'week', meses: 'month' } };
    return `${t('sumPeriod')} ${m[idioma][unidadTiempo]}`;
}

function formatearMoneda(v) {
    return `${moneda} ${Number(v || 0).toLocaleString(idioma === 'es' ? 'es-PE' : 'en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function diasPorPeriodo() {
    return unidadTiempo === 'dias' ? 1 : unidadTiempo === 'semanas' ? 7 : 30;
}

function sumarDias(fb, d) {
    const f = new Date(fb);
    f.setDate(f.getDate() + d);
    return f.toLocaleDateString(idioma === 'es' ? 'es-PE' : 'en-US');
}

function getFechaInicioActividad(a) {
    if (!projectStartDate) return '-';
    if (esCalendarioAplicable() && mapaCalendario[a.ES]) return formatearFecha(mapaCalendario[a.ES]);
    return sumarDias(projectStartDate, a.ES * diasPorPeriodo());
}

function getFechaFinActividad(a) {
    if (!projectStartDate) return '-';
    if (esCalendarioAplicable() && mapaCalendario[a.EF - 1]) return formatearFecha(mapaCalendario[a.EF - 1]);
    return sumarDias(projectStartDate, (a.EF - 1) * diasPorPeriodo());
}

function getPVPeriodo(act, periodo) {
    if (periodo < act.ES || periodo >= act.EF) return 0;
    return (parseFloat(act.presupuesto) || 0) / act.duracion;
}

function getETCEscenario(key, bac, ev, cpi, spi) {
    const resto = bac - ev;
    if (key === 'atipico') return resto;
    if (key === 'tipico') return cpi > 0 ? resto / cpi : 0;
    return (cpi > 0 && spi > 0) ? resto / (cpi * spi) : 0;
}

function formatearFecha(fecha) {
    if (!fecha) return '-';
    const f = fecha instanceof Date ? fecha : new Date(fecha + 'T00:00:00');
    return f.toLocaleDateString(idioma === 'es' ? 'es-PE' : 'en-US');
}

function esCalendarioAplicable() {
    return calendarioActivo && unidadTiempo === 'dias' && projectStartDate;
}

function esDiaLaborable(fecha) {
    const f = fecha instanceof Date ? new Date(fecha) : new Date(fecha + 'T00:00:00');
    const dow = f.getDay();
    if (!diasLaborables.includes(dow)) return false;
    const iso = f.toISOString().slice(0, 10);
    if (diasNoLaborablesCustom.some(d => d.fecha === iso)) return false;
    if (feriadosCache.some(h => h.fecha === iso)) return false;
    return true;
}

function siguienteDiaLaborable(fecha) {
    const f = new Date(fecha);
    f.setDate(f.getDate() + 1);
    while (!esDiaLaborable(f)) f.setDate(f.getDate() + 1);
    return f;
}

function construirMapaCalendario() {
    mapaCalendario = [];
    diasCalendarioGantt = [];
    if (!esCalendarioAplicable()) return;
    const maxP = Math.max(...actividades.map(a => a.EF), 0);
    if (!maxP) return;
    let f = new Date(projectStartDate);
    while (!esDiaLaborable(f)) f.setDate(f.getDate() + 1);
    for (let p = 0; p < maxP; p++) {
        mapaCalendario[p] = new Date(f);
        if (p === 0) diasCalendarioGantt.push(new Date(f));
        f = siguienteDiaLaborable(f);
        if (p < maxP - 1) {
            let gap = new Date(mapaCalendario[p]);
            gap.setDate(gap.getDate() + 1);
            while (gap < f) {
                diasCalendarioGantt.push(new Date(gap));
                gap.setDate(gap.getDate() + 1);
            }
        }
    }
    if (mapaCalendario.length) {
        const ultimo = mapaCalendario[mapaCalendario.length - 1];
        if (!diasCalendarioGantt.some(d => d.toDateString() === ultimo.toDateString())) {
            diasCalendarioGantt.push(new Date(ultimo));
        }
    }
}

function periodoAFechaCalendario(periodo) {
    if (esCalendarioAplicable() && mapaCalendario[periodo]) return mapaCalendario[periodo];
    if (!projectStartDate) return null;
    const f = new Date(projectStartDate);
    f.setDate(f.getDate() + periodo * diasPorPeriodo());
    return f;
}

function getIndiceCalendarioGantt(fechaObj) {
    return diasCalendarioGantt.findIndex(d => d.toDateString() === fechaObj.toDateString());
}

function getPeriodoDesdeIndiceGantt(idx) {
    if (!esCalendarioAplicable()) return idx;
    const fecha = diasCalendarioGantt[idx];
    if (!fecha) return -1;
    for (let p = 0; p < mapaCalendario.length; p++) {
        if (mapaCalendario[p].toDateString() === fecha.toDateString()) return p;
    }
    return -1;
}

function actualizarFeriados() {
    if (typeof obtenerTodosFeriadosPeru !== 'function') return;
    const sel = document.getElementById('departamentosFeriados');
    const deps = sel ? Array.from(sel.selectedOptions).map(o => o.value) : [];
    feriadosCache = obtenerTodosFeriadosPeru(anioFeriados, deps.length ? deps : undefined);
    renderListaFeriados();
}

function renderListaFeriados() {
    const el = document.getElementById('listaFeriados');
    if (!el) return;
    const items = [...feriadosCache];
    diasNoLaborablesCustom.forEach(d => items.push({ fecha: d.fecha, nombre: d.desc || (idioma === 'es' ? 'Personalizado' : 'Custom'), tipo: 'custom' }));
    items.sort((a, b) => a.fecha.localeCompare(b.fecha));
    el.innerHTML = items.map(f =>
        `<div class="feriado-item"><strong>${f.fecha}</strong> — ${f.nombre}${f.tipo === 'custom' ? ` <button class="btn-eliminar" onclick="eliminarDiaNoLaborable('${f.fecha}')">×</button>` : ''}</div>`
    ).join('') || `<div class="feriado-item">${idioma === 'es' ? 'Sin feriados' : 'No holidays'}</div>`;
}

function inicializarCalendarioUI() {
    const sel = document.getElementById('departamentosFeriados');
    if (sel && typeof DEPARTAMENTOS_PERU !== 'undefined') {
        sel.innerHTML = DEPARTAMENTOS_PERU.map(d => `<option value="${d}" selected>${d}</option>`).join('');
    }
    const anioEl = document.getElementById('anioFeriados');
    if (anioEl) anioEl.value = anioFeriados;
    actualizarFeriados();
}

function agregarDiaNoLaborable() {
    const fecha = document.getElementById('fechaNoLaborable')?.value;
    const desc = document.getElementById('descNoLaborable')?.value?.trim() || '';
    if (!fecha) return;
    if (!diasNoLaborablesCustom.some(d => d.fecha === fecha)) {
        diasNoLaborablesCustom.push({ fecha, desc });
    }
    document.getElementById('fechaNoLaborable').value = '';
    document.getElementById('descNoLaborable').value = '';
    actualizarFeriados();
    calcularTodo();
}

function eliminarDiaNoLaborable(fecha) {
    diasNoLaborablesCustom = diasNoLaborablesCustom.filter(d => d.fecha !== fecha);
    actualizarFeriados();
    calcularTodo();
}

function validarProyecto() {
    const errores = [], advertencias = [];
    if (!projectStartDate) errores.push(t('valNoStartDate'));
    if (!actividades.length) advertencias.push(t('valNoActivities'));
    actividades.forEach(a => {
        (a.predecesoras || []).forEach(p => {
            if (!actividades.find(x => x.id === p)) errores.push(`${t('valInvalidPred')} ${a.id}: ${p}`);
            if (p === a.id) errores.push(`${t('valInvalidPred')} ${a.id}: ${p}`);
        });
        if (modoAvance === 'planeado' && a.duracion > 0) {
            const sum = getSumaPorcentajes(a);
            if (Math.abs(sum - 100) > 0.01 && Object.keys(a.porcentajes).length > 0) {
                advertencias.push(`${t('valPctNot100')} ${a.id} (${a.nombre}): ${sum.toFixed(1)}%`);
            }
        }
    });
    if (actividades.length && detectarCiclos()) errores.push(t('valCyclicDeps'));
    return { errores, advertencias, valido: errores.length === 0 };
}

function detectarCiclos() {
    const visitado = new Set(), enPila = new Set();
    function dfs(id) {
        if (enPila.has(id)) return true;
        if (visitado.has(id)) return false;
        visitado.add(id);
        enPila.add(id);
        const act = actividades.find(a => a.id === id);
        if (act?.predecesoras?.some(p => dfs(p))) return true;
        enPila.delete(id);
        return false;
    }
    return actividades.some(a => dfs(a.id));
}

function mostrarValidaciones() {
    const panel = document.getElementById('panelValidaciones');
    const lista = document.getElementById('listaValidaciones');
    if (!panel || !lista) return;
    const { errores, advertencias, valido } = validarProyecto();
    lista.innerHTML = '';
    errores.forEach(msg => {
        const li = document.createElement('li');
        li.textContent = msg;
        li.style.color = '#dc2626';
        lista.appendChild(li);
    });
    advertencias.forEach(msg => {
        const li = document.createElement('li');
        li.textContent = msg;
        li.style.color = '#d97706';
        lista.appendChild(li);
    });
    if (!errores.length && !advertencias.length) {
        lista.innerHTML = `<li style="color:#16a34a">${t('validationOk')}</li>`;
    }
    panel.classList.toggle('visible', errores.length > 0 || advertencias.length > 0);
    panel.classList.toggle('ok', valido && !advertencias.length);
    panel.classList.toggle('error', errores.length > 0);
}

function abrirModalEditar(id) {
    const act = actividades.find(a => a.id === id);
    if (!act) return;
    document.getElementById('editActId').value = id;
    document.getElementById('editNombre').value = act.nombre;
    document.getElementById('editDuracion').value = act.duracion;
    document.getElementById('editPresupuesto').value = act.presupuesto;
    const sel = document.getElementById('editPredecesoras');
    sel.innerHTML = '';
    actividades.filter(a => a.id !== id).forEach(a => {
        const o = document.createElement('option');
        o.value = a.id;
        o.textContent = `${a.id} - ${a.nombre}`;
        o.selected = (act.predecesoras || []).includes(a.id);
        sel.appendChild(o);
    });
    document.getElementById('modalEditar').classList.add('activo');
}

function cerrarModalEditar() {
    document.getElementById('modalEditar')?.classList.remove('activo');
}

function guardarEdicionActividad() {
    const id = parseInt(document.getElementById('editActId').value);
    const act = actividades.find(a => a.id === id);
    if (!act) return;
    act.nombre = document.getElementById('editNombre').value.trim();
    act.duracion = parseInt(document.getElementById('editDuracion').value) || act.duracion;
    act.presupuesto = parseFloat(document.getElementById('editPresupuesto').value) || 0;
    act.predecesoras = Array.from(document.getElementById('editPredecesoras').selectedOptions).map(o => parseInt(o.value));
    act.porcentajes = {};
    cerrarModalEditar();
    actualizarSelectDependencias();
    calcularTodo();
}

function getEstadoProyecto() {
    return {
        version: 2,
        actividades,
        projectStartDate: projectStartDate ? projectStartDate.toISOString().slice(0, 10) : null,
        nombreProyecto: document.getElementById('nombreProyecto')?.value || '',
        unidadTiempo, modoAvance, idioma, moneda, periodosEVM, diaCorte, escenarioETC,
        holguraPorcentaje, calendarioActivo, diasLaborables, anioFeriados,
        diasNoLaborablesCustom, bitacoraHtml
    };
}

function aplicarEstadoProyecto(estado) {
    if (!estado) return;
    actividades = estado.actividades || [];
    projectStartDate = estado.projectStartDate ? new Date(estado.projectStartDate + 'T00:00:00') : null;
    if (document.getElementById('nombreProyecto')) document.getElementById('nombreProyecto').value = estado.nombreProyecto || '';
    if (document.getElementById('fechaInicioProyecto')) document.getElementById('fechaInicioProyecto').value = estado.projectStartDate || '';
    unidadTiempo = estado.unidadTiempo || 'dias';
    modoAvance = estado.modoAvance || 'planeado';
    idioma = estado.idioma || 'es';
    moneda = estado.moneda || 'S/.';
    periodosEVM = estado.periodosEVM || [];
    diaCorte = estado.diaCorte || 1;
    escenarioETC = estado.escenarioETC || 'probable';
    holguraPorcentaje = !!estado.holguraPorcentaje;
    calendarioActivo = !!estado.calendarioActivo;
    diasLaborables = estado.diasLaborables || [1, 2, 3, 4, 5];
    anioFeriados = estado.anioFeriados || new Date().getFullYear();
    diasNoLaborablesCustom = estado.diasNoLaborablesCustom || [];
    bitacoraHtml = estado.bitacoraHtml || '';
    document.getElementById('unidadTiempo').value = unidadTiempo;
    document.getElementById('modoAvance').value = modoAvance;
    document.getElementById('idioma').value = idioma;
    document.getElementById('moneda').value = moneda;
    document.getElementById('escenarioETC').value = escenarioETC;
    const holgEl = document.getElementById('holguraPorcentaje');
    if (holgEl) holgEl.checked = holguraPorcentaje;
    const calEl = document.getElementById('calendarioActivo');
    if (calEl) { calEl.checked = calendarioActivo; togglePanelCalendario(); }
    document.querySelectorAll('.dia-lab input[data-dow]').forEach(cb => {
        cb.checked = diasLaborables.includes(parseInt(cb.dataset.dow));
    });
    if (document.getElementById('anioFeriados')) document.getElementById('anioFeriados').value = anioFeriados;
    actualizarFeriados();
    sincronizarBitacoraUI();
    actualizarSelectDependencias();
    cambiarIdioma();
    calcularTodo();
}

function guardarProyecto() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(getEstadoProyecto()));
    } catch (e) { /* ignore */ }
}

function exportarProyectoJSON() {
    const blob = new Blob([JSON.stringify(getEstadoProyecto(), null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = (document.getElementById('nombreProyecto')?.value || 'TB1_Proyecto').replace(/\s+/g, '_') + '.json';
    a.click();
}

function cargarProyecto(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
        try {
            aplicarEstadoProyecto(JSON.parse(e.target.result));
            alert(t('valLoaded'));
        } catch (err) {
            alert(idioma === 'es' ? 'Error al leer el archivo.' : 'Error reading file.');
        }
    };
    reader.readAsText(file);
    event.target.value = '';
}

function cargarProyectoEjemplo() {
    const hoy = new Date();
    const iso = hoy.toISOString().slice(0, 10);
    aplicarEstadoProyecto({
        nombreProyecto: idioma === 'es' ? 'Edificio Residencial Demo' : 'Residential Building Demo',
        projectStartDate: iso,
        unidadTiempo: 'dias', modoAvance: 'planeado', idioma, moneda,
        actividades: [
            { id: 1, nombre: idioma === 'es' ? 'Excavación' : 'Excavation', duracion: 5, presupuesto: 15000, predecesoras: [], porcentajes: {}, ES: 0, EF: 0, LS: 0, LF: 0, holgura: 0, esCritica: false },
            { id: 2, nombre: idioma === 'es' ? 'Cimentación' : 'Foundation', duracion: 8, presupuesto: 45000, predecesoras: [1], porcentajes: {}, ES: 0, EF: 0, LS: 0, LF: 0, holgura: 0, esCritica: false },
            { id: 3, nombre: idioma === 'es' ? 'Estructura' : 'Structure', duracion: 20, presupuesto: 120000, predecesoras: [2], porcentajes: {}, ES: 0, EF: 0, LS: 0, LF: 0, holgura: 0, esCritica: false },
            { id: 4, nombre: idioma === 'es' ? 'Instalaciones' : 'MEP', duracion: 12, presupuesto: 55000, predecesoras: [3], porcentajes: {}, ES: 0, EF: 0, LS: 0, LF: 0, holgura: 0, esCritica: false },
            { id: 5, nombre: idioma === 'es' ? 'Acabados' : 'Finishes', duracion: 10, presupuesto: 35000, predecesoras: [4], porcentajes: {}, ES: 0, EF: 0, LS: 0, LF: 0, holgura: 0, esCritica: false }
        ],
        periodosEVM: [], diaCorte: 1, escenarioETC: 'probable',
        holguraPorcentaje: false, calendarioActivo: false,
        diasLaborables: [1, 2, 3, 4, 5], anioFeriados: hoy.getFullYear(),
        diasNoLaborablesCustom: [], bitacoraHtml: ''
    });
}

function togglePanelCalendario() {
    const panel = document.getElementById('panelCalendario');
    if (panel) panel.style.display = calendarioActivo ? 'block' : 'none';
}

function iniciarAutoSave() {
    if (autoSaveTimer) clearInterval(autoSaveTimer);
    autoSaveTimer = setInterval(() => guardarProyecto(), 30000);
}

function getNombreProyecto() {
    return document.getElementById('nombreProyecto')?.value?.trim() || (idioma === 'es' ? 'Proyecto sin nombre' : 'Untitled project');
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('fechaInicioProyecto').addEventListener('change', e => {
        projectStartDate = e.target.value ? new Date(e.target.value + 'T00:00:00') : null;
        calcularTodo();
    });
    document.getElementById('unidadTiempo').addEventListener('change', e => {
        unidadTiempo = e.target.value;
        actividades.forEach(a => a.porcentajes = {});
        calcularTodo();
    });
    document.getElementById('modoAvance').addEventListener('change', e => {
        modoAvance = e.target.value;
        actividades.forEach(a => a.porcentajes = {});
        actualizarHintGantt();
        calcularTodo();
    });
    document.getElementById('idioma').addEventListener('change', e => {
        idioma = e.target.value;
        cambiarIdioma();
    });
    document.getElementById('moneda').addEventListener('change', e => {
        moneda = e.target.value;
        renderTabla();
        renderGantt();
        renderTablaEVM();
        generarAnalisisGerencial();
    });
    document.getElementById('escenarioETC').addEventListener('change', e => {
        escenarioETC = e.target.value;
        generarAnalisisGerencial();
    });
    const holgEl = document.getElementById('holguraPorcentaje');
    if (holgEl) holgEl.addEventListener('change', e => { holguraPorcentaje = e.target.checked; renderTabla(); });
    const calEl = document.getElementById('calendarioActivo');
    if (calEl) calEl.addEventListener('change', e => { calendarioActivo = e.target.checked; togglePanelCalendario(); calcularTodo(); });
    document.getElementById('anioFeriados')?.addEventListener('change', e => { anioFeriados = parseInt(e.target.value) || anioFeriados; actualizarFeriados(); calcularTodo(); });
    document.getElementById('departamentosFeriados')?.addEventListener('change', () => { actualizarFeriados(); calcularTodo(); });
    document.querySelectorAll('.dia-lab input[data-dow]').forEach(cb => {
        cb.addEventListener('change', () => {
            diasLaborables = Array.from(document.querySelectorAll('.dia-lab input[data-dow]:checked')).map(c => parseInt(c.dataset.dow));
            if (!diasLaborables.length) diasLaborables = [1, 2, 3, 4, 5];
            calcularTodo();
        });
    });
    document.getElementById('modalEditar')?.addEventListener('click', e => { if (e.target.id === 'modalEditar') cerrarModalEditar(); });
    document.getElementById('modalBitacora')?.addEventListener('click', e => { if (e.target.id === 'modalBitacora') cerrarModalBitacora(); });
    inicializarCalendarioUI();
    inicializarBitacora();
    iniciarAutoSave();
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) aplicarEstadoProyecto(JSON.parse(saved));
        else {
            const bit = localStorage.getItem(BITACORA_KEY);
            if (bit) { bitacoraHtml = bit; sincronizarBitacoraUI(); }
        }
    } catch (e) { /* ignore */ }
    openTab(0);
    cambiarIdioma();
});

function actualizarHintGantt() {
    const el = document.getElementById('ganttHintText');
    if (el) el.textContent = modoAvance === 'planeado' ? t('ganttHintPlanned') : t('ganttHintReal');
}

function openTab(n) {
    tabActual = n;
    for (let i = 0; i <= 3; i++) {
        const tab = document.getElementById('tab' + i);
        if (tab) tab.style.display = n === i ? 'block' : 'none';
    }
    document.querySelectorAll('.tabs .tab').forEach((tab, i) => tab.classList.toggle('active', i === n));
    if (n === 1) {
        generarPeriodosEVM();
        renderTablaEVM();
        generarAnalisisGerencial();
        renderGantt();
    }
    if (n === 2) generarInformeEjecutivo();
    if (n === 3) sincronizarBitacoraUI();
}

function cambiarIdioma() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const k = el.getAttribute('data-i18n');
        if (traducciones[idioma][k]) el.textContent = traducciones[idioma][k];
    });
    actualizarHintGantt();
    renderTabla();
    renderGantt();
    mostrarRutaCritica();
    renderTablaEVM();
    generarAnalisisGerencial();
}

function onCorteChange() {
    diaCorte = parseInt(document.getElementById('diaCorte').value) || 1;
    renderTablaEVM();
    generarAnalisisGerencial();
}

function onEscenarioETCChange() {
    escenarioETC = document.getElementById('escenarioETC').value;
    generarAnalisisGerencial();
}

function actualizarSelectorCorte() {
    const sel = document.getElementById('diaCorte');
    if (!sel) return;
    const total = periodosEVM.length;
    sel.innerHTML = '';
    for (let i = 1; i <= total; i++) {
        const o = document.createElement('option');
        o.value = i;
        o.textContent = getEtiquetaTiempo(i);
        sel.appendChild(o);
    }
    if (diaCorte > total) diaCorte = total || 1;
    sel.value = diaCorte;
}

function getDatosCorte() {
    const idx = Math.min(diaCorte, periodosEVM.length) - 1;
    if (idx < 0) return { pv: 0, ev: 0, ac: 0, bac: 0, idx: -1 };
    const p = periodosEVM[idx];
    const bac = actividades.reduce((s, a) => s + (parseFloat(a.presupuesto) || 0), 0);
    return { pv: p.pptoAcum, ev: p.trabajoAcum, ac: p.costoAcum, bac, idx };
}

function distribuirPorcentajesIgual(act) {
    act.porcentajes = {};
    const n = act.duracion;
    if (n <= 0) return;
    const base = Math.floor(100 / n);
    let resto = 100 - base * n;
    for (let i = act.ES; i < act.EF; i++) {
        act.porcentajes[i] = base + (resto > 0 ? 1 : 0);
        if (resto > 0) resto--;
    }
}

function agregarActividad() {
    const nombre = document.getElementById('actividad').value.trim();
    const duracion = parseInt(document.getElementById('duracion').value);
    const presupuesto = parseFloat(document.getElementById('presupuesto').value) || 0;
    const predecesoras = Array.from(document.getElementById('dependencia').selectedOptions).map(o => parseInt(o.value));
    if (!nombre || !duracion || !projectStartDate) {
        alert(t('alertFillFields'));
        return;
    }
    actividades.push({
        id: actividades.length + 1,
        nombre,
        duracion,
        presupuesto,
        predecesoras,
        porcentajes: {},
        ES: 0,
        EF: 0,
        LS: 0,
        LF: 0,
        holgura: 0,
        esCritica: false
    });
    document.getElementById('actividad').value = '';
    document.getElementById('duracion').value = '';
    document.getElementById('presupuesto').value = '';
    actualizarSelectDependencias();
    calcularTodo();
}

function actualizarSelectDependencias() {
    const sel = document.getElementById('dependencia');
    sel.innerHTML = '';
    actividades.forEach(a => {
        const o = document.createElement('option');
        o.value = a.id;
        o.textContent = `${a.id} - ${a.nombre}`;
        sel.appendChild(o);
    });
}

function eliminarActividad(id) {
    if (!confirm(t('confirmDeleteOne'))) return;
    actividades = actividades.filter(a => a.id !== id);
    actividades.forEach(a => {
        a.predecesoras = (a.predecesoras || []).filter(p => p !== id);
    });
    actualizarSelectDependencias();
    calcularTodo();
}

function eliminarTodasActividades() {
    if (!confirm(t('confirmDeleteAll'))) return;
    actividades = [];
    periodosEVM = [];
    actualizarSelectDependencias();
    calcularTodo();
}

function actualizarPresupuesto(id, val) {
    const a = actividades.find(x => x.id === id);
    if (a) {
        a.presupuesto = parseFloat(val) || 0;
        calcularTodo();
    }
}

function actualizarPorcentaje(actId, periodo, val) {
    const act = actividades.find(a => a.id === actId);
    if (!act) return;
    act.porcentajes[periodo] = parseFloat(val) || 0;
    calcularTodo();
}

function getSumaPorcentajes(act) {
    let s = 0;
    for (let i = act.ES; i < act.EF; i++) s += parseFloat(act.porcentajes[i]) || 0;
    return s;
}

function getValorCelda(act, periodo) {
    if (periodo < act.ES || periodo >= act.EF) return 0;
    const pct = parseFloat(act.porcentajes[periodo]) || 0;
    const pres = parseFloat(act.presupuesto) || 0;
    if (modoAvance === 'planeado') return pres * (pct / 100);
    return getPVPeriodo(act, periodo);
}

function calcularAvancePeriodoDesdeGantt(periodo) {
    if (modoAvance !== 'real') return null;
    let totalPpto = 0, sumaPonderada = 0;
    actividades.forEach(act => {
        if (periodo >= act.ES && periodo < act.EF) {
            const pptoAct = getPVPeriodo(act, periodo);
            const pct = parseFloat(act.porcentajes[periodo]) || 0;
            totalPpto += pptoAct;
            sumaPonderada += pptoAct * pct;
        }
    });
    return totalPpto > 0 ? sumaPonderada / totalPpto : 0;
}

function esCeldaEditable(i, a) { return i >= a.ES && i < a.EF; }

function esCeldaHolgura(i, a) {
    return (a.LS > a.ES && i >= a.ES && i < a.LS) || (a.LF > a.EF && i >= a.EF && i < a.LF);
}

function calcularTodo() {
    mostrarValidaciones();
    if (!actividades.length || !projectStartDate) {
        mapaCalendario = [];
        diasCalendarioGantt = [];
        renderTabla();
        renderGantt();
        document.getElementById('rutaCritica').textContent = t('criticalPathEmpty');
        document.getElementById('rutaCritica')?.classList.remove('resaltada');
        generarPeriodosEVM();
        generarAnalisisGerencial();
        return;
    }
    calcularForwardPass();
    calcularBackwardPass();
    calcularHolguraYCritica();
    construirMapaCalendario();
    actividades.forEach(a => {
        if (Object.keys(a.porcentajes).length === 0 || (modoAvance === 'planeado' && getSumaPorcentajes(a) === 0)) {
            distribuirPorcentajesIgual(a);
        }
    });
    calcularSumaGantt();
    renderTabla();
    renderGantt();
    mostrarRutaCritica();
    generarPeriodosEVM();
    generarAnalisisGerencial();
    if (tabActual === 2) generarInformeEjecutivo();
    guardarProyecto();
}

function calcularForwardPass() {
    let c = true, g = 0;
    while (c && g++ < 100) {
        c = false;
        actividades.forEach(act => {
            let ES = 0;
            if (act.predecesoras?.length) {
                const preds = actividades.filter(a => act.predecesoras.includes(a.id));
                if (preds.length === act.predecesoras.length) ES = Math.max(...preds.map(p => p.EF));
            }
            const EF = ES + act.duracion;
            if (act.ES !== ES || act.EF !== EF) {
                act.ES = ES;
                act.EF = EF;
                c = true;
            }
        });
    }
}

function calcularBackwardPass() {
    const total = Math.max(...actividades.map(a => a.EF), 0);
    actividades.forEach(a => {
        a.LF = total;
        a.LS = total - a.duracion;
    });
    let c = true, g = 0;
    while (c && g++ < 100) {
        c = false;
        for (let i = actividades.length - 1; i >= 0; i--) {
            const act = actividades[i];
            const suc = actividades.filter(s => s.predecesoras?.includes(act.id));
            let LF = total;
            if (suc.length) LF = Math.min(...suc.map(s => s.LS));
            const LS = LF - act.duracion;
            if (act.LF !== LF || act.LS !== LS) {
                act.LF = LF;
                act.LS = LS;
                c = true;
            }
        }
    }
}

function calcularHolguraYCritica() {
    actividades.forEach(a => {
        a.holgura = a.LS - a.ES;
        a.esCritica = a.holgura === 0;
    });
}

function calcularSumaGantt() {
    const maxP = Math.max(...actividades.map(a => a.LF), 0);
    sumaPeriodo = [];
    sumaAcumulada = [];
    let acum = 0;
    for (let i = 0; i < maxP; i++) {
        const s = actividades.reduce((total, a) => {
            return total + (modoAvance === 'planeado' ? getValorCelda(a, i) : getPVPeriodo(a, i));
        }, 0);
        sumaPeriodo.push(s);
        acum += s;
        sumaAcumulada.push(acum);
    }
}

function renderTabla() {
    const tbody = document.getElementById('tablaActividades');
    tbody.innerHTML = '';
    const totalDur = Math.max(...actividades.map(a => a.EF), 0);
    actividades.forEach(act => {
        const preds = act.predecesoras?.length ? act.predecesoras.join(', ') : '-';
        const sumPct = getSumaPorcentajes(act);
        const pctOk = modoAvance === 'real' || Math.abs(sumPct - 100) < 0.01;
        let holguraTxt = act.holgura;
        if (holguraPorcentaje && totalDur > 0) {
            holguraTxt = `${act.holgura} (${((act.holgura / totalDur) * 100).toFixed(1)}%)`;
        }
        const tr = document.createElement('tr');
        if (act.esCritica) tr.classList.add('fila-critica');
        tr.innerHTML = `
            <td>${act.id}</td><td>${act.nombre}</td>
            <td>${act.duracion} ${getUnidadLabel()}</td>
            <td><input type="number" min="0" step="0.01" value="${act.presupuesto}" class="input-tabla"
                onchange="actualizarPresupuesto(${act.id}, this.value)"></td>
            <td>${preds}</td>
            <td>${getFechaInicioActividad(act)}</td><td>${getFechaFinActividad(act)}</td>
            <td>${act.ES}</td><td>${act.EF}</td><td>${act.LS}</td><td>${act.LF}</td>
            <td class="${act.esCritica ? 'holgura-cero' : 'holgura-normal'}">${holguraTxt}</td>
            <td>${act.esCritica ? `<span class="badge-critica">${t('statusCritical')}</span>` : `<span class="badge-normal">${t('statusNormal')}</span>`}</td>
            <td class="${pctOk ? 'pct-ok' : 'pct-error'}">${modoAvance === 'real' ? '-' : sumPct.toFixed(1) + '% ' + (pctOk ? '✓' : '✗')}</td>
            <td>
                <button class="btn-editar no-print" onclick="abrirModalEditar(${act.id})">✎</button>
                <button class="btn-eliminar no-print" onclick="eliminarActividad(${act.id})">X</button>
            </td>`;
        tbody.appendChild(tr);
    });
}

function renderGantt() {
    const container = document.getElementById('ganttContainer');
    container.innerHTML = '';
    if (!actividades.length) {
        container.innerHTML = `<p class="mensaje-vacio">${t('ganttEmpty')}</p>`;
        return;
    }

    const maxP = Math.max(...actividades.map(a => a.LF), 0);
    const startDate = projectStartDate ? new Date(projectStartDate) : new Date();
    const usarCal = esCalendarioAplicable() && diasCalendarioGantt.length > 0;
    const numCols = usarCal ? diasCalendarioGantt.length : maxP;
    const idxCorteGantt = tabActual === 1 && esCalendarioAplicable() && mapaCalendario[diaCorte - 1]
        ? getIndiceCalendarioGantt(mapaCalendario[diaCorte - 1]) : (tabActual === 1 ? diaCorte - 1 : -1);
    let html = '<table class="gantt-table"><thead>';

    if (unidadTiempo === 'dias') {
        html += '<tr><th rowspan="3" class="gantt-sticky">Actividad</th><th rowspan="3">Dur.</th><th rowspan="3">Ppto.</th>';
        for (let i = 0; i < numCols; i += 7) {
            const wd = usarCal ? diasCalendarioGantt[i] : (() => { const d = new Date(startDate); d.setDate(d.getDate() + i); return d; })();
            html += `<th colspan="${Math.min(7, numCols - i)}" class="gantt-header-mes">${String(wd.getDate()).padStart(2, '0')}/${String(wd.getMonth() + 1).padStart(2, '0')}/${wd.getFullYear()}</th>`;
        }
        html += '</tr><tr>';
        for (let i = 0; i < numCols; i++) {
            const f = usarCal ? diasCalendarioGantt[i] : (() => { const d = new Date(startDate); d.setDate(d.getDate() + i); return d; })();
            const noLab = usarCal && !esDiaLaborable(f);
            html += `<th class="gantt-header-dia ${noLab ? 'gantt-header-no-laboral' : ''}">${f.getDate()}</th>`;
        }
        html += '</tr><tr>';
        const ds = idioma === 'es' ? ['D', 'L', 'Ma', 'Mi', 'J', 'V', 'S'] : ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
        for (let i = 0; i < numCols; i++) {
            const f = usarCal ? diasCalendarioGantt[i] : (() => { const d = new Date(startDate); d.setDate(d.getDate() + i); return d; })();
            const noLab = usarCal && !esDiaLaborable(f);
            html += `<th class="gantt-header-sem ${noLab ? 'gantt-header-no-laboral' : ''}">${ds[f.getDay()]}</th>`;
        }
        html += '</tr>';
    } else {
        html += `<tr><th class="gantt-sticky">${t('colActivity')}</th><th>Dur.</th><th>Ppto.</th>`;
        for (let i = 0; i < maxP; i++) html += `<th>${getEtiquetaTiempo(i + 1)}</th>`;
        html += '</tr>';
    }
    html += '</thead><tbody>';

    actividades.forEach(act => {
        const filaCrit = act.esCritica ? ' gantt-fila-critica' : '';
        html += `<tr class="${filaCrit}"><td class="gantt-sticky">${act.id} - ${act.nombre}</td><td>${act.duracion}</td><td class="gantt-ppto">${formatearMoneda(act.presupuesto)}</td>`;
        for (let i = 0; i < numCols; i++) {
            const periodo = usarCal ? getPeriodoDesdeIndiceGantt(i) : i;
            const fCal = usarCal ? diasCalendarioGantt[i] : null;
            const noLab = usarCal && fCal && !esDiaLaborable(fCal);
            const esCorte = i === idxCorteGantt;
            let clsExtra = esCorte ? ' gantt-celda-corte' : '';
            if (noLab && periodo < 0) {
                html += `<td class="gantt-celda-nolab${clsExtra}"></td>`;
            } else if (periodo >= 0 && esCeldaEditable(periodo, act)) {
                const critCls = act.esCritica ? ' gantt-celda-trabajo-critica' : '';
                const pct = act.porcentajes[periodo] ?? '';
                const val = modoAvance === 'planeado' ? getValorCelda(act, periodo) : '';
                html += `<td class="gantt-celda-trabajo${critCls}${clsExtra}">
                    <input type="number" min="0" max="100" step="0.1" value="${pct}" class="input-pct"
                        onchange="actualizarPorcentaje(${act.id}, ${periodo}, this.value)">
                    ${modoAvance === 'planeado' && val > 0 ? `<small class="valor-celda">${val.toFixed(0)}</small>` : ''}
                </td>`;
            } else if (periodo >= 0 && esCeldaHolgura(periodo, act)) {
                html += `<td class="gantt-celda-holgura${clsExtra}"></td>`;
            } else if (noLab) {
                html += `<td class="gantt-celda-nolab${clsExtra}"></td>`;
            } else {
                html += `<td class="gantt-celda-vacia${clsExtra}"></td>`;
            }
        }
        html += '</tr>';
    });

    html += `<tr class="fila-suma"><td class="gantt-sticky" colspan="3"><strong>${getLabelSumaPeriodo()}</strong></td>`;
    for (let i = 0; i < numCols; i++) {
        const p = usarCal ? getPeriodoDesdeIndiceGantt(i) : i;
        html += `<td><strong>${p >= 0 ? (sumaPeriodo[p] || 0).toFixed(0) : ''}</strong></td>`;
    }
    html += '</tr>';
    html += `<tr class="fila-acumulada"><td class="gantt-sticky" colspan="3"><strong>${t('accumulated')}</strong></td>`;
    for (let i = 0; i < numCols; i++) {
        const p = usarCal ? getPeriodoDesdeIndiceGantt(i) : i;
        html += `<td><strong>${p >= 0 ? (sumaAcumulada[p] || 0).toFixed(0) : ''}</strong></td>`;
    }
    html += '</tbody></table>';
    container.innerHTML = html;
}

function mostrarRutaCritica() {
    const el = document.getElementById('rutaCritica');
    const crit = actividades.filter(a => a.esCritica).sort((a, b) => a.ES - b.ES);
    const total = Math.max(...actividades.map(a => a.EF), 0);
    el?.classList.remove('resaltada');
    if (!crit.length) {
        el.textContent = t('criticalPathEmpty');
        return;
    }
    el.classList.add('resaltada');
    let r = t('start');
    crit.forEach(a => { r += ` → ${a.id}`; });
    el.innerHTML = `<strong>${t('criticalPath').toUpperCase()}</strong><br><br>${r} → ${t('end')}<br><br><strong>${t('totalDuration')}: ${total} ${getUnidadLabel()}</strong>`;
}

function generarPeriodosEVM() {
    const total = Math.max(...actividades.map(a => a.EF), 0);
    const ant = [...periodosEVM];
    const sinAct = document.getElementById('evmSinActividades');
    const wrap = document.getElementById('wrapperTablaEVM');

    if (!total) {
        periodosEVM = [];
        if (sinAct) sinAct.style.display = 'block';
        if (wrap) wrap.style.display = 'none';
        generarAnalisisGerencial();
        return;
    }
    if (sinAct) sinAct.style.display = 'none';
    if (wrap) wrap.style.display = 'block';

    periodosEVM = [];
    for (let i = 0; i < total; i++) {
        const prev = ant[i] || {};
        let avance = prev.avanceManual !== undefined ? prev.avance : (prev.avance ?? '');

        const avanceGantt = calcularAvancePeriodoDesdeGantt(i);
        if (modoAvance === 'real' && avanceGantt !== null && prev.avanceManual === undefined) {
            avance = avanceGantt.toFixed(2);
        }

        periodosEVM.push({
            tiempo: i + 1,
            avance: avance,
            avanceManual: prev.avanceManual,
            pptoParcial: sumaPeriodo[i] || 0,
            pptoAcum: 0,
            costoParcial: prev.costoParcial ?? '',
            costoAcum: 0,
            trabajoParcial: 0,
            trabajoAcum: 0
        });
    }
    recalcularEVM(true);
    actualizarSelectorCorte();
}

function recalcularEVM(reRenderTabla = true) {
    let pA = 0, cA = 0, tA = 0;
    periodosEVM.forEach(p => {
        const ppto = parseFloat(p.pptoParcial) || 0;
        const avance = parseFloat(p.avance) || 0;
        let costo = parseFloat(p.costoParcial) || 0;

        p.trabajoParcial = ppto * (avance / 100);

        if (avance === 0) {
            costo = 0;
            p.costoParcial = '';
        }

        pA += ppto;
        cA += costo;
        tA += p.trabajoParcial;
        p.pptoAcum = pA;
        p.costoAcum = cA;
        p.trabajoAcum = tA;
    });

    if (reRenderTabla) {
        renderTablaEVM();
    } else {
        actualizarFilasCalculadasEVM();
    }

    generarAnalisisGerencial();
}

function actualizarAvanceEVM(idx, val) {
    periodosEVM[idx].avance = val;
    if (val === '' || val === null) {
        delete periodosEVM[idx].avanceManual;
    } else {
        periodosEVM[idx].avanceManual = parseFloat(val);
    }
    recalcularEVM(false);
}

function actualizarCostoEVM(idx, val) {
    periodosEVM[idx].costoParcial = val;
    recalcularEVM(false);
}

function actualizarFilasCalculadasEVM() {
    periodosEVM.forEach((p, idx) => {
        const row = document.querySelector(`#tbodyEVMPeriodos tr[data-idx="${idx}"]`);
        if (!row) return;

        const av0 = (parseFloat(p.avance) || 0) === 0;
        const esCorte = (idx + 1) === diaCorte;

        row.classList.toggle('fila-corte', esCorte);
        row.cells[0].innerHTML = `${getEtiquetaTiempo(p.tiempo)}${esCorte ? ' ◀' : ''}`;
        row.cells[2].textContent = formatearMoneda(p.pptoParcial);
        row.cells[3].textContent = formatearMoneda(p.pptoAcum);

        const costInput = row.querySelector('.input-costo');
        if (costInput) {
            costInput.disabled = av0;
            costInput.title = av0 ? t('noCostIfZeroAdvance') : '';
        }

        row.cells[5].textContent = formatearMoneda(p.costoAcum);
        row.cells[6].textContent = formatearMoneda(p.trabajoParcial);
        row.cells[7].textContent = formatearMoneda(p.trabajoAcum);
    });
}

function renderTablaEVM() {
    const tbody = document.getElementById('tbodyEVMPeriodos');
    if (!tbody) return;

    tbody.innerHTML = '';
    periodosEVM.forEach((p, idx) => {
        const av0 = (parseFloat(p.avance) || 0) === 0;
        const esCorte = (idx + 1) === diaCorte;
        const tr = document.createElement('tr');
        tr.setAttribute('data-idx', idx);
        if (esCorte) tr.classList.add('fila-corte');

        tr.innerHTML = `
            <td>${getEtiquetaTiempo(p.tiempo)}${esCorte ? ' ◀' : ''}</td>
            <td>
                <input type="number" min="0" max="100" step="0.01"
                    value="${p.avance ?? ''}" class="input-tabla input-avance"
                    oninput="actualizarAvanceEVM(${idx}, this.value)">
            </td>
            <td>${formatearMoneda(p.pptoParcial)}</td>
            <td>${formatearMoneda(p.pptoAcum)}</td>
            <td>
                <input type="number" min="0" step="0.01"
                    value="${p.costoParcial ?? ''}" class="input-tabla input-costo"
                    ${av0 ? 'disabled' : ''} title="${av0 ? t('noCostIfZeroAdvance') : ''}"
                    oninput="actualizarCostoEVM(${idx}, this.value)">
            </td>
            <td>${formatearMoneda(p.costoAcum)}</td>
            <td>${formatearMoneda(p.trabajoParcial)}</td>
            <td>${formatearMoneda(p.trabajoAcum)}</td>`;

        tbody.appendChild(tr);
    });
}

function dibujarCurvaS() {
    const canvas = document.getElementById('curvaS');
    if (!canvas || typeof Chart === 'undefined' || !periodosEVM.length) return;
    if (chartCurvaS) chartCurvaS.destroy();

    const labels = periodosEVM.map(p => getEtiquetaTiempo(p.tiempo));
    const idxCorte = diaCorte - 1;

    const dataPV = periodosEVM.map(p => p.pptoAcum);
    const dataEV = periodosEVM.map((p, i) => i <= idxCorte ? p.trabajoAcum : null);
    const dataAC = periodosEVM.map((p, i) => i <= idxCorte ? p.costoAcum : null);

    const pluginCorte = {
        id: 'lineaCorteVertical',
        afterDraw(chart) {
            const { ctx, chartArea, scales } = chart;
            if (idxCorte < 0 || !scales.x) return;
            const x = scales.x.getPixelForValue(idxCorte);
            if (x < chartArea.left || x > chartArea.right) return;
            ctx.save();
            ctx.strokeStyle = '#f59e0b';
            ctx.lineWidth = 2;
            ctx.setLineDash([6, 4]);
            ctx.beginPath();
            ctx.moveTo(x, chartArea.top);
            ctx.lineTo(x, chartArea.bottom);
            ctx.stroke();
            ctx.fillStyle = '#f59e0b';
            ctx.font = 'bold 11px sans-serif';
            ctx.fillText(idioma === 'es' ? 'Corte' : 'Cutoff', x + 4, chartArea.top + 14);
            ctx.restore();
        }
    };

    chartCurvaS = new Chart(canvas, {
        type: 'line',
        plugins: [pluginCorte],
        data: {
            labels,
            datasets: [
                {
                    label: idioma === 'es' ? 'PV Acumulado (Plan)' : 'Accum. PV (Plan)',
                    data: dataPV,
                    borderColor: '#059669',
                    backgroundColor: 'rgba(5,150,105,0.08)',
                    borderWidth: 2.5,
                    tension: 0.3,
                    pointRadius: 3
                },
                {
                    label: idioma === 'es' ? 'EV Acumulado (Real)' : 'Accum. EV (Actual)',
                    data: dataEV,
                    borderColor: '#f97316',
                    borderWidth: 2.5,
                    tension: 0.3,
                    pointRadius: 4
                },
                {
                    label: idioma === 'es' ? 'AC Acumulado (Real)' : 'Accum. AC (Actual)',
                    data: dataAC,
                    borderColor: '#7c3aed',
                    borderWidth: 2.5,
                    tension: 0.3,
                    pointRadius: 4
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'top' },
                tooltip: {
                    callbacks: {
                        title: items => {
                            const i = items[0].dataIndex;
                            const marca = (i + 1) === diaCorte ? (idioma === 'es' ? ' ◀ Corte' : ' ◀ Cutoff') : '';
                            return labels[i] + marca;
                        },
                        label: ctx => ctx.raw !== null ? `${ctx.dataset.label}: ${formatearMoneda(ctx.raw)}` : ''
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: v => formatearMoneda(v)
                    }
                }
            }
        }
    });
}

function dibujarGraficaEscenarios(resultados) {
    const canvas = document.getElementById('graficaEscenarios');
    if (!canvas || typeof Chart === 'undefined' || !resultados.length) return;
    if (chartEscenarios) chartEscenarios.destroy();

    const labels = resultados.map(r => r.nombre);
    const colorSel = '#c8102e';
    const colorNormal = '#94a3b8';

    chartEscenarios = new Chart(canvas, {
        type: 'bar',
        data: {
            labels,
            datasets: [
                {
                    label: 'ETC',
                    data: resultados.map(r => r.etc),
                    backgroundColor: resultados.map(r => r.key === escenarioETC ? colorSel : colorNormal)
                },
                {
                    label: 'EAC',
                    data: resultados.map(r => r.eac),
                    backgroundColor: resultados.map(r => r.key === escenarioETC ? '#9c0d24' : '#cbd5e1')
                },
                {
                    label: 'VAC',
                    data: resultados.map(r => r.vac),
                    backgroundColor: resultados.map(r => r.key === escenarioETC ? '#dc2626' : '#e2e8f0')
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'top' },
                tooltip: {
                    callbacks: {
                        label: ctx => `${ctx.dataset.label}: ${formatearMoneda(ctx.raw)}`
                    }
                }
            },
            scales: {
                y: {
                    ticks: {
                        callback: v => formatearMoneda(v)
                    }
                }
            }
        }
    });
}

function generarAnalisisGerencial() {
    const elCron = document.getElementById('analisisCronograma');
    const elCosto = document.getElementById('analisisCosto');
    const elProy = document.getElementById('analisisProyecciones');
    if (!elCron || !elCosto || !elProy) return;

    const { pv, ev, ac, bac } = getDatosCorte();
    const duracionOriginal = Math.max(...actividades.map(a => a.EF), 0);
    const unidad = getUnidadLabel();
    const periodoLabel = getEtiquetaTiempo(diaCorte);

    document.getElementById('bacTotal').textContent = formatearMoneda(bac);
    document.getElementById('pvCorte').textContent = formatearMoneda(pv);
    document.getElementById('evCorte').textContent = formatearMoneda(ev);
    document.getElementById('acCorte').textContent = formatearMoneda(ac);

    const spi = pv > 0 ? ev / pv : 0;
    const cpi = ac > 0 ? ev / ac : 0;
    const sv = ev - pv;
    const cv = ev - ac;
    const tcpiBac = (bac - ac) > 0 ? (bac - ev) / (bac - ac) : 0;
    const etcSel = getETCEscenario(escenarioETC, bac, ev, cpi, spi);
    const eacSel = ac + etcSel;
    const tcpiEac = (eacSel - ac) > 0 ? (bac - ev) / (eacSel - ac) : 0;
    const avanceCronPct = (spi - 1) * 100;
    const sobrecostoPct = ev > 0 ? ((ac - ev) / ev) * 100 : 0;
    const costoPorUnidadEV = cpi > 0 ? (1 / cpi) : 0;

    const tiempoEstimado = spi > 0 ? duracionOriginal / spi : 0;
    const retraso = Math.max(0, tiempoEstimado - duracionOriginal);

    document.getElementById('spi').textContent = spi.toFixed(3);
    document.getElementById('cpi').textContent = cpi.toFixed(3);
    document.getElementById('sv').textContent = formatearMoneda(sv);
    document.getElementById('cv').textContent = formatearMoneda(cv);
    const elTcpiBac = document.getElementById('tcpiBac');
    const elTcpiEac = document.getElementById('tcpiEac');
    const elAvCron = document.getElementById('avanceCronPct');
    const elSobre = document.getElementById('sobrecostoPct');
    const elInterpExtra = document.getElementById('interpretacionIndicadoresExtra');
    if (elTcpiBac) elTcpiBac.textContent = tcpiBac.toFixed(3);
    if (elTcpiEac) elTcpiEac.textContent = tcpiEac.toFixed(3);
    if (elAvCron) elAvCron.textContent = `${avanceCronPct.toFixed(1)}%`;
    if (elSobre) elSobre.textContent = `${sobrecostoPct.toFixed(1)}%`;
    if (elInterpExtra) {
        elInterpExtra.innerHTML = idioma === 'es'
            ? `<strong>Indicadores extendidos al ${periodoLabel}:</strong><br>
                TCPI (BAC) = ${tcpiBac.toFixed(3)} — ${tcpiBac <= 1 ? 'rendimiento futuro alcanzable para cumplir BAC.' : 'se requiere mejorar eficiencia de costo para no exceder BAC.'}<br>
                TCPI (EAC) = ${tcpiEac.toFixed(3)} — según EAC proyectado (${formatearMoneda(eacSel)}).<br>
                Avance cronograma = (SPI−1)×100 = <strong>${avanceCronPct.toFixed(1)}%</strong> — ${avanceCronPct >= 0 ? 'adelanto respecto al plan.' : 'retraso respecto al plan.'}<br>
                Sobrecosto = ((AC−EV)/EV)×100 = <strong>${sobrecostoPct.toFixed(1)}%</strong> — ${sobrecostoPct <= 0 ? 'bajo presupuesto en valor ganado.' : 'gasto superior al valor ganado.'}`
            : `<strong>Extended indicators at ${periodoLabel}:</strong><br>
                TCPI (BAC) = ${tcpiBac.toFixed(3)} | TCPI (EAC) = ${tcpiEac.toFixed(3)} (EAC ${formatearMoneda(eacSel)})<br>
                Schedule advance = ${avanceCronPct.toFixed(1)}% | Cost overrun = ${sobrecostoPct.toFixed(1)}%`;
    }

    if (idioma === 'es') {
        elCron.innerHTML = `
            <p><strong>Periodo analizado:</strong> ${periodoLabel}</p>
            <p><strong>SV = EV − PV =</strong> ${formatearMoneda(ev)} − ${formatearMoneda(pv)} = <span class="${sv >= 0 ? 'txt-ok' : 'txt-bad'}">${formatearMoneda(sv)}</span></p>
            <p><strong>SPI = EV / PV =</strong> ${formatearMoneda(ev)} / ${formatearMoneda(pv)} = <strong>${spi.toFixed(3)}</strong></p>
            <p class="interpretacion-texto">
                ${sv >= 0
                    ? `La obra <strong>no presenta retraso</strong> al ${periodoLabel.toLowerCase()}. El valor ganado supera o iguala lo planificado, con un excedente de trabajo equivalente a ${formatearMoneda(Math.abs(sv))}.`
                    : `La obra se encuentra <strong>atrasada en el cronograma</strong>. Existe un retraso equivalente a <strong>${formatearMoneda(Math.abs(sv))}</strong> de trabajo no ejecutado respecto a lo planificado (PV).`}
                <br><br>
                El SPI de <strong>${spi.toFixed(3)}</strong> indica que el proyecto avanza al <strong>${(spi * 100).toFixed(1)}%</strong> de la velocidad planificada.
                ${spi < 1
                    ? `Es decir, por cada ${moneda} 1.00 planificado, solo se está generando ${moneda} ${spi.toFixed(3)} de avance real. Si se mantiene este ritmo, <strong>no se terminará a tiempo</strong> el proyecto.`
                    : `El ritmo de avance es igual o superior al planificado.`}
            </p>
            <p><strong>Tiempo estimado de culminación = Duración original / SPI =</strong> ${duracionOriginal} / ${spi.toFixed(3)} = <strong>${tiempoEstimado.toFixed(1)} ${unidad}</strong></p>
            <p><strong>Retraso estimado ≈</strong> <span class="${retraso > 0 ? 'txt-bad' : 'txt-ok'}">${retraso.toFixed(1)} ${unidad}</span>
                ${retraso > 0
                    ? `(en lugar de ${duracionOriginal} ${unidad} planificados, se estima ${tiempoEstimado.toFixed(1)} ${unidad})`
                    : `(no se proyecta retraso adicional respecto al plan)`}
            </p>
        `;

        elCosto.innerHTML = `
            <p><strong>Periodo analizado:</strong> ${periodoLabel}</p>
            <p><strong>CV = EV − AC =</strong> ${formatearMoneda(ev)} − ${formatearMoneda(ac)} = <span class="${cv >= 0 ? 'txt-ok' : 'txt-bad'}">${formatearMoneda(cv)}</span></p>
            <p><strong>CPI = EV / AC =</strong> ${formatearMoneda(ev)} / ${formatearMoneda(ac)} = <strong>${cpi.toFixed(3)}</strong></p>
            <p class="interpretacion-texto">
                ${cv >= 0
                    ? `El proyecto está <strong>bajo presupuesto</strong>. Se ha generado ${formatearMoneda(Math.abs(cv))} más de valor del trabajo ejecutado (EV) de lo que se ha gastado (AC).`
                    : `Se ha gastado <strong>${formatearMoneda(Math.abs(cv))} más</strong> de lo que corresponde por el valor del trabajo realmente ejecutado (EV). La obra acumula un <strong>sobrecosto</strong> de ${formatearMoneda(Math.abs(cv))} al ${periodoLabel.toLowerCase()}.`}
                <br><br>
                Por cada ${moneda} 1.00 invertido, solo se está generando aproximadamente <strong>${moneda} ${cpi.toFixed(3)}</strong> de avance real (eficiencia de costo: ${(cpi * 100).toFixed(1)}%).
                ${cpi < 1
                    ? `Visto de otra manera, para obtener ${formatearMoneda(ev)} de valor ganado, se han gastado ${formatearMoneda(ac)} (≈ ${moneda} ${costoPorUnidadEV.toFixed(2)} por cada ${moneda} 1.00 de EV).`
                    : ''}
            </p>
            <p><strong>TCPI (BAC) = (BAC − EV) / (BAC − AC) =</strong> (${formatearMoneda(bac)} − ${formatearMoneda(ev)}) / (${formatearMoneda(bac)} − ${formatearMoneda(ac)}) = <strong>${tcpiBac.toFixed(3)}</strong></p>
            <p class="interpretacion-texto">
                ${tcpiBac <= 1
                    ? `Se necesita un rendimiento de ${tcpiBac.toFixed(3)} para terminar dentro del presupuesto. El desempeño futuro requerido es alcanzable.`
                    : `Se necesita un rendimiento de <strong>${tcpiBac.toFixed(3)}</strong>: por cada ${moneda} 1.00 que se invierta de aquí en adelante, se debe generar ${moneda} ${tcpiBac.toFixed(2)} de valor para cumplir con el BAC.`}
            </p>
            <p><strong>TCPI (EAC) = (BAC − EV) / (EAC − AC) =</strong> <strong>${tcpiEac.toFixed(3)}</strong> (EAC = ${formatearMoneda(eacSel)})</p>
            <p><strong>Avance cronograma % = (SPI−1)×100 =</strong> ${avanceCronPct.toFixed(1)}% | <strong>Sobrecosto % =</strong> ${sobrecostoPct.toFixed(1)}%</p>
            <p><strong>Estado general:</strong>
                ${(spi < 1 && cpi < 1)
                    ? '🔴 Proyecto en estado CRÍTICO: desviaciones negativas en tiempo y costo.'
                    : (spi < 1 || cpi < 1)
                        ? '🟡 Proyecto con desviación en tiempo o costo.'
                        : '🟢 Proyecto dentro de parámetros planificados.'}
            </p>
        `;
    } else {
        elCron.innerHTML = `
            <p><strong>Analyzed period:</strong> ${periodoLabel}</p>
            <p><strong>SV = EV − PV =</strong> ${formatearMoneda(sv)} | <strong>SPI =</strong> ${spi.toFixed(3)}</p>
            <p class="interpretacion-texto">
                ${spi >= 1
                    ? 'Project is on or ahead of schedule.'
                    : `Project is behind schedule. Running at ${(spi * 100).toFixed(1)}% of planned speed. Delay equivalent to ${formatearMoneda(Math.abs(sv))} of unexecuted work.`}
            </p>
            <p><strong>Estimated completion time:</strong> ${tiempoEstimado.toFixed(1)} ${unidad} | <strong>Estimated delay:</strong> ${retraso.toFixed(1)} ${unidad}</p>
        `;

        elCosto.innerHTML = `
            <p><strong>Analyzed period:</strong> ${periodoLabel}</p>
            <p><strong>CV = EV − AC =</strong> ${formatearMoneda(cv)} | <strong>CPI =</strong> ${cpi.toFixed(3)}</p>
            <p class="interpretacion-texto">
                ${cpi >= 1
                    ? 'Project is under budget.'
                    : `Over budget by ${formatearMoneda(Math.abs(cv))}. For every ${moneda} 1.00 spent, only ${moneda} ${cpi.toFixed(3)} of real progress is generated.`}
            </p>
            <p><strong>TCPI (BAC) =</strong> ${tcpiBac.toFixed(3)} | <strong>TCPI (EAC) =</strong> ${tcpiEac.toFixed(3)}</p>
            <p>Schedule advance %: ${avanceCronPct.toFixed(1)}% | Cost overrun %: ${sobrecostoPct.toFixed(1)}%</p>
        `;
    }

    const escenarios = [
        { key: 'atipico', nombre: idioma === 'es' ? 'Atípico' : 'Atypical', formula: 'ETC = BAC − EV' },
        { key: 'tipico', nombre: idioma === 'es' ? 'Típico' : 'Typical', formula: 'ETC = (BAC − EV) / CPI' },
        { key: 'probable', nombre: idioma === 'es' ? 'Más probable' : 'Most probable', formula: 'ETC = (BAC − EV) / (CPI × SPI)' }
    ];

    const resultados = escenarios.map(e => {
        const etc = getETCEscenario(e.key, bac, ev, cpi, spi);
        const eac = ac + etc;
        const vac = bac - eac;
        return { ...e, etc, eac, vac };
    });

    const sel = resultados.find(r => r.key === escenarioETC) || resultados[2];

    const filasTabla = resultados.map(r => {
        const esSel = r.key === escenarioETC;
        return `<tr class="${esSel ? 'fila-escenario-seleccionado' : ''}">
            <td>${r.nombre}${esSel ? ' ✓' : ''}</td>
            <td>${r.formula}</td>
            <td>${formatearMoneda(r.etc)}</td>
            <td>${formatearMoneda(r.eac)}</td>
            <td class="${r.vac >= 0 ? 'txt-ok' : 'txt-bad'}">${formatearMoneda(r.vac)}</td>
        </tr>`;
    }).join('');

    if (idioma === 'es') {
        elProy.innerHTML = `
            <table class="tabla-proyecciones">
                <tr>
                    <th>Escenario</th>
                    <th>Fórmula</th>
                    <th>ETC</th>
                    <th>EAC = AC + ETC</th>
                    <th>VAC = BAC − EAC</th>
                </tr>
                ${filasTabla}
            </table>
            <p style="margin-top:14px" class="interpretacion-texto">
                Se utiliza el escenario <strong>${sel.nombre}</strong>
                ${sel.key === 'probable'
                    ? ', ya que considera tanto el desempeño en costo como en cronograma, representando un escenario más desfavorable del proyecto.'
                    : sel.key === 'tipico'
                        ? ', asumiendo que la eficiencia de costo actual continuará.'
                        : ', asumiendo que el trabajo restante se ejecutará según el presupuesto original.'}
            </p>
            <p><strong>EAC = AC + ETC =</strong> ${formatearMoneda(ac)} + ${formatearMoneda(sel.etc)} = <strong>${formatearMoneda(sel.eac)}</strong></p>
            <p><strong>VAC = BAC − EAC =</strong> ${formatearMoneda(bac)} − ${formatearMoneda(sel.eac)} = <span class="${sel.vac >= 0 ? 'txt-ok' : 'txt-bad'}">${formatearMoneda(sel.vac)}</span></p>
            <p class="interpretacion-texto">
                ${sel.vac >= 0
                    ? `Se estima terminar dentro o por debajo del presupuesto original (ahorro proyectado de ${formatearMoneda(sel.vac)}).`
                    : `Se estima un <strong>sobrecosto final</strong> de ${formatearMoneda(Math.abs(sel.vac))} respecto al BAC.`}
            </p>
        `;
    } else {
        elProy.innerHTML = `
            <table class="tabla-proyecciones">
                <tr><th>Scenario</th><th>Formula</th><th>ETC</th><th>EAC</th><th>VAC</th></tr>
                ${filasTabla}
            </table>
            <p><strong>Selected EAC:</strong> ${formatearMoneda(sel.eac)} | <strong>VAC:</strong> ${formatearMoneda(sel.vac)}</p>
        `;
    }

    dibujarCurvaS();
    dibujarGraficaEscenarios(resultados);
}

function exportarExcelCronograma() {
    if (typeof XLSX === 'undefined') {
        alert(t('alertNoExcel'));
        return;
    }
    if (!actividades.length) {
        alert(t('alertNoActivities'));
        return;
    }

    const rows = actividades.map(a => ({
        ID: a.id,
        Actividad: a.nombre,
        Duracion: a.duracion,
        Unidad: getUnidadLabel(),
        Presupuesto: parseFloat(a.presupuesto) || 0,
        Predecesoras: (a.predecesoras || []).join(';'),
        FechaInicio: getFechaInicioActividad(a),
        FechaFin: getFechaFinActividad(a),
        ES: a.ES,
        EF: a.EF,
        LS: a.LS,
        LF: a.LF,
        Holgura: a.holgura,
        Critica: a.esCritica ? 'SI' : 'NO'
    }));

    const ws = XLSX.utils.json_to_sheet(rows);
    ws['!cols'] = [
        { wch: 5 }, { wch: 28 }, { wch: 10 }, { wch: 10 }, { wch: 14 },
        { wch: 14 }, { wch: 14 }, { wch: 14 }, { wch: 6 }, { wch: 6 },
        { wch: 6 }, { wch: 6 }, { wch: 10 }, { wch: 8 }
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Cronograma');
    XLSX.writeFile(wb, 'Cronograma_TB1.xlsx');
}

function exportarExcelEVM() {
    if (typeof XLSX === 'undefined') {
        alert(t('alertNoExcel'));
        return;
    }
    if (!periodosEVM.length) {
        alert(t('alertNoEVM'));
        return;
    }

    const rows = periodosEVM.map((p, idx) => ({
        Periodo: getEtiquetaTiempo(p.tiempo),
        'Avance %': parseFloat(p.avance) || 0,
        'PV Parcial': parseFloat(p.pptoParcial) || 0,
        'PV Acumulado': parseFloat(p.pptoAcum) || 0,
        'AC Parcial': parseFloat(p.costoParcial) || 0,
        'AC Acumulado': parseFloat(p.costoAcum) || 0,
        'EV Parcial': parseFloat(p.trabajoParcial) || 0,
        'EV Acumulado': parseFloat(p.trabajoAcum) || 0,
        'Periodo de corte': (idx + 1) === diaCorte ? 'SI' : 'NO'
    }));

    const ws = XLSX.utils.json_to_sheet(rows);
    ws['!cols'] = Array(9).fill({ wch: 16 });

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Valor Ganado');
    XLSX.writeFile(wb, 'ValorGanado_TB1.xlsx');
}

function guardarPDF(tabIndex) {
    if (typeof html2pdf === 'undefined') {
        alert(t('alertNoPDF'));
        return;
    }

    const tab = document.getElementById(tabIndex === 0 ? 'tab0' : 'tab1');
    const nombre = tabIndex === 0 ? t('pdfCronograma') : t('pdfEVM');
    const titulo = document.querySelector('header').cloneNode(true);

    const contenedor = document.createElement('div');
    contenedor.appendChild(titulo);
    contenedor.appendChild(tab.cloneNode(true));
    contenedor.querySelectorAll('.no-print').forEach(el => el.remove());

    html2pdf().set({
        margin: 10,
        filename: nombre,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a3', orientation: 'landscape' }
    }).from(contenedor).save();
}

function imprimirSeccion(tabIndex) {
    document.body.classList.remove('print-cronograma', 'print-evm', 'print-informe', 'print-bitacora');
    const cls = ['print-cronograma', 'print-evm', 'print-informe', 'print-bitacora'];
    document.body.classList.add(cls[tabIndex] || 'print-cronograma');
    openTab(tabIndex);
    setTimeout(() => {
        window.print();
        document.body.classList.remove(...cls);
    }, 400);
}

/* --- Bitácora --- */
function inicializarBitacora() {
    crearToolbarBitacora('bitacoraToolbar');
    crearToolbarBitacora('bitacoraToolbarModal');
    ['bitacoraEditor', 'bitacoraEditorModal'].forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        el.addEventListener('input', () => {
            bitacoraHtml = el.innerHTML;
            sincronizarBitacoraDesde(el);
            try { localStorage.setItem(BITACORA_KEY, bitacoraHtml); } catch (e) { /* ignore */ }
        });
    });
    sincronizarBitacoraUI();
}

function crearToolbarBitacora(containerId) {
    const tb = document.getElementById(containerId);
    if (!tb) return;
    const cmds = [
        { cmd: 'bold', label: 'B', title: 'Bold' }, { cmd: 'italic', label: 'I', title: 'Italic' },
        { cmd: 'underline', label: 'U', title: 'Underline' }, { cmd: 'strikeThrough', label: 'S', title: 'Strike' },
        { sep: true },
        { cmd: 'foreColor', label: '🎨', val: '#c8102e' }, { cmd: 'hiliteColor', label: '🖍', val: '#fef08a' },
        { sep: true },
        { cmd: 'fontSize', select: ['1', '3', '5', '7'] },
        { cmd: 'fontName', select: ['Segoe UI', 'Arial', 'Times New Roman', 'Courier New'] },
        { sep: true },
        { cmd: 'insertUnorderedList', label: '•' }, { cmd: 'insertOrderedList', label: '1.' },
        { cmd: 'justifyLeft', label: '⬅' }, { cmd: 'justifyCenter', label: '⬌' }, { cmd: 'justifyRight', label: '➡' },
        { sep: true },
        { cmd: 'undo', label: '↩' }, { cmd: 'redo', label: '↪' }
    ];
    tb.innerHTML = '';
    cmds.forEach(c => {
        if (c.sep) { tb.innerHTML += '<span style="width:1px;height:20px;background:#cbd5e1;margin:0 4px;"></span>'; return; }
        if (c.select) {
            const sel = document.createElement('select');
            c.select.forEach(v => { const o = document.createElement('option'); o.value = v; o.textContent = v; sel.appendChild(o); });
            sel.onchange = () => document.execCommand(c.cmd, false, sel.value);
            tb.appendChild(sel);
        } else {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.textContent = c.label;
            btn.title = c.title || c.cmd;
            btn.onclick = () => {
                const target = containerId.includes('Modal') ? document.getElementById('bitacoraEditorModal') : document.getElementById('bitacoraEditor');
                target?.focus();
                document.execCommand(c.cmd, false, c.val || null);
            };
            tb.appendChild(btn);
        }
    });
}

function sincronizarBitacoraUI() {
    ['bitacoraEditor', 'bitacoraEditorModal'].forEach(id => {
        const el = document.getElementById(id);
        if (el && el.innerHTML !== bitacoraHtml) el.innerHTML = bitacoraHtml || '';
    });
}

function sincronizarBitacoraDesde(sourceEl) {
    bitacoraHtml = sourceEl.innerHTML;
    ['bitacoraEditor', 'bitacoraEditorModal'].forEach(id => {
        const el = document.getElementById(id);
        if (el && el !== sourceEl) el.innerHTML = bitacoraHtml;
    });
}

function abrirBitacora() {
    sincronizarBitacoraUI();
    document.getElementById('modalBitacora')?.classList.add('activo');
}

function cerrarModalBitacora() {
    document.getElementById('modalBitacora')?.classList.remove('activo');
}

function exportarBitacoraTXT() {
    const blob = new Blob([document.getElementById('bitacoraEditor')?.innerText || ''], { type: 'text/plain;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'Bitacora_TB1.txt';
    a.click();
}

function exportarBitacoraPDF() {
    guardarPDFProfesional('bitacora');
}

function exportarBitacoraWord() {
    const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word"><head><meta charset="utf-8"></head><body>${bitacoraHtml}</body></html>`;
    const blob = new Blob(['\ufeff', html], { type: 'application/msword' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'Bitacora_TB1.doc';
    a.click();
}

/* --- Informe Ejecutivo --- */
function generarInformeEjecutivo() {
    const el = document.getElementById('contenidoInformeEjecutivo');
    if (!el) return;
    const { pv, ev, ac, bac } = getDatosCorte();
    const spi = pv > 0 ? ev / pv : 0;
    const cpi = ac > 0 ? ev / ac : 0;
    const sv = ev - pv;
    const cv = ev - ac;
    const tcpiBac = (bac - ac) > 0 ? (bac - ev) / (bac - ac) : 0;
    const etcSel = getETCEscenario(escenarioETC, bac, ev, cpi, spi);
    const eacSel = ac + etcSel;
    const vacSel = bac - eacSel;
    const totalDur = Math.max(...actividades.map(a => a.EF), 0);
    const critCount = actividades.filter(a => a.esCritica).length;
    const fecha = new Date().toLocaleDateString(idioma === 'es' ? 'es-PE' : 'en-US');
    const periodoLabel = getEtiquetaTiempo(diaCorte);

    el.innerHTML = `
        <div class="informe-portada">
            <h2>${getNombreProyecto()}</h2>
            <p>${t('executiveReport')} — ${fecha}</p>
            <p>${idioma === 'es' ? 'Periodo de corte' : 'Cutoff period'}: <strong>${periodoLabel}</strong></p>
        </div>
        <div class="informe-seccion">
            <h3>${idioma === 'es' ? 'Resumen Ejecutivo' : 'Executive Summary'}</h3>
            <p>${idioma === 'es'
                ? `El proyecto "${getNombreProyecto()}" cuenta con ${actividades.length} actividades, duración planificada de ${totalDur} ${getUnidadLabel()} y BAC de ${formatearMoneda(bac)}. Al ${periodoLabel.toLowerCase()}, el SPI es ${spi.toFixed(3)} y el CPI es ${cpi.toFixed(3)}.`
                : `Project "${getNombreProyecto()}" has ${actividades.length} activities, planned duration ${totalDur} ${getUnidadLabel()} and BAC ${formatearMoneda(bac)}. At ${periodoLabel}, SPI is ${spi.toFixed(3)} and CPI is ${cpi.toFixed(3)}.`}
            </p>
            <div class="informe-kpis">
                <div class="informe-kpi"><div class="etiq">BAC</div><div class="valor">${formatearMoneda(bac)}</div></div>
                <div class="informe-kpi"><div class="etiq">PV</div><div class="valor">${formatearMoneda(pv)}</div></div>
                <div class="informe-kpi"><div class="etiq">EV</div><div class="valor">${formatearMoneda(ev)}</div></div>
                <div class="informe-kpi"><div class="etiq">AC</div><div class="valor">${formatearMoneda(ac)}</div></div>
                <div class="informe-kpi"><div class="etiq">SPI</div><div class="valor">${spi.toFixed(3)}</div></div>
                <div class="informe-kpi"><div class="etiq">CPI</div><div class="valor">${cpi.toFixed(3)}</div></div>
                <div class="informe-kpi"><div class="etiq">TCPI (BAC)</div><div class="valor">${tcpiBac.toFixed(3)}</div></div>
                <div class="informe-kpi"><div class="etiq">EAC</div><div class="valor">${formatearMoneda(eacSel)}</div></div>
            </div>
        </div>
        <div class="informe-seccion">
            <h3>${idioma === 'es' ? 'Cronograma y Ruta Crítica' : 'Schedule and Critical Path'}</h3>
            <p>${idioma === 'es'
                ? `Desviación de cronograma (SV): ${formatearMoneda(sv)}. Actividades críticas: ${critCount}. ${spi >= 1 ? 'El avance físico-financiero está acorde o adelantado al plan.' : 'Se detecta retraso; se recomienda revisar recursos en ruta crítica.'}`
                : `Schedule variance (SV): ${formatearMoneda(sv)}. Critical activities: ${critCount}.`}
            </p>
        </div>
        <div class="informe-seccion">
            <h3>${idioma === 'es' ? 'Costos y Proyección' : 'Costs and Projection'}</h3>
            <p>${idioma === 'es'
                ? `Desviación de costo (CV): ${formatearMoneda(cv)}. EAC proyectado: ${formatearMoneda(eacSel)}. VAC: ${formatearMoneda(vacSel)}.`
                : `Cost variance (CV): ${formatearMoneda(cv)}. Projected EAC: ${formatearMoneda(eacSel)}. VAC: ${formatearMoneda(vacSel)}.`}
            </p>
        </div>
        <div class="informe-conclusion">
            <strong>${idioma === 'es' ? 'Conclusiones' : 'Conclusions'}</strong>
            <p>${(spi < 1 && cpi < 1)
                ? (idioma === 'es' ? 'El proyecto presenta desviaciones adversas en tiempo y costo. Requiere acciones correctivas inmediatas.' : 'Project shows adverse time and cost deviations. Immediate corrective actions required.')
                : (spi < 1 || cpi < 1)
                    ? (idioma === 'es' ? 'El proyecto muestra desviación en tiempo o costo. Monitoreo reforzado recomendado.' : 'Project shows schedule or cost deviation. Enhanced monitoring recommended.')
                    : (idioma === 'es' ? 'El proyecto se mantiene dentro de los parámetros planificados de cronograma y costo.' : 'Project remains within planned schedule and cost parameters.')}</p>
        </div>
        <div class="informe-recomendacion">
            <strong>${idioma === 'es' ? 'Recomendaciones' : 'Recommendations'}</strong>
            <ul style="margin:8px 0 0 20px;">
                ${spi < 1 ? `<li>${idioma === 'es' ? 'Priorizar actividades de ruta crítica y evaluar recursos adicionales.' : 'Prioritize critical path activities and evaluate additional resources.'}</li>` : ''}
                ${cpi < 1 ? `<li>${idioma === 'es' ? 'Revisar partidas con sobrecosto y negociar con proveedores.' : 'Review over-budget items and negotiate with suppliers.'}</li>` : ''}
                <li>${idioma === 'es' ? 'Actualizar seguimiento EVM semanalmente y documentar en bitácora.' : 'Update EVM tracking weekly and document in logbook.'}</li>
            </ul>
        </div>`;

    dibujarCurvaSInforme();
    dibujarEscenariosInforme(bac, ev, ac, cpi, spi);
}

function dibujarCurvaSInforme() {
    const canvas = document.getElementById('informeCurvaS');
    if (!canvas || typeof Chart === 'undefined' || !periodosEVM.length) return;
    if (chartInformeCurvaS) chartInformeCurvaS.destroy();
    const idxCorte = diaCorte - 1;
    chartInformeCurvaS = new Chart(canvas, {
        type: 'line',
        data: {
            labels: periodosEVM.map(p => getEtiquetaTiempo(p.tiempo)),
            datasets: [
                { label: 'PV', data: periodosEVM.map(p => p.pptoAcum), borderColor: '#059669', tension: 0.3 },
                { label: 'EV', data: periodosEVM.map((p, i) => i <= idxCorte ? p.trabajoAcum : null), borderColor: '#f97316', tension: 0.3 },
                { label: 'AC', data: periodosEVM.map((p, i) => i <= idxCorte ? p.costoAcum : null), borderColor: '#7c3aed', tension: 0.3 }
            ]
        },
        options: { responsive: true, scales: { y: { ticks: { callback: v => formatearMoneda(v) } } } }
    });
}

function dibujarEscenariosInforme(bac, ev, ac, cpi, spi) {
    const canvas = document.getElementById('informeEscenarios');
    if (!canvas || typeof Chart === 'undefined') return;
    if (chartInformeEscenarios) chartInformeEscenarios.destroy();
    const keys = ['atipico', 'tipico', 'probable'];
    const nombres = keys.map(k => k === 'atipico' ? (idioma === 'es' ? 'Atípico' : 'Atypical') : k === 'tipico' ? (idioma === 'es' ? 'Típico' : 'Typical') : (idioma === 'es' ? 'Probable' : 'Probable'));
    const eacs = keys.map(k => ac + getETCEscenario(k, bac, ev, cpi, spi));
    chartInformeEscenarios = new Chart(canvas, {
        type: 'bar',
        data: { labels: nombres, datasets: [{ label: 'EAC', data: eacs, backgroundColor: ['#94a3b8', '#64748b', '#c8102e'] }] },
        options: { responsive: true, scales: { y: { ticks: { callback: v => formatearMoneda(v) } } } }
    });
}

/* --- Exportación extendida --- */
function exportarExcelCompleto() {
    if (typeof XLSX === 'undefined') { alert(t('alertNoExcel')); return; }
    const wb = XLSX.utils.book_new();
    if (actividades.length) {
        const rows = actividades.map(a => ({
            ID: a.id, Actividad: a.nombre, Duracion: a.duracion, Unidad: getUnidadLabel(),
            Presupuesto: parseFloat(a.presupuesto) || 0, Predecesoras: (a.predecesoras || []).join(';'),
            Inicio: getFechaInicioActividad(a), Fin: getFechaFinActividad(a),
            ES: a.ES, EF: a.EF, LS: a.LS, LF: a.LF, Holgura: a.holgura, Critica: a.esCritica ? 'SI' : 'NO'
        }));
        XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(rows), 'Cronograma');
    }
    if (periodosEVM.length) {
        const evmRows = periodosEVM.map((p, idx) => ({
            Periodo: getEtiquetaTiempo(p.tiempo), 'Avance %': parseFloat(p.avance) || 0,
            'PV Parcial': p.pptoParcial, 'PV Acum': p.pptoAcum, 'AC Parcial': p.costoParcial || 0,
            'AC Acum': p.costoAcum, 'EV Parcial': p.trabajoParcial, 'EV Acum': p.trabajoAcum,
            Corte: (idx + 1) === diaCorte ? 'SI' : 'NO'
        }));
        XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(evmRows), 'Valor Ganado');
    }
    const { pv, ev, ac, bac } = getDatosCorte();
    const spi = pv > 0 ? ev / pv : 0;
    const cpi = ac > 0 ? ev / ac : 0;
    const indRows = [{ Indicador: 'BAC', Valor: bac }, { Indicador: 'PV', Valor: pv }, { Indicador: 'EV', Valor: ev },
        { Indicador: 'AC', Valor: ac }, { Indicador: 'SPI', Valor: spi }, { Indicador: 'CPI', Valor: cpi },
        { Indicador: 'SV', Valor: ev - pv }, { Indicador: 'CV', Valor: ev - ac },
        { Indicador: 'TCPI_BAC', Valor: (bac - ac) > 0 ? (bac - ev) / (bac - ac) : 0 }];
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(indRows), 'Indicadores');
    XLSX.writeFile(wb, 'TB1_Completo.xlsx');
}

function guardarPDFProfesional(tipo) {
    const jsPDF = window.jspdf?.jsPDF;
    if (!jsPDF) { alert(t('alertNoJsPDF')); return; }
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const nombre = getNombreProyecto();
    const fecha = new Date().toLocaleDateString(idioma === 'es' ? 'es-PE' : 'en-US');
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    const footer = (pageNum, total) => {
        doc.setFontSize(8);
        doc.setTextColor(100);
        doc.text(`${nombre} — TB1 CI579`, 14, pageH - 8);
        doc.text(`${fecha} | ${idioma === 'es' ? 'Pág.' : 'Page'} ${pageNum}/${total}`, pageW - 14, pageH - 8, { align: 'right' });
    };
    const addHeader = (titulo) => {
        doc.setFillColor(200, 16, 46);
        doc.rect(0, 0, pageW, 22, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(14);
        doc.text(titulo, 14, 14);
        doc.setTextColor(0, 0, 0);
    };

    if (tipo === 'cronograma') {
        addHeader(`${t('tabSchedule')} — ${nombre}`);
        doc.setFontSize(10);
        let y = 30;
        doc.text(`${t('startDate')}: ${projectStartDate ? formatearFecha(projectStartDate) : '-'}`, 14, y);
        y += 8;
        if (typeof doc.autoTable === 'function') {
            doc.autoTable({
                startY: y,
                head: [['ID', t('colActivity'), t('colDuration'), t('colBudget'), 'ES', 'EF', t('colSlack')]],
                body: actividades.map(a => [a.id, a.nombre, `${a.duracion} ${getUnidadLabel()}`, formatearMoneda(a.presupuesto), a.ES, a.EF, a.holgura]),
                styles: { fontSize: 8 }, headStyles: { fillColor: [200, 16, 46] }
            });
        }
    } else if (tipo === 'evm') {
        addHeader(`${t('tabEVM')} — ${nombre}`);
        const { pv, ev, ac, bac } = getDatosCorte();
        doc.setFontSize(10);
        doc.text(`BAC: ${formatearMoneda(bac)} | PV: ${formatearMoneda(pv)} | EV: ${formatearMoneda(ev)} | AC: ${formatearMoneda(ac)}`, 14, 30);
        if (typeof doc.autoTable === 'function' && periodosEVM.length) {
            doc.autoTable({
                startY: 38,
                head: [[t('colTime'), t('colAdvance'), 'PV Acum', 'AC Acum', 'EV Acum']],
                body: periodosEVM.map(p => [getEtiquetaTiempo(p.tiempo), `${parseFloat(p.avance) || 0}%`, formatearMoneda(p.pptoAcum), formatearMoneda(p.costoAcum), formatearMoneda(p.trabajoAcum)]),
                styles: { fontSize: 7 }, headStyles: { fillColor: [200, 16, 46] }
            });
        }
    } else if (tipo === 'informe') {
        addHeader(`${t('executiveReport')} — ${nombre}`);
        doc.setFontSize(10);
        const { pv, ev, ac, bac } = getDatosCorte();
        const spi = pv > 0 ? ev / pv : 0;
        const cpi = ac > 0 ? ev / ac : 0;
        doc.text(`SPI: ${spi.toFixed(3)} | CPI: ${cpi.toFixed(3)} | ${t('cutoffLabel')}: ${getEtiquetaTiempo(diaCorte)}`, 14, 30);
        doc.text(`${idioma === 'es' ? 'Ver gráficos en la aplicación web.' : 'See charts in web app.'}`, 14, 38);
    } else if (tipo === 'bitacora') {
        addHeader(`${t('tabBitacora')} — ${nombre}`);
        doc.setFontSize(10);
        const texto = document.getElementById('bitacoraEditor')?.innerText || '';
        const lineas = doc.splitTextToSize(texto || (idioma === 'es' ? '(Bitácora vacía)' : '(Empty logbook)'), pageW - 28);
        doc.text(lineas, 14, 30);
    }

    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        footer(i, totalPages);
    }
    const nombres = { cronograma: 'TB1_Cronograma_Pro', evm: 'TB1_EVM_Pro', informe: 'TB1_Informe_Pro', bitacora: 'TB1_Bitacora_Pro' };
    doc.save((nombres[tipo] || 'TB1_Reporte') + '.pdf');
}
