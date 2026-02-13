import jsonfile from 'jsonfile';
import moment from 'moment';
import simpleGit from 'simple-git';
import random from 'random';

const path = './data.json';

const makeCommit = (n) => {
  if (n === 0) return simpleGit().push(); // Push at the end

  // Random date in past 365 days
  const date = moment()
    .subtract(random.int(0, 365), 'days') // past year
    .format();

  const data = { date };
  console.log(date);

  // Write to JSON & commit
  jsonfile.writeFile(path, data, () => {
    simpleGit()
      .add([path])
      .commit(date, { '--date': date }, () => makeCommit(n - 1));
  });
};

// Number of commits you want
makeCommit(100);
