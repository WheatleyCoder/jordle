// Word list: all 5-letter words starting with J
// These are the valid guesses AND the answer pool
const J_WORDS = [
  "JABOT", "JACKO", "JACKS", "JACKY", "JADED", "JADES", "JAGGS", "JAGGY",
  "JAILS", "JALAP", "JAMBE", "JAMBO", "JAMBS", "JAMMY", "JAPAN", "JAVAN",
  "JAWAN", "JAWED", "JAZZY", "JEANS", "JEBEL", "JEDED", "JEDEL", "JEELS",
  "JEELY", "JEEPS", "JEERS", "JEFES", "JEHAD", "JELLO", "JELLS", "JELLY",
  "JERID", "JERKS", "JERKY", "JERRS", "JERTH", "JESTS", "JETAN", "JETED",
  "JETES", "JETON", "JETTY", "JEUHS", "JEVAL", "JEWEL", "JEWIE", "JEZES",
  "JIBBA", "JIBBS", "JIBED", "JIBER", "JIBES", "JIFFS", "JIFFY", "JIGOT",
  "JIGSA", "JILTS", "JIMMY", "JINNI", "JINNS", "JIPES", "JIRGA", "JIRRE",
  "JIVED", "JIVES", "JIVEY", "JIVOS", "JOBED", "JOBES", "JOCKS", "JOCKY",
  "JOCOS", "JOEYS", "JOGGS", "JOINS", "JOINT", "JOIST", "JOKED", "JOKER",
  "JOKES", "JOKEY", "JOLLY", "JOLTS", "JOLTY", "JOLYN", "JORUM", "JOUST",
  "JOWLS", "JOWLY", "JOYED", "JOYFS", "JUBAS", "JUDGE", "JUDOS", "JUGAL",
  "JUICE", "JUICY", "JULYS", "JUMAR", "JUMBO", "JUMPS", "JUMPY", "JUNCO",
  "JUNKS", "JUNKY", "JUNTA", "JUPES", "JURAT", "JUROR", "JUTES", "JUTTY",
  "JUVES", "JUVIE"
];

// Filter to only valid 5-letter words (safety)
const VALID_WORDS = J_WORDS.filter(w => w.length === 5);

// Answer pool - curated common/recognizable J-words (proper nouns removed)
const ANSWER_POOL = [
"JABOT", "JACKO", "JACKS", "JACKY", "JADED", "JADES", "JAGGY",
"JAILS", "JALAP", "JAMBE", "JAMBO", "JAMBS", "JAMMY", "JAPAN", "JAVAN",
"JAWAN", "JAWED", "JAZZY", "JEANS", "JEBEL", "JEDED", "JEDEL", "JEELS",
"JEELY", "JEEPS", "JEERS", "JEFES", "JEHAD", "JELLO", "JELLS", "JELLY",
"JERKS", "JERKY", "JESTS", "JETAN", "JETED", "JETES", "JETON", "JETTY",
"JEWEL", "JIBBA", "JIBBS", "JIBED", "JIBER", "JIBES", "JIFFS", "JIFFY",
"JIGSA", "JIMMY", "JINNI", "JINNS", "JIPES", "JIRGA", "JIRRE", "JIVED",
"JIVES", "JIVEY", "JIVOS", "JOCKS", "JOCKY", "JOCOS", "JOEYS", "JOGGS",
"JOINS", "JOINT", "JOIST", "JOKED", "JOKER", "JOKES", "JOKEY", "JOLLY",
"JOLTS", "JOLTY", "JOLYN", "JORUM", "JOUST", "JOWLS", "JOWLY", "JOYED",
"JUBAS", "JUDGE", "JUDOS", "JUGAL", "JUICE", "JUICY", "JULYS", "JUMAR",
"JUMBO", "JUMPS", "JUMPY", "JUNCO", "JUNKS", "JUNKY", "JUNTA", "JUPES",
"JURAT", "JUROR", "JUTES", "JUVIE"
];

// Remove duplicates from answer pool
const UNIQUE_ANSWERS = [...new Set(ANSWER_POOL.filter(w => w.length === 5))];

// Seeded random based on date string
function getDailyWord(dateStr) {
  if (!dateStr) {
    const d = new Date();
    dateStr = d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate();
  }
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    const ch = dateStr.charCodeAt(i);
    hash = ((hash << 5) - hash) + ch;
    hash |= 0;
  }
  const idx = Math.abs(hash) % UNIQUE_ANSWERS.length;
  return UNIQUE_ANSWERS[idx];
}

// Valid guesses: any 5-letter word starting with J
// We use the full VALID_WORDS list plus additional common English 5-letter J-words
const GUESS_POOL = [...new Set([
  ...VALID_WORDS,
  "JUCOS", "JUGGS", "JUMAL"
])].filter(w => w.length === 5).sort();
