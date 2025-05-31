const datos = localStorage.getItem('vehiculos_parqueadero');
if (datos) {
    const vehiculos = JSON.parse(datos);
    console.log('Vehículos cargados:', vehiculos);
}

document.addEventListener('DOMContentLoaded', () => {
    const datos = localStorage.getItem('vehiculos_parqueadero');
    if (datos) {
        const vehiculos = JSON.parse(datos);
        vehiculos.forEach(buscarVehiculo);
    } else {
        document.getElementById('lista-vehiculos').innerText = 'No hay vehículos registrados.';
    }
});

function buscarVehiculo(vehiculo) {
    document.getElementById(`btn-buscar`).addEventListener(`click`, function () {

        let vehiculoABuscar = document.getElementById(`buscar-vehiculo`).value;
        if (vehiculo.placa.toLowerCase() === vehiculoABuscar.toLowerCase()) {
            document.querySelectorAll('.vehicle-card').forEach(e => e.remove());
            const card = document.createElement('div');
            card.className = 'vehicle-card';
            card.innerHTML = `
        <h3>${vehiculo.placa}</h3>
        <p><strong>Conductor:</strong> ${vehiculo.conductor}</p>
        <p><strong>Tipo:</strong> ${vehiculo.tipo_conductor}</p>
        <p><strong>Ubicación:</strong> ${vehiculo.puerta.replace(/_/g, ' ')}</p>
        <p><strong>Entrada:</strong> ${vehiculo.fecha_entrada} ${vehiculo.hora_entrada}</p>
      `;
            document.getElementById('lista-vehiculos').appendChild(card);
        }
    })
}