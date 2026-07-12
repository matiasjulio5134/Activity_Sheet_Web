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
                { texto: "Generar Documento para POST", editando: false },
                { texto: "Publicar POST", editando: false }
            ]
        },
        {
            nombre: "Martes",
            fecha: "09/06/2025",
            tareas: [
                { texto: "Generar Documento para POST", editando: false },
                { texto: "Publicar POST", editando: false }
            ]
        },
        {
            nombre: "Miercoles",
            fecha: "10/06/2025",
            tareas: [
                { texto: "Generar Documento para POST", editando: false },
                { texto: "Publicar POST", editando: false }
            ]
        },
        {
            nombre: "Jueves",
            fecha: "11/06/2025",
            tareas: [
                { texto: "Generar Documento para POST", editando: false },
                { texto: "Publicar POST", editando: false }
            ]
        },
        {
            nombre: "Viernes",
            fecha: "12/06/2025",
            tareas: [
                { texto: "Generar Documento para POST", editando: false },
                { texto: "Publicar POST", editando: false }
            ]
        }
    ]);

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
            editando: true
        });
        setDias(nuevosDias);
    }
    // =================================================

    // =================================================
    // funcion agregarTarea
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
        if(texto === "") {
            nuevosDias[indiceDia].tareas.splice(indiceTarea, 1);
        } else {
            nuevosDias[indiceDia].tareas[indiceTarea].editando = false;
        }
        setDias(nuevosDias);
    }

    // =================================================
    return (
        <div>
            <h1>Registro de Actividades</h1>
            <h3>Semana {numero}</h3>
            {dias.map((dia, indiceDia) => (
                <div key={dia.nombre}>
                    <h3>{dia.nombre}</h3>
                    <p>{dia.nombre}</p>
                    <button onClick={() => agregarTarea(indiceDia)}>Agregar tarea</button>

                    <select>
                        <option>-- Indicar Ausencia --</option>
                        <option>Baja Médica / Enfermedad</option>
                        <option>Asuntos Propios</option>
                        <option>Día Festivo</option>
                    </select>

                    <br />
                    <br />

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
                                            if(e.key === "Enter"){
                                                guardarTarea(indiceDia, index);
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
                                <button>Editar</button>
                                <button>Borrar</button>
                            </div>
                        ))
                    )}
                    <hr />
                </div>
            ))}
            <button onClick={cancelar}>Cancelar</button>
            <button>Guardar</button>
            <button>Finalizar Semana</button>
        </div>
    );
}
export default EditWeek;