import { readFile } from 'fs';
import path from 'path';
import { Arguments } from 'yargs-parser';
import { isInspecting } from '../utils';

type Data = number[]

async function readData(useSimpleInput: boolean): Promise<Data> {
  return new Promise((resolve, reject) => {
    readFile(path.resolve(__dirname, useSimpleInput ? 'simpleInput': 'input'), (err, data) => {
      if( err ) reject(err);
      else {
        resolve(
          data
            .toString()
            .split(/,/g)
            .filter(v => v)
            .map(v => parseInt(v, 10))
        );        
      }
    })
  })
}

//TODO: Probably just do math, actually
//TODO: Definitely do math, 256 is too much (we knew that)

function countFish(data: number[], days: number) {
  let fish = data.slice(0);
  for( let i=0; i<days; i++ ){
    let newFish = [];
    for( let f=0; f<fish.length; f++ ) {
      if( fish[f] === 0 ){
        fish[f] = 6;
        newFish.push(8);
      }
      else fish[f]--;
    }
    fish = fish.concat(newFish);
  }
  return fish.length;
}

async function runtime(argv: Arguments) {
  if( isInspecting() ) debugger;
  try {
    const data = await readData(!!argv.simple);
    console.log("Fish after 80 days", countFish(data, 80));
    // console.log("Fish after 256 days", countFish(data, 256));
  } catch (e) {
    console.error("Unable to read input data")
    throw e;
  }
}

export default {
  run: (argv: Arguments) => runtime(argv)
}
