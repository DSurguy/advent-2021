import { readFile } from 'fs';
import path from 'path';

async function readData(): Promise<string[]> {
  return new Promise((resolve, reject) => {
    readFile(path.resolve(__dirname, 'input'), (err, data) => {
      if( err ) reject(err);
      else {
        resolve(
          data.toString().split(/[\n\r]/g).filter(v => v)
        )
      }
    })
  })
}

function getEpsilonByGamma(data: string[]): number {
  let positionTotals: [number, number][] = new Array(data[0].length).fill([0,0]);
  positionTotals = positionTotals.map(function () {
    return [0,0]
  });

  for( let line of data ) {
    line.split('').forEach((value, index) => {
      if( value === '0' ) positionTotals[index][0]++;
      else positionTotals[index][1]++;
    })
  }

  const [gamma, epsilon] = positionTotals.reduce(([gamma, epsilon], position) => {
    if( position[0] > position[1] ) {
      return [
        gamma + "0",
        epsilon + "1"
      ]
    }
    else {
      return [
        gamma + "1",
        epsilon + "0"
      ]
    }
  }, ["", ""])

  return parseInt(gamma, 2) * parseInt(epsilon, 2);
}

async function runtime() {
  try {
    const data = await readData();
    console.log("Gamma x Epsilon", getEpsilonByGamma(data));
  } catch (e) {
    console.error("Unable to read input data")
    throw e;
  }
}

runtime();