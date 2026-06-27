/* Feriados nacionales y regionales del Perú - TB1 CI579
 * Fuente base: calendario oficial (DL 713, Leyes 32582, 32658, 32659, 32660) y gob.pe/feriados
 * Para agregar o modificar feriados, edite FERIADOS_NACIONALES_FIJOS o FERIADOS_REGIONALES.
 * Campo opcional desdeAnio: feriado válido solo desde ese año (ej. reforma 2024).
 */

const DEPARTAMENTOS_PERU = [
    'Amazonas', 'Áncash', 'Apurímac', 'Arequipa', 'Ayacucho', 'Cajamarca', 'Callao',
    'Cusco', 'Huancavelica', 'Huánuco', 'Ica', 'Junín', 'La Libertad', 'Lambayeque',
    'Lima', 'Loreto', 'Madre de Dios', 'Moquegua', 'Pasco', 'Piura', 'Puno',
    'San Martín', 'Tacna', 'Tumbes', 'Ucayali'
];

/** Feriados nacionales de fecha fija. desdeAnio opcional (default: siempre aplica). */
const FERIADOS_NACIONALES_FIJOS = [
    { m: 1, d: 1, nombre: 'Año Nuevo' },
    { m: 5, d: 1, nombre: 'Día del Trabajo' },
    { m: 6, d: 7, nombre: 'Batalla de Arica y Día de la Bandera', desdeAnio: 2024 },
    { m: 6, d: 29, nombre: 'San Pedro y San Pablo' },
    { m: 7, d: 23, nombre: 'Día de la Fuerza Aérea del Perú', desdeAnio: 2024 },
    { m: 7, d: 28, nombre: 'Fiestas Patrias' },
    { m: 7, d: 29, nombre: 'Fiestas Patrias' },
    { m: 8, d: 6, nombre: 'Batalla de Junín', desdeAnio: 2024 },
    { m: 8, d: 30, nombre: 'Santa Rosa de Lima' },
    { m: 10, d: 8, nombre: 'Combate de Angamos' },
    { m: 11, d: 1, nombre: 'Día de Todos los Santos' },
    { m: 12, d: 8, nombre: 'Inmaculada Concepción' },
    { m: 12, d: 9, nombre: 'Batalla de Ayacucho', desdeAnio: 2024 },
    { m: 12, d: 25, nombre: 'Navidad' }
];

