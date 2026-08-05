import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaGithub, FaLinkedin, FaEnvelope, FaWhatsapp, FaDiscord, FaPhone } from "react-icons/fa";
import { SiGmail } from "react-icons/si";
import axios from "axios";

function Weeks() {
  const navigate = useNavigate();
  const [fechaSimulada, setFechaSimulada] = useState("");
  const [avisosCerrados, setAvisosCerrados] = useState([]);
  const [mostrarEstados, setMostrarEstados] = useState(false);

  // =====================================================
  // Usuario guardado despues del login
  const usuarioGuardado = JSON.parse(localStorage.getItem("usuario"));

  // Datos de alumnos
  const [alumno, setAlumno] = useState({
    nombre: "",
    fechaInicio: "",
    fechaFin: ""
  });
  // =====================================================

  // =====================================================
  // Semanas
  const [semanas, setSemanas] = useState([]);
  useEffect(() => {
    const obtenerPracticas = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("TOKEN GUARDADO:", token);


        let url = "http://localhost:3000/internships/my-internship";

        if (fechaSimulada) {
          url += `?mockDate=${fechaSimulada}`;
        }

        console.log("URL enviada:", url);

        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const datos = response.data;
        console.log(
          "DATOS RECIBIDOS:",
          JSON.stringify(datos, null, 2)
        );
        setAlumno({
          nombre: usuarioGuardado?.nombre || "",
          fechaInicio: datos.start_date,
          fechaFin: datos.end_date
        });

        setSemanas(datos.weeklyLog || []);
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

  // ======================================================
  // Funcion para obtener iniciales del nombre del alumno
  function obtenerIniciales(nombre) {
    if (!nombre) return "";

    const palabras = nombre.trim().split(" ");

    if (palabras.length === 1) {
      return palabras[0].substring(0, 2).toUpperCase();
    }

    return (
      palabras[0][0] +
      palabras[palabras.length - 1][0]
    ).toUpperCase();
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

    return Math.round(
      (tiempoTrancurrido / duracionTotal) * 100
    );
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

    const inicio = new Date(
      fechaInicio.substring(0, 10) + "T00:00:00"
    );

    const hoy = fechaSimulada
      ? new Date(fechaSimulada + "T00:00:00")
      : new Date();

    const diferencia = hoy - inicio;

    const diasTranscurridos = Math.floor(
      diferencia / (1000 * 60 * 60 * 24)
    );

    if (diasTranscurridos < 0) {
      return 0;
    }

    return Math.floor(diasTranscurridos / 7) + 1;
  }
  // ======================================================

  // ======================================================
  // calcular datos de progreso
  const progreso = calcularProgreso(
    alumno.fechaInicio,
    alumno.fechaFin
  );
  const semanaActual = calcularSemanaActual(
    alumno.fechaInicio
  );
  const semanasCompletas = semanas.filter(
    (semana) => semana.estado === "Completada"
  ).length
  // ======================================================

  // ======================================================
  // funcion puedeEditar
  function puedeEditar(semana) {

    const estado = obtenerEstadoSemana(semana);

    const fechaSeleccionada = fechaSimulada
      ? fechaSimulada
      : new Date().toISOString().substring(0, 10);

    const fechaInicioSemana = semana.start_date.substring(0, 10);

    // Si la semana todavía no ha empezado
    if (fechaSeleccionada < fechaInicioSemana) {
      return false;
    }

    // Si está completada no se puede editar
    if (estado === "Completada") {
      return false;
    }

    // Semana actual o pendiente anterior editable
    if (
      estado === "Pendiente" ||
      estado === "En curso"
    ) {
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
    return semana.status === "Completada";
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
      year: "numeric"
    });
  }
  function fechaFueraDePracticas() {
    if (
      !fechaSimulada ||
      !alumno.fechaInicio ||
      !alumno.fechaFin
    ) {
      return false;
    }

    // Fecha de inicio: YYYY-MM-DD
    const fechaInicio = alumno.fechaInicio.substring(0, 10);

    // Fecha de finalización: YYYY-MM-DD
    const fechaFin = alumno.fechaFin.substring(0, 10);

    // Si la fecha seleccionada es anterior al inicio
    // O posterior al final
    return (
      fechaSimulada < fechaInicio ||
      fechaSimulada > fechaFin
    );
  }
  // ======================================================

  // ======================================================
  // funcion cerrar aviso
  function cerrarAviso(weekId) {
    setAvisosCerrados((avisos) => [
      ...avisos,
      weekId
    ]);
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
    if (
      !alumno.fechaInicio ||
      !alumno.fechaFin
    ) {
      return semana.status || "Pendiente";
    }
    // =========================================
    // FECHAS
    // =========================================
    const fechaInicioPracticas =
      alumno.fechaInicio.substring(0, 10);

    const fechaInicioSemana =
      semana.start_date.substring(0, 10);

    const fechaFinSemana =
      semana.end_date.substring(0, 10);

    // =========================================
    // ANTES DE COMENZAR LAS PRÁCTICAS
    // =========================================
    if (
      fechaSeleccionada < fechaInicioPracticas
    ) {
      return "Pendiente";
    }

    // =========================================
    // SEMANA FUTURA
    // =========================================
    if (
      fechaSeleccionada < fechaInicioSemana
    ) {
      return "Pendiente";
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
    if (semana.status === "Completada") {
      return "Completada";
    }
    // =========================================
    // ESTADO POR DEFECTO
    // =========================================
    return "Pendiente";
  }
  // ======================================================

  // ======================================================
  // funcion paa descargar word (Backend)
  const descargarWord = async (weekId) => {
    const token = localStorage.getItem("token");

    const url = `http://localhost:3000/weekly-logs/${weekId}/download-word`;

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob",
      });

      const disposition =
        response.headers["content-disposition"];

      let filename = "hoja_actividad.docx";

      if (disposition) {
        const fileNameMatch =
          disposition.match(/filename\s*=\s*"?([^";]+)"?/);

        if (fileNameMatch) {
          filename = fileNameMatch[1];
        }
      }

      const blob = new Blob([response.data], {
        type: response.data.type,
      });

      const href = URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = href;
      link.download = filename;

      document.body.appendChild(link);

      link.click();

      link.remove();

      URL.revokeObjectURL(href);

    } catch (error) {
      console.error("Error descargando el Word:", error);
    }
  };
  // ======================================================

  return (
    <div className="pantalla-practicas">
      {/* ============================= */}
      {/* CABECERA */}
      {/* ============================= */}
      <header className="cabecera">
        <div className="encabezado">
          <h2 className="logo">
            Logo Empresa
          </h2>
          <div className="iniciales-container">
            <span className="avatar-circulo">
              {obtenerIniciales(alumno.nombre)}
            </span>
            <button
              className="btn-cerrar-sesion"
              onClick={cerrarSesion}
            >
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
            <h3>
              Fecha simulada para pruebas
            </h3>
            <input
              type="date"
              value={fechaSimulada}
              onChange={(e) =>
                setFechaSimulada(e.target.value)
              }
            />
            <p>
              Si no seleccionas ninguna fecha,
              se utilizará la fecha actual.
            </p>
          </div>
        </div>
        {/* ============================= */}
        {/* PROGRESO */}
        {/* ============================= */}
        <div className="progreso-practicas">
          <h2 className="titulo-progreso">
            Progreso de prácticas
          </h2>
          <div className="fechas-progreso">
            <p>
              <strong>Fecha inicio:</strong>{" "}
              {formatearFecha(alumno.fechaInicio)}
            </p>
            <p>
              <strong>Fecha fin:</strong>{" "}
              {formatearFecha(alumno.fechaFin)}
            </p>
          </div>
          <div className="progreso-fila">
            <div className="progreso-barra-contenedor">
              <div
                className="progreso-barra"
                style={{
                  "--progreso": `${progreso}%`
                }}
              >
              </div>
            </div>
            <span className="progreso-porcentaje">
              {progreso}%
            </span>
          </div>
          <p className="texto-progreso">
            {semanasCompletas} de {semanas.length} semanas completadas
          </p>
          <p className="semana-actual">
            Semana actual: {semanaActual}
          </p>
        </div>
        {/* ============================= */}
        {/* TÍTULO LISTADO */}
        {/* ============================= */}
        <h2 className="titulo-seccion">
          Listado de semanas
        </h2>
        {/* ============================= */}
        {/* LISTADO DE SEMANAS */}
        {/* ============================= */}
        <div className="listado-semanas">
          {/* ====================================== */}
          {/* SI LA FECHA ES POSTERIOR AL PERIODO */}
          {/* ====================================== */}
          {fechaFueraDePracticas() &&
            fechaSimulada >
            alumno.fechaFin.substring(0, 10) ? (
            <div className="mensaje-sin-practicas">
              No hay prácticas asignadas para esta fecha.
            </div>
          ) : (
            /* ====================================== */
            /* MOSTRAR SEMANAS */
            /* ====================================== */
            semanas.map((semana) => {
              {/* ====================================== */ }
              {/* OBTENER ESTADO VISUAL */ }
              {/* ====================================== */ }
              const estado =
                obtenerEstadoSemana(semana) || "";

              const estadoMinusculas =
                estado.toLowerCase();

              const isCompletado =
                estadoMinusculas === "completada";

              const isAnulada =
                estadoMinusculas === "anulada";

              const isEnCurso =
                estadoMinusculas === "en curso";
              {/* ====================================== */ }
              {/* FECHAS PARA EL AVISO */ }
              {/* ====================================== */ }
              const fechaFinSemana =
                new Date(semana.end_date);

              const fechaComprobar =
                fechaSimulada
                  ? new Date(
                    fechaSimulada + "T23:59:59"
                  )
                  : new Date();

              const semanaTerminada =
                fechaComprobar > fechaFinSemana;

              const mostrarAviso =
                semanaTerminada &&
                !isCompletado &&
                !isAnulada;
              return (
                <div
                  key={semana.week_id}
                  className="contenedor-semana"
                >
                  {/* ============================= */}
                  {/* AVISO DE SEMANA */}
                  {/* ============================= */}
                  {mostrarAviso && (
                    <div className="aviso-semana">
                      <span>
                        No olvides completar la semana
                      </span>
                      <button
                        className="cerrar-aviso"
                        type="button"
                      >
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
                        Desde{" "}
                        {formatearFecha(
                          semana.start_date
                        )}
                        {" "}
                        hasta{" "}
                        {formatearFecha(
                          semana.end_date
                        )}
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
                        className={`estado-badge ${isCompletado
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
                        onClick={() =>
                          editarSemana(
                            semana.week_number
                          )
                        }
                        disabled={
                          !puedeEditar(semana)
                        }
                      >
                        Editar
                      </button>
                      {/* ============================= */}
                      {/* BOTÓN DESCARGAR */}
                      {/* ============================= */}

                      <button
                        disabled={!isCompletado}
                        onClick={() => descargarWord(semana.week_id)}
                        className="btn-accion"
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
        {/* ============================= */}
        {/* FOOTER */}
        {/* ============================= */}
        <footer className="footer">
          {/* IZQUIERDA */}
          <div className="footer-col">
            <h2 className="footer-logo">
              <span className="naranja">ANMB</span> SOFTWARE
            </h2>
            <p>
              Desarrollo de aplicaciones web para la gestión de prácticas,
              formación y soluciones empresariales.
            </p>
          </div>
          {/* AYUDA */}
          <div className="footer-col footer-centro">
            <h3>¿Necesitas ayuda?</h3>
            <p>
              Si encuentras algún error o problema técnico,
              ponte en contacto con nuestro equipo de soporte.
            </p>

            <div className="botones-ayuda">
              <a className="btn-contactar">
                <FaEnvelope />
                Contactar soporte
              </a>

              <button
                className="btn-estados"
                onClick={() => setMostrarEstados(true)}
              >
                ℹ Estados de prácticas
              </button>
            </div>
          </div>
          {/* CONTACTO */}
          <div className="footer-col footer-centro">
            <h3>Contacto</h3>
            <div className="contacto-soporte">
              <div className="contacto-item">
                <FaEnvelope className="icono-contacto" />
                <div>
                  <h4>Email de soporte</h4>
                  <a href="mailto:soporte@anmbsoftware.com">
                    soporte@anmbsoftware.com
                  </a>
                </div>
              </div>

              <div className="contacto-item">
                <FaPhone className="icono-contacto" />
                <div>
                  <h4>Teléfono de contacto</h4>
                  <a href="tel:+34915536162">
                    +34 915 536 162
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* EQUIPO */}
          <div className="footer-col">
            <div className="equipo">
              <h4>Backend</h4>
              <p>Antonio Navarro</p>

              <div className="redes">
                <a
                  href="https://github.com/anavarro81"
                  target="_blank"
                  rel="noreferrer"
                >
                  <FaGithub />
                </a>

                <a
                  href="https://www.linkedin.com/in/antonio-navarro-deldujo/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <FaLinkedin />
                </a>
                <a
                  href="https://discord.gg/TU_INVITACION"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <SiGmail />
                </a>
              </div>
            </div>

            <div className="equipo">
              <h4>Frontend</h4>
              <p>Matías Briceño</p>

              <div className="redes">
                <a
                  href="https://github.com/matiasjulio5134"
                  target="_blank"
                  rel="noreferrer"
                >
                  <FaGithub />
                </a>

                <a
                  href="https://wa.me/643873510"
                  target="_blank"
                  rel="noreferrer"
                >
                  <FaWhatsapp />
                </a>

                <a
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=matiasjulio5134@gmail.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <SiGmail />
                </a>
              </div>
            </div>
          </div>
        </footer>
        {
          mostrarEstados && (
            <div className="modal-overlay">
              <div className="modal-estados">

                <button
                  className="cerrar-modal"
                  onClick={() => setMostrarEstados(false)}
                >
                  ✕
                </button>

                <h2>
                  Estados de las prácticas
                </h2>

                <p>
                  Consulta el significado de cada estado de tus semanas.
                </p>

                <div className="estado-modal">
                  <h3>🟡 Pendiente</h3>
                  <p>
                    La semana todavía no ha comenzado.
                  </p>
                </div>

                <div className="estado-modal">
                  <h3>🔵 En curso</h3>
                  <p>
                    La semana está activa y puedes editar las tareas.
                  </p>
                </div>

                <div className="estado-modal">
                  <h3>🟢 Completada</h3>
                  <p>
                    La semana está finalizada y permite descargar el Word.
                  </p>
                </div>

                <div className="estado-modal">

                  <h3>🔴 Pendiente</h3>
                  <p>
                    La semana no está disponible.
                  </p>
                </div>
              </div>
            </div>
          )
        }
      </div >
    </div >
  )
}
export default Weeks;
