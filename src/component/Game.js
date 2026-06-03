import React, { useState, useEffect, useRef } from 'react';
import '.././App.css';

const SIZE = 4;

function emptyGrid() {
  return Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
}

function copyGrid(g) {
  return g.map(row => row.slice());
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function addRandomTile(grid) {
  const empties = [];
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (grid[r][c] === 0) empties.push([r, c]);
    }
  }
  if (empties.length === 0) return false;
  const [r, c] = empties[getRandomInt(empties.length)];
  grid[r][c] = Math.random() < 0.9 ? 2 : 4;
  return true;
}

function rotateGrid(grid) {
  const res = emptyGrid();
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      res[c][SIZE - 1 - r] = grid[r][c];
    }
  }
  return res;
}

function moveLeft(grid) {
  let scoreAdd = 0;
  const newGrid = grid.map(row => {
    const arr = row.filter(v => v !== 0);
    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] === arr[i + 1]) {
        arr[i] = arr[i] * 2;
        scoreAdd += arr[i];
        arr.splice(i + 1, 1);
      }
    }
    while (arr.length < SIZE) arr.push(0);
    return arr;
  });
  return { grid: newGrid, scoreAdd };
}

function gridsEqual(a, b) {
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) if (a[r][c] !== b[r][c]) return false;
  }
  return true;
}

function canMove(grid) {
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (grid[r][c] === 0) return true;
      if (c < SIZE - 1 && grid[r][c] === grid[r][c + 1]) return true;
      if (r < SIZE - 1 && grid[r][c] === grid[r + 1][c]) return true;
    }
  }
  return false;
}

export default function Game() {
  const [grid, setGrid] = useState(() => {
    const g = emptyGrid();
    addRandomTile(g);
    addRandomTile(g);
    return g;
  });
  const [score, setScore] = useState(0);
  const [over, setOver] = useState(false);
  const touchStartRef = useRef(null);

  const restart = () => {
    const g = emptyGrid();
    addRandomTile(g);
    addRandomTile(g);
    setGrid(g);
    setScore(0);
    setOver(false);
  };

  const move = (dir) => {
    if (over) return;
    let working = copyGrid(grid);
    let rotated = false;
    // dir: 'left','right','up','down'
    if (dir === 'right') {
      // flip each row
      working = working.map(row => row.slice().reverse());
      const res = moveLeft(working);
      working = res.grid.map(row => row.reverse());
      if (!gridsEqual(working, grid)) {
        addRandomTile(working);
        setGrid(working);
        setScore(s => s + res.scoreAdd);
      }
    } else if (dir === 'left') {
      const res = moveLeft(working);
      if (!gridsEqual(res.grid, grid)) {
        addRandomTile(res.grid);
        setGrid(res.grid);
        setScore(s => s + res.scoreAdd);
      }
    } else if (dir === 'up') {
      // rotate left, move left, rotate right
      let r1 = rotateGrid(working);
      let r2 = rotateGrid(r1);
      let r3 = rotateGrid(r2);
      // after 3 rotations, grid is rotated 270deg (effectively transpose)
      const res = moveLeft(r3);
      let after = rotateGrid(res.grid);
      if (!gridsEqual(after, grid)) {
        addRandomTile(after);
        setGrid(after);
        setScore(s => s + res.scoreAdd);
      }
    } else if (dir === 'down') {
      // rotate right: do one rotate, move left, rotate back
      let r1 = rotateGrid(working);
      const res = moveLeft(r1);
      let after = rotateGrid(rotateGrid(rotateGrid(res.grid)));
      if (!gridsEqual(after, grid)) {
        addRandomTile(after);
        setGrid(after);
        setScore(s => s + res.scoreAdd);
      }
    }

    // after move check game over
    setTimeout(() => {
      setOver(!canMove(grid));
    }, 20);
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') move('left');
      if (e.key === 'ArrowRight') move('right');
      if (e.key === 'ArrowUp') move('up');
      if (e.key === 'ArrowDown') move('down');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [grid, over]);

  // touch handlers for swipe
  useEffect(() => {
    const onTouchStart = (e) => {
      const t = e.touches[0];
      touchStartRef.current = { x: t.clientX, y: t.clientY };
    };
    const onTouchEnd = (e) => {
      if (!touchStartRef.current) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - touchStartRef.current.x;
      const dy = t.clientY - touchStartRef.current.y;
      const absX = Math.abs(dx);
      const absY = Math.abs(dy);
      if (Math.max(absX, absY) < 20) return;
      if (absX > absY) {
        if (dx > 0) move('right'); else move('left');
      } else {
        if (dy > 0) move('down'); else move('up');
      }
      touchStartRef.current = null;
    };
    const el = document.getElementById('game-root') || document.body;
    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchend', onTouchEnd, { passive: true });
    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchend', onTouchEnd);
    };
  }, [grid, over]);

  return (
    <div className="game-page" id="game-root">
      <div className="game-panel">
        <div className="game-header">
          <h2>2048</h2>
          <div className="score-box">分数<br/><strong>{score}</strong></div>
        </div>

        <div className="controls">
          <button className="btn" onClick={restart}>重新开始</button>
          {over && <div className="game-over">游戏结束</div>}
        </div>

        <div className="grid">
          {grid.map((row, r) => (
            <div className="grid-row" key={r}>
              {row.map((cell, c) => (
                <div className={`cell ${cell ? 'tile' : 'empty'}`} key={c}>
                  {cell !== 0 ? <div className={`num n${cell}`}>{cell}</div> : null}
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="hint">支持键盘方向键与触摸滑动。</div>
      </div>
    </div>
  );
}
