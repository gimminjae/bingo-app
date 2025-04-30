import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import "./BingoGame.css";

function BingoGame() {
  // n 상태 및 입력값
  const [n, setN] = useState(() => {
    const savedN = Cookies.get("bingoSize");
    return savedN ? parseInt(savedN, 10) : 5;
  });
  const [inputN, setInputN] = useState(n);
  // n*n 보드 생성 (저장된 보드가 있으면 사용)
  const [board, setBoard] = useState(() => {
    const savedBoard = Cookies.get("bingoBoard");
    const savedN = Cookies.get("bingoSize");
    const size = savedN ? parseInt(savedN, 10) : 5;
    return savedBoard
      ? JSON.parse(savedBoard)
      : Array(size)
          .fill()
          .map(() => Array(size).fill(null));
  });
  // n 변경 시 보드도 새로 생성
  useEffect(() => {
    setBoard(
      Array(n)
        .fill()
        .map(() => Array(n).fill(null))
    );
  }, [n]);

  const handleColorChange = (rowIndex, colIndex, color) => {
    const newBoard = board.map((row, rIdx) =>
      row.map((cell, cIdx) =>
        rIdx === rowIndex && cIdx === colIndex ? color : cell
      )
    );
    setBoard(newBoard);
    checkBingo(newBoard);
    Cookies.set("bingoBoard", JSON.stringify(newBoard));
    Cookies.set("bingoSize", n);
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
    for (let col = 0; col < n; col++) {
      if (checkLine(board.map((row) => row[col]))) {
        console.log("Bingo!");
        return;
      }
    }

    // Check diagonals
    if (
      checkLine(board.map((row, idx) => row[idx])) ||
      checkLine(board.map((row, idx) => row[n - 1 - idx]))
    ) {
      console.log("Bingo!");
      return;
    }
  };

  const resetBoard = () => {
    const newBoard = Array(n)
      .fill()
      .map(() => Array(n).fill(null));
    setBoard(newBoard);
    Cookies.set("bingoBoard", JSON.stringify(newBoard));
    Cookies.set("bingoSize", n);
  };

  useEffect(() => {
    Cookies.set("bingoBoard", JSON.stringify(board));
    Cookies.set("bingoSize", n);
  }, [board, n]);

  // n 입력 UI: n이 null이면 입력창, 아니면 빙고판
  if (!n || n < 2) {
    return (
      <div className="bingo-game-container">
        <form
          onSubmit={e => {
            e.preventDefault();
            if (inputN >= 2) setN(Number(inputN));
          }}
        >
          <label>
            빙고판 크기(n):
            <input
              type="number"
              min="2"
              value={inputN}
              onChange={e => setInputN(e.target.value)}
              style={{ marginLeft: 8, width: 60 }}
            />
          </label>
          <button type="submit" style={{ marginLeft: 8 }}>시작</button>
        </form>
      </div>
    );
  }

  return (
    <div className="bingo-game-container">
      <form
        onSubmit={e => {
          e.preventDefault();
          if (inputN >= 2) setN(Number(inputN));
        }}
        style={{ marginBottom: 16 }}
      >
        <label>
          빙고판 크기(n):
          <input
            type="number"
            min="2"
            value={inputN}
            onChange={e => setInputN(e.target.value)}
            style={{ marginLeft: 8, width: 60 }}
          />
        </label>
        <button type="submit" style={{ marginLeft: 8 }}>변경</button>
      </form>
      <div
        className="bingo-board"
        style={{
          gridTemplateColumns: `repeat(${n}, 1fr)`,
          gridTemplateRows: `repeat(${n}, 1fr)`
        }}
      >
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
                {rowIndex * n + colIndex + 1}
              </span>
              <div className="color-buttons">
                <button onClick={() => handleColorChange(rowIndex, colIndex, "blue")}>파랑</button>
                <button onClick={() => handleColorChange(rowIndex, colIndex, "red")}>빨강</button>
                <button onClick={() => handleColorChange(rowIndex, colIndex, "white")}>하양</button>
                <button onClick={() => handleColorChange(rowIndex, colIndex, "green")}>초록</button>
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
