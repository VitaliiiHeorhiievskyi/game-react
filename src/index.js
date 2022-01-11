import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
function Square(props) {
    return props.value.Checked === false ? (
        <button className="square" onClick={props.onClick}>
            {props.value.value}
        </button>
    ) : (
        <button
            className="square"
            style={{ background: "green" }}
            onClick={props.onClick}
        >
            {props.value.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    render() {
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}

class square {
    constructor(props) {
        this.value = null;
        this.Checked = false;
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [
                {
                    squares: [
                        new square(),
                        new square(),
                        new square(),
                        new square(),
                        new square(),
                        new square(),
                        new square(),
                        new square(),
                        new square(),
                    ],
                },
            ],
            stepNumber: 0,
            xIsNext: true,
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        let squares=[];
        for (let index = 0; index < 9; index++) {
           squares[index]=Object.assign(Object.create(Object.getPrototypeOf(current.squares[index])), current.squares[index]);
        }
        if (calculateWinner(squares) || squares[i].value) {
            return;
        }
        squares[i].value = this.state.xIsNext ? "X" : "O";
        this.setState({
            history: history.concat([
                {
                    squares: squares,
                },
            ]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: step % 2 === 0,
        });
    }

    render() {
        const history = this.state.history;
        console.log(history)
        const current = history[this.state.stepNumber];
        console.log(this.state.stepNumber);
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const desc = move ? "Go to move #" + move : "Go to game start";
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });

        let status;
        if (winner) {
            status = "Winner: " + winner;
        } else {
            status = "Next player: " + (this.state.xIsNext ? "X" : "O");
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares) {
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
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (
            squares[a].value &&
            squares[a].value === squares[b].value &&
            squares[a].value === squares[c].value
        ) {
            squares[a].Checked = true;
            squares[b].Checked = true;
            squares[c].Checked = true;
            return squares[a].value;
        }
    }
    return null;
}
