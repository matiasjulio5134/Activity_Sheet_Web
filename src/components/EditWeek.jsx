import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";

function EditWeek() {
    const navigate = useNavigate();
    const { numero } = useParams();
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
    // funcion cancelar
    function cancelar() {
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
        <div>
            <h1>Registro de Actividades</h1>
            <h3>Semana {numero}</h3>
            {dias.map((dia, indiceDia) => (
                <div key={dia.nombre}>
                    <h3>{dia.nombre}</h3>
                    <p>{dia.fecha}</p>
                    <button onClick={() => agregarTarea(indiceDia)}>Agregar tarea</button>

                    <select>
                        <option>-- Indicar Ausencia --</option>
                        <option>Baja Médica / Enfermedad</option>
                        <option>Asuntos Propios</option>
                        <option>Día Festivo</option>
                    </select>

                    <br />
                    <br />
                    <div className="listaTareas">
                        {dia.tareas.length === 0 ? (
                            <p>No hay tareas registradas</p>
                        ) : (
                            dia.tareas.map((tarea, index) => (
                                <div key={index}>
                                    {tarea.editando ? (
                                        <input
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
                                            type="text"
                                            value={tarea.texto}
                                            readOnly
                                        />
                                    )}
                                    <button onClick={() => editarTarea(indiceDia, index)}>Editar</button>
                                    <button onClick={() => abrirModal(indiceDia, index)}>Borrar</button>
                                </div>
                            ))
                        )}
                        <hr />
                    </div>
                </div>
            ))}
            {mostrarModal && (
                <div>
                    <h3>Confirmar borrado</h3>
                    <p>
                        ¿Quieres borrar la tarea "
                        {
                            dias[tareaABorrar.indiceDia]
                                .tareas[tareaABorrar.indiceTarea]
                                .texto.substring(0, 100)
                        }"?
                    </p>
                    <button onClick={cancelarBorrado}>Cancelar</button>
                    <button onClick={borrarTarea}>Aceptar</button>
                </div>
            )}
            <button onClick={cancelar}>Cancelar</button>
            <button>Guardar</button>
            <button>Finalizar Semana</button>
        </div>
    );
}
export default EditWeek;