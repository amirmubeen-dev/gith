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


import jsonfile from "jsonfile";
import moment from "moment";
import simpleGit from "simple-git";

const FILE_PATH = "./data.json";
const git = simpleGit();

// 7 rows (Sun-Sat), columns represent weeks
// 1 = commit, 0 = no commit

const pattern = [
  // A
  [0,1,1,1,0],
  [1,0,0,0,1],
  [1,1,1,1,1],
  [1,0,0,0,1],
  [1,0,0,0,1],

  // space
  [0,0],

  // .
  [0],
  [1],
  [0],

  // space
  [0,0],

  // D
  [1,1,1,0],
  [1,0,0,1],
  [1,0,0,1],
  [1,0,0,1],
  [1,1,1,0],

  // space
  [0,0],

  // E
  [1,1,1],
  [1,0,0],
  [1,1,1],
  [1,0,0],
  [1,1,1],

  // space
  [0,0],

  // V
  [1,0,0,0,1],
  [1,0,0,0,1],
  [0,1,0,1,0],
  [0,1,0,1,0],
  [0,0,1,0,0],
];

// Flatten into GitHub 7-row structure
const commits = [];

pattern.forEach(col => {
  col.forEach((value, rowIndex) => {
    if (value === 1) {
      commits.push(rowIndex);
    }
  });
});

const makeCommits = async () => {
  let totalCommits = 1500;
  let i = 0;

  for (let week = 0; week < pattern.length && totalCommits > 0; week++) {
    const col = pattern[week];

    for (let day = 0; day < col.length; day++) {
      if (col[day] === 1 && totalCommits > 0) {
        const date = moment()
          .subtract(week, "weeks")
          .day(day)
          .format();

        await jsonfile.writeFile(FILE_PATH, { date });

        await git.add([FILE_PATH]);
        await git.commit(`commit ${i}`, { "--date": date });

        console.log("Committed:", date);
        totalCommits--;
        i++;
      }
    }
  }

  await git.push();
  console.log("Done pushing 🚀");
};

makeCommits();
