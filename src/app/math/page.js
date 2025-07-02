'use client'
import pageStyles from '../page.module.css';
import subpagesStyles from '../subpages.module.css';
import React, { useEffect, useState, useRef } from 'react';
const duration = 60;  

export default function MathProblems() {
  const [selectedType, setSelectedType] = useState('addition'); // Default to addition
  const [numberOfCorrectAnswers, setNumberOfCorrectAnswers] = useState(0);
  const [numberOfWrongAnswers, setNumberOfWrongAnswers] = useState(0);
  const [problem, setProblem] = useState('');
  const [answer, setAnswer] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [timer, setTimer] = useState(duration);
  const inputRef = useRef(null);
  const intervalRef = useRef(null);
  const styles = { ...pageStyles, ...subpagesStyles };

  useEffect(() => {
    console.log('Selected type changed:', selectedType);
    resetGame(true);
  }, [selectedType]);

  const generateAdditionProblem = () => {
    const tenOrHundred = Math.random() < 0.5 ? 10 : 100;
    const a = Math.floor(Math.random() * tenOrHundred);
    const b = tenOrHundred === 100 ? Math.floor(Math.random() * 10) : Math.floor(Math.random() * 100);
    setProblem(`${a} + ${b}`);
  }

  const countDown = () => {
    if (!intervalRef.current && timer === duration) {
      intervalRef.current = setInterval(() => {
        setTimer(prev => prev > 0 ? prev - 1 : 0);
      }, 1000);
    }
  };

  useEffect(() => {
    if (timer === 0 && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [timer]);

  const generateSubtractionProblem = () => {
    const tenOrHundred = Math.random() < 0.5 ? 10 : 100;
    const tenOrHundred2 = Math.random() < 0.5 ? 10 : 100;
    const a = Math.floor(Math.random() * tenOrHundred);
    const b = Math.floor(Math.random() * tenOrHundred2);
      const max = Math.max(a, b);
      const min = Math.min(a, b);
      setProblem(`${max} - ${min}`);
  }

  const generateMultiplicationProblem = () => {
    const a = Math.floor(Math.random() * 12) + 1; // 1 to 12
    const b = Math.floor(Math.random() * 12) + 1; // 1 to 12
    setProblem(`${a} × ${b}`);
  }

  const generateDivisionProblem = () => {
    let a = Math.floor(Math.random() * 100) + 1; // Avoid division by zero
    const b = Math.floor(Math.random() * 10) + 1; // Avoid division by zero
    // Ensure a is divisible by b
    const remainder = a % b;
    if (remainder !== 0) {
      const adjustment = remainder > 0 ? remainder : -remainder;
      a -= adjustment; // Adjust a to make it divisible by b
    }
    setProblem(`${a} ÷ ${b}`);
  }

  const checkAnswer = (event) => {
    const correctAnswer = eval(problem.replace('×', '*').replace('÷', '/'));
    if (correctAnswer === +answer) {
      setCorrectAnswer(true);
      setNumberOfCorrectAnswers(prev => prev + 1);
      setTimeout(() => {
        generateNewProblem();
      }, 1500);
    } else {
      setCorrectAnswer(false);
      setNumberOfWrongAnswers(prev => prev + 1);
      document.body.classList.toggle('blink-red');
      setTimeout(() => {
        setCorrectAnswer(null);
        document.body.classList.toggle('blink-red');
        if (inputRef.current) {
          inputRef.current.focus();
        }      
      }, 1500);
    }
  }

  const generateNewProblem = (typeChanged) => {
    setCorrectAnswer(null);
    setAnswer('');
    if (selectedType === 'addition') {
      generateAdditionProblem();
    } else if (selectedType === 'subtraction') {
      generateSubtractionProblem();
    } else if (selectedType === 'multiplication') {
      generateMultiplicationProblem();
    } else if (selectedType === 'division') {
      generateDivisionProblem();
    }
    console.log('Generating new problem:', typeChanged);
    if (inputRef.current && timer !== 0 && timer !== duration && !typeChanged) {
      inputRef.current.focus();
    }
  }

  const resetGame = (typeChanged) => {
    setTimer(duration);
    setProblem('');
    setAnswer('');
    setCorrectAnswer(null);
    setNumberOfCorrectAnswers(0);
    setNumberOfWrongAnswers(0);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (inputRef.current) {
      console.log('Resetting input focus');
      inputRef.current.blur();
    }
    generateNewProblem(typeChanged);

  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button className={styles.backButton} onClick={() => window.history.back()}></button>
        <div className={styles.timer}>
          <span>
            {Math.floor(timer / 60)}:{timer % 60 < 10 ? `0${timer % 60}` : timer % 60}
          </span>
        </div>
      </header>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Öva på att räkna
        </h1>
        <button onClick={() => setSelectedType('addition')} className={selectedType !== 'addition' ? styles.notSelected : ''}>Addition</button>
        <button onClick={() => setSelectedType('subtraction')} className={selectedType !== 'subtraction' ? styles.notSelected : ''}>Subtraktion</button>
        <button onClick={() => setSelectedType('multiplication')} className={selectedType !== 'multiplication' ? styles.notSelected : ''}>Multiplikation</button>
        <button onClick={() => setSelectedType('division')} className={selectedType !== 'division' ? styles.notSelected : ''}>Division</button>
        {problem ? <div className={styles.problem}>
          <p>
            {problem} =
          </p>
          <input ref={inputRef} type="number" placeholder="?" value={answer} onChange={(e) => setAnswer(e.target.value)} onKeyUp={(e) => e.key === 'Enter' && checkAnswer()} onClick={countDown}/>
          <button className={styles.checkmark} onClick={checkAnswer} disabled={!answer || timer === 0} >
            <svg width="30" height="30" fill={answer ? '#10a64a' : '#ccc' } id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 122.88 101.6"><defs></defs><title>tick-green</title><path d="M4.67,67.27c-14.45-15.53,7.77-38.7,23.81-24C34.13,48.4,42.32,55.9,48,61L93.69,5.3c15.33-15.86,39.53,7.42,24.4,23.36L61.14,96.29a17,17,0,0,1-12.31,5.31h-.2a16.24,16.24,0,0,1-11-4.26c-9.49-8.8-23.09-21.71-32.91-30v0Z" /></svg>
          </button>
        </div>
          : <p>Laddar...</p>}
        {correctAnswer !== null && (
          <p onClick={() => { correctAnswer ? generateNewProblem : setCorrectAnswer(null); }} className={correctAnswer ? styles.correct : styles.incorrect}>
            {correctAnswer ? 'Rätt svar!' : 'Fel svar, försök igen'}
          </p>
        )}
        {timer === 0 && (
          <p className={styles.correct} onClick={resetGame}>
            Tiden är ute, du hann med {numberOfCorrectAnswers} övningar!
          </p>
        )}
        <p><span>Antal rätt:</span> {numberOfCorrectAnswers} <span>Antal fel:</span> {numberOfWrongAnswers}</p>
      </main>
    </div>
  )

}