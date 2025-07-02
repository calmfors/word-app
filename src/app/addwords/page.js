"use client";

import React from "react";
import { useState, useRef } from "react";
import styles from "../page.module.css";
import { postData } from "../lib/appwrite";
import { useTextToSpeech } from "../useTextToSpeech";

export default function AddWords() {
  const [newWords, setNewWords] = useState([]);
  const [status, setStatus] = useState("idle");
  const inputRef = useRef(null);
  const lang = "sv-SE";
  const textToSpeech = useTextToSpeech();

  const submitWords = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const word = formData.get("word");
    const meaning = formData.get("meaning");
    if (word && meaning) {
      setNewWords(prev => [...prev, { english: word.trim().toLowerCase().replaceAll('.', ''), swedish: meaning.trim().toLowerCase().replaceAll('.', '') }]);
      event.target.reset();
      inputRef.current.focus();
    } else {
      setStatus("error");
      textToSpeech("Fyll i både engelskt och svenskt ord.", lang);
    }
  }

  const removeWord = (event) => {
    const index = event.target.dataset.index;
    if (index !== undefined) {
      setNewWords(prev => prev.filter((_, i) => i !== parseInt(index)));
    } else {
      console.error("Index not found.");
    }
  }

  const saveWords = () => {
    if (newWords.length === 0) {
      alert("Inga nya glosor att spara!");
      return;
    }
    const currentDate = new Date();
    const startOfYear = new Date(currentDate.getFullYear(), 0, 1);
    const week = Math.ceil((((currentDate - startOfYear) / 86400000) + startOfYear.getDay() + 1) / 7);
    newWords.forEach(word => {
      postData('word',{
        english: word.english,
        swedish: word.swedish,
        week  // Assuming week is not used here, set to "0"
      }).catch(error => {
        console.error("Error saving word:", error);
      });
    });
    setStatus("success");
    textToSpeech("Glosorna sparades!", lang);
    setNewWords([]);
    setTimeout(() => {
      setStatus("idle");
    }, 2000);
  }

  return (
    <div className={styles.page}>
      <button className={styles.backButton} onClick={() => window.history.back()}></button>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Lägg till nya engelska glosor
        </h1>
        <form onSubmit={submitWords}>
          <label>
            Engelskt ord:
            <input ref={inputRef} type="text" name="word" autoComplete="off" autoCapitalize="off" autoCorrect="off" />
          </label>
          <label>
            Svenskt ord:
            <input type="text" name="meaning" autoComplete="off" />
          </label>
          <button type="submit">Lägg till</button>
        </form>
        {newWords && newWords.length > 0 && (
          <div className={styles.newWords}>
          <ul className={styles.newWordsList}>
            {newWords.map((word, index) => (
              <li key={index}>
                <p>{word.english} - {word.swedish} <span className={styles.remove} data-index={index} onClick={removeWord}>&times;</span></p>
              </li>
            ))}
          </ul>
          <button className={styles.savebutton} onClick={saveWords}>
            Spara nya glosorna
          </button>
          </div>       
        )}
        {(status === 'success' || status === 'error') && (
          <p onClick={() => setStatus('idle')} className={status === 'error' ? styles.incorrect : styles.correct}>
            {status === 'success' ? "Glosorna sparades!" : "Fyll i både engelskt och svenskt ord."}
          </p>
        )}
      </main>
    </div>
  );
}