'use client';

import React, { useEffect, useState } from 'react';
import styles from '../page.module.css';
import words from '../../../resources/words.json';
import { useTextToSpeech } from '../useTextToSpeech';
import { getData } from '../lib/appwrite';

export default function TestWords() {
  const [randomWords, setRandomWords] = useState([]);
  const [correctIndex, setCorrectIndex] = useState(0);
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [animationKey, setAnimationKey] = useState(0);
  const [numberOfCorrectAnswers, setNumberOfCorrectAnswers] = useState(0);
  const [numberOfWrongAnswers, setNumberOfWrongAnswers] = useState(0);
  const [help, setHelp] = useState(false);
  const textToSpeech = useTextToSpeech();
  const [fromLang, setFromLang] = useState('sv-SE');
  const [toLang, setToLang] = useState('en-US');
  const wordsFromLocalStorage = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('newWords')) : null;
  const [status, setStatus] = useState('idle');
  const [soundOn, setSoundOn] = useState(true);

  const wordList = words

  useEffect(() => {
    console.log('wordsFromLocalStorage', wordsFromLocalStorage);
    async function fetchData() {
      const data = await getData();
      wordList.push(...data.documents);
      if (wordsFromLocalStorage) {
        const uniqueWords = wordsFromLocalStorage.filter((word) => {
          return !wordList.some((w) => w.english === word.english && w.swedish === word.swedish);
        });
        wordList.push(...uniqueWords);
      }
    }
    fetchData();
  }, []);

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
  };

  useEffect(() => {
    getRandomWords();
  }, []);

  useEffect(() => {
    if (fromLang === 'en-US') {
      setToLang('sv-SE');
    } else {
      setToLang('en-US');
    }
    resetGame();
  }, [fromLang]);

  const resetGame = () => {
    setNumberOfCorrectAnswers(0);
    setNumberOfWrongAnswers(0);
    getRandomWords();
  }

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

  const handleClick = (event) => {
    const selectedWord = event.target.textContent;
    const correctAnswer = fromLang === 'en-US' ? randomWords[correctIndex]?.swedish : randomWords[correctIndex]?.english;
    if (soundOn) {
      textToSpeech(randomWords[correctIndex][fromLang === 'en-US' ? 'english' : 'swedish'], fromLang);
      textToSpeech(event.target.dataset.word, toLang);
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
        }, 1500);
      }
    }, soundOn ? 500 : 0);
  };

  if (randomWords.length < 4) return null;

  return (
    <div className={styles.page}>
      <button className={styles.backButton} onClick={() => window.history.back()}></button>
      <main className={styles.main}>
        <h1 className={styles.title}>Öva engelska glosor</h1>
        <p key={animationKey + 1}>
          Vad är <span className={styles.word} onClick={() => soundOn && textToSpeech(randomWords[correctIndex][fromLang === 'en-US' ? 'english' : 'swedish'], fromLang)}>{randomWords[correctIndex][fromLang === 'en-US' ? 'english' : 'swedish']}</span> på {fromLang === 'en-US' ? 'svenska' : 'engelska'}?
        </p>
        <ul key={animationKey} className={soundOn ? styles.wordList : [styles.wordList, styles.wordListNoSound].join(' ')}>
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
        <p><span>Antal rätt:</span> {numberOfCorrectAnswers} <span>Antal fel:</span> {numberOfWrongAnswers}</p>
      </main>
    </div>
  );
}