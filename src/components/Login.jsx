import React, { useState } from "react";

export default function Login({ setLogin }) {

    const [dni, setDni] = useState("");
    const [password, setPassword] = useState("");

    const [errorDni, setErrorDni] = useState("");
    const [errorPassword, setErrorPassword] = useState("");

    const handleDniChange = (e) => {
        setDni(e.target.value.toUpperCase());
    };

    function validarDNI(dni) {

        // Comprueba que tenga 8 números y una letra
        if (!/^\d{8}[A-Z]$/.test(dni)) {
            return false;
        }

        // Letras oficiales del DNI
        const letras = "TRWAGMYFPDXBNJZSQVHLCKE";

        // Obtener los números
        const numero = dni.slice(0, 8);

        // Obtener la letra
        const letra = dni[8];

        // Calcular el resto
        const resto = numero % 23;

        // Comprobar si la letra es correcta
        if (letras[resto] === letra) {
            return true;
        } else {
            return false;
        }
    }

    const handleSubmit = (e) => {

        e.preventDefault();

        // Borrar errores anteriores
        setErrorDni("");
        setErrorPassword("");

        let valido = true;

        // Validar DNI
        if (dni === "") {
            setErrorDni("El DNI es obligatorio");
            valido = false;

        } else if (!validarDNI(dni)) {
            setErrorDni("El DNI no es válido");
            valido = false;
        }

        // Validar contraseña
        if (password === "") {
            setErrorPassword("La contraseña es obligatoria");
            valido = false;
        }

        // Si todo está correcto
        if (valido) {
            console.log("Iniciando sesión con:", { dni, password });

            setLogin(true);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">

                <form onSubmit={handleSubmit}>

                    <h2>Iniciar Sesión</h2>

                    <input
                        type="text"
                        placeholder="12345678X"
                        value={dni}
                        maxLength={9}
                        onChange={handleDniChange}
                    />

                    {errorDni && (
                        <p className="error">{errorDni}</p>
                    )}

                    <input
                        type="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    {errorPassword && (
                        <p className="error">{errorPassword}</p>
                    )}

                    <button type="submit" className="btn-login">
                        Iniciar Sesión
                    </button>

                </form>

            </div>
        </div>
    );
}
