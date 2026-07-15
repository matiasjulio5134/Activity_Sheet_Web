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
    { numero: 3, estado: "Completado", actual: false },
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
    if (semana.estado === "Completado") { return false; }
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
  function puedeDescargar(semana) {
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
    <div className="pantalla-practicas">
      <header className="cabecera">
        <div className="encabezado">
          <h2 className="logo">
            <span className="naranja">CAS</span> Training
          </h2>
          <div className="iniciales-container">
            <span className="avatar-circulo">
              {obtenerIniciales(alumno.nombre)}
            </span>
            <button className="btn-cerrar-sesion" onClick={cerrarSesion}>
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      <div className="contenedor-principal">
        <div className="info-periodo">
          <h2 className="titulo-periodo">Periodo de prácticas</h2>
          <p className="texto-periodo"><strong>Fecha inicio:</strong> {alumno.fechaInicio}</p>
          <p className="texto-periodo"><strong>Fecha fin:</strong> {alumno.fechaFin}</p>
        </div>

        <h2 className="titulo-seccion">Listado de semanas</h2>

        <div className="listado-semanas">
          {semanas.map((semana) => {
            const isCompletado = semana.estado.toLowerCase() === 'completado';
            return (
              <div key={semana.numero} className="semana-tarjeta">
                <div className="semana-info">
                  <h3 className="semana-titulo">Semana {semana.numero}</h3>
                  <p className="semana-fechas">
                    Desde {alumno.fechaInicio} hasta {alumno.fechaFin}
                  </p>
                </div>

                <div className="semana-acciones">
                  <span className={`estado-badge ${isCompletado ? 'badge-completado' : 'badge-pendiente'}`}>
                    {semana.estado}
                  </span>

                  <button
                    className="btn-accion"
                    onClick={() => editarSemana(semana.numero)}
                    disabled={!puedeEditar(semana)}
                  >
                    Editar
                  </button>

                  <button
                    className="btn-accion"
                    disabled={!puedeDescargar(semana)}
                  >
                    Descargar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
export default Weeks;
