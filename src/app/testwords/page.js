'use client';

import React, { useEffect, useState, useRef } from 'react';
import pageStyles from '../page.module.css';
import subPagesStyles from '../subpages.module.css'
import words from '../../../resources/words.json';
import { useTextToSpeech } from '../useTextToSpeech';
import { getData, postData } from '../lib/appwrite';

export default function TestWords() {
  const duration = 60; // Duration in seconds
  const [randomWords, setRandomWords] = useState([]);
  const [correctIndex, setCorrectIndex] = useState(0);
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [animationKey, setAnimationKey] = useState(0);
  const [numberOfCorrectAnswers, setNumberOfCorrectAnswers] = useState(0);
  const [numberOfWrongAnswers, setNumberOfWrongAnswers] = useState(0);
  const [timer, setTimer ] = useState(duration);
  const [help, setHelp] = useState(false);
  const [fromLang, setFromLang] = useState('sv-SE');
  const [toLang, setToLang] = useState('en-US');
  const [status, setStatus] = useState('loading');
  const [soundOn, setSoundOn] = useState(true);
  const textToSpeech = useTextToSpeech();
  const wordList = words;
  const styles = { ...pageStyles, ...subPagesStyles}
  const [name, setName] = useState('');
  const [enterName, setEnterName] = useState(false);
  const selectedType = 'ord'; // Assuming this is the type of exercise
  const intervalRef = useRef(null);

  useEffect(() => {
    async function fetchData() {
      setStatus('loading');
      const data = await getData('word');
      wordList.push(...data.documents);
      const uniqueWords = Array.from(new Set(wordList.map(word => JSON.stringify(word)))).map(word => JSON.parse(word));
      wordList.length = 0; 
      wordList.push(...uniqueWords);
    }
    fetchData();
    getRandomWords();
  }, []);

  useEffect(() => {
    if (fromLang === 'en-US') setToLang('sv-SE');
    else setToLang('en-US');
    resetGame();
  }, [fromLang]);

  useEffect(() => {
    if (help) {
      const helpIndexes = new Set();
      while (helpIndexes.size < 1) {
        const randomIndex = Math.floor(Math.random() * randomWords.length);
        if (randomIndex !== correctIndex && !randomWords[randomIndex].disabled) {
          helpIndexes.add(randomIndex);
        }
      }
      const helpArray = Array.from(helpIndexes);
      const updatedWords = randomWords.map((word, index) => {
        if (helpArray.includes(index)) {
          return { ...word, disabled: true };
        }
        return word;
      }
      );
      setRandomWords(updatedWords);
      setHelp(false);
    }
  }, [help]);

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

  const resetGame = () => {
    setNumberOfCorrectAnswers(0);
    setNumberOfWrongAnswers(0);
    getRandomWords();
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }

  const getRandomWords = () => {
    setCorrectAnswer(null);
    const numberOfWords = wordList.length;
    const uniqueIndexes = new Set();
    while (uniqueIndexes.size < 4) {
      uniqueIndexes.add(Math.floor(Math.random() * numberOfWords));
    }
    const selectedWords = Array.from(uniqueIndexes).map((i) => wordList[i]);
    const answerIndex = Math.floor(Math.random() * 4);
    selectedWords.forEach((word, index) => {
      word = { ...word, disabled: false };
    });
    setRandomWords(selectedWords);
    setCorrectIndex(answerIndex);
    setAnimationKey((k) => k + 1);
    setStatus('loaded');
  };

  const handleClick = (event) => {
    const selectedWord = event.target.textContent;
    const correctAnswer = fromLang === 'en-US' ? randomWords[correctIndex]?.swedish : randomWords[correctIndex]?.english;
    if (soundOn) {
      textToSpeech(randomWords[correctIndex][fromLang === 'en-US' ? 'english' : 'swedish'], fromLang);
      setTimeout(() => {
        textToSpeech(selectedWord, toLang);
      }, 500);
    }
    if (selectedWord != correctAnswer) {
      document.body.classList.toggle('blink-red');
    }
    setTimeout(() => {
      if (selectedWord === correctAnswer) {
        //if (soundOn) textToSpeech('Rätt!', 'sv-SE')
        setNumberOfCorrectAnswers((prev) => prev + 1);
        setCorrectAnswer(true);
        setTimeout(() => {
          getRandomWords();
        }, 1500);
      } else {
        //if (soundOn) textToSpeech('Fel!', 'sv-SE')
        setNumberOfWrongAnswers((prev) => prev + 1);
        setCorrectAnswer(false);
        setTimeout(() => {
          setCorrectAnswer(null);
          document.body.classList.toggle('blink-red');
        }, 1500);
      }
    }, soundOn ? 500 : 0);
  };

  if (status === 'loading') return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.title}>Laddar ord...</h1>
      </main>
    </div>
  );
  const checkResult = async () => {
    console.log('Saving result...');
    let isBest = false;
    await getData('stats').then((data) => {
      console.log('Fetched stats:', data);
      if (!data || !data.documents || !data.documents.length) {
        console.log('No previous stats found, this is the best result');
        isBest = true;
      }
      else {
        const allResults = data.documents.concat([{
          correctAnswers: numberOfCorrectAnswers,
          wrongAnswers: numberOfWrongAnswers
        }]);
        allResults.sort((a, b) =>
          (b.correctAnswers * 10 - b.wrongAnswers * 5) - (a.correctAnswers * 10 - a.wrongAnswers * 5)
        );
        const index = allResults.findIndex(
          r => r.correctAnswers === numberOfCorrectAnswers && r.wrongAnswers === numberOfWrongAnswers
        );
        isBest = index > -1 && index < 10;
      }
    }).catch((error) => {
      console.error('Error fetching stats:', error);
    });
    if (isBest) {
      setTimer(duration);
      setEnterName(true);
    } else {
      console.log('Not the best result, no name entry needed');
      resetGame(false);
    }
  }

  const saveResult = () => {
    console.log('Saving result with name:', name);
    if (!name || name.trim() === '') {
      setEnterName(false);
      setName('');
      resetGame(true);
      return;
    }
    const result = {
      type: selectedType,
      correctAnswers: numberOfCorrectAnswers,
      wrongAnswers: numberOfWrongAnswers,
      time: duration,
      name
    };

    postData('stats', result)
      .then(() => {
        console.log('Result saved successfully');
        setEnterName(false);
        setName('');
        resetGame(true);
      })
      .catch((error) => {
        console.error('Error saving result:', error);
      });
  }
