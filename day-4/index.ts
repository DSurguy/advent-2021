import { readFile } from 'fs';
import path from 'path';

type Data = {
  pulls: number[];
  boards: number[][];
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
          return boardString
            .split(/[ \n]+/g)
            .filter(v => v)
            .map(v => parseInt(v, 10))
        })
        resolve({
          pulls,
          boards
        })
      }
    })
  })
}

const BingoType: Record<string, number> = {
  none: -1,
  h1: 0,
  h2: 1,
  h3: 2,
  h4: 3,
  h5: 4,
  v1: 5,
  v2: 6,
  v3: 7,
  v4: 8,
  v5: 9,
  d1: 10,
  d2: 11,
  full: 12,
}

type Board = {
  places: number[];
  pulls: boolean[];
}

function getBingo(board: Board) {
  for( let i=0; i<5; i++ ) {
    let rowStart = i*5;
    if( [
      board.pulls[rowStart],
      board.pulls[rowStart+1],
      board.pulls[rowStart+2],
      board.pulls[rowStart+3],
      board.pulls[rowStart+4]
    ].every(v => v)) {
      return BingoType[`h${i+1}`];
    }
    if( [
      board.pulls[i],
      board.pulls[i+5],
      board.pulls[i+10],
      board.pulls[i+15],
      board.pulls[i+20]
    ].every(v=>v)) {
      return BingoType[`h${i+1}`];
    }
  }
  if( [
    board.pulls[0],
    board.pulls[6],
    board.pulls[12],
    board.pulls[18],
    board.pulls[24]
  ].every(v=>v) ) return BingoType.d1;
  if( [
    board.pulls[4],
    board.pulls[8],
    board.pulls[12],
    board.pulls[16],
    board.pulls[20]
  ].every(v=>v) ) return BingoType.d2;
  return BingoType.none;
}

function getUnpulledBoardValue(board: Board) {
  return board
    .places
    .filter((value, index) => !board.pulls[index])
    .reduce((sum, value) => sum + value, 0)
}

function firstBingoBoardValue(data: Data) {
  const boards: Board[] = data.boards.map(b => {
    return {
      places: b.slice(0),
      pulls: new Array(25).fill(false)
    }
  })
  for( let pull of data.pulls ) {
    for( let board of boards ) {
      let placePulled = board.places.indexOf(pull);
      if( placePulled !== -1 ) {
        board.pulls[placePulled] = true;
        let bingoType = getBingo(board);
        if( bingoType !== BingoType.none ) return getUnpulledBoardValue(board) * pull;
      }
    }
  }
}

async function runtime() {
  try {
    const data = await readData();
    console.log("First Bingo Board Value", firstBingoBoardValue(data));
  } catch (e) {
    console.error("Unable to read input data")
    throw e;
  }
}

runtime();