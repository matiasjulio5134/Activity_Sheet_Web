import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../utils/axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Login() {
  const navigate = useNavigate();

  const [dni, setDni] = useState("");
  const [password, setPassword] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);

  const [errorDni, setErrorDni] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const [errorGeneral, setErrorGeneral] = useState("");

  const [loading, setLoading] = useState(false);

  // Validación del DNI/NIE español
  const validarDNI = (valor) => {
    const dniLimpio = valor.toUpperCase().trim();

    if (!/^\d{8}[A-Z]$/.test(dniLimpio)) {
      return false;
    }

    const letras = "TRWAGMYFPDXBNJZSQVHLCKE";
    const numero = parseInt(dniLimpio.substring(0, 8), 10);
    const letra = dniLimpio.charAt(8);

    return letras[numero % 23] === letra;
  };

  // Validación de contraseña
  const validarPassword = (valor) => {
    const tieneNumero = /\d/.test(valor);
    const tieneMinuscula = /[a-z]/.test(valor);
    const tieneMayuscula = /[A-Z]/.test(valor);
    const tieneEspecial = /[^A-Za-z0-9]/.test(valor);

    return (
      valor.length >= 6 &&
      tieneNumero &&
      tieneMinuscula &&
      tieneMayuscula &&
      tieneEspecial
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrorDni("");
    setErrorPassword("");
    setErrorGeneral("");

    let hayErrores = false;

    if (!dni.trim()) {
      setErrorDni("Introduce tu DNI.");
      hayErrores = true;
    } else if (!validarDNI(dni)) {
      setErrorDni("El DNI no es válido.");
      hayErrores = true;
    }

    if (!password) {
      setErrorPassword("Introduce tu contraseña.");
      hayErrores = true;
    } else if (!validarPassword(password)) {
      setErrorPassword(
        "La contraseña debe tener al menos 6 caracteres, una mayúscula, una minúscula, un número y un carácter especial."
      );
      hayErrores = true;
    }

    if (hayErrores) {
      return;
    }

    try {
      setLoading(true);

      const response = await axiosInstance.post("/users/login", {
        dni: dni.toUpperCase(),
        password: password,
      });

      const datosUsuario = response.data;

      // Guardar usuario y token
      localStorage.setItem("usuario", JSON.stringify(datosUsuario));
      localStorage.setItem("token", datosUsuario.token);

      // Ir a la pantalla principal
      navigate("/weeks");
    } catch (error) {
      console.error("Error al iniciar sesión:", error);

      if (error.response?.status === 401) {
        setErrorGeneral("DNI o contraseña incorrectos.");
      } else {
        setErrorGeneral(
          "No se ha podido iniciar sesión. Inténtalo de nuevo."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <h1>Iniciar sesión</h1>

          <p className="login-subtitle">
            Introduce tus datos para acceder
          </p>

          <form onSubmit={handleSubmit}>
            {/* DNI */}
            <div className="form-group">
              <label htmlFor="dni">DNI</label>

              <input
                id="dni"
                type="text"
                value={dni}
                onChange={(e) => {
                  setDni(e.target.value.toUpperCase());
                  setErrorDni("");
                  setErrorGeneral("");
                }}
                placeholder="12345678A"
                maxLength={9}
                disabled={loading}
              />

              {errorDni && (
                <p className="error-message">{errorDni}</p>
              )}
            </div>

            {/* Contraseña */}
            <div className="form-group">
              <label htmlFor="password">Contraseña</label>

              <div className="password-container">
                <input
                  id="password"
                  type={mostrarPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrorPassword("");
                    setErrorGeneral("");
                  }}
                  placeholder="Contraseña"
                  disabled={loading}
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setMostrarPassword(!mostrarPassword)
                  }
                  disabled={loading}
                >
                  {mostrarPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              {errorPassword && (
                <p className="error-message">{errorPassword}</p>
              )}
            </div>

            {/* Error general */}
            {errorGeneral && (
              <p className="error-message general-error">
                {errorGeneral}
              </p>
            )}

            {/* Botón */}
            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading ? "Iniciando sesión..." : "Iniciar sesión"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;