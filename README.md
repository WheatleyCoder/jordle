# Jordle

The J-Word Wordle. A daily 5-letter word game where every answer starts with **J**.

Play now at [tycooncoder.github.io/jordle](https://tycooncoder.github.io/jordle/)

## How to Play

- Guess the JORDLE in 6 tries
- Every answer is a 5-letter word that starts with **J**
- After each guess, tiles light up to show how close you are:
  - Green = correct letter, correct spot
  - Yellow = correct letter, wrong spot
  - Gray = letter not in the word
- A new word is available every day at midnight

## Features

- Daily rotating J-word (via GitHub Actions)
- Streak tracking (stored in localStorage)
- Share your results with the emoji grid
- Dark theme with golden J accent
- Mobile responsive
- Keyboard + on-screen keyboard support

## Tech

Pure HTML/CSS/JS, no frameworks, no build step. Deployed on GitHub Pages.

A GitHub Action runs daily at midnight UTC to rotate the daily word.
