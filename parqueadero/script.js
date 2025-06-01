// Configuración inicial
const ESPACIO_TOTAL = 20; // Capacidad total del parqueadero
const LIMITES_PUERTAS = {
    Puerta_1: 7,
    Puerta_2: 7,
    Puerta_3: 6
}; // Capacidad por zona
let vehiculos = []; // Arreglo principal de vehículos registrados

// === utils/localStorage ===

// Guarda el arreglo 'vehiculos' en localStorage como string JSON
function guardarEnLocalStorage() {
    localStorage.setItem('vehiculos_parqueadero', JSON.stringify(vehiculos));
}

// Carga el arreglo desde localStorage y renderiza los vehículos guardados
function cargarDesdeLocalStorage() {
    const datos = localStorage.getItem('vehiculos_parqueadero');
    if (datos) {
        vehiculos = JSON.parse(datos);
        vehiculos.forEach(renderVehiculo);
        actualizarEspaciosDisponibles();
    }
}

// === DOM Ready ===
document.addEventListener('DOMContentLoaded', () => {
    // Verifica si el input de búsqueda existe
    if (!document.getElementById('search-vehicle')) {
        console.error('Elemento search-vehicle no encontrado');
        return;
    }

    // Verifica que los elementos principales del DOM existan antes de continuar
    if (document.getElementById('espacio_disponible') &&
        document.getElementById('vehiculos_Puerta_1') &&
        document.getElementById('vehiculos_Puerta_2') &&
        document.getElementById('vehiculos_Puerta_3')) {
        
        cargarDesdeLocalStorage(); // Carga vehículos desde el almacenamiento
        document.getElementById('search-vehicle').addEventListener('input', buscarVehiculo); // Añade listener de búsqueda
    } else {
        console.error('Elementos del DOM necesarios no encontrados');
    }
});

// === Registro de nuevo vehículo ===
function agregarVehiculo(vehiculo) {
    vehiculos.push(vehiculo); // Agrega al arreglo
    guardarEnLocalStorage(); // Persiste
    renderVehiculo(vehiculo); // Muestra en pantalla
    actualizarEspaciosDisponibles(); // Recalcula espacios
    mostrarAlerta(`Vehículo ${vehiculo.placa} registrado en ${reemplazarGuionBajo(vehiculo.puerta)}.`, 'success');
}

// === Salida de vehículo ===
function registrarSalida(placa) {
    const vehiculo = vehiculos.find(v => v.placa === placa); // Busca por placa
    if (vehiculo) {
        vehiculos = vehiculos.filter(v => v.placa !== placa); // Elimina del arreglo
        guardarEnLocalStorage(); // Actualiza localStorage
        const card = document.querySelector(`.vehicle-card[data-placa="${placa}"]`); // Encuentra la tarjeta
        if (card) {
            card.remove(); // Elimina la tarjeta del DOM
        }
        actualizarEspaciosDisponibles(); // Recalcula espacios
        mostrarAlerta(`Vehículo ${placa} ha sido retirado de ${reemplazarGuionBajo(vehiculo.puerta)}.`, 'info');
    }
}

// === Genera objeto vehículo ===
function crearVehiculo(placa, conductor, tipo, puerta) {
    return {
        placa,
        conductor,
        tipo_conductor: tipo,
        puerta,
        hora_entrada: new Date().toLocaleTimeString(), // Hora actual
        fecha_entrada: new Date().toLocaleDateString(), // Fecha actual
        timestamp: Date.now() // Marca de tiempo
    };
}
// === Manejo del formulario de registro ===
const formulario = document.getElementById('formulario');
if (formulario) {
    formulario.addEventListener('submit', function (e) {
        e.preventDefault(); // Previene el envío por defecto
        // Obtiene valores del formulario
        const placa = document.getElementById('placa')?.value.trim().toUpperCase();
        const conductor = document.getElementById('conductor')?.value.trim();
        const tipo_conductor = document.getElementById('tipo_conductor')?.value;
        const puerta = document.getElementById('area_estacionamiento')?.value;
        // Validación de campos vacíos
        if (!placa || !conductor || !tipo_conductor || !puerta) {
            mostrarAlerta('Por favor, complete todos los campos.', 'warning');
            return;
        }
        // Validación de placa duplicada
        if (vehiculos.some(v => v.placa === placa)) {
            mostrarAlerta('Esta placa ya está registrada en el parqueadero.', 'error');
            return;
        }
        // Validación de parqueadero lleno
        if (vehiculos.length >= ESPACIO_TOTAL) {
            mostrarAlerta('El parqueadero está lleno. No hay espacios disponibles.', 'error');
            return;
        }
        // Validación de espacio disponible en la puerta seleccionada
        const vehiculosEnPuerta = vehiculos.filter(v => v.puerta === puerta).length;
        if (vehiculosEnPuerta >= LIMITES_PUERTAS[puerta]) {
            mostrarAlerta(`La ${reemplazarGuionBajo(puerta)} está llena. Por favor seleccione otra área.`, 'error');
            return;
        }
        // Crea y agrega el nuevo vehículo
        const vehiculo = crearVehiculo(placa, conductor, tipo_conductor, puerta);
        agregarVehiculo(vehiculo);
        this.reset(); // Limpia el formulario
    });
}

