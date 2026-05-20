// Word list: all 5-letter words starting with J
// These are the valid guesses AND the answer pool
const J_WORDS = [
 "JAAPS", "JABBA", "JABED", "JABER", "JABIR", "JABOT", "JACAL", "JACET", "JACHS", "JACKO",
 "JACKS", "JACKY", "JACOB", "JACOT", "JADED", "JADES", "JAFIS", "JAGAS", "JAGGS", "JAGGY",
 "JAGIR", "JAGRA", "JAIIS", "JAILS", "JALAP", "JALOP", "JALUT", "JAMAL", "JAMBE", "JAMBK",
 "JAMBO", "JAMBS", "JAMES", "JAMMY", "JAMPS", "JANET", "JANGL", "JANGO", "JANIS", "JANKS",
 "JANNS", "JANOS", "JANTS", "JANTY", "JAPAN", "JARKS", "JARLS", "JARMA", "JAROD", "JARPS",
 "JARTA", "JASON", "JASPE", "JASPS", "JATKI", "JATOS", "JATTS", "JAUKS", "JAVAN", "JAVAS",
 "JAVED", "JAVEL", "JAWAN", "JAWED", "JAWER", "JAWNS", "JAXIE", "JAYNE", "JAZZY", "JEANS",
 "JEBEL", "JEDED", "JEDEL", "JEEES", "JEELS", "JEELY", "JEEPS", "JEERS", "JEFES", "JEFFS",
 "JEHAD", "JEHUS", "JELED", "JELLO", "JELLS", "JELLY", "JEMBE", "JENNY", "JEONS", "JERID",
 "JERKS", "JERRS", "JERTH", "JESSE", "JESTS", "JETAN", "JETED", "JETER", "JETES", "JETON",
 "JETTY", "JEUHS", "JEVAL", "JEWEL", "JEWIE", "JEZES", "JIBBA", "JIBBS", "JIBED", "JIBER",
 "JIBES", "JIFFS", "JIFFY", "JIGOT", "JIGSA", "JILTS", "JIMMY", "JIMPY", "JINNE", "JINNI",
 "JINNS", "JIPES", "JIRGA", "JIRRE", "JIVED", "JIVES", "JIVEY", "JIVOS", "JIZZY", "JOANA",
 "JOANN", "JOBED", "JOBES", "JOCKS", "JOCKY", "JOCOS", "JOEYS", "JOGGS", "JOHAN", "JOHNS",
 "JOINS", "JOINT", "JOIST", "JOKED", "JOKER", "JOKES", "JOKEY", "JOLIE", "JOLLY", "JOLTS",
 "JOLTY", "JOLYN", "JOMON", "JONAH", "JONAS", "JONES", "JONGS", "JONTA", "JOOKS", "JORDS",
 "JORUM", "JOSES", "JOSHY", "JOSIA", "JOSIE", "JOTAS", "JOTTY", "JOUST", "JOVAN", "JOWED",
 "JOWLS", "JOWLY", "JOYCE", "JOYED", "JOYFS", "JUANA", "JUBAL", "JUBAS", "JUBES", "JUCOS",
 "JUDAH", "JUDAS", "JUDGE", "JUDGY", "JUDOS", "JUGAL", "JUGGS", "JUGGY", "JUGUM", "JUICE",
 "JUICY", "JULIA", "JULIE", "JULIO", "JULYS", "JUMAL", "JUMAR", "JUMBO", "JUMBY", "JUMPS",
 "JUMPY", "JUNCO", "JUNIA", "JUNKS", "JUNKY", "JUNTA", "JUNTI", "JUPES", "JUPON", "JURAT",
 "JUROR", "JUSTE", "JUSTO", "JUTES", "JUTTY", "JUVES", "JUVIE"
];

// Filter to only valid 5-letter words (safety)
const VALID_WORDS = J_WORDS.filter(w => w.length === 5);

// Answer pool - curated common/recognizable J-words
const ANSWER_POOL = [
"JABOT", "JACKO", "JACKS", "JACKY", "JACOB", "JADED", "JADES", "JAGGY",
"JAILS", "JALAP", "JAMAL", "JAMBE", "JAMBO", "JAMBS", "JAMMY", "JANET",
"JANIS", "JAPAN", "JASON", "JAVAN", "JAVED", "JAWAN", "JAWED", "JAYNE",
"JAZZY", "JEANS", "JEBEL", "JEELS", "JEEPS", "JEERS", "JEFES", "JEHAD",
"JELLO", "JELLS", "JELLY", "JENNY", "JERKS", "JESTS", "JETON", "JETTY",
"JEWEL", "JIBBA", "JIBBS", "JIBED", "JIBER", "JIBES", "JIFFS", "JIFFY",
"JIMMY", "JINNI", "JINNS", "JIVED", "JIVES", "JOCKS", "JOEYS", "JOGGS",
"JOHAN", "JOHNS", "JOINS", "JOINT", "JOIST", "JOKED", "JOKER", "JOKES",
"JOKEY", "JOLIE", "JOLLY", "JOLTS", "JORDS", "JORUM", "JOUST", "JOWLS",
"JOWLY", "JOYCE", "JOYED", "JUANA", "JUBAL", "JUBAS", "JUDAH", "JUDAS",
"JUDGE", "JUDOS", "JUGAL", "JUICE", "JUICY", "JULIA", "JULIE", "JULIO",
"JUMAR", "JUMBO", "JUMPS", "JUMPY", "JUNCO", "JUNKS", "JUNKY", "JUNTA",
"JUPES", "JURAT", "JUROR", "JUTES", "JUVIE"
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
 "JAUPS","JEDIS","JERRY","JIGGS","JIGGY","JIHAD","JIMPS","JINKS","JIROS","JISMS",
 "JIVED","JIVER","JIVES","JIVIN","JIVVY","JOBEY","JOGGS","JORAM","JORGE","JOSEF",
 "JOTTA","JOUAL","JOUKS","JOULE","JUBAH","JUBBA","JUBBS","JUBEE","JUCHU","JUMEN",
 "JURIS","JUTED","JUXTA"
])].filter(w => w.length === 5).sort();
