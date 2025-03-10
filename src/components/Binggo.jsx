import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import "./BingoGame.css";

function BingoGame() {
  // 5x5 보드 생성 (저장된 보드가 있으면 사용)
  const [board, setBoard] = useState(() => {
    const savedBoard = Cookies.get("bingoBoard");
    return savedBoard
      ? JSON.parse(savedBoard)
      : Array(5)
          .fill()
          .map(() => Array(5).fill(null));
  });

  const handleColorChange = (rowIndex, colIndex, color) => {
    const newBoard = board.map((row, rIdx) =>
      row.map((cell, cIdx) =>
        rIdx === rowIndex && cIdx === colIndex ? color : cell
      )
    );
    setBoard(newBoard);
    checkBingo(newBoard);
    Cookies.set("bingoBoard", JSON.stringify(newBoard));
  };

  const checkBingo = (board) => {
    const checkLine = (line) =>
      line.every((cell) => cell !== null && cell === line[0]);

    // Check rows
    if (board.some((row) => checkLine(row))) {
      console.log("Bingo!");
      return;
    }

    // Check columns
    for (let col = 0; col < 5; col++) {
      if (checkLine(board.map((row) => row[col]))) {
        console.log("Bingo!");
        return;
      }
    }

    // Check diagonals
    if (
      checkLine(board.map((row, idx) => row[idx])) ||
      checkLine(board.map((row, idx) => row[5 - 1 - idx]))
    ) {
      console.log("Bingo!");
      return;
    }
  };

  const resetBoard = () => {
    const newBoard = Array(5)
      .fill()
      .map(() => Array(5).fill(null));
    setBoard(newBoard);
    Cookies.set("bingoBoard", JSON.stringify(newBoard));
  };

  useEffect(() => {
    Cookies.set("bingoBoard", JSON.stringify(board));
  }, [board]);

  return (
    <div>
      <div className="bingo-board">
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className="bingo-cell"
              style={{
                backgroundColor: cell || "white",
              }}
            >
              <span className="cell-number">
                {rowIndex * 5 + colIndex + 1}
              </span>
              <div className="color-buttons">
                <button onClick={() => handleColorChange(rowIndex, colIndex, "blue")}>
                  파랑
                </button>
                <button onClick={() => handleColorChange(rowIndex, colIndex, "red")}>
                  빨강
                </button>
                <button onClick={() => handleColorChange(rowIndex, colIndex, "white")}>
                  하양
                </button>
                <button onClick={() => handleColorChange(rowIndex, colIndex, "green")}>
                  초록
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      <button className="reset-button" onClick={resetBoard}>
        Reset Board
      </button>
    </div>
  );
}

export default BingoGame;
