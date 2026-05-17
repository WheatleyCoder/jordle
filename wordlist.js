// Word list: all 5-letter words starting with J
// These are the valid guesses AND the answer pool
const J_WORDS = [
 "JABOT","JACAL","JACET","JACKS","JACKY","JADED","JADES","JAFIS","JAGAS","JAGGS",
 "JAGGY","JAGIR","JAGRA","JAIIS","JAILS","JAKES","JALAP","JALOP","JAMBE","JAMBO",
 "JAMBS","JAMBK","JAMES","JAMMY","JAMPS","JANES","JANNS","JANTY","JAPAN","JAPED",
 "JAPER","JAPES","JARKS","JARLS","JARMA","JARPS","JARTA","JASPE","JASPS","JATKI",
 "JATOS","JATTS","JAUKS","JAVEL","JAVAS","JAWAN","JAWED","JAWER","JAWNS","JAXIE",
 "JAZZY","JEANS","JEBEL","JEDED","JEDEL","JEEES","JEELS","JEELY","JEERS","JEFES",
 "JEHAD","JEHUS","JELED","JELLO","JELLS","JELLY","JEMBE","JEMMY","JENNY","JEONS",
 "JERRS","JERTH","JESSE","JESTS","JETAN","JETED","JETER","JETES","JETON","JETTY",
 "JEUHS","JEWEL","JEWIE","JEZES","JIBBA","JIBBS","JIBED","JIBER","JIBES","JIFFS",
 "JIFFY","JIGOT","JIGSA","JILTS","JIMMY","JIMPY","JINNE","JINNI","JINNS","JIPES",
 "JIRGA","JIRRE","JIVEY","JIVOS","JIZZY","JOANN","JOBED","JOBES","JOCKO","JOCKS",
 "JOCKY","JOCOS","JOEYS","JOHNS","JOINS","JOINT","JOIST","JOKED","JOKER","JOKES",
 "JOKEY","JOLLY","JOLTS","JOLTY","JOMON","JONAH","JONAS","JONES","JONGS","JONTA",
 "JOOKS","JORDS","JOSES","JOSHY","JOSIA","JOSIE","JOTAS","JOTTY","JOUST","JOWED",
 "JOWLS","JOWLY","JOYED","JOYFS","JUBAS","JUBES","JUCOS","JUDAS","JUDGE","JUDGY",
 "JUDOS","JUGAL","JUGGS","JUGGY","JUGUM","JUICE","JUICY","JUMAR","JUMBO","JUMBY",
 "JUMPS","JUMPY","JUNCO","JUNKS","JUNKY","JUNTA","JUNTI","JUPES","JUPON","JURAT",
 "JUROR","JUSTE","JUSTO","JUTES","JUTTY","JUVES","JUVIE"
];

// Filter to only valid 5-letter words (safety)
const VALID_WORDS = J_WORDS.filter(w => w.length === 5);

// Answer pool - curated common/recognizable J-words
const ANSWER_POOL = [
 "JACKS","JACKY","JADED","JADES","JAILS","JAKES","JAMBE","JAMBO","JAMMY","JAPAN",
 "JAPED","JAPER","JAPES","JAWAN","JAWED","JAZZY","JEANS","JEERS","JELLY","JEMMY",
 "JENNY","JESTS","JETTY","JEWEL","JIBED","JIBER","JIBES","JIFFY","JIMMY","JINNI",
 "JINNS","JOCKS","JOEYS","JOHNS","JOINS","JOINT","JOIST","JOKED","JOKER","JOKES",
 "JOKEY","JOLLY","JOLTS","JORDS","JOUST","JOWLS","JOWLY","JOYED","JUDGE","JUDOS",
 "JUICE","JUICY","JUMBO","JUMPS","JUMPY","JUNCO","JUNKS","JUNKY","JUNTA","JUPES",
 "JURAT","JUROR","JUTES","JUVIE","JABOT","JAGGY","JALAP","JAMBS","JANES","JEBEL",
 "JEELS","JEFES","JEHAD","JELLO","JELLS","JETON","JIBBA","JIBBS","JIFFS","JIVED",
 "JIVES","JOCKO","JOGGS","JUBAS","JUGAL","JUMAR"
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
