import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './WordScrambleGame.module.css';
import { FaLightbulb, FaClock, FaRedo, FaPlay, FaCheckCircle, FaTimesCircle, FaInfoCircle, FaSignOutAlt, FaArrowLeft } from 'react-icons/fa';
import Confetti from 'react-confetti';
import { useAuth } from '../../../context/AuthContext'; // Adjusted path assuming context is at src/context

const DIFFICULTY_TIERS = [
  { tierId: 1, name: "Beginner", minLength: 3, maxLength: 4, timeLimit: 20, points: 5 },
  { tierId: 2, name: "Intermediate", minLength: 5, maxLength: 6, timeLimit: 30, points: 10 },
  { tierId: 3, name: "Advanced", minLength: 7, maxLength: 8, timeLimit: 40, points: 15 },
  { tierId: 4, name: "Expert", minLength: 9, maxLength: Infinity, timeLimit: 45, points: 20 },
];

const HINT_PENALTY = 25;

const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const scramble = (word) => {
  if (!word) return '';
  const letters = word.split('');
  let scrambledWord = '';
  do {
    for (let i = letters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [letters[i], letters[j]] = [letters[j], letters[i]];
    }
    scrambledWord = letters.join('');
  } while (scrambledWord === word && word.length > 1);
  return scrambledWord;
};

const getTierForLevel = (level) => {
  if (level <= 3) return DIFFICULTY_TIERS[0]; // Levels 1-3
  if (level <= 6) return DIFFICULTY_TIERS[1]; // Levels 4-6
  if (level <= 9) return DIFFICULTY_TIERS[2]; // Levels 7-9
  return DIFFICULTY_TIERS[3]; // Level 10+
};

