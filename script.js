function Gameboard() {
    const rows = 3;
    const columns = 3;
    const board = [];
  
    for (let i = 0; i < rows; i++) {
      board[i] = [];
      for (let j = 0; j < columns; j++) {
        board[i].push(Cell());
      }
    }
  
    const getBoard = () => board;
  
    const dropToken = (column, row, player) => {
      const availableCells = board.filter((row) => row[column].getValue() === "").map(row => row[column]);
  
      if (!availableCells.length) return;
  
      //const lowestRow = availableCells.length - 1;
      board[row][column].addToken(player);
    };
  
    const printBoard = () => {
      const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()))
      return boardWithCellValues;
    };
  
    return { getBoard, dropToken, printBoard };
  }
  
  function Cell() {
    let value = "";
  
    const addToken = (player) => {
      value = player;
    };
  
    const getValue = () => value;
  
    return {
      addToken,
      getValue
    };
  }
  
  function GameController(
    playerOneName = "Player One",
    playerTwoName = "Player Two"
  ) {
    const board = Gameboard();
  
    const players = [
      {
        name: playerOneName,
        token: "X"
      },
      {
        name: playerTwoName,
        token: "O"
      }
    ];
  
    let activePlayer = players[0];
  
    const switchPlayerTurn = () => {
      activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };
    const getActivePlayer = () => activePlayer;
  
    const printNewRound = () => {
      board.printBoard();
      //console.log(`${getActivePlayer().name}'s turn.`);
    };
  
    const playRound = (column, row) => {
      /*console.log(
        `Dropping ${getActivePlayer().name}'s token into column ${column}...`
      );*/
      board.dropToken(column, row, getActivePlayer().token);
  
      /*  This is where we would check for a winner and handle that logic,
          such as a win message. */
  
      switchPlayerTurn();
      printNewRound();
    };

    const checkWinner = () => {
      const boardWithCellValues = board.printBoard();
      let winner = null;
      // Check rows
      boardWithCellValues.forEach(row => {
        if (row[0] === row[1] && row[0] === row[2] && row[0] !== "") {
          winner = row[0];
        }

      })
      
      boardWithCellValues.forEach((row, index) => {
        if (boardWithCellValues[0][index] === boardWithCellValues[1][index] && boardWithCellValues[0][index] === boardWithCellValues[2][index] && boardWithCellValues[0][index] !== "") {
          winner = boardWithCellValues[0][index];
        }
      })

      if (boardWithCellValues[0][0] === boardWithCellValues[1][1] && boardWithCellValues[0][0] === boardWithCellValues[2][2] && boardWithCellValues[0][0] !== "") {
        winner = boardWithCellValues[0][0];            
      }

      if (boardWithCellValues[0][2] === boardWithCellValues[1][1] && boardWithCellValues[2][0] === boardWithCellValues[1][1] && boardWithCellValues[1][1] !== "") {
        winner = boardWithCellValues[1][1];
            
      }

      console.log (winner);
      return winner;

    }
  
    printNewRound();
  
    return {
      playRound,
      getActivePlayer,
      checkWinner,
      getBoard: board.getBoard
    };
  }
  
  function ScreenController() {
    const game = GameController();
    const playerTurnDiv = document.querySelector('.turn');
    const boardDiv = document.querySelector('.board');
  
    const updateScreen = (winner) => {
      // clear the board
      boardDiv.textContent = "";
  
      // get the newest version of the board and player turn
      const board = game.getBoard();
      const activePlayer = game.getActivePlayer();
  
      // Display player's turn
      playerTurnDiv.textContent = `${activePlayer.name}'s turn...`
      playerTurnDiv.style = "text-align: left;"
      if(winner) {
        playerTurnDiv.textContent = `${winner} WINS!`
        playerTurnDiv.style = "text-align: center;"
      }
      // Render board squares
      board.forEach((row, indexRow) => {
        row.forEach((cell, indexColumn) => {
          // Anything clickable should be a button!!
          const cellButton = document.createElement("button");
          cellButton.classList.add("cell");
          // Create a data attribute to identify the column
          // This makes it easier to pass into our `playRound` function 

          cellButton.dataset.row = indexRow
          cellButton.dataset.column = indexColumn
          cellButton.textContent = cell.getValue();
          boardDiv.appendChild(cellButton);
        })
      })
    }
  
    // Add event listener for the board
    function clickHandlerBoard(e) {
      const selectedRow = e.target.dataset.row;
      const selectedColumn = e.target.dataset.column;
      // Make sure I've clicked a column and not the gaps in between
      if (!selectedColumn) return;
      
      game.playRound(selectedColumn, selectedRow);


      
      updateScreen(game.checkWinner());
    }
    boardDiv.addEventListener("click", clickHandlerBoard);
  
    // Initial render
    updateScreen();
  
    // We don't need to return anything from this module because everything is encapsulated inside this screen controller.
  }
  
  ScreenController();
  
  restartBtn.addEventListener('click', () => {
    window.location.reload();
  });