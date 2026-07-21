import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";

function EditWeek() {
    const navigate = useNavigate();
    const { numero } = useParams();
    const alumno = JSON.parse(localStorage.getItem("usuario"));
    const [dias, setDias] = useState([
        {
            nombre: "Lunes",
            fecha: "08/06/2025",
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
            fecha: "09/06/2025",
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
            fecha: "10/06/2025",
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
            fecha: "11/06/2025",
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
            fecha: "12/06/2025",
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
        navigate("/weeks");
    }
    // =================================================

    // =================================================
    // Funcion Guardar semana
    function guardar(){
        alert("Semana guardada correctamente");
        navigate("/weeks");
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
                        <span className="naranja">CAS</span> Training
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
                    <h3>Semana {numero}</h3>
                </div>
                <div className="days-container">
                    {dias.map((dia, indiceDia) => (
                        <div className="day-card" key={dia.nombre}>
                            <div className="day-header">
                                <h3>{dia.nombre}</h3>
                                <p>{dia.fecha}</p>
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