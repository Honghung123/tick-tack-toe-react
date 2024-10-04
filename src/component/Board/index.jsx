import "./style.css";
import Square from "../Square";
import React, { useState } from "react";

const isContainArray = (supperArray, targetArray) => {
    return supperArray.some((arr) => targetArray.every((element, index) => element === arr[index]));
};

export default function Board({ board, winnerPath, handleSquareClick }) {
    return (
        <>
            <div className="board">
                {Array.from({ length: board.length }, (_, i) => (
                    <div className="board-row" key={i}>
                        {Array.from({ length: board.length }, (_, j) => (
                            <Square
                                key={j}
                                xAxis={i}
                                yAxis={j}
                                value={board[i][j]}
                                onClick={handleSquareClick}
                                isHighlight={isContainArray(winnerPath, [i, j])}
                            />
                        ))}
                    </div>
                ))}
            </div>
        </>
    );
}
