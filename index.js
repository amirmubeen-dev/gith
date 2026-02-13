// import jsonfile from 'jsonfile';
// import moment from 'moment';
// import simpleGit from 'simple-git';
// import random from 'random';

// const path = './data.json';

// const makeCommit = (n) => {
//   if (n === 0) return simpleGit().push(); // Push at the end

//   // Random date in past 365 days
//   const date = moment()
//     .subtract(random.int(0, 365), 'days') // past year
//     .format();

//   const data = { date };
//   console.log(date);

//   // Write to JSON & commit
//   jsonfile.writeFile(path, data, () => {
//     simpleGit()
//       .add([path])
//       .commit(date, { '--date': date }, () => makeCommit(n - 1));
//   });
// };

// // Number of commits you want
// makeCommit(100);

import simpleGit from "simple-git";
import jsonfile from "jsonfile";
import moment from "moment";

const git = simpleGit();
const FILE_PATH = "./data.json";

// ===== SETTINGS =====
const TEXT = process.argv[2] || "A DEV";
const INTENSITY = 5;          // commits per green square (1–5 recommended)
const MAX_COMMITS =800;      // safety limit
const TOTAL_WEEKS = 82;       // GitHub shows 52 weeks
// =====================


// 5x7 Font
const FONT = {
  A: ["01110","10001","10001","11111","10001","10001","10001"],
  D: ["11110","10001","10001","10001","10001","10001","11110"],
  E: ["11111","10000","10000","11110","10000","10000","11111"],
  V: ["10001","10001","10001","10001","10001","01010","00100"],
  M: ["10001","11011","10101","10101","10001","10001","10001"],
  I: ["11111","00100","00100","00100","00100","00100","11111"],
  R: ["11110","10001","10001","11110","10100","10010","10001"],
  ".": ["00000","00000","00000","00000","00000","01100","01100"],
  " ": ["000","000","000","000","000","000","000"],
};


// Generate matrix from text
function generateMatrix(text) {
  const rows = 7;
  let matrix = Array.from({ length: rows }, () => []);

  text.toUpperCase().split("").forEach(char => {
    const letter = FONT[char];
    if (!letter) return;

    for (let r = 0; r < rows; r++) {
      matrix[r].push(...letter[r].split(""), "0");
    }
  });

  return matrix;
}


// Auto center text inside 52 weeks
function centerMatrix(matrix) {
  const currentWidth = matrix[0].length;
  const padding = Math.floor((TOTAL_WEEKS - currentWidth) / 2);

  matrix.forEach(row => {
    for (let i = 0; i < padding; i++) {
      row.unshift("0");
      row.push("0");
    }
  });

  return matrix;
}


async function makeCommits() {
  let matrix = generateMatrix(TEXT);
  matrix = centerMatrix(matrix);

  let commitCount = 0;

  for (let col = 0; col < matrix[0].length; col++) {
    for (let row = 0; row < 7; row++) {

      if (matrix[row][col] === "1") {

        for (let i = 0; i < INTENSITY; i++) {

          if (commitCount >= MAX_COMMITS) break;

          const date = moment()
            .subtract(TOTAL_WEEKS - col, "weeks")
            .day(row)
            .format();

          await jsonfile.writeFile(FILE_PATH, { date: date + "-" + i });

          await git.add([FILE_PATH]);
          await git.commit(`commit ${commitCount}`, {
            "--date": date,
          });

          commitCount++;
          console.log("Commit:", commitCount);
        }
      }
    }
  }

  await git.push();
  console.log(`🚀 Done! Total commits: ${commitCount}`);
}

makeCommits();