// === Renderiza una tarjeta de vehículo en el HTML ===
function renderVehiculo(vehiculo) {
    const vehicleGrid = document.getElementById(`vehiculos_${vehiculo.puerta}`);
    if (!vehicleGrid) {
        console.error(`Contenedor vehiculos_${vehiculo.puerta} no encontrado`);
        return;
    }
    const card = document.createElement('div');
    card.className = 'vehicle-card';
    // Define el color del borde según el tipo de conductor
    let borderColor = '#ccc';
    switch (vehiculo.tipo_conductor) {
        case 'Estudiante': borderColor = '#2ecc71'; break;
        case 'Docente': borderColor = '#e67e22'; break;
        case 'Administrativo': borderColor = '#9b59b6'; break;
        case 'Visitante': borderColor = '#e74c3c'; break;
    }
    // Atributos para animación (AOS)
    card.setAttribute('data-aos', 'flip-left');
    card.setAttribute('data-aos-duration', '800');
    card.style.borderLeft = `4px solid ${borderColor}`;
    card.dataset.placa = vehiculo.placa; // Para búsqueda por placa
    // Contenido HTML de la tarjeta
    card.innerHTML = `
        <h3>${vehiculo.placa}</h3>
        <p><strong>Conductor:</strong> ${vehiculo.conductor}</p>
        <p><strong>Tipo:</strong> ${vehiculo.tipo_conductor}</p>
        <p><strong>Ubicación:</strong> ${reemplazarGuionBajo(vehiculo.puerta)}</p>
        <div class="vehicle-meta">
            <span>${vehiculo.hora_entrada}</span>
            <span>${vehiculo.fecha_entrada}</span>
        </div>
        <button class="btn-salida" data-placa="${vehiculo.placa}">Registrar Salida</button>
    `;
    // Agrega la tarjeta al contenedor
    vehicleGrid.appendChild(card);
    // Listener para botón "Registrar Salida"
    card.querySelector('.btn-salida').addEventListener('click', function () {
        registrarSalida(vehiculo.placa);
    });
}

// === Actualiza los espacios disponibles generales y por puerta ===
function actualizarEspaciosDisponibles() {
    const totalDisponible = ESPACIO_TOTAL - vehiculos.length;
    const espacioDisponibleTotal = document.getElementById('espacio_disponible');
    if (espacioDisponibleTotal) {
        espacioDisponibleTotal.textContent = totalDisponible;
    }

    // Por cada puerta, actualiza el contador individual
    Object.keys(LIMITES_PUERTAS).forEach(puerta => {
        const count = vehiculos.filter(v => v.puerta === puerta).length;
        const disponibles = LIMITES_PUERTAS[puerta] - count;
        const espacioPuertaEl = document.getElementById(`espacio_${puerta}`);
        if (espacioPuertaEl) {
            espacioPuertaEl.textContent = disponibles;
        }
    });
}

// === Filtro de vehículos por placa (buscador) ===
function buscarVehiculo() {
    const termino = this.value.toLowerCase(); // Lo que el usuario escribe
    const cards = document.querySelectorAll('.vehicle-card');

    // Muestra u oculta tarjetas según si la placa coincide
    cards.forEach(card => {
        const placa = card.dataset.placa.toLowerCase();
        card.style.display = placa.includes(termino) ? 'block' : 'none';
    });
}

// === Muestra alertas en pantalla temporalmente ===
function mostrarAlerta(mensaje, tipo) {
    const alerta = document.createElement('div');
    alerta.className = `alerta ${tipo}`;
    alerta.textContent = mensaje;

    document.body.appendChild(alerta);

    setTimeout(() => {
        alerta.remove(); // Elimina después de 3 segundos
    }, 3000);
}

// === Reemplaza guiones bajos con espacios para mostrar en texto ===
function reemplazarGuionBajo(texto) {
    return texto.replace(/_/g, ' ');
}
