// Configuración inicial
const ESPACIO_TOTAL = 20;
const LIMITES_PUERTAS = {
    Puerta_1: 7,
    Puerta_2: 7,
    Puerta_3: 6
};
let vehiculos = [];

// utils/localStorage
function guardarEnLocalStorage() {
    localStorage.setItem('vehiculos_parqueadero', JSON.stringify(vehiculos));
}

function cargarDesdeLocalStorage() {
    const datos = localStorage.getItem('vehiculos_parqueadero');
    if (datos) {
        vehiculos = JSON.parse(datos);
        vehiculos.forEach(renderVehiculo);
        actualizarEspaciosDisponibles();
    }
}

// DOM Ready
document.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById('search-vehicle')) {
        console.error('Elemento search-vehicle no encontrado');
        return;
    }

    if (document.getElementById('espacio_disponible') &&
        document.getElementById('vehiculos_Puerta_1') &&
        document.getElementById('vehiculos_Puerta_2') &&
        document.getElementById('vehiculos_Puerta_3')) {
        
        cargarDesdeLocalStorage();
        document.getElementById('search-vehicle').addEventListener('input', buscarVehiculo);
    } else {
        console.error('Elementos del DOM necesarios no encontrados');
    }
});

// En agregarVehiculo
function agregarVehiculo(vehiculo) {
    vehiculos.push(vehiculo);
    guardarEnLocalStorage();
    renderVehiculo(vehiculo);
    actualizarEspaciosDisponibles();
    mostrarAlerta(`Vehículo ${vehiculo.placa} registrado en ${reemplazarGuionBajo(vehiculo.puerta)}.`, 'success');
}

// En registrarSalida
function registrarSalida(placa) {
    const vehiculo = vehiculos.find(v => v.placa === placa);
    if (vehiculo) {
        vehiculos = vehiculos.filter(v => v.placa !== placa);
        guardarEnLocalStorage();
        const card = document.querySelector(`.vehicle-card[data-placa="${placa}"]`);
        if (card) {
            card.remove();
        }
        actualizarEspaciosDisponibles();
        mostrarAlerta(`Vehículo ${placa} ha sido retirado de ${reemplazarGuionBajo(vehiculo.puerta)}.`, 'info');
    }
}


function crearVehiculo(placa, conductor, tipo, puerta) {
    return {
        placa,
        conductor,
        tipo_conductor: tipo,
        puerta,
        hora_entrada: new Date().toLocaleTimeString(),
        fecha_entrada: new Date().toLocaleDateString(),
        timestamp: Date.now()
    };
}
// Manejo del formulario
const formulario = document.getElementById('formulario');
if (formulario) {
    formulario.addEventListener('submit', function (e) {
        e.preventDefault();

        const placa = document.getElementById('placa')?.value.trim().toUpperCase();
        const conductor = document.getElementById('conductor')?.value.trim();
        const tipo_conductor = document.getElementById('tipo_conductor')?.value;
        const puerta = document.getElementById('area_estacionamiento')?.value;

        if (!placa || !conductor || !tipo_conductor || !puerta) {
            mostrarAlerta('Por favor, complete todos los campos.', 'warning');
            return;
        }

        if (vehiculos.some(v => v.placa === placa)) {
            mostrarAlerta('Esta placa ya está registrada en el parqueadero.', 'error');
            return;
        }

        if (vehiculos.length >= ESPACIO_TOTAL) {
            mostrarAlerta('El parqueadero está lleno. No hay espacios disponibles.', 'error');
            return;
        }

        const vehiculosEnPuerta = vehiculos.filter(v => v.puerta === puerta).length;
        if (vehiculosEnPuerta >= LIMITES_PUERTAS[puerta]) {
            mostrarAlerta(`La ${reemplazarGuionBajo(puerta)} está llena. Por favor seleccione otra área.`, 'error');
            return;
        }

        const vehiculo = crearVehiculo(placa, conductor, tipo_conductor, puerta);
        agregarVehiculo(vehiculo);
        this.reset();
    });
}






function renderVehiculo(vehiculo) {
    const vehicleGrid = document.getElementById(`vehiculos_${vehiculo.puerta}`);
    if (!vehicleGrid) {
        console.error(`Contenedor vehiculos_${vehiculo.puerta} no encontrado`);
        return;
    }

    const card = document.createElement('div');
    card.className = 'vehicle-card';

    switch (vehiculo.tipo_conductor) {
        case 'Estudiante': borderColor = '#2ecc71'; break;
        case 'Docente': borderColor = '#e67e22'; break;
        case 'Administrativo': borderColor = '#9b59b6'; break;
        case 'Visitante': borderColor = '#e74c3c'; break;
    }
    card.setAttribute('data-aos', 'flip-left');
    card.setAttribute('data-aos-duration', '800');
    card.style.borderLeft = `4px solid ${borderColor}`;

    // card.dataset.type = vehiculo.tipo_conductor;
    card.dataset.placa = vehiculo.placa;
    // card.dataset.puerta = vehiculo.puerta;

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

    vehicleGrid.appendChild(card);

    card.querySelector('.btn-salida').addEventListener('click', function () {
        registrarSalida(vehiculo.placa);
    });
}

function actualizarEspaciosDisponibles() {
    const totalDisponible = ESPACIO_TOTAL - vehiculos.length;
    const espacioDisponibleTotal = document.getElementById('espacio_disponible');
    if (espacioDisponibleTotal) {
        espacioDisponibleTotal.textContent = totalDisponible;
    }

    // Actualizar por puerta
    Object.keys(LIMITES_PUERTAS).forEach(puerta => {
        const count = vehiculos.filter(v => v.puerta === puerta).length;
        const disponibles = LIMITES_PUERTAS[puerta] - count;
        const espacioPuertaEl = document.getElementById(`espacio_${puerta}`);
        if (espacioPuertaEl) {
            espacioPuertaEl.textContent = disponibles;
        }
    });
}

function buscarVehiculo() {
    const termino = this.value.toLowerCase();
    const cards = document.querySelectorAll('.vehicle-card');

    cards.forEach(card => {
        const placa = card.dataset.placa.toLowerCase();
        card.style.display = placa.includes(termino) ? 'block' : 'none';
    });
}

function mostrarAlerta(mensaje, tipo) {
    const alerta = document.createElement('div');
    alerta.className = `alerta ${tipo}`;
    alerta.textContent = mensaje;

    document.body.appendChild(alerta);

    setTimeout(() => {
        alerta.remove();
    }, 3000);
}

function reemplazarGuionBajo(texto) {
    return texto.replace(/_/g, ' ');
}

