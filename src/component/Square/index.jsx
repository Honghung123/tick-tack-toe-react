import React from "react";
import "./style.css";

export default function Square({ xAxis, yAxis, isHighlight, value, onClick }) {
    return (
        <button className={isHighlight ? "square active" : "square"} onClick={() => onClick(xAxis, yAxis)}>
            <span className="square-mark">{value}</span>
        </button>
    );
}