const WordScrambleGame = () => {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [currentWordDetails, setCurrentWordDetails] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [hintUsed, setHintUsed] = useState(false);
  const [showHintText, setShowHintText] = useState(false);
  const [gameState, setGameState] = useState('initial'); // 'initial', 'loading', 'playing', 'wordOver', 'gameOver'
  const [feedback, setFeedback] = useState({ message: '', type: '' });
  const [shuffledWordPool, setShuffledWordPool] = useState([]);
  const [usedWordOriginals, setUsedWordOriginals] = useState(new Set());
  const [showLowTimeAlert, setShowLowTimeAlert] = useState(false);
  const [isLoadingWords, setIsLoadingWords] = useState(false);
  const [wordLoadingError, setWordLoadingError] = useState('');
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(false);
  const { token, updateUserContext } = useAuth(); // Get token and a way to update user context if available

  const saveScoreToBackend = useCallback(async (pointsToSave) => {
    if (!token) {
      console.log("User not authenticated. Cannot save score.");
      return;
    }
    // We can decide to save even 0 points if it signifies game completion
    // if (pointsToSave <= 0) {
    //   console.log("No points to save.");
    //   return;
    // }
    try {
      const response = await fetch('/api/users/update-game-score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ pointsEarned: pointsToSave }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to save score.');
      }
      console.log('Score saved successfully:', data);
      if (updateUserContext && data.totalPoints !== undefined) { // If AuthContext has a way to update user
        updateUserContext({ totalPoints: data.totalPoints }); // Update local user context
      }
    } catch (error) {
      console.error('Error saving score to backend:', error);
    }
  }, [token, updateUserContext]);

  const triggerGameOverActions = useCallback((finalScore, message) => {
    setFeedback({ message, type: 'info' });
    setGameState('gameOver');
    setShowLowTimeAlert(false);
    saveScoreToBackend(finalScore); // Save score to backend
    if (finalScore > 0) { // Show confetti only if points were scored
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 6000); // Confetti for 6 seconds
    }
  }, [saveScoreToBackend]);

  const loadLevel = useCallback((levelNumber, currentPool, currentUsedWords) => {
    setGameState('loading');
    const tierSettings = getTierForLevel(levelNumber);
    let chosenWord = null;

    for (const wordObj of currentPool) {
      const wordLength = wordObj.word.length;
      if (
        wordLength >= tierSettings.minLength &&
        wordLength <= tierSettings.maxLength &&
        !currentUsedWords.has(wordObj.word.toUpperCase())
      ) {
        chosenWord = wordObj;
        break;
      }
    }

    if (chosenWord) {
      const newUsedWords = new Set(currentUsedWords);
      newUsedWords.add(chosenWord.word.toUpperCase());
      setUsedWordOriginals(newUsedWords);

      setCurrentWordDetails({
        original: chosenWord.word.toUpperCase(),
        scrambled: scramble(chosenWord.word.toUpperCase()),
        hint: chosenWord.hint,
        points: tierSettings.points,
        timeLimit: tierSettings.timeLimit,
      });
      setTimeLeft(tierSettings.timeLimit);
      setUserInput('');
      setHintUsed(false);
      setShowHintText(false);
      setShowLowTimeAlert(false);
      setFeedback({ message: '', type: '' });
      setGameState('playing');
    } else {
      // No suitable word found for this level/tier
      // Check if there are any words left at all in the pool that haven't been used,
      // regardless of the current tier's length constraints.
      const anyUnusedWordsLeft = currentPool.some(wordObj => !currentUsedWords.has(wordObj.word.toUpperCase()));
      let gameOverMessage = `Congratulations! You've completed all available words. Final Score: ${score}`;
      if (anyUnusedWordsLeft) {
        gameOverMessage = `No more words available for the current difficulty. Well done! Final Score: ${score}`;
      }
      triggerGameOverActions(score, gameOverMessage);
    }
  }, [score, triggerGameOverActions]);


  const startGameSequence = useCallback(async () => {
    setIsLoadingWords(true);
    setWordLoadingError('');
    setGameState('loading'); // Indicate loading state for UI

    try {
      // Ensure your backend is running and accessible at this URL
      // If your frontend and backend are on different ports,
      // you'll need to configure proxy in package.json or use full URL and CORS
      const response = await fetch('/api/wordscramble/words'); // Updated API endpoint
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ msg: `HTTP error! status: ${response.status}` }));
        throw new Error(errorData.msg || `HTTP error! status: ${response.status}`);
      }
      const fetchedWords = await response.json();

      if (!fetchedWords || fetchedWords.length === 0) {
        throw new Error('No words received from server.');
      }

      const initialPool = shuffleArray(fetchedWords);
      setShuffledWordPool(initialPool);
      setUsedWordOriginals(new Set());
      setCurrentLevel(1);
      setScore(0);
      setShowConfetti(false); // Ensure confetti is off at start
      setShowLowTimeAlert(false);
      loadLevel(1, initialPool, new Set()); // loadLevel will set gameState to 'playing' or 'gameOver'
    } catch (error) {
      console.error("Failed to fetch words:", error);
      setWordLoadingError(error.message || 'Failed to load words. Please try again later.');
      setGameState('initial'); // Revert to initial screen on error
    } finally {
      setIsLoadingWords(false);
    }
  }, [loadLevel]);

  useEffect(() => {
    let timerId;
    if (gameState === 'playing' && timeLeft > 0) {
      timerId = setInterval(() => {
        setTimeLeft((currentTimerValue) => {
          const newTime = currentTimerValue - 1;
          if (newTime <= 5 && newTime > 0) {
            setShowLowTimeAlert(true);
          } else if (newTime === 0) {
            setShowLowTimeAlert(false); // Hide when time is up
          }
          return newTime;
        }); // Removed extra closing brace here
      }, 1000);
    } else if (gameState === 'playing' && timeLeft === 0) {
      setGameState('wordOver');
      setFeedback({ message: `Time's up! The word was: ${currentWordDetails?.original}`, type: 'error' });
      setShowLowTimeAlert(false);
    }
    return () => clearInterval(timerId);
  }, [gameState, timeLeft, currentWordDetails]);

  const handleInputChange = (e) => {
    setUserInput(e.target.value.toUpperCase());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userInput.trim() || gameState !== 'playing') return;

    if (userInput === currentWordDetails.original) {
      let pointsEarned = currentWordDetails.points;
      if (hintUsed) {
        pointsEarned -= HINT_PENALTY;
        pointsEarned = Math.max(0, pointsEarned); // Ensure points don't go negative
      }
      setScore((prevScore) => prevScore + pointsEarned);
      setFeedback({ message: `Correct! +${pointsEarned} points.`, type: 'success' });
    } else {
      setFeedback({ message: `Incorrect! The word was: ${currentWordDetails.original}`, type: 'error' });
    }
    setGameState('wordOver');
  };

  const handleHint = () => {
    if (gameState === 'playing' && !hintUsed) {
      setHintUsed(true);
      setShowHintText(true);
    }
  };

  const handleNextLevel = () => {
    const nextLevelNumber = currentLevel + 1;
    setCurrentLevel(nextLevelNumber);
    setShowHintText(false); // Hide hint text for the next word
    loadLevel(nextLevelNumber, shuffledWordPool, usedWordOriginals);
  };

  const handlePlayAgain = () => {
    setShowConfetti(false); // Reset confetti
    startGameSequence();
  };

  const handleQuitGame = () => {
    const quitMessage = `You've quit the game. Your final score: ${score}`;
    triggerGameOverActions(score, quitMessage);
  };

  const handleGoToGamesPage = () => {
    navigate('/games'); // Navigate to the main games page
  };

  if (gameState === 'initial') {
    return (
      <div className={styles.gameContainer}>
        <div className={styles.initialScreen}>
          <h1>Word Scramble Challenge!</h1>
          <p>Unscramble letters to form words across various difficulty levels. Test your vocabulary and speed!</p>
          {wordLoadingError && <p className={`${styles.feedback} ${styles.error}`}>{wordLoadingError}</p>}
          <button
            onClick={startGameSequence}
            className={`${styles.controlButton} ${styles.playButton}`}
            disabled={isLoadingWords}
          >
            <FaPlay style={{ marginRight: '8px' }} /> Start Game
          </button>
          <button onClick={handleGoToGamesPage} className={`${styles.controlButton} ${styles.backButton}`}>
            <FaArrowLeft style={{ marginRight: '8px' }} /> Back to Games
          </button>
        </div>
      </div>
    );
  }

  if (gameState === 'loading') {
    return (
      <div className={styles.gameContainer}>
        <div className={styles.loadingScreen}>
          <button onClick={handleGoToGamesPage} className={`${styles.controlButton} ${styles.backButton} ${styles.backButtonAbsolute}`}>
            <FaArrowLeft />
          </button>
          {isLoadingWords && !currentWordDetails ? ( // Show "Loading Words..." only if words are being fetched initially
            <p>Loading Words...</p>
          ) : (
            <p>Loading Level {currentLevel}...</p>
          )}
        </div>
      </div>
    );
  }

  if (gameState === 'gameOver') {
    return (
      <div className={styles.gameContainer}>
        {showConfetti && <Confetti recycle={false} numberOfPieces={300} />}
        <div className={styles.gameOverScreen}>
         <button onClick={handleGoToGamesPage} className={`${styles.controlButton} ${styles.backButton} ${styles.backButtonAbsolute}`}>
            <FaArrowLeft />
          </button>
          <h2>Game Over!</h2>
          {feedback.message && <p className={`${styles.feedback} ${styles[feedback.type]}`}>{feedback.message}</p>}
          {/* Final score is already in feedback message for gameOver state */}
          <button onClick={handlePlayAgain} className={`${styles.controlButton} ${styles.playButton}`}>
            <FaRedo style={{ marginRight: '8px' }} /> Play Again
          </button>
        </div>
      </div>
    );
  }

  if (!currentWordDetails) {
    return (
      <div className={styles.gameContainer}>
        <button onClick={handleGoToGamesPage} className={`${styles.controlButton} ${styles.backButton} ${styles.backButtonAbsolute}`}>
          <FaArrowLeft />
        </button>
        <p>Preparing game...</p>
      </div>
    );
  }

  return (
    <div className={styles.gameContainer}>
      <button onClick={handleGoToGamesPage} className={`${styles.controlButton} ${styles.backButton} ${styles.backButtonAbsolute} ${styles.backButtonIngame}`}>
        <FaArrowLeft />
      </button>
      <header className={styles.gameHeader}>
        <h1>Word Scramble</h1>
        <div className={styles.stats}>
          <span>Score: {score}</span>
          <span>Level: {currentLevel} ({getTierForLevel(currentLevel).name})</span>
          {gameState === 'playing' && (
            <button onClick={handleQuitGame} className={`${styles.controlButton} ${styles.quitButton}`}>
              <FaSignOutAlt style={{ marginRight: '5px' }} /> Quit
            </button>
          )}
        </div>
      </header>

      <div className={styles.wordArea}>
        <p className={styles.scrambledWord}>{currentWordDetails.scrambled}</p>
        {gameState === 'playing' && (
          <div className={styles.timer}>
            <FaClock style={{ marginRight: '5px' }} /> {timeLeft}s
          </div>
        )}
        {gameState === 'playing' && showLowTimeAlert && timeLeft > 0 && (
          <p className={styles.lowTimeAlert}>Hurry! Time is running out!</p>
        )}
      </div>

      {(feedback.message && (gameState === 'wordOver' || gameState === 'gameOver')) && (
         <p className={`${styles.feedback} ${styles[feedback.type]}`}>
            {feedback.type === 'success' && <FaCheckCircle style={{ marginRight: '5px' }} />}
            {feedback.type === 'error' && <FaTimesCircle style={{ marginRight: '5px' }} />}
            {feedback.type === 'info' && <FaInfoCircle style={{ marginRight: '5px' }} />}
            {feedback.message}
        </p>
      )}
      {showHintText && gameState === 'playing' && (
        <p className={`${styles.feedback} ${styles.info} ${styles.hintFeedback}`}>
            <FaInfoCircle style={{ marginRight: '5px' }} />
            Hint: {currentWordDetails.hint} (-{HINT_PENALTY} pts if correct)
        </p>
      )}

      {gameState === 'playing' && (
        <form onSubmit={handleSubmit} className={styles.inputForm}>
          <input
            type="text"
            value={userInput}
            onChange={handleInputChange}
            placeholder="Unscramble the word"
            className={styles.inputField}
            aria-label="Your guess"
            disabled={gameState !== 'playing'}
          />
          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.controlButton} disabled={!userInput.trim()}>
              Submit
            </button>
            <button type="button" onClick={handleHint} className={`${styles.controlButton} ${styles.hintButton}`} disabled={hintUsed || showHintText}>
              <FaLightbulb style={{ marginRight: '5px' }} /> Hint
            </button>
          </div>
        </form>
      )}

      {gameState === 'wordOver' && (
        <div className={styles.wordOverControls}>
          <button onClick={handleNextLevel} className={styles.controlButton}>
            Next Level
          </button>
        </div>
      )}
    </div>
  );
};

export default WordScrambleGame;