let espacio_total = 20; 
document.getElementById('formulario').addEventListener('submit', function (e) {
    e.preventDefault();

    const placa = document.getElementById('placa').value.trim();
    const conductor = document.getElementById('conductor').value.trim();
    const tipo_conductor = document.getElementById('tipo_conductor').value;

    if (placa === '' || conductor === '') {
        alert('Por favor, complete todos los campos.')
        return;
    }
    const vehiculo = {
        placa,
        conductor,
        tipo_conductor,
        hora_entrada: new Date().toLocaleTimeString()
    };
    // Llama a la funcion que agrega el vehiculo en una carta
    renderVehicle(vehiculo);
    // Limpia el formulario
    this.reset();
});

// Agregar vehiculo
function renderVehicle(vehiculo) {
    const card = document.createElement('div');
    card.className = 'vehicle-card';

    card.innerHTML = `
        <p><strong>Matrícula:</strong> ${vehiculo.placa}</p>
        <p><strong>Conductor:</strong> ${vehiculo.conductor}</p>
        <p><strong>Tipo:</strong> ${vehiculo.tipo_conductor}</p>
        <p><strong>Hora de entrada:</strong> ${vehiculo.hora_entrada}</p>
        <button class="btn btn-danger" onclick="removeVehicle(this)">Eliminar</button>
    `;

    espacio_total--;
    actualizarContador()
    document.getElementById('cartar_de_vehiculos').appendChild(card);
}

// Eliminar vehiculo
function removeVehicle(button){
    espacio_total++;
    actualizarContador()
    const card = button.parentElement;
    card.remove();
}

// Contador de espacio disponible
function actualizarContador() {
    document.getElementById('espacio_disponible').textContent = espacio_total;
}
