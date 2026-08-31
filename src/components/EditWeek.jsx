import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import {
  FaGithub,
  FaLinkedin,
  FaEnvelope,
  FaWhatsapp,
  FaDiscord,
} from "react-icons/fa";
import { SiGmail } from "react-icons/si";
import { axiosInstance } from "../utils/axios";

function EditWeek() {
  const navigate = useNavigate();
  const { numero, weekId } = useParams();
  const [fechasSemana, setFechasSemana] = useState([]);
  const inputRefs = useRef({});
  // =================================================
  // Mostrar fecha correctamente
  function formatearFecha(fecha) {
    if (!fecha) return "";

    return fecha.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  // =================================================
  // Datos del alumno
  const alumno = JSON.parse(localStorage.getItem("usuario"));

  // =================================================

  // =================================================
  // Dias y tareas
  const [dias, setDias] = useState([]);

  // Detectar si el usuario ha modificado algo
  const [hayCambios, setHayCambios] = useState(false);

  // Estado para controlar la tarea que se está editando.
  const [editingTaskKey, setEditingTaskKey] = useState(null);

  useEffect(() => {
    async function cargarSemana() {
      try {
        const token = localStorage.getItem("token");

        const respuesta = await axiosInstance.get(`/weekly-logs/${weekId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const datos = respuesta.data.weekTasks;

        // Fechas reales de la semana
        const fechas = datos.daily_log.map((dia) => new Date(dia.date));

        setFechasSemana(fechas);

        // Convertir los datos del backend
        // al formato que utiliza nuestro componente
        const diasBackend = datos.daily_log.map((dia, indice) => ({
          nombre: ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes"][indice],

          ausencia: dia.absence || "",

          tareas: dia.tasks.map((tarea) => ({
            _id: tarea._id,
            texto: tarea.description,
            textoOriginal: tarea.description,
            editando: false,
          })),
        }));

        setDias(diasBackend);
      } catch (error) {
        console.error("Error recuperando la semana:", error);
      }
    }

    if (weekId) {
      cargarSemana();
    }
  }, [weekId]);

  // =================================================
  // Estados de los modales
  const [modalConfig, setModalConfig] = useState({
    open: false,
    action: null,
    message: "",
    acceptText: "Aceptar",
    cancelText: "Cancelar",
    data: null,
  });
  function cerrarModal() {
    setModalConfig({
      open: false,
      action: null,
      message: "",
      acceptText: "Aceptar",
      cancelText: "Cancelar",
      data: null,
    });
  }
  function handleModalAccept() {
    switch (modalConfig.action) {
      case "cancel":
        navigate("/weeks");
        break;

      case "save":
        confirmarGuardar();
        return;

      case "finish":
        confirmarFinalizar();
        return;

      case "deleteTask":
        borrarTarea();
        return;

      case "absence":
        confirmarAusencia();
        return;

      default:
        break;
    }

    cerrarModal();
  }

  // =================================================
  // Cerrar sesión
  function cerrarSesion() {
    localStorage.removeItem("usuario");
    localStorage.removeItem("token");

    navigate("/");
  }

  // =================================================
  // Obtener iniciales
  function obtenerIniciales(nombre) {
    if (!nombre) return "";

    const partes = nombre.trim().split(" ");

    if (partes.length === 1) {
      return partes[0].substring(0, 2).toUpperCase();
    }

    return (
      partes[0].charAt(0) + partes[partes.length - 1].charAt(0)
    ).toUpperCase();
  }

  // =================================================
  // Cancelar edición de semana
  function cancelar() {
    if (!hayCambios) {
      navigate("/weeks");
      return;
    }

    setModalConfig({
      open: true,
      action: "cancel",
      message:
        "¿Estás seguro de que quieres cancelar? Se perderán los datos introducidos.",
      acceptText: "Aceptar",
      cancelText: "Cancelar",
      data: null,
    });
  }

  // =================================================
  // Guardar semana
  function guardar() {
    setModalConfig({
      open: true,
      action: "save",
      message: "¿Estás seguro de que quieres guardar la semana?",
      acceptText: "Aceptar",
      cancelText: "Cancelar",
      data: null,
    });
  }

  // =================================================
  // Finalizar semana
  function finalizar() {
    setModalConfig({
      open: true,
      action: "finish",
      message:
        "¿Estás seguro de que quieres finalizar la semana? Una vez finalizada no podrás modificar las tareas.",
      acceptText: "Aceptar",
      cancelText: "Cancelar",
      data: null,
    });
  }

  function prepararDatosParaBackend() {
    return {
      daily_logs: dias.map((dia, indiceDia) => ({
        // Fecha real de cada día
        date: fechasSemana[indiceDia],

        tasks: dia.tareas.map((tarea, indiceTarea) => ({
          _id: tarea._id,

          description: tarea.texto,

          order: indiceTarea + 1,
        })),

        absence: null,
      })),
    };
  }

  async function confirmarFinalizar() {
    // =================================================
    // Comprobar tareas vacías
    // =================================================

    const tareasVacias = dias.some((dia) =>
      dia.tareas.some((tarea) => tarea.texto.trim() === ""),
    );

    if (tareasVacias) {
      alert("Completa todas las tareas antes de finalizar la semana");

      return;
    }

    try {
      const token = localStorage.getItem("token");

      const datosBackend = prepararDatosParaBackend();

      const respuestaTareas = await axiosInstance.put(
        `/weekly-logs/${weekId}`,
        datosBackend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // =================================================
      // Cambiar estado a completada
      // =================================================

      const respuestaCompletada = await axiosInstance.put(
        `/weekly-logs/${weekId}/completed`,

        datosBackend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      cerrarModal();
      navigate("/weeks");
    } catch (error) {
      console.error("Error finalizando semana:", error);

      if (error.response) {
        console.error("Respuesta del BACKEND:", error.response.data);
      }
    }
  }
  // =================================================
  // Agregar tarea
  // Se crea un indice temporal solo para usar en front.
  // El de bbdd o se informa.
  function agregarTarea(indiceDia) {
    const nuevosDias = [...dias];

    nuevosDias[indiceDia].tareas.push({
      _id: null,
      frontendId: crypto.randomUUID(),
      texto: "",
      textoOriginal: "",
      editando: true,
    });

    const indiceNuevaTarea = nuevosDias[indiceDia].tareas.length - 1;

    setDias(nuevosDias);
    setHayCambios(true);

    setTimeout(() => {
      const input =
        inputRefs.current[`${indiceDia}-${indiceNuevaTarea}`];

      if (input) {
        input.focus();
      }
    }, 0);
  }

  // =================================================
  // Cambiar texto de tarea
  function cambiarTexto(indiceDia, indiceTarea, texto) {
    const nuevosDias = [...dias];

    nuevosDias[indiceDia].tareas[indiceTarea].texto = texto.substring(0, 200);

    setDias(nuevosDias);

    setHayCambios(true);
  }

  // =================================================
  // Guardar tarea
  function guardarTarea(indiceDia, indiceTarea) {
    const nuevosDias = [...dias];

    const texto = nuevosDias[indiceDia].tareas[indiceTarea].texto.trim();

    // Si no hay nada escrito, eliminar tarea
    if (texto === "") {
      nuevosDias[indiceDia].tareas.splice(indiceTarea, 1);
    } else {
      nuevosDias[indiceDia].tareas[indiceTarea].textoOriginal = texto;
      nuevosDias[indiceDia].tareas[indiceTarea].editando = false;
    }
    const input = inputRefs.current[`${indiceDia}-${indiceTarea}`];

    if (input) {
      input.blur();
    }

    setDias(nuevosDias);
  }

  // =================================================
  // Editar tarea
  function editarTarea(indiceDia, indiceTarea) {
    const nuevosDias = [...dias];

    nuevosDias[indiceDia].tareas[indiceTarea].editando = true;

    setDias(nuevosDias);

    setTimeout(() => {
      const input = inputRefs.current[`${indiceDia}-${indiceTarea}`];
      /*// Si la tarea ya existe mantengo el id, si no cojo el nuevo generado (nueva tarea).
         setEditingTaskKey(tarea._id ?? tarea.frontendId);*/
      if (input) {
        input.focus();

        // Cursor al final del texto
        input.setSelectionRange(input.value.length, input.value.length);
      }
    }, 0);
  }

  // =================================================
  // Cancelar edición de tarea
  function cancelarEdicion(indiceDia, indiceTarea) {
    const nuevosDias = [...dias];

    nuevosDias[indiceDia].tareas[indiceTarea].texto =
      nuevosDias[indiceDia].tareas[indiceTarea].textoOriginal;

    nuevosDias[indiceDia].tareas[indiceTarea].editando = false;

    setDias(nuevosDias);
  }

  // =================================================
  // Abrir modal de borrado
  function abrirModal(indiceDia, indiceTarea) {
    const textoTarea = dias[indiceDia].tareas[indiceTarea].texto;

    setModalConfig({
      open: true,
      action: "deleteTask",
      message: `¿Quieres borrar la tarea "${textoTarea.substring(0, 100)}"?`,
      acceptText: "Aceptar",
      cancelText: "Cancelar",
      data: {
        indiceDia,
        indiceTarea,
      },
    });
  }

  // =================================================

  // =================================================
  // Borrar tarea
  function borrarTarea() {
    const { indiceDia, indiceTarea } = modalConfig.data;

    const nuevosDias = [...dias];

    nuevosDias[indiceDia].tareas.splice(indiceTarea, 1);

    setDias(nuevosDias);
    setHayCambios(true);

    cerrarModal();
  }
  // =================================================

  // =================================================
  // funcion Confirmar ausencia
  function confirmarAusencia() {
    const { indiceDia, ausencia } = modalConfig.data;

    const nuevosDias = structuredClone(dias);

    // Borrar todas las tareas del día
    nuevosDias[indiceDia].tareas = [];

    // Guardar la ausencia seleccionada
    nuevosDias[indiceDia].ausencia = ausencia;

    setDias(nuevosDias);
    setHayCambios(true);

    cerrarModal();
  }
  // =================================================

  // =================================================
  // funcion confirmarGuardar
  async function confirmarGuardar() {
    try {
      const token = localStorage.getItem("token");

      const datosBackend = prepararDatosParaBackend();

      await axiosInstance.put(
        `/weekly-logs/${weekId}`,
        datosBackend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      navigate("/weeks");
    } catch (error) {
      console.error("Error guardando semana:", error);

      if (error.response) {
        console.error(error.response.data);
      }
    }
  }
  // =================================================

  // =================================================
  // funcion cambiarAusencia
  function cambiarAusencia(indiceDia, valor) {

    if (valor !== "" && dias[indiceDia].tareas.length > 0) {
      setModalConfig({
        open: true,
        action: "absence",
        message:
          "Este día tiene tareas. Si continúas se borrarán todas las tareas.",
        acceptText: "Aceptar",
        cancelText: "Cancelar",
        data: {
          indiceDia,
          ausencia: valor,
        },
      });

      return;
    }

    const nuevosDias = [...dias];
    nuevosDias[indiceDia].ausencia = valor;
    setDias(nuevosDias);
  }
  // =================================================

  // =================================================
  return (
    <div className="pantalla-practicas">
      {/* ============================= */}
      {/* HEADER */}
      {/* ============================= */}

      <header className="cabecera">
        <div className="encabezado">
          <h2 className="logo">Logo Empresa</h2>

          <div className="iniciales-container">
            <span className="avatar-circulo">
              {obtenerIniciales(alumno?.nombre)}
            </span>

            <button className="btn-cerrar-sesion" onClick={cerrarSesion}>
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      {/* ============================= */}
      {/* CONTENIDO ACTIVIDADES */}
      {/* ============================= */}

      <div className="activities-page">
        <div className="activities-header">
          <h1>Registro de Actividades</h1>

          <h3>
            Semana {numero} — Del {formatearFecha(fechasSemana[0])} al{" "}
            {formatearFecha(fechasSemana[fechasSemana.length - 1])}
          </h3>
        </div>

        {/* ============================= */}
        {/* DIAS */}
        {/* ============================= */}

        <div className="days-container">
          {dias.map((dia, indiceDia) => (
            <div className="day-card" key={dia.nombre}>
              <div className="day-header">
                <h3>{dia.nombre}</h3>

                <p>{formatearFecha(fechasSemana[indiceDia])}</p>
              </div>

              <div className="day-controls">
                <button
                  className="add-task-button"
                  onClick={() => agregarTarea(indiceDia)}
                  disabled={!!dia.ausencia}
                >
                  Agregar tarea
                </button>

                <select
                  className="absence-select"
                  value={dia.ausencia}
                  onChange={(e) => cambiarAusencia(indiceDia, e.target.value)}
                >
                  <option value="">-- Indicar Ausencia --</option>
                  <option value="Baja Medica / Enfermedad">Baja Médica / Enfermedad</option>

                  <option value="asuntos_propios">Asuntos Propios</option>

                  <option value="dia_festivo">Día Festivo</option>
                </select>
              </div>

              {/* ============================= */}
              {/* LISTA DE TAREAS */}
              {/* ============================= */}

              <div className="listaTareas">
                {dia.tareas.length === 0 ? (
                  <p className="no-tasks">No hay tareas registradas</p>
                ) : (
                  dia.tareas.map((tarea, index) => (
                    <div className="task-row" key={index}>
                      {tarea.editando ? (
                        <input
                          ref={(el) => {
                            inputRefs.current[`${indiceDia}-${index}`] = el;
                          }}
                          className="task-input"
                          type="text"
                          value={tarea.texto}
                          maxLength={200}
                          onChange={(e) =>
                            cambiarTexto(indiceDia, index, e.target.value)
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              guardarTarea(indiceDia, index);
                            }

                            if (e.key === "Escape") {
                              cancelarEdicion(indiceDia, index);
                            }
                          }}
                        />
                      ) : (
                        <input
                          ref={(elemento) => {
                            inputRefs.current[`${indiceDia}-${index}`] = elemento;
                          }}
                          className="task-input"
                          type="text"
                          value={tarea.texto}
                          readOnly
                        />
                      )}

                      <button
                        className="edit-button"
                        onClick={() => editarTarea(indiceDia, index)}
                      >
                        Editar
                      </button>

                      <button
                        className="delete-button"
                        onClick={() => abrirModal(indiceDia, index)}
                      >
                        Borrar
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>

        {/* ============================= */}
        {/* MODAL ÚNICO */}
        {/* ============================= */}

        {modalConfig.open && (
          <div className="modal-overlay">
            <div className="delete-modal">
              <p>{modalConfig.message}</p>

              <div className="modal-actions">
                <button className="delete-button" onClick={handleModalAccept}>
                  {modalConfig.acceptText}
                </button>

                <button className="cancel-button" onClick={cerrarModal}>
                  {modalConfig.cancelText}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============================= */}
        {/* ACCIONES DE SEMANA */}
        {/* ============================= */}

        <div className="week-actions">
          <button className="cancel-button" onClick={cancelar}>
            Cancelar
          </button>

          <button onClick={guardar} className="save-button">
            Guardar
          </button>

          <button className="finish-button" onClick={finalizar}>
            Finalizar Semana
          </button>
        </div>
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

        {/* CENTRO */}

        <div className="footer-col footer-centro">
          <h3>¿Necesitas ayuda?</h3>

          <p>Si tienes alguna duda, ponte en contacto con nosotros.</p>

          <a className="btn-contactar">
            <FaEnvelope />
            Contactar
          </a>
        </div>

        {/* DERECHA */}

        <div className="footer-col">
          <div className="equipo">
            <h4>Backend</h4>

            <p>Antonio Navarro</p>

            <div className="redes">
              <a
                href="https://github.com/anavarro81"
                target="_blank"
                rel="noreferrer"
                title="GitHub"
              >
                <FaGithub />
              </a>

              <a
                href="https://www.linkedin.com/in/antonio-navarro-deldujo/"
                target="_blank"
                rel="noreferrer"
                title="LinkedIn"
              >
                <FaLinkedin />
              </a>

              <a
                href="https://discord.gg/TU_INVITACION"
                target="_blank"
                rel="noreferrer"
                title="Discord"
              >
                <FaDiscord />
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
                title="GitHub"
              >
                <FaGithub />
              </a>

              <a
                href="https://wa.me/643873510"
                target="_blank"
                rel="noreferrer"
                title="WhatsApp"
              >
                <FaWhatsapp />
              </a>

              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=matiasjulio5134@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                title="Gmail"
              >
                <SiGmail />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default EditWeek;
