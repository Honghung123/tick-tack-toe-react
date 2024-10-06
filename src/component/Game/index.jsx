import React, { useRef, useState } from "react";
import "./style.css";
import Board from "../Board";

const initialBoard = (size = 3) => {
    const board = [];
    for (let i = 0; i < size; i++) {
        board.push([]);
        for (let j = 0; j < size; j++) {
            board[i].push("");
        }
    }
    return board;
};
const cloneArray = (board) => {
    const newBoard = [];
    for (let i = 0; i < board.length; i++) {
        newBoard.push([...board[i]]);
    }
    return newBoard;
};
const copyValueIntoBoardFrom = (boardSize, history, turn, isReverse) => {
    history = isReverse ? history.slice().reverse() : history;
    const newBoard = initialBoard(boardSize);
    for (let i = 0; i < history.length; i++) {
        const [xAxis, yAxis] = history[i];
        newBoard[xAxis][yAxis] = turn[i % 2];
    }
    return newBoard;
};

export default function Game() {
    const [turn, setTurn] = useState(["X", "O"]);
    const [size, setSize] = useState(3);
    const [history, setHistory] = useState([]);
    const [isShowReversedHistory, setIsShowReversedHistory] = useState(false);
    const [board, setBoard] = useState(initialBoard());
    const [winnerPath, setWinnerPath] = useState([]);
    const inputRef = useRef(null);
    const changeTurn = () => {
        setTurn([...turn.reverse()]);
    };

    const changeSize = () => {
        const newSize = inputRef.current.value;
        setBoard(initialBoard(newSize));
        setWinnerPath([]);
        setHistory([]);
    };

    const handleSquareClick = (xAxis, yAxis) => {
        if (board[xAxis][yAxis] !== "" || winnerPath.length === board.length) {
            return;
        }
        const newBoard = cloneArray(board);
        newBoard[xAxis][yAxis] = turn[history.length % 2];
        setBoard(newBoard);
        const existWinnerPath = calculateWinner(newBoard);
        if (existWinnerPath.length === board.length) {
            console.log(existWinnerPath);
            setWinnerPath(existWinnerPath);
        }
        updateHistory([xAxis, yAxis]);
    };

    const updateHistory = (coordinate) => {
        const newHistory = isShowReversedHistory ? [coordinate, ...history] : [...history, coordinate];
        setHistory(newHistory);
    };

    const sortHistory = () => {
        setHistory([...history].reverse());
        setIsShowReversedHistory(!isShowReversedHistory);
    };

    const changeHistory = (index) => {
        if (winnerPath.length > 0) return;
        const newHistory = isShowReversedHistory
            ? history
                  .slice()
                  .reverse()
                  .slice(0, index + 1)
                  .reverse()
            : history.slice(0, index + 1);
        console.log(newHistory);
        setHistory(newHistory);
        setBoard(copyValueIntoBoardFrom(size, newHistory, turn, isShowReversedHistory));
    };

    const resetData = () => {
        setBoard(initialBoard(size));
        setWinnerPath([]);
        setHistory([]);
    };

    const renderHistoryList = () => {
        const getIndex = (index) => (isShowReversedHistory ? history.length - 1 - index : index);
        return history.map((coord, index) =>
            index != (isShowReversedHistory ? 0 : history.length - 1) ? (
                <li key={index} className="history-item" onClick={() => changeHistory(getIndex(index))}>
                    <button type="button" className="btn sm-btn outline-btn">
                        Go to move #{getIndex(index)} with the location: {coordinateToString(coord)}
                    </button>
                </li>
            ) : (
                <span key={index} className="history-item d-inline-block">
                    You are at move #{getIndex(index)} with the location: {coordinateToString(coord)}
                </span>
            )
        );
    };

    return (
        <div className="game-container">
            {winnerPath.length == board.length ? (
                <div className="winner">
                    <div className="winner-content">Winner: {board[winnerPath[0][0]][winnerPath[0][1]]}</div>
                </div>
            ) : (
                <div className="status">Current turn: {turn[history.length % 2]}</div>
            )}
            {history.length == board.length * board.length && winnerPath.length == 0 && (
                <div className="status-draw">Draw</div>
            )}

            {history.length === 0 && (
                <div className="change-section">
                    <button type="button" className="btn success-btn md-btn" onClick={changeTurn}>
                        Change turn
                    </button>
                    <div className="change-size">
                        <input
                            type="number"
                            name=""
                            id=""
                            value={size}
                            min={3}
                            ref={inputRef}
                            onChange={(e) => setSize(e.target.value)}
                        />
                        <button type="button" className="btn info-btn sm-btn" onClick={changeSize}>
                            Change size
                        </button>
                    </div>
                </div>
            )}

            <div className="game">
                <div className="game-board">
                    <Board board={board} winnerPath={winnerPath} handleSquareClick={handleSquareClick} />
                </div>
                <div className="game-info">
                    <h3>History: </h3>
                    <ol className="history-list">{renderHistoryList()}</ol>
                    <div className="sort-section">
                        {history.length > 1 && (
                            <button type="button" className="btn sm-btn success-btn" onClick={sortHistory}>
                                Sort
                            </button>
                        )}
                    </div>
                </div>
            </div>
            {history.length > 0 && (
                <div className="reset-section">
                    <button onClick={resetData} className="btn md-btn reset-btn">
                        Reset game
                    </button>
                </div>
            )}
        </div>
    );
}

const coordinateToString = ([x, y]) => `(${x},${y})`;
const calculateWinner = (board) => {
    const boardSize = board.length;
    // Check all value in a column has the same value
    for (let col = 0; col < boardSize; col++) {
        let winPath = [[0, col]];
        for (let row = 1; row < boardSize; row++) {
            if (board[row][col] !== board[row - 1][col] || board[row][col] === "") {
                break;
            }
            winPath.push([row, col]);
        }
        if (winPath.length === boardSize) {
            return winPath;
        }
    }
    // Check all value in a row has the same value
    for (let row = 0; row < boardSize; row++) {
        let winPath = [[row, 0]];
        for (let col = 1; col < boardSize; col++) {
            if (board[row][col] !== board[row][col - 1] || board[row][col] === "") {
                break;
            }
            winPath.push([row, col]);
        }
        if (winPath.length === boardSize) {
            return winPath;
        }
    }
    // Check all value in a diagonal has the same value
    const firstCellValueInDiagonal1 = board[0][0];
    let winPath = [];
    for (let row = 0; row < boardSize; row++) {
        if (board[row][row] !== firstCellValueInDiagonal1 || board[row][row] === "") {
            break;
        }
        winPath.push([row, row]);
    }
    if (winPath.length === boardSize) {
        return winPath;
    }
    // Check all value in a diagonal has the same value
    const firstCellValueInDiagonal2 = board[boardSize - 1][0];
    winPath = [];
    for (let row = boardSize - 1; row >= 0; row--) {
        if (board[row][boardSize - 1 - row] !== firstCellValueInDiagonal2 || board[row][boardSize - 1 - row] === "") {
            break;
        }
        winPath.push([row, boardSize - 1 - row]);
    }
    if (winPath.length === boardSize) {
        return winPath;
    }
    return [];
};
