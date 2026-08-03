import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Weeks() {
  const navigate = useNavigate();
  const [fechaSimulada, setFechaSimulada] = useState("");
  const [avisosCerrados, setAvisosCerrados] = useState([]);

  // =====================================================
  // Usuario guardado despues del login
  const usuarioGuardado = JSON.parse(localStorage.getItem("usuario"));

  // Datos de alumnos
  const [alumno, setAlumno] = useState({
    nombre: "",
    fechaInicio: "",
    fechaFin: "",
  });
  // =====================================================

  // =====================================================
  // Semanas
  const [semanas, setSemanas] = useState([]);
  useEffect(() => {
    const obtenerPracticas = async () => {
      try {
        const token = localStorage.getItem("token");

        let url = "http://localhost:3000/internships/my-internship";

        if (fechaSimulada) {
          url += `?mockDate=${fechaSimulada}`;
        }

        console.log("URL enviada:", url);

        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const datos = response.data;
        console.log("DATOS RECIBIDOS:", datos);

        setAlumno({
          nombre: usuarioGuardado?.nombre || "",
          fechaInicio: datos.start_date,
          fechaFin: datos.end_date,
        });

        setSemanas(datos.weeklyLog);
      } catch (error) {
        console.error("Error obteniendo las prácticas:", error);
      }
    };

    obtenerPracticas();
  }, [fechaSimulada]);
  /*const semanas = [
    { numero: 1, estado: "Pendiente", actual: false },
    { numero: 2, estado: "En curso", actual: true },
    { numero: 3, estado: "Completado", actual: false },
    { numero: 4, estado: "Anulada", actual: false }
  ];*/
  // ======================================================

  const handleDowloadFile = async (weekId) => {
    const token = localStorage.getItem("token");

    const url = `http://localhost:3000/weekly-logs/${weekId}/download-word`;

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob",
      });

      // Extraer nombre de archivo desde Content-Disposition si está disponible
      const disposition =
        response.headers["content-disposition"] ||
        response.headers["Content-Disposition"];

      console.log('disposition >> ', disposition);
      
      

      let filename = "hoja_actividad.docx";
      if (disposition) {
        const fileNameMatch = disposition.match(/filename\s*=\s*"?([^";]+)"?/);
        if (fileNameMatch) {
          filename = fileNameMatch[1];
        }
      }

      const blob = new Blob([response.data], { type: response.data.type });
      const href = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = href;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(href);
    } catch (error) {
      console.error("Error descargado el archivo ", error);
    }
  };

  // ======================================================
  // Funcion para obtener iniciales del nombre del alumno
  function obtenerIniciales(nombre) {
    if (!nombre) return "";

    const palabras = nombre.trim().split(" ");

    if (palabras.length === 1) {
      return palabras[0].substring(0, 2).toUpperCase();
    }

    return (palabras[0][0] + palabras[palabras.length - 1][0]).toUpperCase();
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
  // Funcion para calcular progreso
  function calcularProgreso(fechaInicio, fechaFin) {
    const inicio = convertirFecha(fechaInicio);
    const fin = convertirFecha(fechaFin);
    const hoy = new Date();

    // En caso de que todavia no haya comenzado las practicas
    if (hoy < inicio) {
      return 0;
    }
    // O si ya han terminado
    if (hoy >= fin) {
      return 100;
    }
    const duracionTotal = fin - inicio;
    const tiempoTrancurrido = hoy - inicio;

    return Math.round((tiempoTrancurrido / duracionTotal) * 100);
  }
  // ======================================================

  // ======================================================
  // Funcion para convertir fechas
  function convertirFecha(fecha) {
    if (!fecha) return new Date();

    return new Date(fecha);
  }
  // ======================================================

  // ======================================================
  // Funcion para calcular la semana
  function calcularSemanaActual(fechaInicio) {
    const inicio = convertirFecha(fechaInicio);

    const hoy = fechaSimulada
      ? new Date(fechaSimulada + "T00:00:00")
      : new Date();

    const diferencia = hoy - inicio;

    const diasTranscurridos = Math.floor(diferencia / (1000 * 60 * 60 * 24));

    if (diasTranscurridos < 0) {
      return 0;
    }

    return Math.floor(diasTranscurridos / 7) + 1;
  }
  // ======================================================

  // ======================================================
  // calcular datos de progreso
  const progreso = calcularProgreso(alumno.fechaInicio, alumno.fechaFin);
  const semanaActual = calcularSemanaActual(alumno.fechaInicio);
  const semanasCompletas = semanas.filter(
    (semana) => semana.estado === "Completado",
  ).length;
  // ======================================================

  // ======================================================
  // funcion puedeEditar
  function puedeEditar(semana) {
    const estado = obtenerEstadoSemana(semana);

    if (estado === "Completado") {
      return false;
    }

    if (estado === "Anulada") {
      return false;
    }

    if (estado === "En curso") {
      return true;
    }

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
    return semana.status === "Completado";
  }
  // ======================================================

  // ======================================================
  // Funcion editarSemana
  function editarSemana(numero) {
    navigate("/editweek/" + numero);
  }
  // ======================================================

  // ======================================================
  // Funcion para mostrar fechas en formato DD/MM/AAAA y fecha anterior
  function formatearFecha(fecha) {
    if (!fecha) return "";

    const fechaObjeto = new Date(fecha);

    return fechaObjeto.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }
  function fechaFueraDePracticas() {
    if (!fechaSimulada || !alumno.fechaInicio || !alumno.fechaFin) {
      return false;
    }

    // Fecha de inicio: YYYY-MM-DD
    const fechaInicio = alumno.fechaInicio.substring(0, 10);

    // Fecha de finalización: YYYY-MM-DD
    const fechaFin = alumno.fechaFin.substring(0, 10);

    // Si la fecha seleccionada es anterior al inicio
    // O posterior al final
    return fechaSimulada < fechaInicio || fechaSimulada > fechaFin;
  }
  // ======================================================

  // ======================================================
  // funcion cerrar aviso
  function cerrarAviso(weekId) {
    setAvisosCerrados((avisos) => [...avisos, weekId]);
  }
  // ======================================================

  // ======================================================
  // Funcion obtener Estado Semana
  function obtenerEstadoSemana(semana) {
    // =========================================
    // FECHA QUE VAMOS A UTILIZAR
    // =========================================
    // Si hay una fecha seleccionada en el input,
    // usamos esa fecha.
    // Si no hay fecha seleccionada,
    // usamos la fecha actual.
    const fechaSeleccionada = fechaSimulada
      ? fechaSimulada
      : new Date().toISOString().substring(0, 10);

    // =========================================
    // COMPROBAR QUE EXISTAN LAS FECHAS
    // =========================================
    if (!alumno.fechaInicio || !alumno.fechaFin) {
      return semana.status || "Pendiente";
    }
    // =========================================
    // FECHAS
    // =========================================
    const fechaInicioPracticas = alumno.fechaInicio.substring(0, 10);

    const fechaInicioSemana = semana.start_date.substring(0, 10);

    const fechaFinSemana = semana.end_date.substring(0, 10);

    // =========================================
    // ANTES DE COMENZAR LAS PRÁCTICAS
    // =========================================
    if (fechaSeleccionada < fechaInicioPracticas) {
      return "Anulada";
    }

    // =========================================
    // SEMANA FUTURA
    // =========================================
    if (fechaSeleccionada < fechaInicioSemana) {
      return "Anulada";
    }

    // =========================================
    // SEMANA EN CURSO
    // =========================================
    if (
      fechaSeleccionada >= fechaInicioSemana &&
      fechaSeleccionada <= fechaFinSemana
    ) {
      return "En curso";
    }

    // =========================================
    // SEMANA FINALIZADA
    // =========================================
    if (semana.status) {
      return semana.status;
    }
    // =========================================
    // ESTADO POR DEFECTO
    // =========================================
    return "Pendiente";
  }
  // ======================================================

  return (
    <div className="pantalla-practicas">
      {/* ============================= */}
      {/* CABECERA */}
      {/* ============================= */}
      <header className="cabecera">
        <div className="encabezado">
          <h2 className="logo">Logo Empresa</h2>
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
      {/* ============================= */}
      {/* CONTENIDO PRINCIPAL */}
      {/* ============================= */}
      <div className="contenedor-principal">
        {/* ============================= */}
        {/* FECHA SIMULADA */}
        {/* ============================= */}
        <div className="info-periodo">
          <div className="fecha-prueba">
            <h3>Fecha simulada para pruebas</h3>
            <input
              type="date"
              value={fechaSimulada}
              onChange={(e) => setFechaSimulada(e.target.value)}
            />
            <p>
              Si no seleccionas ninguna fecha, se utilizará la fecha actual.
            </p>
          </div>
          {/* ============================= */}
          {/* PERIODO DE PRÁCTICAS */}
          {/* ============================= */}
          <h2 className="titulo-periodo">Periodo de prácticas</h2>
          <p className="texto-periodo">
            <strong>Fecha inicio:</strong> {formatearFecha(alumno.fechaInicio)}
          </p>
          <p className="texto-periodo">
            <strong>Fecha fin:</strong> {formatearFecha(alumno.fechaFin)}
          </p>
        </div>
        {/* ============================= */}
        {/* PROGRESO */}
        {/* ============================= */}
        <div className="progreso-practicas">
          <div className="progreso-fila">
            <div className="progreso-barra-contenedor">
              <div
                className="progreso-barra"
                style={{
                  "--progreso": `${progreso}%`,
                }}
              ></div>
            </div>
            <span className="progreso-porcentaje">{progreso}%</span>
          </div>
          <p className="texto-progreso">
            {semanasCompletas} de {semanas.length} semanas completadas (Semana
            actual: {semanaActual})
          </p>
        </div>
        {/* ============================= */}
        {/* TÍTULO LISTADO */}
        {/* ============================= */}
        <h2 className="titulo-seccion">Listado de semanas</h2>
        {/* ============================= */}
        {/* LISTADO DE SEMANAS */}
        {/* ============================= */}
        <div className="listado-semanas">
          {/* ====================================== */}
          {/* SI LA FECHA ES POSTERIOR AL PERIODO */}
          {/* ====================================== */}
          {fechaFueraDePracticas() &&
          fechaSimulada > alumno.fechaFin.substring(0, 10) ? (
            <div className="mensaje-sin-practicas">
              No hay prácticas asignadas para esta fecha.
            </div>
          ) : (
            /* ====================================== */
            /* MOSTRAR SEMANAS */
            /* ====================================== */
            semanas.map((semana) => {
              {
                /* ====================================== */
              }
              {
                /* OBTENER ESTADO VISUAL */
              }
              {
                /* ====================================== */
              }
              const estado = obtenerEstadoSemana(semana) || "";

              const estadoMinusculas = estado.toLowerCase();

              const isCompletado = estadoMinusculas === "completado";

              const isAnulada = estadoMinusculas === "anulada";

              const isEnCurso = estadoMinusculas === "en curso";
              {
                /* ====================================== */
              }
              {
                /* FECHAS PARA EL AVISO */
              }
              {
                /* ====================================== */
              }
              const fechaFinSemana = new Date(semana.end_date);

              const fechaComprobar = fechaSimulada
                ? new Date(fechaSimulada + "T23:59:59")
                : new Date();

              const semanaTerminada = fechaComprobar > fechaFinSemana;

              const mostrarAviso =
                semanaTerminada && !isCompletado && !isAnulada;
              return (
                <div key={semana.week_id} className="contenedor-semana">
                  {/* ============================= */}
                  {/* AVISO DE SEMANA */}
                  {/* ============================= */}
                  {mostrarAviso && (
                    <div className="aviso-semana">
                      <span>No olvides completar la semana</span>
                      <button className="cerrar-aviso" type="button">
                        ×
                      </button>
                    </div>
                  )}
                  {/* ============================= */}
                  {/* TARJETA DE LA SEMANA */}
                  {/* ============================= */}
                  <div className="semana-tarjeta">
                    {/* ============================= */}
                    {/* INFORMACIÓN */}
                    {/* ============================= */}
                    <div className="semana-info">
                      <h3 className="semana-titulo">
                        Semana {semana.week_number}
                      </h3>
                      <p className="semana-fechas">
                        Desde {formatearFecha(semana.start_date)} hasta{" "}
                        {formatearFecha(semana.end_date)}
                      </p>
                    </div>
                    {/* ============================= */}
                    {/* ACCIONES */}
                    {/* ============================= */}
                    <div className="semana-acciones">
                      {/* ============================= */}
                      {/* ESTADO */}
                      {/* ============================= */}
                      <span
                        className={`estado-badge ${
                          isCompletado
                            ? "badge-completado"
                            : isAnulada
                              ? "badge-anulada"
                              : isEnCurso
                                ? "badge-en-curso"
                                : "badge-pendiente"
                        }`}
                      >
                        {estado}
                      </span>
                      {/* ============================= */}
                      {/* BOTÓN EDITAR */}
                      {/* ============================= */}
                      <button
                        className="btn-accion"
                        onClick={() => editarSemana(semana.week_number)}
                        disabled={!puedeEditar(semana)}
                      >
                        Editar
                      </button>
                      {/* ============================= */}
                      {/* BOTÓN DESCARGAR */}
                      {/* ============================= */}

                      <button
                        className="btn-accion"
                        disabled={false}
                        onClick={() =>
                          handleDowloadFile(semana.week_id, semana.week_number)
                        }
                      >
                        Descargar
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
export default Weeks;
