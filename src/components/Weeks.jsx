import { useNavigate } from "react-router-dom";

function Weeks() {
  const navigate = useNavigate();

  // =====================================================
  // Datos de ejemplo
  const alumno = {
    nombre: "Juan Perez",
    fechaInicio: "01/09/2025",
    fechaFin: "30/09/2025"
  };
  // =====================================================

  // =====================================================
  // Semanas de ejemplo
  const semanas = [
    { numero: 1, estado: "Pendiente" },
    { numero: 2, estado: "En curso" },
    { numero: 3, estado: "Completada" },
    { numero: 4, estado: "Anulada" }
  ];
  // ======================================================

  // ======================================================
  // Funcion para obtener iniciales del nombre del alumno
  function obtenerIniciales(nombre) {
    const palabras = nombre.split(" ");
    return palabras[0][0] + palabras[1][0];
  }
  // ======================================================

  // ======================================================
  // Funcion para cerrar sesion
  function cerrarSesion() {
    localStorage.clear();
    navigate("/");
  }
  // ======================================================

  // ======================================================
  // Funcion editarSemana
  function editarSemana(numero){
    navigate("/editweek/" + numero);
  }
  // ======================================================

  return (
  <div>
    <header>
      <div>
        {obtenerIniciales(alumno.nombre)}
      </div>
      <button onClick={cerrarSesion}>Cerrar sesión</button>
    </header>

    <hr />
    <h2>Periodo de prácticas</h2>
    <p><strong>Fecha inicio:</strong> {alumno.fechaInicio}</p>
    <p><strong>Fecha fin:</strong> {alumno.fechaFin}</p>
    <hr />
    {semanas.map((semana) => (
      <div key={semana.numero}>
       <h3>Semana {semana.numero}</h3>
       <p><strong>Estado:</strong>{semana.estado}</p> 
       <button onClick={() => editarSemana(semana.numero)}>Editar</button>
       <button>Descargar</button>
       <hr />
       </div>
    ))}
  </div>
);
}
export default Weeks;
