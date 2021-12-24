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

function countFish(data: number[], days: number) {
  let fish = data.reduce((counts, value) => {
    counts[value]++;
    return counts;
  }, [0,0,0,0,0,0,0,0,0]);

  for( let i=0; i<days; i++ ){
    let zeroes = fish.shift()!;
    fish[6] += zeroes;
    fish[8] = zeroes;
  }
  return fish.reduce((sum, value) => sum + value, 0);
}

async function runtime(argv: Arguments) {
  if( isInspecting() ) debugger;
  try {
    const data = await readData(!!argv.simple);
    console.log("Fish after 80 days", countFish(data, 80));
    console.log("Fish after 256 days", countFish(data, 256));
  } catch (e) {
    console.error("Unable to read input data")
    throw e;
  }
}

export default {
  run: (argv: Arguments) => runtime(argv)
}
