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

function getMedianPowerToAlign(data: number[]) {
  let positions = data.slice(0).sort((a,b) => a < b ? -1 : a > b ? 1 : 0);
  if( positions.length % 2 === 0 ){
    let floorMedian = positions[positions.length/2 - 1];
    let ceilMedian = positions[positions.length/2];
    let floorCost = positions.reduce((sum, p) => sum + Math.abs(p - floorMedian), 0);
    let ceilCost = positions.reduce((sum, p) => sum + Math.abs(p - ceilMedian), 0);
    return Math.min(floorCost, ceilCost);
  }
  else {
    let median = positions[Math.floor(positions.length/2)];
    return positions.reduce((sum, p) => sum + Math.abs(p - median));
  }
}

function getMeanPowerToAlign(data: number[]) {
  let mean = data.reduce((sum, p) => sum + p, 0)/data.length;
  let floor = Math.floor(mean);
  let ceil = Math.ceil(mean);
  let floorCost = data.reduce((sum, p) => {
    let diff = Math.abs(p - floor);
    return sum + diff * (1 + diff) / 2;
  }, 0);
  let ceilCost = data.reduce((sum, p) => {
    let diff = Math.abs(p - ceil);
    return sum + diff * (1 + diff) / 2;
  }, 0);
  return Math.min(floorCost, ceilCost);
}

async function runtime(argv: Arguments) {
  if( isInspecting() ) debugger;
  try {
    const data = await readData(!!argv.simple);
    console.log("Median power to align", getMedianPowerToAlign(data));
    console.log("Mean power to align", getMeanPowerToAlign(data));
  } catch (e) {
    console.error("Unable to read input data")
    throw e;
  }
}

export default {
  run: (argv: Arguments) => runtime(argv)
}
