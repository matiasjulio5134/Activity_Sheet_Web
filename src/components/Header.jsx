function Header({ nombre, setLogin }) {

    function cerrarSesion() {
        localStorage.clear();
        setLogin(false);
    }

    return (
        <header className="header">
            <div className="avatar">
                {nombre.charAt(0).toUpperCase()}
            </div>

            <button onClick={cerrarSesion}>
                Cerrar sesión
            </button>
        </header>
    );
}
export default Header;