/** Feriados regionales por departamento (fecha fija anual). */
const FERIADOS_REGIONALES = {
    Amazonas: [
        { m: 6, d: 1, nombre: 'Aniversario de Chachapoyas' },
        { m: 11, d: 3, nombre: 'Aniversario del departamento de Amazonas' }
    ],
    'Áncash': [
        { m: 2, d: 12, nombre: 'Aniversario de la creación política de Áncash' },
        { m: 12, d: 23, nombre: 'Aniversario de Huaraz' }
    ],
    Apurímac: [
        { m: 4, d: 28, nombre: 'Aniversario de la creación política de Apurímac' },
        { m: 6, d: 14, nombre: 'Aniversario del departamento de Apurímac' },
        { m: 9, d: 8, nombre: 'Festividad de Nuestra Señora de Cocharcas' }
    ],
    Arequipa: [
        { m: 8, d: 15, nombre: 'Aniversario de Arequipa' },
        { m: 1, d: 6, nombre: 'Aniversario de la provincia de Arequipa' }
    ],
    Ayacucho: [
        { m: 4, d: 25, nombre: 'Aniversario de Huamanga' },
        { m: 5, d: 4, nombre: 'Aniversario del departamento de Ayacucho' },
        { m: 11, d: 6, nombre: 'Día de la Canción Folclórica Ayacuchana' }
    ],
    Cajamarca: [
        { m: 2, d: 11, nombre: 'Aniversario de Cajamarca' },
        { m: 2, d: 14, nombre: 'Carnaval de Cajamarca' }
    ],
    Callao: [
        { m: 8, d: 20, nombre: 'Aniversario del Callao' },
        { m: 10, d: 28, nombre: 'Día del Callao' }
    ],
    Cusco: [
        { m: 6, d: 24, nombre: 'Inti Raymi / Cusco' },
        { m: 7, d: 16, nombre: 'Virgen del Carmen — Mamacha Carmen' },
        { m: 11, d: 3, nombre: 'Aniversario del departamento de Cusco' }
    ],
    Huancavelica: [
        { m: 4, d: 5, nombre: 'Aniversario de Huancavelica' },
        { m: 4, d: 24, nombre: 'Aniversario del departamento de Huancavelica' }
    ],
    Huánuco: [
        { m: 8, d: 15, nombre: 'Aniversario de Huánuco' },
        { m: 2, d: 15, nombre: 'Aniversario del departamento de Huánuco' }
    ],
    Ica: [
        { m: 2, d: 19, nombre: 'Aniversario de Ica' },
        { m: 3, d: 27, nombre: 'Aniversario del departamento de Ica' }
    ],
    Junín: [
        { m: 9, d: 13, nombre: 'Aniversario del departamento de Junín' },
        { m: 12, d: 15, nombre: 'Aniversario de Huancayo' }
    ],
    'La Libertad': [
        { m: 12, d: 6, nombre: 'Aniversario de La Libertad' },
        { m: 12, d: 15, nombre: 'Festividad de la Virgen de la Puerta' },
        { m: 12, d: 29, nombre: 'Día de la Independencia de Trujillo' }
    ],
    Lambayeque: [
        { m: 12, d: 7, nombre: 'Aniversario de Lambayeque' },
        { m: 1, d: 13, nombre: 'Aniversario del departamento de Lambayeque' },
        { m: 4, d: 18, nombre: 'Aniversario de Chiclayo' }
    ],
    Lima: [
        { m: 1, d: 18, nombre: 'Aniversario de Lima' },
        { m: 1, d: 20, nombre: 'Festividad de San Sebastián' }
    ],
    Loreto: [
        { m: 2, d: 7, nombre: 'Aniversario de Loreto' },
        { m: 6, d: 24, nombre: 'Fiesta de San Juan' },
        { m: 7, d: 24, nombre: 'Conmemoración de la Batalla de Zarumilla' }
    ],
    'Madre de Dios': [
        { m: 12, d: 26, nombre: 'Aniversario de Madre de Dios' },
        { m: 6, d: 15, nombre: 'Aniversario del departamento de Madre de Dios' }
    ],
    Moquegua: [
        { m: 8, d: 25, nombre: 'Aniversario de Moquegua' },
        { m: 5, d: 26, nombre: 'Aniversario de la provincia de Ilo' },
        { m: 10, d: 14, nombre: 'Festividad de Santa Fortunata' },
        { m: 11, d: 25, nombre: 'Aniversario de Mariscal Nieto' }
    ],
    Pasco: [
        { m: 11, d: 27, nombre: 'Aniversario de Pasco' },
        { m: 12, d: 9, nombre: 'Aniversario del departamento de Pasco' }
    ],
    Piura: [
        { m: 1, d: 24, nombre: 'Aniversario de Piura' },
        { m: 9, d: 27, nombre: 'Aniversario del departamento de Piura' }
    ],
    Puno: [
        { m: 11, d: 4, nombre: 'Aniversario de Puno' },
        { m: 11, d: 5, nombre: 'Aniversario del departamento de Puno' }
    ],
    'San Martín': [
        { m: 9, d: 14, nombre: 'Aniversario de San Martín' },
        { m: 5, d: 7, nombre: 'Aniversario del departamento de San Martín' }
    ],
    Tacna: [
        { m: 8, d: 28, nombre: 'Reincorporación de Tacna al Perú' },
        { m: 5, d: 26, nombre: 'Aniversario del Alto de la Alianza' },
        { m: 9, d: 14, nombre: 'Festividad del Señor de Locumba' }
    ],
    Tumbes: [
        { m: 1, d: 7, nombre: 'Aniversario de Tumbes' },
        { m: 1, d: 25, nombre: 'Aniversario del departamento de Tumbes' }
    ],
    Ucayali: [
        { m: 6, d: 7, nombre: 'Aniversario de Ucayali' },
        { m: 6, d: 18, nombre: 'Aniversario de la creación del departamento de Ucayali' },
        { m: 6, d: 24, nombre: 'Fiesta de San Juan' }
    ]
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

/** ISO local YYYY-MM-DD sin desfase UTC. */
function fechaALocalISO(fecha) {
    if (!fecha) return null;
    const f = fecha instanceof Date ? fecha : new Date(fecha + 'T00:00:00');
    if (isNaN(f.getTime())) return null;
    return fechaISO(f.getFullYear(), f.getMonth() + 1, f.getDate());
}

function sumarDiasFecha(fecha, dias) {
    const f = new Date(fecha);
    f.setDate(f.getDate() + dias);
    return f;
}

function feriadoAplicaEnAnio(feriado, anio) {
    return !feriado.desdeAnio || anio >= feriado.desdeAnio;
}

function obtenerFeriadosNacionalesPeru(anio) {
    const pascua = calcularPascua(anio);
    const juevesSanto = sumarDiasFecha(pascua, -3);
    const viernesSanto = sumarDiasFecha(pascua, -2);
    const lista = FERIADOS_NACIONALES_FIJOS
        .filter(f => feriadoAplicaEnAnio(f, anio))
        .map(f => ({
            fecha: fechaISO(anio, f.m, f.d),
            nombre: f.nombre,
            tipo: 'nacional'
        }));
    lista.push(
        { fecha: fechaALocalISO(juevesSanto), nombre: 'Jueves Santo', tipo: 'nacional' },
        { fecha: fechaALocalISO(viernesSanto), nombre: 'Viernes Santo', tipo: 'nacional' }
    );
    return lista.sort((a, b) => a.fecha.localeCompare(b.fecha));
}

function obtenerFeriadosRegionalesPeru(anio, departamentos) {
    const deps = departamentos?.length ? departamentos : DEPARTAMENTOS_PERU;
    const out = [];
    deps.forEach(dep => {
        (FERIADOS_REGIONALES[dep] || []).forEach(f => {
            if (!feriadoAplicaEnAnio(f, anio)) return;
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

/** Feriados en un rango de fechas (multi-año). fechaInicio/fin: Date o 'YYYY-MM-DD'. */
function obtenerFeriadosEnRango(fechaInicio, fechaFin, departamentos) {
    const isoIni = fechaALocalISO(fechaInicio);
    const isoFin = fechaALocalISO(fechaFin);
    if (!isoIni || !isoFin) return [];
    const [yIni] = isoIni.split('-').map(Number);
    const [yFin] = isoFin.split('-').map(Number);
    const map = new Map();
    for (let anio = yIni; anio <= yFin; anio++) {
        obtenerTodosFeriadosPeru(anio, departamentos).forEach(f => {
            if (f.fecha >= isoIni && f.fecha <= isoFin) map.set(f.fecha, f);
        });
    }
    return Array.from(map.values()).sort((a, b) => a.fecha.localeCompare(b.fecha));
}
