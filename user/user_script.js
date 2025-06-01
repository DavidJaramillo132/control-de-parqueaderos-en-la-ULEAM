// Obtener los datos del localStorage con la clave 'vehiculos_parqueadero'
const datos = localStorage.getItem('vehiculos_parqueadero');
if (datos) {
    // Si existen datos, los parsea a un arreglo de objetos JavaScript
    const vehiculos = JSON.parse(datos);
    // Imprime los vehículos cargados en la consola
    console.log('Vehículos cargados:', vehiculos);
}

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    const datos = localStorage.getItem('vehiculos_parqueadero');

    if (datos) {
        // Si hay datos, los parsea
        const vehiculos = JSON.parse(datos);
        // Para cada vehículo, ejecuta la función buscarVehiculo
        vehiculos.forEach(buscarVehiculo);
    } else {
        // Si no hay datos, muestra un mensaje de que no hay vehículos registrados
        document.getElementById('lista-vehiculos').innerText = 'No hay vehículos registrados.';
    }
});

// Función que configura el evento para buscar un vehículo
function buscarVehiculo(vehiculo) {
    // Agrega un event listener al botón con id 'btn-buscar'
    document.getElementById(`btn-buscar`).addEventListener(`click`, function () {

        // Obtiene el valor ingresado por el usuario
        let vehiculoABuscar = document.getElementById(`buscar-vehiculo`).value;

        // Compara la placa del vehículo actual con el valor ingresado (sin importar mayúsculas/minúsculas)
        if (vehiculo.placa.toLowerCase() === vehiculoABuscar.toLowerCase()) {

            // Elimina todas las tarjetas existentes de vehículos
            document.querySelectorAll('.vehicle-card').forEach(e => e.remove());

            // Crea una nueva tarjeta con los datos del vehículo encontrado
            const card = document.createElement('div');
            card.className = 'vehicle-card';
            card.innerHTML = `
        <h3>${vehiculo.placa}</h3>
        <p><strong>Conductor:</strong> ${vehiculo.conductor}</p>
        <p><strong>Tipo:</strong> ${vehiculo.tipo_conductor}</p>
        <p><strong>Ubicación:</strong> ${vehiculo.puerta.replace(/_/g, ' ')}</p>
        <p><strong>Entrada:</strong> ${vehiculo.fecha_entrada} ${vehiculo.hora_entrada}</p>
      `;

            // Agrega la tarjeta al contenedor con id 'lista-vehiculos'
            document.getElementById('lista-vehiculos').appendChild(card);
        }
    })
}
