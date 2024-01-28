var express = require("express");
var morgan = require("morgan");
let cors = require("cors");
var app = express();

const PARAMETROS_CONSULTABLES = [
  "nombre",
  "consola",
  "nota-minima",
  "fecha-lanzamiento",
];

const PORT = 3000;
let JUEGOS = require("./juegos.json"); //aqui no me deja ponerlo solo como juegos

//recibe parametros por url
// app.use(express.static("public"));
app.use(morgan("dev"));
app.use(cors());
app.use(express.static(__dirname + "/public"));
app.use(express.json());

app.listen(PORT, () => {
  console.log("Server escuchando en el puerto " + PORT);
});

app.get("/", (req, res) => {
  res.send("Hola mundo");
});

app.get("/api/juegos", (req, res) => {
  let juegos_propiedades = JUEGOS.map((juego) => {
    return {
      id: juego.id,
      nombre: juego.nombre,
      fecha_lanzamiento: juego.fecha_lanzamiento,
      consola: juego.consola,
      nota: juego.nota,
    };
  });
  res.json({
    success: true,
    message: "Juegos encontrados",
    data: {
      count: juegos_propiedades.length,
      juegos: juegos_propiedades,
    },
  });
});

app.get("/api/juegos/:id", (req, res) => {
  //aqui me sale este error
  let id = req.params.id;
  let filtro = JUEGOS.filter((juego) => juego.id == id);
  if (filtro.length > 0) {
    res.json({
      success: true,
      message: "juego enconctrado con id: " + id,
      data: filtro[0],
    });
  } else {
    res.status(404).json({
      success: false,
      error_code: 4321,
      message: "No se encuentra ningún juego con el id: " + id,
    });
  }
});

app.get("/api/juegos/filtrar", (req, res) => {
  let consultas = req.query;

  // Función para filtrar por consola
  function filtrarPorConsola(juegos, consola) {
    return juegos.filter(
      (juego) => juego.consola.toLowerCase() === consola.toLowerCase()
    );
  }
  // Función para filtrar por nota mínima
  function filtrarPorNotaMinima(juegos, notaMinima) {
    return juegos.filter((juego) => juego.nota >= notaMinima);
  }
  function filtrarPorSalida(juegos, fecha_lanzamiento) {
    return juegos.filter(
      (juego) => juego.fecha_lanzamiento === fecha_lanzamiento
    );
  }

  // Aplicar filtros
  let juegosFiltrados = [...juegos];

  if (consultas.consola) {
    juegosFiltrados = filtrarPorConsola(juegosFiltrados, consultas.consola);
  }

  if (consultas.notaMinima) {
    juegosFiltrados = filtrarPorNotaMinima(
      juegosFiltrados,
      parseFloat(consultas.notaMinima)
    );
  }
  if (consultas.fecha_lanzamiento) {
    juegosFiltrados = filtrarPorSalida(
      juegosFiltrados,
      consultas.fecha_lanzamiento
    );
  }

  res.json({
    success: true,
    message: "Listado de juegos filtrados",
    data: {
      count: juegosFiltrados.length,
      juegos: juegosFiltrados,
    },
  });
});

// Endpoint para crear un nuevo juego
app.post("/api/juegos", (req, res) => {
  const nuevoJuego = req.body;
  nuevoJuego.id = JUEGOS.length + 1;
  JUEGOS.push(nuevoJuego);
  

  console.log(JUEGOS);
  res.status(201).json({
    success: true,
    message: "Juego creado con éxito",
    data: nuevoJuego,
  });
});

// Endpoint para actualizar un juego por ID
app.put("/api/juegos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = JUEGOS.findIndex((item) => item.id === id);

  if (index !== -1) {
    JUEGOS[index] = req.body;
    console.log(JUEGOS);
    res.json({
      success: true,
      message: "Juego actualizado con éxito",
      data: JUEGOS[index],
    });
  } else {
    res.status(404).json({
      success: false,
      error_code: 4321,
      message: "Juego no encontrado",
    });
  }
});

// Endpoint para borrar un juego por ID
app.delete("/api/juegos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  JUEGOS = JUEGOS.filter((item) => item.id !== id);
  console.log(JUEGOS);
  res.json({
    success: true,
    message: "Juego eliminado con éxito",
  });
});
