import React, {useState} from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'

const Square = (props) => {
  return (
    <button 
      className="square" 
      onClick={() => props.onClick()}>
      {props.value}
    </button>
  );
}
  
const Board = (props) =>  {
  const renderSquare = (i) => {
    return (
      <Square 
        value={props.squares[i]}
        onClick={() => props.onClick(i)}
      />);
  }

  return (
    <div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  );
}

const Game = () => {
  const [state, setState] = useState({
    history: [{
      squares: Array(9).fill(null),
    }],
    xIsNext: true,
    stepNumber: 0,
    changeIndex: null,
  });

  const handleClick = (i) => {
    const history = state.history.slice(0, state.stepNumber + 1);
    const current = history[history.length - 1].squares;
    const squares = current.slice();
    if (calculateWinner(squares) || squares[i] ) {
      return;
    }
    squares[i] = state.xIsNext? 'X' : 'O';
    setState({
      history: history.concat([{squares: squares}]),
      xIsNext: !state.xIsNext,
      stepNumber: history.length,
      changeIndex: i,
    });
  }

  const jumpTo = (step) => {
    setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
      history: state.history,
      changeIndex: state.changeIndex,
    });
  }
  
  const current = state.history[state.stepNumber];
  const winner = calculateWinner(current.squares);
  const isDraw = checkForDraw(current.squares);
  const moves = state.history.map((step, move) => {
    const latestMove = move === state.history.length-1;
    const selectedMove = move === state.stepNumber;
    if(latestMove){
      generateCoordinates(state.changeIndex, move)
    }
    const desc = move ? `Go to move # ${move}  --  (${coordinatesMap[move]})` : `Go to game start`;
    return (
      <li key={move}>
        <button onClick={()=>{jumpTo(move)}}>{selectedMove ? <strong>{desc}</strong>: desc}</button>
      </li>
    )
  })
  const status = winner ? `Winner: ${winner}` : isDraw ? `Game over - Draw` : `Next player: ${state.xIsNext ? 'X' : 'O'}`;

  return (
    <div className="game">
      <div className="game-board">
        <Board
          xIsNext={state.xIsNext}
          squares={current.squares}
          onClick={(i) => handleClick(i)}
        />
      </div>
      <div className="game-info">
        <div>{ status }</div>
        <ol>{ moves }</ol>
      </div>
    </div>
  );
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

const calculateWinner = (squares) => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let winningCombo of lines) {
    const [a, b, c] = winningCombo;
    if (squares[a] && squares[a] === squares[b] && squares[b] === squares[c]) {
      return squares[a];
    }
  }
}

const checkForDraw = (squares) => {
  return !squares.includes(null);
};

const coordinatesMap = {};

const generateCoordinates = (index, move) => {
  const column = index % 3;
  const row = [0, 1, 2].includes(index) ? 0 : [3, 4, 5].includes(index) ? 1 : 2;
  coordinatesMap[move] = `${column}, ${row}`;
}

