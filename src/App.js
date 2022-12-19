// CSS
import './App.css';

//React
import { useCallback, useEffect, useState } from 'react';

// data
import { wordsList } from './data/word';

// components
import StartScreen from './components/StartScreen';
import Game from './components/Game';
import GameOver from './components/GameOver';

const stages = [
  { id: 1, name: 'start' },
  { id: 2, name: 'game' },
  { id: 3, name: 'end' },
];

const guessesQty = 3;
function App() {
  const [gameStage, setGameStage] = useState(stages[0].name);
  const [words] = useState(wordsList);

  const [pickedWord, setpickedWord] = useState("");
  const [pickedCategory, setpickedCategory] = useState("");
  const [letters, setLetters] = useState([]);

  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [guesses, setGuesses] = useState(guessesQty);
  const [score, setScore] = useState(0);

  const pickedWordAndCategory = useCallback(() => {
    // pick a random category
    const categories = Object.keys(words);
    const category = categories[Math.floor(Math.random() * Object.keys(categories).length)]

    console.log(category);
    // pick a random word
    const word = words[category][Math.floor(Math.random() * words[category].length)]
    console.log(word)

    return { word, category };
  }, [words]);

  //start secret word game
  const startGame = useCallback(() => {
    // clear All letters
    clearLetterStates();
    // pick word and pick category
    const { word, category } = pickedWordAndCategory();

    // create an array of letters
    let wordLetters = word.split("");

    wordLetters = wordLetters.map((l) => l.toLowerCase());
    console.log(wordLetters);
    console.log(word, category);

    // fill states
    setpickedWord(word);
    setpickedCategory(category);
    setLetters(wordLetters);

    setGameStage(stages[1].name);
  }, [pickedWordAndCategory]);

  //process the letter input
  const verifyLetter = (letter) => {

    const normalizeLetter = letter.toLowerCase();

    //check if letter has already been utilized
    if (
      guessedLetters.includes(normalizeLetter) ||
      wrongLetters.includes(normalizeLetter)
    ) {
      return
    }

    //push guessed letter or remove a guess
    if (letters.includes(normalizeLetter)) {
      setGuessedLetters((actualGuessesLetters) => [
        ...actualGuessesLetters,
        normalizeLetter
      ])
    } else {
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters,
        normalizeLetter
      ]);
      setGuesses((actualGuesses) => actualGuesses - 1);
    }
  }

  const clearLetterStates = () => {
    setGuessedLetters([]);
    setWrongLetters([]);
  }
  //check if guesses ended
  useEffect(() => {
    if (guesses <= 0) {
      // reset all stages
      clearLetterStates();
      setGameStage(stages[2].name);
    }
  }, [guesses])
  // check win condition
  useEffect(() => {
    const uniqueLetters = [...new Set(letters)];

    //win condition
    if (guessedLetters.length === uniqueLetters.length) {
      // add score
      setScore((actualScore) => actualScore += 100);
      //restart game with new word
      startGame();
    }
    console.log(uniqueLetters)
  }, [guessedLetters, letters, startGame])
  //restart game
  const retry = () => {
    setScore(0);
    setGuesses(guessesQty);
    setGameStage(stages[0].name);
  }

  return (
    <div className="App">
      {gameStage === 'start' && <StartScreen startGame={startGame} />}
      {gameStage === 'game' &&
        <Game verifyLetter={verifyLetter}
          pickedWord={pickedWord}
          pickedCategory={pickedCategory}
          letters={letters}
          guessedLetters={guessedLetters}
          wrongLetters={wrongLetters}
          guesses={guesses}
          score={score}
        />
      }
      {gameStage === 'end' && <GameOver retry={retry} score={score} />
      }
    </div>
  );
}

export default App;