const getPoints = () => {
  const points = numberOfCorrectAnswers * 10 - numberOfWrongAnswers * 5;
  if (points < 0) return 0; // Ensure points don't go below zero
  return points;
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
        <h1 className={styles.title}>Öva engelska glosor</h1>
        <p key={animationKey + 1}>
          Vad är <span className={styles.word} onClick={() => soundOn && textToSpeech(randomWords[correctIndex][fromLang === 'en-US' ? 'english' : 'swedish'], fromLang)}>{randomWords[correctIndex][fromLang === 'en-US' ? 'english' : 'swedish']}</span> på {fromLang === 'en-US' ? 'svenska' : 'engelska'}?
        </p>
        <ul key={animationKey} className={soundOn ? '' : styles.wordListNoSound} onClick={countDown}>
          {randomWords.map((word, index) => (
            <li key={toLang === 'en-US' ? word.english : word.swedish}>
              <button disabled={word.disabled} data-word={word[toLang === 'en-US' ? 'english' : 'swedish']} onClick={handleClick}>{toLang === 'en-US' ? word.english : word.swedish}</button>
              {soundOn && <button className={styles.speaker} onClick={() => textToSpeech(word[toLang === 'en-US' ? 'english' : 'swedish'], toLang)}></button>}
            </li>
          ))}
        </ul>
        <section className={styles.buttons}>
          <button className={styles.grey} onClick={() => randomWords.filter(word => word.disabled).length < 2 && setHelp(true)}>
            Hjälp &bull;
          </button>
          <button className={styles.grey} onClick={() => setFromLang(fromLang === 'en-US' ? 'sv-SE' : 'en-US')}>
            Byt språk &bull;
          </button>
          <button className={styles.grey} onClick={resetGame}>
            Börja om &bull;
          </button>
          <button className={styles.grey} onClick={() => setSoundOn(!soundOn)}>
            {soundOn ? 'Ljud av' : 'Ljud på'}
          </button>
        </section>
        {correctAnswer !== null && (
          <p onClick={() => { correctAnswer ? getRandomWords() : setCorrectAnswer(null); }} className={correctAnswer ? styles.correct : styles.incorrect}>
            {correctAnswer ? 'Rätt svar!' : 'Fel svar, försök igen'}
          </p>
        )}
        {timer === 0 && (
          <p className={styles.correct} onClick={checkResult}>
            Tiden är ute, du hann med {numberOfCorrectAnswers} övningar!
          </p>
        )}
        {enterName && (
          <div className={[styles.enterName]}>
            <label htmlFor="namn">Skriv ditt namn</label>
            <input id="name" type="text" autoFocus autoComplete="off" value={name} onChange={(e) => setName(e.target.value)} onKeyUp={(e) => e.key === 'Enter' && saveResult()} />
            <button onClick={saveResult}>Spara</button>
          </div>
        )}
        <p><span>Poäng:</span> {getPoints()} <span>Övningar:</span> {numberOfCorrectAnswers}</p>
      </main>
    </div>
  );
}