/* Feriados nacionales y regionales del Perú - TB1 CI579 */

const DEPARTAMENTOS_PERU = [
    'Amazonas', 'Áncash', 'Apurímac', 'Arequipa', 'Ayacucho', 'Cajamarca', 'Callao',
    'Cusco', 'Huancavelica', 'Huánuco', 'Ica', 'Junín', 'La Libertad', 'Lambayeque',
    'Lima', 'Loreto', 'Madre de Dios', 'Moquegua', 'Pasco', 'Piura', 'Puno',
    'San Martín', 'Tacna', 'Tumbes', 'Ucayali'
];

const FERIADOS_REGIONALES = {
    Amazonas: [{ m: 6, d: 1, nombre: 'Aniversario de Chachapoyas' }],
    'Áncash': [{ m: 12, d: 23, nombre: 'Aniversario de Áncash' }],
    Apurímac: [{ m: 6, d: 14, nombre: 'Aniversario de Apurímac' }],
    Arequipa: [{ m: 8, d: 15, nombre: 'Aniversario de Arequipa' }],
    Ayacucho: [{ m: 4, d: 25, nombre: 'Aniversario de Ayacucho' }],
    Cajamarca: [{ m: 2, d: 14, nombre: 'Aniversario de Cajamarca' }],
    Callao: [{ m: 8, d: 20, nombre: 'Aniversario del Callao' }],
    Cusco: [{ m: 6, d: 24, nombre: 'Inti Raymi / Cusco' }],
    Huancavelica: [{ m: 4, d: 5, nombre: 'Aniversario de Huancavelica' }],
    Huánuco: [{ m: 8, d: 15, nombre: 'Aniversario de Huánuco' }],
    Ica: [{ m: 2, d: 19, nombre: 'Aniversario de Ica' }],
    Junín: [{ m: 12, d: 15, nombre: 'Aniversario de Junín' }],
    'La Libertad': [{ m: 12, d: 6, nombre: 'Aniversario de La Libertad' }],
    Lambayeque: [{ m: 12, d: 7, nombre: 'Aniversario de Lambayeque' }],
    Lima: [{ m: 1, d: 18, nombre: 'Aniversario de Lima' }],
    Loreto: [{ m: 2, d: 7, nombre: 'Aniversario de Loreto' }],
    'Madre de Dios': [{ m: 12, d: 26, nombre: 'Aniversario de Madre de Dios' }],
    Moquegua: [{ m: 8, d: 25, nombre: 'Aniversario de Moquegua' }],
    Pasco: [{ m: 11, d: 27, nombre: 'Aniversario de Pasco' }],
    Piura: [{ m: 1, d: 24, nombre: 'Aniversario de Piura' }],
    Puno: [{ m: 11, d: 4, nombre: 'Aniversario de Puno' }],
    'San Martín': [{ m: 9, d: 14, nombre: 'Aniversario de San Martín' }],
    Tacna: [{ m: 8, d: 28, nombre: 'Aniversario de Tacna' }],
    Tumbes: [{ m: 1, d: 7, nombre: 'Aniversario de Tumbes' }],
    Ucayali: [{ m: 6, d: 7, nombre: 'Aniversario de Ucayali' }]
};

function calcularPascua(anio) {
    const a = anio % 19, b = Math.floor(anio / 100), c = anio % 100;
    const d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4), k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const mes = Math.floor((h + l - 7 * m + 114) / 31);
    const dia = ((h + l - 7 * m + 114) % 31) + 1;
    return new Date(anio, mes - 1, dia);
}

function fechaISO(anio, mes, dia) {
    return `${anio}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
}

function sumarDiasFecha(fecha, dias) {
    const f = new Date(fecha);
    f.setDate(f.getDate() + dias);
    return f;
}

function obtenerFeriadosNacionalesPeru(anio) {
    const pascua = calcularPascua(anio);
    const juevesSanto = sumarDiasFecha(pascua, -3);
    const viernesSanto = sumarDiasFecha(pascua, -2);
    const lista = [
        { fecha: fechaISO(anio, 1, 1), nombre: 'Año Nuevo', tipo: 'nacional' },
        { fecha: fechaISO(anio, 5, 1), nombre: 'Día del Trabajo', tipo: 'nacional' },
        { fecha: fechaISO(anio, 7, 28), nombre: 'Fiestas Patrias', tipo: 'nacional' },
        { fecha: fechaISO(anio, 7, 29), nombre: 'Fiestas Patrias', tipo: 'nacional' },
        { fecha: fechaISO(anio, 12, 8), nombre: 'Inmaculada Concepción', tipo: 'nacional' },
        { fecha: fechaISO(anio, 12, 25), nombre: 'Navidad', tipo: 'nacional' },
        { fecha: juevesSanto.toISOString().slice(0, 10), nombre: 'Jueves Santo', tipo: 'nacional' },
        { fecha: viernesSanto.toISOString().slice(0, 10), nombre: 'Viernes Santo', tipo: 'nacional' }
    ];
    if (anio >= 2024) {
        lista.push({ fecha: fechaISO(anio, 6, 29), nombre: 'San Pedro y San Pablo', tipo: 'nacional' });
    }
    return lista;
}

function obtenerFeriadosRegionalesPeru(anio, departamentos) {
    const deps = departamentos?.length ? departamentos : DEPARTAMENTOS_PERU;
    const out = [];
    deps.forEach(dep => {
        (FERIADOS_REGIONALES[dep] || []).forEach(f => {
            out.push({
                fecha: fechaISO(anio, f.m, f.d),
                nombre: `${f.nombre} (${dep})`,
                tipo: 'regional',
                departamento: dep
            });
        });
    });
    return out;
}

function obtenerTodosFeriadosPeru(anio, departamentos) {
    const map = new Map();
    [...obtenerFeriadosNacionalesPeru(anio), ...obtenerFeriadosRegionalesPeru(anio, departamentos)]
        .forEach(f => { if (!map.has(f.fecha)) map.set(f.fecha, f); });
    return Array.from(map.values()).sort((a, b) => a.fecha.localeCompare(b.fecha));
}
