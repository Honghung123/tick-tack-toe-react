import { useState } from "react";
import Game from "./component/Game";
import "./App.css";
import Footer from "./component/Footer";

function App() {
    return (
        <div className="container">
            <h1>Tick Tack Toe</h1>
            <div className="wrapper">
                <div className="inner">
                    <Game />
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default App;
