import { useState } from 'react'
import React from 'react'
import Login from './components/Login'
import Header from './components/Header'
import VistaSemanal from './components/VistaSemanal'
import './App.css'

function App() {

    const [login, setLogin] = useState(false);

    if (!login) {
        return <Login setLogin={setLogin} />;
    }

    return (
        <>
            <Header nombre="Juan Pérez" setLogin={setLogin} />
            <VistaSemanal />
        </>
    );
}

export default App;