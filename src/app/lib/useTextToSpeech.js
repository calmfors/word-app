import { useCallback } from "react";

export function useTextToSpeech() {
  const speak = useCallback((text, lang = "en-US") => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      const utterance = new window.SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  return speak;
}