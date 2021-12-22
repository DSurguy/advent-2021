import { readFile } from 'fs';
import path from 'path';

type Data = {
  pulls: number[];
  boards: number[][][];
}

async function readData(): Promise<Data> {
  return new Promise((resolve, reject) => {
    readFile(path.resolve(__dirname, 'input'), (err, data) => {
      if( err ) reject(err);
      else {
        let result = data.toString().split(/\n\s*\n/g).filter(v => v) as string[];
        let [pullString, ...boardStrings] = result;
        let pulls = pullString.split(',').map(v => parseInt(v, 10));
        let boards = boardStrings.map(boardString => {
          return boardString.split(/\n/g).map(boardLine => {
            return boardLine.split(/[ ]+/g).map(v => parseInt(v, 10))
          })
        })
        resolve({
          pulls,
          boards
        })
      }
    })
  })
}

async function runtime() {
  try {
    const data = await readData();
    console.log("Initial Data Read")
    console.log("First 5 pulls", data.pulls.slice(0,5));
    console.log("First board", data.boards[0]);
  } catch (e) {
    console.error("Unable to read input data")
    throw e;
  }
}

runtime();