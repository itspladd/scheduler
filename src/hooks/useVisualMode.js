import React, { useState } from "react";

export default function useVisualMode(initialMode) {
  const [mode, setMode] = useState(initialMode);
  const [history, setHistory] = useState([initialMode]);

  function transition(newMode, replaceCurrentMode = false) {
    setMode(newMode);
    setHistory(prev => {
      const prevState = [...prev];
      replaceCurrentMode && prevState.pop(); // Pop off the current state if replacing
      return [...prevState, newMode]
    });
  }

  function back() {
    // We can only go back if there's a previous state to go back to,
    // so if the history is <= 1, then we do nothing.
    if (history.length > 1) {
      const newHistory = [...history];
      newHistory.pop();
      setMode(newHistory[newHistory.length - 1]);
      setHistory(newHistory);
    }
  }

  return { mode, transition, back };
}