'use client';
import React, { useEffect, useState } from 'react';
import pageStyles from "../page.module.css";
import subPagesStyles from "../subpages.module.css";
import { getData } from '../lib/appwrite'; // Uncomment if you need to fetch data

export default function Highscore() {
  const styles = { ...pageStyles, ...subPagesStyles };
  const [highScoreList, setHighScoreList] = useState([]);
  const [status, setStatus] = useState('loading'); 
  
  useEffect(() => {
    async function fetchHighScores() {
      try {
        const data = await getData('stats');
        if (data && data.documents) {
          const sortedScores = data.documents.sort((a, b) => (b.correctAnswers * 10 - b.wrongAnswers * 5) - (a.correctAnswers * 10 - a.wrongAnswers * 5));
          setHighScoreList(sortedScores.slice(0, 10)); // Get top 10 scores          
        }
      } catch (error) {
        console.error("Error fetching high scores:", error);
      }
      setStatus('loaded');
    }
    fetchHighScores();
  }, []);

  const getSymbol = (type) => {
    switch (type) {
      case 'addition':
        return '+';
      case 'subtraction':
        return '–';
      case 'multiplication':
        return '×';
      case 'division':
        return '÷';
      default:
        return type;
    }
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button className={styles.backButton} onClick={() => window.history.back()}></button>
      </header>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Topplista
        </h1>
        {status === 'loading' ? (
          <p className={styles.loading}>Laddar...</p>
        ) : highScoreList.length === 0 ? (
          <p className={styles.noScores}>Inga resultat än. Var först med att sätta ett rekord!</p>
        ) : (
          <table className={styles.highscoreTable}>
            <thead>
              <tr>
                <th> </th>
                <th>NAMN</th>
                <th>POÄNG</th>
                <th>TYP</th>
              </tr>
            </thead>
            <tbody>
              {highScoreList.map((score, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{score.name}</td>
                  <td>{score.correctAnswers * 10 - score.wrongAnswers * 5}</td>
                  <td data-type={score.type}>{getSymbol(score.type)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
}
