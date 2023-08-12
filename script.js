const tileContainer = document.querySelector(".tileContainer");
const keyContainer = document.querySelector(".keyContainer");
const messageDisplay = document.querySelector(".messageContainer");
const newGameButton = document.querySelector("#newGame");

fetch("https://random-word-api.herokuapp.com/word?length=5")
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    const purdle = data.toString().toUpperCase();
    console.log("I know this is the word, its on purpose " + purdle);
    const keys = [
      "Q",
      "W",
      "E",
      "R",
      "T",
      "Y",
      "U",
      "I",
      "O",
      "P",
      "A",
      "S",
      "D",
      "F",
      "G",
      "H",
      "J",
      "K",
      "L",
      "ENTER",
      "Z",
      "X",
      "C",
      "V",
      "B",
      "N",
      "M",
      "«",
    ];

    const guessRows = [
      ["", "", "", "", ""],
      ["", "", "", "", ""],
      ["", "", "", "", ""],
      ["", "", "", "", ""],
      ["", "", "", "", ""],
      ["", "", "", "", ""],
    ];

    let currentRow = 0;
    let currentTile = 0;
    let isGameOver = false;

    guessRows.forEach((guessRow, guessRowIndex) => {
      const rowElement = document.createElement("div");
      rowElement.setAttribute("id", "guessRow-" + guessRowIndex);
      guessRow.forEach((guess, guessIndex) => {
        const tileElement = document.createElement("div");
        tileElement.setAttribute(
          "id",
          "guessRow-" + guessRowIndex + "-tile-" + guessIndex
        );
        tileElement.classList.add("tile");
        rowElement.append(tileElement);
      });
      tileContainer.append(rowElement);
    });

    const handleClick = (letter) => {
      if (letter === "«") {
        deleteLetter();
        return;
      }
      if (letter === "ENTER") {
        checkRow();
        return;
      }
      addLetter(letter);
    };

    keys.forEach((key) => {
      const btnElement = document.createElement("button");
      btnElement.textContent = key;
      btnElement.setAttribute("id", key);
      btnElement.addEventListener("click", () => handleClick(key));
      keyContainer.append(btnElement);
    });

    document.addEventListener("keypress", (event) => {
      const key = event.key.toUpperCase();
      if (keys.includes(key)) {
        handleClick(key);
      }
    });

    const addLetter = (letter) => {
      if (currentTile < 5 && currentRow < 6) {
        const tile = document.getElementById(
          "guessRow-" + currentRow + "-tile-" + currentTile
        );
        tile.textContent = letter;
        guessRows[currentRow][currentTile] = letter;
        tile.setAttribute("data", letter);
        currentTile++;
      }
    };

    const deleteLetter = () => {
      if (currentTile > 0) {
        currentTile--;
        const tile = document.getElementById(
          "guessRow-" + currentRow + "-tile-" + currentTile
        );
        tile.textContent = "";
        guessRows[currentRow][currentTile] = "";
        tile.setAttribute("data", "");
      }
    };
    document.addEventListener("keydown", (event) => {
      if (event.key === "Backspace") {
        deleteLetter();
      }
    });

    let isMessageDisplayed = false;

    const checkRow = () => {
      const guess = guessRows[currentRow].join("");

      if (currentTile > 4 && !isMessageDisplayed) {
        isMessageDisplayed = true;
        flipTile();

        if (purdle === guess) {
          showMessage("Amazing!");
          isGameOver = true;
          return;
        } else {
          if (currentRow >= 5) {
            isGameOver = true;
            showMessage("Game Over");
            return;
          }
          if (currentRow < 5) {
            currentRow++;
            currentTile = 0;
            isMessageDisplayed = false;
          }
        }
      }
    };

    const showMessage = (message) => {
      const messageP = document.createElement("P");
      messageP.textContent = message;
      messageDisplay.append(messageP);
    };

    const addColorToKey = (keyLetter, color) => {
      const key = document.getElementById(keyLetter);
      if (key) {
        key.classList.add(color);
      }
    };

    const flipTile = () => {
      const rowTiles = document.getElementById(
        "guessRow-" + currentRow
      ).childNodes;
      let checkpurdle = purdle;
      const guess = [];
      rowTiles.forEach((tile) => {
        guess.push({ letter: tile.getAttribute("data"), color: "greyOv" });
      });

      guess.forEach((guess, index) => {
        if (guess.letter == purdle[index]) {
          guess.color = "greenOv";
          checkpurdle = checkpurdle.replace(guess.letter, "");
        }
      });

      guess.forEach((guess) => {
        if (checkpurdle.includes(guess.letter)) {
          guess.color = "yellowOv";
          checkpurdle = checkpurdle.replace(guess.letter, "");
        }
      });

      rowTiles.forEach((tile, index) => {
        setTimeout(() => {
          tile.classList.add(guess[index].color);
          addColorToKey(guess[index].letter, guess[index].color);
        }, 400 * index);
      });
    };
  });

newGameButton.addEventListener("click", () => {
  window.location.reload();
});
