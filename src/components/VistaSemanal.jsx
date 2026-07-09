function Semanas() {

  const semanas = [
    {
      numero: 1,
      desde: "08/06/2026",
      hasta: "12/06/2026",
      estado: "Completado"
    },
    {
      numero: 2,
      desde: "15/06/2026",
      hasta: "19/06/2026",
      estado: "Completado"
    },
    {
      numero: 3,
      desde: "22/06/2026",
      hasta: "26/06/2026",
      estado: "Pendiente"
    },
    {
      numero: 4,
      desde: "29/06/2026",
      hasta: "02/07/2026",
      estado: "Pendiente"
    }
  ];

  return (
    <div className="contenedor">

      {semanas.map((semana) => (
        <div className="tarjeta" key={semana.numero}>

          <div>
            <h3>Semana {semana.numero}</h3>

            <p>
              Desde: {semana.desde} - Hasta: {semana.hasta}
            </p>
          </div>

          <div className="acciones">

            <span className={semana.estado === "Completado" ? "completado" : "pendiente"}>
              {semana.estado}
            </span>

            <button>Editar</button>

            <button>Descargar Word</button>

          </div>

        </div>
      ))}

    </div>
  );
}

export default Semanas;