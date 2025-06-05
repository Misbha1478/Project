// frontend/src/pages/GamesPage/GamesPage.jsx
import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import styles from './GamesPage.module.css';
// We will no longer directly render FlashQuizGame here

const GamesPage = () => {
  return (
    <div className={styles.gamesPageContainer}>
      <h1 className={styles.pageTitle}>Diamond Tier Games</h1>
      <p className={styles.comingSoonText}>
        Welcome to the exclusive games section for Diamond Tier members!
        Select a game below to start playing.
      </p>
      <div className={styles.gamesGrid}>
        {/* Card for Flash Quiz Game */}
        <Link to="/games/quiz-levels" className={styles.gameCardLink}>
          <div className={styles.gameCard}>
            <div className={styles.gameIcon}>🧠</div> {/* Or an actual image/icon component */}
            <h2 className={styles.gameTitle}>Flash Quiz</h2>
            <p className={styles.gameDescription}>
              Test your knowledge on productivity, logic, and more. Earn points for correct answers!
            </p>
          </div>
        </Link>

        {/* Card for Word Scramble Game */}
        <Link to="/games/word-scramble" className={styles.gameCardLink}>
          <div className={styles.gameCard}>
            <div className={styles.gameIcon}>📝</div> {/* Or a different relevant icon */}
            <h2 className={styles.gameTitle}>Word Scramble</h2>
            <p className={styles.gameDescription}>
              Unscramble jumbled letters to form words. Improves focus and vocabulary!
            </p>
          </div>
        </Link>

      </div>
    </div>
  );
};

export default GamesPage;
