import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";

function EditWeek() {
    const navigate = useNavigate();
    const { numero } = useParams();
    function obtenerFechasSemana(numeroSemana) {
        const fechaInicioPracticas = new Date("2026-08-03T00:00:00");

        const inicio = new Date(fechaInicioPracticas);

        // Cada semana suma 7 días
        inicio.setDate(
            inicio.getDate() + (Number(numeroSemana) - 1) * 7
        );

        const fechas = [];

        // De lunes a viernes
        for (let i = 0; i < 5; i++) {
            const fecha = new Date(inicio);

            fecha.setDate(inicio.getDate() + i);

            fechas.push(fecha);
        }

        return fechas;
    }
    // =====================================

    // =====================================
    // Funcion para mostrar fecha correctamente
    function formatearFecha(fecha) {
        return fecha.toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        });
    }
    // =====================================

    // =====================================
    const fechasSemana = obtenerFechasSemana(numero);

    // =====================================
    const alumno = JSON.parse(localStorage.getItem("usuario"));
    const [dias, setDias] = useState([
        {
            nombre: "Lunes",
            tareas: [
                {
                    texto: "Generar Documento para POST",
                    textoOriginal: "Preparar documentacion",
                    editando: false
                },

            ]
        },
        {
            nombre: "Martes",
            tareas: [
                {
                    texto: "Generar Documento para POST",
                    textoOriginal: "Preparar documentacion",
                    editando: false
                },
            ]
        },
        {
            nombre: "Miercoles",
            tareas: [
                {
                    texto: "Generar Documento para POST",
                    textoOriginal: "Preparar documentacion",
                    editando: false
                },
            ]
        },
        {
            nombre: "Jueves",
            tareas: [
                {
                    texto: "Generar Documento para POST",
                    textoOriginal: "Preparar documentacion",
                    editando: false
                },
            ]
        },
        {
            nombre: "Viernes",
            tareas: [
                {
                    texto: "Generar Documento para POST",
                    textoOriginal: "Preparar documentacion",
                    editando: false
                },
            ]
        }
    ]);

    const [mostrarModal, setMostrarModal] = useState(false);
    const [tareaABorrar, setTareaABorrar] = useState(null);
    const [mostrarModalCancelar, setMostrarModalCancelar] = useState(false);
    const [mostrarModalGuardar, setMostrarModalGuardar] = useState(false);

    // =================================================
    // funcion cerrarsesion
    function cerrarSesion() {
        localStorage.removeItem("usuario");
        navigate("/");
    }
    // =================================================

    // =================================================
    // funcion obenter iniciales
    function obtenerIniciales(nombre) {
        if (!nombre) return "";

        const partes = nombre.trim().split(" ");

        if (partes.length === 1) {
            return partes[0].substring(0, 2).toUpperCase();
        }

        return (
            partes[0].charAt(0) +
            partes[partes.length - 1].charAt(0)
        ).toUpperCase();
    }
    // =================================================

    // =================================================
    // funcion cancelar
    function cancelar() {
        setMostrarModalCancelar(true);
    }
    // =================================================

    // =================================================
    // Funcion de acepta cancelacion
    function confirmarCancelar() {
        setMostrarModalCancelar(false)
        navigate("/weeks");
    }
    // =================================================

    // =================================================
    function cerrarModalCancelar() {
        setMostrarModalCancelar(false);
    }
    // =================================================

    // =================================================
    // Funcion Guardar semana
    function guardar() {
        setMostrarModalGuardar(true);
    }
    function confirmarGuardar() {
        setMostrarModalGuardar(false);
        navigate("/weeks");
    }

    function cerrarModalGuardar() {
        setMostrarModalGuardar(false);
    }
    // =================================================

    // =================================================
    // Funcion AgregarTarea
    function agregarTarea(indiceDia) {
        const nuevosDias = [...dias];

        nuevosDias[indiceDia].tareas.push({
            texto: "",
            textoOtiginal: "",
            editando: true
        });
        setDias(nuevosDias);
    }
    // =================================================

    // =================================================
    // funcion CambiarTexto
    function cambiarTexto(indiceDia, indiceTarea, texto) {
        const nuevosDias = [...dias];
        nuevosDias[indiceDia].tareas[indiceTarea].texto = texto;
        setDias(nuevosDias);
    }
    // =================================================

    // =================================================
    // Funcion guardar Tarea
    function guardarTarea(indiceDia, indiceTarea) {
        const nuevosDias = [...dias];
        const texto =
            nuevosDias[indiceDia].tareas[indiceTarea].texto.trim();

        // Si no hay nada escrito
        if (texto === "") {
            nuevosDias[indiceDia].tareas.splice(indiceTarea, 1);
        } else {
            nuevosDias[indiceDia].tareas[indiceTarea].textoOriginal = texto;
            nuevosDias[indiceDia].tareas[indiceTarea].editando = false;
        }
        setDias(nuevosDias);
    }
    // =================================================

    // =================================================
    // Funcion editarTarea
    function editarTarea(indiceDia, indiceTarea) {
        const nuevosDias = [...dias];
        nuevosDias[indiceDia].tareas[indiceTarea].editando = true;
        setDias(nuevosDias);
    }
    // =================================================

    // =================================================
    // funcion CancelarEdicion
    function cancelarEdicion(indiceDia, indiceTarea) {
        const nuevosDias = [...dias];
        nuevosDias[indiceDia].tareas[indiceTarea].texto =
            nuevosDias[indiceDia].tareas[indiceTarea].textoOriginal;
        nuevosDias[indiceDia].tareas[indiceTarea].editando = false;

        setDias(nuevosDias);
    }
    // Esto Recupera el últimno texto guardado
    // Sale del modo edición
    // =================================================

    // =================================================
    // Funcion abrirModal
    function abrirModal(indiceDia, indiceTarea) {
        setTareaABorrar({
            indiceDia,
            indiceTarea
        });
        setMostrarModal(true);
    }
    // =================================================

    // =================================================
    // Funcion para cancelar
    function cancelarBorrado() {
        setMostrarModal(false);
        setTareaABorrar(null);
    }
    // =================================================

    // =================================================
    // funcion para borrar
    function borrarTarea() {
        const nuevosDias = [...dias];

        nuevosDias[tareaABorrar.indiceDia].tareas.splice(
            tareaABorrar.indiceTarea,
            1
        );
        setDias(nuevosDias);
        setMostrarModal(false);
        setTareaABorrar(null);
    }

    // =================================================

    // =================================================
    return (
        <div className="pantalla-practicas">

            {/* HEADER AÑADIDO */}
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
            <div className="activities-page">
                <div className="activities-header">
                    <h1>Registro de Actividades</h1>
                    <h3>Semana {numero} — Del{" "}
                        {formatearFecha(fechasSemana[0])} al{" "}
                        {formatearFecha(fechasSemana[4])}
                    </h3>
                </div>
                <div className="days-container">
                    {dias.map((dia, indiceDia) => (
                        <div className="day-card" key={dia.nombre}>
                            <div className="day-header">
                                <h3>{dia.nombre}</h3>
                                <p>
                                    {formatearFecha(fechasSemana[indiceDia])}
                                </p>
                            </div>
                            <div className="day-controls">
                                <button
                                    className="add-task-button"
                                    onClick={() => agregarTarea(indiceDia)}>
                                    Agregar tarea
                                </button>

                                <select className="absence-select">
                                    <option>-- Indicar Ausencia --</option>
                                    <option>Baja Médica / Enfermedad</option>
                                    <option>Asuntos Propios</option>
                                    <option>Día Festivo</option>
                                </select>
                            </div>

                            <div className="listaTareas">
                                {dia.tareas.length === 0 ? (
                                    <p className="no-tasks">
                                        No hay tareas registradas
                                    </p>
                                ) : (
                                    dia.tareas.map((tarea, index) => (
                                        <div className="task-row" key={index}>
                                            {tarea.editando ? (
                                                <input
                                                    className="task-input"
                                                    type="text"
                                                    value={tarea.texto}
                                                    maxLength={200}
                                                    onChange={(e) =>
                                                        cambiarTexto(
                                                            indiceDia,
                                                            index,
                                                            e.target.value
                                                        )
                                                    }
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter") {
                                                            guardarTarea(
                                                                indiceDia,
                                                                index
                                                            );
                                                        }
                                                        if (e.key === "Escape") {
                                                            cancelarEdicion(
                                                                indiceDia,
                                                                index
                                                            );
                                                        }
                                                    }}
                                                />
                                            ) : (
                                                <input
                                                    className="task-input"
                                                    type="text"
                                                    value={tarea.texto}
                                                    readOnly
                                                />
                                            )}
                                            <button
                                                className="edit-button"
                                                onClick={() =>
                                                    editarTarea(
                                                        indiceDia,
                                                        index
                                                    )
                                                }
                                            >
                                                Editar
                                            </button>
                                            <button
                                                className="delete-button"
                                                onClick={() =>
                                                    abrirModal(
                                                        indiceDia,
                                                        index
                                                    )
                                                }
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
                {mostrarModal && (
                    <div className="modal-overlay">
                        <div className="delete-modal">
                            <h3>Confirmar borrado</h3>
                            <p>
                                ¿Quieres borrar la tarea "
                                {
                                    dias[tareaABorrar.indiceDia]
                                        .tareas[tareaABorrar.indiceTarea]
                                        .texto.substring(0, 100)
                                }"?
                            </p>
                            <div className="modal-actions">
                                <button
                                    className="cancel-button"
                                    onClick={cancelarBorrado}>Cancelar</button>
                                <button
                                    className="delete-button"
                                    onClick={borrarTarea}>Aceptar</button>
                            </div>
                        </div>
                    </div>
                )}
                {mostrarModalCancelar && (
                    <div className="modal-overlay">
                        <div className="delete-modal">
                            <p>
                                ¿Estás seguro de que quieres Cancelar?
                                Se perderán los datos introducidos.
                            </p>

                            <div className="modal-actions">
                                <button
                                    className="delete-button"
                                    onClick={confirmarCancelar}
                                >
                                    Aceptar
                                </button>

                                <button
                                    className="cancel-button"
                                    onClick={cerrarModalCancelar}
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {mostrarModalGuardar && (
                    <div className="modal-overlay">
                        <div className="delete-modal">
                            <p>
                                ¿Estás seguro de que quieres guardar la semana?
                            </p>

                            <div className="modal-actions">
                                <button
                                    className="delete-button"
                                    onClick={confirmarGuardar}
                                >
                                    Aceptar
                                </button>

                                <button
                                    className="cancel-button"
                                    onClick={cerrarModalGuardar}
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                <div className="week-actions">
                    <button
                        className="cancel-button"
                        onClick={cancelar}>Cancelar</button>
                    <button onClick={guardar} className="save-button">Guardar</button>
                    <button className="finish-button">Finalizar Semana</button>
                </div>
            </div>
        </div>
    );
}
export default EditWeek;