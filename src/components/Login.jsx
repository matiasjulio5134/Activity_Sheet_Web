import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { axiosInstance } from '../utils/axios';

function Login() {
    const [dni, setDni] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    // Errores de validación
    const [errorDni, setErrorDni] = useState("");
    const [errorPassword, setErrorPassword] = useState("");
    const [errorLogin, setErrorLogin] = useState("");

    // =====================================================
    // Validación del DNI
    function validarDNI(dni) {
        const letras = "TRWAGMYFPDXBNJZSQVHLCKE";

        // Comprobar que tenga 8 números y una letra
        const formato = /^[0-9]{8}[A-Za-z]$/;
        if (!formato.test(dni)) {
            return false;
        }
        const numero = parseInt(dni.substring(0, 8));
        const letra = dni.substring(8).toUpperCase();

        const resto = numero % 23;

        return letras[resto] === letra;
    }
    // ======================================================

    // ======================================================
    // Validacion de la contraseña
    function validarPassword(password) {
        const formato = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_-]).{6,}$/;
        return formato.test(password);
    }
    // ======================================================

    // ======================================================
    // Se ejecuta al pulsar el boton. Funcion iniciar Sesion
    async function iniciarSesion() {
        // Limpiar errores anteriores
        setErrorDni("");
        setErrorPassword("");
        setErrorLogin("");

        let formularioValido = true;

        // Validar DNI
        if (dni === "") {
            setErrorDni("El DNI es obligatorio");
            formularioValido = false;
        } else if (!validarDNI(dni)) {
            setErrorDni("El DNI no es valido");
            formularioValido = false;
        }

        // Validar contraseña
        if (password === "") {
            setErrorPassword("La contraseña es obligatoria");
            formularioValido = false;
        } else if (!validarPassword(password)) {
            setErrorPassword("La contraseña no cumple los requisitos");
            formularioValido = false;
        }

        // Si hay erroes, no se envia al backend
        if (!formularioValido) {
            return;
        }
        
        // Datos que se enviaran al BACKEND
        const userData = {
            dni,
            password
        };

        try {
            // Llamada al BACKEND
            const resp = await axiosInstance.post("/users/login", userData);
            
            // Mostar la respuesta por consola
            console.log(resp.data);

            // Guardar los datos del usuario
            localStorage.setItem("usuario", JSON.stringify(resp.data));

            // Ir a la pantalla de semanas
            navigate("/weeks");
        } catch (error) {
            // Si el login falla
            setErrorLogin("DNI o contraseña incorrectos");

            console.error(
                error.response?.data || error.message
            );
        }
        // =====================================================
        
    }
    return (
        <div>
            <h2>Iniciar sesión</h2>

            <div>
                <label>DNI:</label><br />
                <input
                    type="text"
                    value={dni}
                    onChange={(e) => setDni(e.target.value)}
                    placeholder="12345678A"
                    required
                />
                {errorDni && (
                    <p>{errorDni}</p>
                )}
            </div>
            <br />
            <div>
                <label>Contraseña:</label><br />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required

                />
                {errorPassword && (
                    <p>{errorPassword}</p>
                )}
            </div>
            <br />
            <button onClick={iniciarSesion}>Iniciar sesión</button>
            {errorLogin && (
                <p>{errorLogin}</p>
            )}
        </div>
    )
}
export default Login
