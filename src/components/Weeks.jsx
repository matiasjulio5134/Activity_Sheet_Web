import { useNavigate } from "react-router-dom";

function Weeks() {
  const navigate = useNavigate();

  // =====================================================
  // Datos de ejemplo
  const alumno = {
    nombre: "Juan Perez",
    fechaInicio: "14/07/2025",
    fechaFin: "20/09/2025"
  };
  // =====================================================

  // =====================================================
  // Semanas de ejemplo
  const semanas = [
    { numero: 1, estado: "Pendiente", actual: false },
    { numero: 2, estado: "En curso", actual: true },
    { numero: 3, estado: "Completada", actual: false },
    { numero: 4, estado: "Anulada", actual: false }
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
  // funcion puedeEditar
  function puedeEditar(semana) {
    if (semana.estado === "Completada") { return false; }
    if (semana.estado === "Anulada") { return false; }
    if (semana.estado === "En curso") { return false; }
    if (semana.estado === "Pendiente" && !semana.actual) { return false; }
    return false;
  }
  // Con esta funcion:
  /*
    En curso -> Editar
    Pendiente (anterior) -> Editar
    Completada -> No Editar
    Anulada -> No Editar
  */
  // ======================================================

  // ======================================================
  // Funcion Descargar Word
  function puedeDecargar(semana) {
    return semana.estado === "Completada";
  }
  // ======================================================

  // ======================================================
  // Funcion editarSemana
  function editarSemana(numero) {
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
          <button onClick={() => editarSemana(semana.numero)}
            disabled={!puedeEditar(semana)}>Editar</button>
          <button disabled={!puedeDecargar(semana)}>Descargar</button>
          <hr />
        </div>
      ))}
    </div>
  );
}
export default Weeks;
