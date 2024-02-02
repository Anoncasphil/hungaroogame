const wordDisplay = document.querySelector(".word-display");
const guessesText = document.querySelector(".guesses-text b");
const keyboardDiv = document.querySelector(".keyboard");
const hangmanImage = document.querySelector(".hangman-box img");
const gameModal = document.querySelector(".game-modal");
const playAgainBtn = gameModal.querySelector("button");

// Initializing game variables
let currentWord, correctLetters, wrongGuessCount, points;
const maxGuesses = 3;
const pointsPerCorrectAnswer = 10;
const hintCost = 25;

points = 0;

const resetGame = () => {
    // Resetting game variables and UI elements
    correctLetters = [];
    wrongGuessCount = 0;
    hangmanImage.src = "images/hangman-0.svg";
    guessesText.innerText = `${wrongGuessCount} / ${maxGuesses}`;
    wordDisplay.innerHTML = currentWord.split("").map(() => `<li class="letter"></li>`).join("");
    keyboardDiv.querySelectorAll("button").forEach(btn => btn.disabled = false);
    gameModal.classList.remove("show");
}

const resetPoints = () => {
    // Reset points to zero and update the display
    points = 0;
    document.querySelector(".points-box input").value = points;
}


const getRandomWord = () => {
    // Selecting a random word and hint from the wordList
    const { word, hint } = wordList[Math.floor(Math.random() * wordList.length)];
    currentWord = word; // Making currentWord as random word
    document.querySelector(".hint-text b").innerText = hint;
    resetGame();
}

const updatePoints = () => {
    // Update points and display
    points += pointsPerCorrectAnswer;
    document.querySelector(".points-box input").value = points;
}

const gameOver = (isVictory) => {
    // After game complete.. showing modal with relevant details
    const modalText = isVictory ? `You found the word:` : 'The correct word was:';
    gameModal.querySelector("img").src = `images/${isVictory ? 'victory' : 'lost'}.gif`;
    gameModal.querySelector("h4").innerText = isVictory ? 'Congrats!' : 'Game Over!';
    gameModal.querySelector("p").innerHTML = `${modalText} <b>${currentWord}</b>`;
    gameModal.classList.add("show");
}

const getHint = () => {
    if (points >= hintCost) {
        // Deduct points and provide hint
        points -= hintCost;
        document.querySelector(".points-box input").value = points;

        // Retrieve consonants and vowels from the currentWord
        const consonants = Array.from(new Set(currentWord.match(/[^aeiou]/gi)));
        const vowels = Array.from(new Set(currentWord.match(/[aeiou]/gi)));

        if (consonants.length === 0 && vowels.length === 0) {
            alert("No consonants or vowels in the word!");
        } else {
            // Choose randomly between consonants or vowels for the hint
            const hintArray = Math.random() < 0.5 ? consonants : vowels;

            // Display the hint in an alert or any other way you prefer
            const randomHint = hintArray[Math.floor(Math.random() * hintArray.length)];
            alert(`Hello! I am the Game Master! Your Hint would be: "${randomHint}"`);
        }
    } else {
        alert("Insufficient points to acquire a hint!");
    }
}

const initGame = (button, clickedLetter) => {
    // Checking if clickedLetter exists in the currentWord
    if (currentWord.includes(clickedLetter)) {
        // Showing all correct letters on the word display
        [...currentWord].forEach((letter, index) => {
            if (letter === clickedLetter) {
                correctLetters.push(letter);
                wordDisplay.querySelectorAll("li")[index].innerText = letter;
                wordDisplay.querySelectorAll("li")[index].classList.add("guessed");
            }
        });

        // Move the updatePoints() line inside the if statement only if a round is won
        if (correctLetters.length === currentWord.length) {
            gameOver(true);
            updatePoints();
        }
    } else {
        // If clicked letter doesn't exist, then update the wrongGuessCount and hangman image
        wrongGuessCount++;
        hangmanImage.src = `images/hangman-${wrongGuessCount}.svg`;
    }

    button.disabled = true; // Disabling the clicked button so the user can't click again
    guessesText.innerText = `${wrongGuessCount} / ${maxGuesses}`;

    // Calling gameOver function if the wrongGuessCount reaches maxGuesses
    if (wrongGuessCount === maxGuesses) return gameOver(false);
}

// Creating keyboard buttons and adding event listeners
for (let i = 97; i <= 122; i++) {
    const button = document.createElement("button");
    button.innerText = String.fromCharCode(i);
    keyboardDiv.appendChild(button);
    button.addEventListener("click", (e) => initGame(e.target, String.fromCharCode(i)));
}

getRandomWord();
playAgainBtn.addEventListener("click", getRandomWord);

const startGame = () => {
    getRandomWord();
    resetGame();
};

document.getElementById("resetButton").addEventListener("click", function() {
    resetGame();
    resetPoints(); // Ensure that the correct function name is used
});

