// Configuración inicial
const ESPACIO_TOTAL = 20;
let vehiculos = [];

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
  actualizarEspaciosDisponibles();
  document.getElementById('search-vehicle').addEventListener('input', buscarVehiculo);
});

// Manejo del formulario
document.getElementById('formulario').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const placa = document.getElementById('placa').value.trim().toUpperCase();
  const conductor = document.getElementById('conductor').value.trim();
  const tipo_conductor = document.getElementById('tipo_conductor').value;

  if (!validarFormulario(placa, conductor, tipo_conductor)) return;
  
  if (vehiculos.length >= ESPACIO_TOTAL) {
    mostrarAlerta('El parqueadero está lleno. No hay espacios disponibles.', 'error');
    return;
  }

  const vehiculo = crearVehiculo(placa, conductor, tipo_conductor);
  agregarVehiculo(vehiculo);
  this.reset();
});

// Funciones auxiliares
function validarFormulario(placa, conductor, tipo) {
  if (!placa || !conductor || !tipo) {
    mostrarAlerta('Por favor, complete todos los campos.', 'warning');
    return false;
  }
  
  if (vehiculos.some(v => v.placa === placa)) {
    mostrarAlerta('Esta placa ya está registrada en el parqueadero.', 'error');
    return false;
  }
  
  return true;
}

function crearVehiculo(placa, conductor, tipo) {
  return {
    placa,
    conductor,
    tipo_conductor: tipo,
    hora_entrada: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    fecha_entrada: new Date().toLocaleDateString(),
    timestamp: Date.now()
  };
}

function agregarVehiculo(vehiculo) {
  vehiculos.push(vehiculo);
  renderVehiculo(vehiculo);
  actualizarEspaciosDisponibles();
  mostrarAlerta(`Vehículo ${vehiculo.placa} registrado exitosamente.`, 'success');
}

// Renderizado de vehículos
function renderVehiculo(vehiculo) {
  const vehicleGrid = document.getElementById('cartar_de_vehiculos');
  
  const card = document.createElement('div');
  card.className = 'vehicle-card';
  card.dataset.type = vehiculo.tipo_conductor;
  card.dataset.placa = vehiculo.placa;
  
  card.innerHTML = `
    <h3>${vehiculo.placa}</h3>
    <p><strong>Conductor:</strong> ${vehiculo.conductor}</p>
    <p><strong>Tipo:</strong> ${vehiculo.tipo_conductor}</p>
    <div class="vehicle-meta">
      <span>${vehiculo.hora_entrada}</span>
      <span>${vehiculo.fecha_entrada}</span>
    </div>
    <button class="btn-salida" data-placa="${vehiculo.placa}">Registrar Salida</button>
  `;
  
  vehicleGrid.appendChild(card);
  
  // Agregar evento al botón de salida
  card.querySelector('.btn-salida').addEventListener('click', function() {
    registrarSalida(vehiculo.placa);
  });
}

// Funciones de utilidad
function actualizarEspaciosDisponibles() {
  const disponibles = ESPACIO_TOTAL - vehiculos.length;
  document.getElementById('espacio_disponible').textContent = disponibles;
  
  // Actualizar barra de capacidad
  const porcentaje = (disponibles / ESPACIO_TOTAL) * 100;
  document.getElementById('capacity-bar').style.width = `${porcentaje}%`;
  
  // Cambiar color según disponibilidad
  const capacityBar = document.getElementById('capacity-bar');
  if (porcentaje < 20) {
    capacityBar.style.background = 'linear-gradient(90deg, #e74c3c, #c0392b)';
  } else if (porcentaje < 50) {
    capacityBar.style.background = 'linear-gradient(90deg, #f39c12, #e67e22)';
  } else {
    capacityBar.style.background = 'linear-gradient(90deg, #2ecc71, #27ae60)';
  }
}

function buscarVehiculo() {
  const termino = this.value.toLowerCase();
  const cards = document.querySelectorAll('.vehicle-card');
  
  cards.forEach(card => {
    const placa = card.dataset.placa.toLowerCase();
    card.style.display = placa.includes(termino) ? 'block' : 'none';
  });
}

function registrarSalida(placa) {
  vehiculos = vehiculos.filter(v => v.placa !== placa);
  document.querySelector(`.vehicle-card[data-placa="${placa}"]`).remove();
  actualizarEspaciosDisponibles();
  mostrarAlerta(`Vehículo ${placa} ha sido retirado.`, 'info');
}

function mostrarAlerta(mensaje, tipo) {
  // Implementar un sistema de notificaciones bonito
  console.log(`[${tipo.toUpperCase()}] ${mensaje}`);
  // Puedes usar Toastify, SweetAlert o similar aquí
}