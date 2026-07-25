import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Weeks() {
  const navigate = useNavigate();
  const [fechaSimulada, setFechaSimulada] = useState("");

  // =====================================================
  // Datos de alumnos
  //const alumno = JSON.parse(localStorage.getItem("usuario"));
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

        console.log("DATOS RECIBIDOS:", datos);

        setAlumno({
          fechaInicio: datos.start_date,
          fechaFin: datos.end_date
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
    const inicio = convertirFecha(fechaInicio);
    const hoy = new Date();

    const diferencia = hoy - inicio;

    const diasTrancurridos = Math.floor(
      diferencia / (1000 * 60 * 60 * 24)
    );

    if (diasTrancurridos < 0) {
      return 0;
    }

    return Math.floor(diasTrancurridos / 7) + 1;
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
    (semana) => semana.estado === "Completado"
  ).length
  // ======================================================

  // ======================================================
  // funcion puedeEditar
  function puedeEditar(semana) {
    if (semana.status === "Completado") {
      return false;
    }

    if (semana.status === "Anulada") {
      return false;
    }

    if (semana.status === "En curso") {
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
  // Funcion para mostrar fechas en formato DD/MM/AAAA
  function formatearFecha(fecha) {
    if (!fecha) return "";

    const fechaObjeto = new Date(fecha);

    return fechaObjeto.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  }
  // ======================================================

  return (
    <div className="pantalla-practicas">
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

      <div className="contenedor-principal">

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
          <h2 className="titulo-periodo">
            Periodo de prácticas
          </h2>

          <p className="texto-periodo">
            <strong>Fecha inicio:</strong>{" "}
            {formatearFecha(alumno.fechaInicio)}
          </p>

          <p className="texto-periodo">
            <strong>Fecha fin:</strong>{" "}
            {formatearFecha(alumno.fechaFin)}
          </p>
        </div>

        <div className="progreso-practicas">

          <div className="progreso-fila">
            <div className="progreso-barra-contenedor">
              <div
                className="progreso-barra"
                style={{
                  "--progreso": `${progreso}%`
                }}
              ></div>
            </div>

            <span className="progreso-porcentaje">
              {progreso}%
            </span>
          </div>

          <p className="texto-progreso">
            {semanasCompletas} de {semanas.length} semanas completadas
            (Semana actual: {semanaActual})
          </p>

        </div>

        <h2 className="titulo-seccion">
          Listado de semanas
        </h2>

        <div className="listado-semanas">

          {semanas.map((semana) => {

            const isCompletado = semana.status?.toLowerCase() === "completado";

            return (
              <div
                key={semana.week_id}
                className="semana-tarjeta"
              >

                <div className="semana-info">

                  <h3 className="semana-titulo">
                    Semana {semana.week_number}
                  </h3>

                  <p className="semana-fechas">
                    Desde{" "}
                    {formatearFecha(semana.start_date)}
                    {" "}hasta{" "}
                    {formatearFecha(semana.end_date)}
                  </p>

                </div>

                <div className="semana-acciones">

                  <span
                    className={`estado-badge ${isCompletado
                      ? "badge-completado"
                      : "badge-pendiente"
                      }`}
                  >
                    {semana.status}
                  </span>

                  <button
                    className="btn-accion"
                    onClick={() =>
                      editarSemana(semana.week_number)
                    }
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
