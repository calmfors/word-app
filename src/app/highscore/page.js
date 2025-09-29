'use client';
import React, { useEffect, useState } from 'react';
import pageStyles from "../page.module.css";
import subPagesStyles from "../subpages.module.css";
import { getData } from '../lib/appwrite'; // Uncomment if you need to fetch data
import Header from '../components/Header';

export default function Highscore() {
  const styles = { ...pageStyles, ...subPagesStyles };
  const [highScoreList, setHighScoreList] = useState([]);
  const [status, setStatus] = useState('loading'); 
  
  useEffect(() => {
    async function fetchHighScores() {
      try {
        const data = await getData('stats');
        if (data && data.documents) {
          const sortedScores = data.documents.sort((a, b) =>{
            if (b.points !== a.points) {
              return b.points - a.points; // Sort by points descending
            }
            return a.wrongAnswers - b.wrongAnswers; // If points are equal, sort by wrongAnswers ascending
          });          
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
      <Header hideSvg={true} />
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
                <th>#</th>
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
                  <td>{score.points}</td>
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
