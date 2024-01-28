const dominio = "http://localhost:3000";

function mostrarFormularioModificar(juego) {
  const formularioModificar = document.getElementById(
    "formulario-modificar-juego"
  );
  const divModificar = document.getElementById("div-modificar");
  const idHidden = document.createElement("p");
  idHidden.innerText = juego.id;
  idHidden.classList.add("no-mostrar");
  idHidden.id = "id-juego-modificar";

  divModificar.appendChild(idHidden);

  divModificar.classList.remove("no-mostrar");

  // Rellenar el formulario con los datos actuales del juego
  document.getElementById("nombre-modificar").value = juego.nombre;
  document.getElementById("consola-modificar").value = juego.consola;
  document.getElementById("nota-modificar").value = juego.nota;
  document.getElementById("fecha_lanzamiento-modificar").value =
    juego.fecha_lanzamiento;

  // Agregar un atributo data-id al formulario para saber qué juego estamos modificando
  formularioModificar.dataset.id = juego.id;
}

// Función para cancelar la modificación y ocultar el formulario
function cancelarModificacion() {
  const formularioModificar = document.getElementById(
    "formulario-modificar-juego"
  );
  

  formularioModificar.reset();
}
// Función para enviar el formulario de modificación
async function modificarJuego(event) {
  event.preventDefault();

  const formularioModificar = document.getElementById(
    "formulario-modificar-juego"
  );
  const formData = new FormData(formularioModificar);
  const id = +document.getElementById("id-juego-modificar").innerText;
  document.getElementById("id-juego-modificar").remove();

  console.log(id); // Obtener el id del juego a modificar

  const juegoModificado = {
    id: id,
    nombre: formData.get("nombre-modificar"),
    consola: formData.get("consola-modificar"),
    nota: formData.get("nota-modificar"),
    fecha_lanzamiento: formData.get("fecha_lanzamiento-modificar"),
  };

  const response = await fetch(dominio + `/api/juegos/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(juegoModificado),
  });

  const data = await response.json();
  //   console.log(data);

  const mensaje = document.getElementById("mensaje");
  mensaje.innerHTML = data.message;

  // Recargar la lista de juegos
  const juegosLista = document.getElementById("juegos-lista");
  juegosLista.innerHTML = "";
  cargarListaJuegos();
}
// Función para enviar una solicitud de borrado de juego
async function borrarJuego(id) {
  const response = await fetch(dominio + `/api/juegos/${id}`, {
    method: "DELETE",
  });

  const data = await response.json();

  const mensaje = document.getElementById("mensaje");
  mensaje.innerHTML = data.message;

  // Recargar la lista de juegos
  const juegosLista = document.getElementById("juegos-lista");
  juegosLista.innerHTML = "";
  cargarListaJuegos();
}

// Modifica el evento submit del formulario de modificación
document
  .getElementById("formulario-modificar-juego")
  .addEventListener("submit", modificarJuego);

// Modifica el evento submit del formulario de creación para obtener un id
document
  .getElementById("formulario-nuevo-juego")
  .addEventListener("submit", function (event) {
    event.preventDefault();
  });

function crearElementoJuego(juego) {
  const juegosLista = document.getElementById("juegos-lista");
  const juegoItem = document.createElement("div");

  juegoItem.className = "juego-item";
  juegoItem.innerHTML = `<span class="negrita">${juego.nombre}</span> -
                         <span class="negrita">Consola:</span> ${juego.consola} -
                         <span class="negrita">Nota:</span> ${juego.nota} -
                         <span class="negrita">Fecha de Lanzamiento:</span> ${juego.fecha_lanzamiento}`;

  const editButton = document.createElement("button");
  editButton.innerHTML = "<img src='./img/edit.svg' width='15' height='15'>";
  editButton.classList.add("edit-button");
  editButton.addEventListener("click", () => {
    mostrarFormularioModificar(juego);
    document
      .getElementById("div-modificar")
      .scrollIntoView({ behavior: "smooth" });
  });

  const deleteButton = document.createElement("button");
  deleteButton.innerHTML =
    "<img src='./img/delete.svg' width='15' height='15'>";
  deleteButton.classList.add("delete-button");
  deleteButton.addEventListener("click", () => borrarJuego(juego.id));

  juegoItem.appendChild(editButton);
  juegoItem.appendChild(deleteButton);
  juegosLista.appendChild(juegoItem);
}

async function cargarListaJuegos() {
  try {
    const response = await fetch(dominio + "/api/juegos");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    } else {
      const data = await response.json();

      data.data.juegos.forEach((juego) => {
        crearElementoJuego(juego);
      });
    }
  } catch (error) {
    console.log("Ha ocurrido un error: ", error);
  }
}

async function crearNuevoJuego(event) {
  const juegosLista = document.getElementById("juegos-lista");

  event.preventDefault();

  const formulario = document.getElementById("formulario-nuevo-juego");
  const formData = new FormData(formulario);

  const response = await fetch(dominio + "/api/juegos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(Object.fromEntries(formData)),
  });

  const data = await response.json();
  console.log(data);

  const mensaje = document.getElementById("mensaje");
  mensaje.innerHTML = data.message;

  //ES MAS EFICIENTE
  const juego = Object.fromEntries(formData);
  juego.id = juegosLista.children.length + 1;
  crearElementoJuego(juego);

  formulario.reset();
}

function mostrarMensaje(mensaje, tipo) {
  const mensajeElemento = document.getElementById("mensaje");
  mensajeElemento.innerText = mensaje;
  mensajeElemento.className = tipo;
  mensajeElemento.style.display = "block";

  // Ocultar el mensaje después de 3 segundos
  setTimeout(() => {
    mensajeElemento.style.display = "none";
  }, 3000);
}

document.addEventListener("DOMContentLoaded", () => {
  cargarListaJuegos();

  document
    .getElementById("formulario-nuevo-juego")
    .addEventListener("submit", crearNuevoJuego);
});

// Mostrar mensaje de éxito
mostrarMensaje("Juego creado con éxito", "success");
