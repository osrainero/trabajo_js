function Auto(nombre, marca, precio, color) {
  this.nombre = nombre;
  this.marca = marca;
  this.precio = precio;
  this.color = color;
}

async function cargarDatosDesdeJSON() {
  try {
    const response = await fetch('autos.json');
    if (!response.ok) {
      throw new Error('No se pudo cargar el archivo JSON');
    }
    const datos = await response.json();
    return datos;
  } catch (error) {
    console.error(error);
    return [];
  }
}

cargarDatosDesdeJSON().then((datos) => {
  const autos = datos.map((item) => new Auto(item.nombre, item.marca, item.precio, item.color));

  function mostrarListaAutos() {
    const autosListDiv = document.querySelector(".autos-list");
    const listaHTML = `
      <h2>Estos son los autos a la venta:</h2>
      ${autos.map(auto => `
          <div class="auto">
              <h3>${auto.nombre}</h3>
              <p><strong>Marca:</strong> ${auto.marca}</p>
              <p><strong>Precio:</strong> ${auto.precio}</p>
              <p><strong>Color:</strong> ${auto.color}</p>
          </div>
      `).join('')}
    `;
    autosListDiv.innerHTML = listaHTML;
  }

  function registrarNombre() {
    const nombreGuardado = localStorage.getItem('nombreUsuario');
    if (nombreGuardado) {
      localStorage.removeItem('nombreUsuario');
      mostrarNombre();
    } else {
      const nombre = prompt('Ingrese su nombre:');
      if (nombre) {
        localStorage.setItem('nombreUsuario', nombre);
        mostrarNombre();
      }
    }
  }

  function mostrarNombre() {
    const nombreGuardado = localStorage.getItem('nombreUsuario');
    const registrarBtn = document.getElementById('registrarBtn');
    const usuarioDiv = document.getElementById('usuario');
    const menuUsuarioDiv = document.getElementById('menuUsuario');

    if (nombreGuardado) {
      usuarioDiv.textContent = `Bienvenido ${nombreGuardado}`;
      registrarBtn.textContent = 'Salir';
      menuUsuarioDiv.innerHTML = `
          <button id="comparBtn">Comprar Vehiculo</button>
          <button id="venderBtn">Vender un Vehiculo</button>
      `;

      const comparBtn = document.getElementById('comparBtn');
      const venderBtn = document.getElementById('venderBtn');
      comparBtn.addEventListener('click', mostrarFormularioCompra);
      venderBtn.addEventListener('click', mostrarFormularioCarga);
    } else {
      usuarioDiv.textContent = '';
      registrarBtn.textContent = 'Registrar';
      menuUsuarioDiv.innerHTML = '';
    }
  }

  function mostrarFormularioCarga() {
    const autosVentaDiv = document.querySelector('.autosVenta');
    const formularioHTML = `
      <h2>Cargar Nuevo Auto</h2>
      <form id="autoForm">
          <label for="nombre">Nombre:</label>
          <input type="text" id="nombre" required><br>
          <label for="marca">Marca:</label>
          <input type="text" id="marca" required><br>
          <label for="precio">Precio:</label>
          <input type="number" id="precio" required><br>
          <label for="color">Color:</label>
          <input type="text" id="color" required><br>
          <button type="submit">Agregar auto al Catalogo</button>
      </form>
    `;

    autosVentaDiv.innerHTML = formularioHTML;

    const autoForm = document.getElementById('autoForm');

    autoForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const nombre = document.getElementById('nombre').value;
      const marca = document.getElementById('marca').value;
      const precio = parseFloat(document.getElementById('precio').value);
      const color = document.getElementById('color').value;

      if (nombre && marca && !isNaN(precio) && color) {
        const nuevoAuto = new Auto(nombre, marca, precio, color);
        autos.push(nuevoAuto);
        localStorage.setItem('autos', JSON.stringify(autos));
        mostrarListaAutos();
        autoForm.reset();
        autosVentaDiv.innerHTML = '';

        Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: 'El auto se ha agregado al catálogo.'
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Por favor, complete todos los campos correctamente.'
        });
      }
    });
  }

  function mostrarFormularioCompra() {
    const autosCompraDiv = document.querySelector('.autosCompra');
    const formularioHTML = `
      <h2>Comprar Auto</h2>
      <form id="compraForm">
          <label for="autosDisponibles">Selecciona un auto:</label>
          <select id="autosDisponibles">
              ${autos.map((auto, index) => `<option value="${index}">${auto.nombre}</option>`).join('')}
          </select><br>
          <button type="submit">Quiero comprar este Auto!</button>
      </form>
    `;

    autosCompraDiv.innerHTML = formularioHTML;

    const compraForm = document.getElementById('compraForm');

    compraForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const selectedIndex = document.getElementById('autosDisponibles').value;

      if (selectedIndex !== "") {
        const autoComprado = autos.splice(selectedIndex, 1)[0];
        localStorage.setItem('autos', JSON.stringify(autos));

        Swal.fire({
          icon: 'success',
          title: '¡Felicitaciones!',
          text: `¡Has comprado el ${autoComprado.nombre}!`
        });

        mostrarListaAutos();
        autosCompraDiv.innerHTML = '';
      } else {
        Swal.fire({
          icon: 'warning',
          title: '¡Atención!',
          text: 'Por favor, seleccione un auto antes de comprar.'
        });
      }
    });
  }

  const registrarBtn = document.getElementById('registrarBtn');
  registrarBtn.addEventListener('click', registrarNombre);

  mostrarNombre();
  mostrarListaAutos();
});
