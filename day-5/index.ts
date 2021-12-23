import { readFile } from 'fs';
import path from 'path';
import { Arguments } from 'yargs-parser';
import { isInspecting } from '../utils';

type Data = {
  from: {
    x: number;
    y: number;
  },
  to: {
    x: number;
    y: number;
  }
}[]

async function readData(useSimpleInput: boolean): Promise<Data> {
  return new Promise((resolve, reject) => {
    readFile(path.resolve(__dirname, useSimpleInput ? 'simpleInput': 'input'), (err, data) => {
      if( err ) reject(err);
      else {
        let result = data.toString().split(/\n+/g).filter(v => v) as string[];
        resolve(result
          .map(line => {
            let [from, to] = line.split(' -> ');
            let [fromX, fromY] = from.split(',').map(v => parseInt(v, 10));
            let [toX, toY] = to.split(',').map(v => parseInt(v, 10));
            return {
              from: {
                x: fromX,
                y: fromY
              },
              to: {
                x: toX,
                y: toY
              }
            };
          })
        )
      }
    })
  })
}

enum VentType {
  horizontal,
  vertical,
  diagonal
}

function getOverlaps(vents: Data, skipDiagonal = false) {
  let visited = new Set<string>();
  let overlaps = new Set<string>();
  for( let vent of vents ){
    let coords = {
      x: vent.from.x,
      y: vent.from.y
    };
    let stringCoord = `${coords.x},${coords.y}`;
    if( visited.has(stringCoord) ) overlaps.add(stringCoord);
    visited.add(stringCoord);
    let ventType: VentType;
    if( vent.from.x !== vent.to.x ) {
      if( vent.from.y !== vent.to.y ) ventType = VentType.diagonal;
      else ventType = VentType.horizontal;
    }
    else if( vent.from.y !== vent.to.y ){
      if( vent.from.x !== vent.to.x ) ventType = VentType.diagonal;
      else ventType = VentType.vertical;
    }
    else continue; //single-tile vent

    if( skipDiagonal && ventType === VentType.diagonal ) continue;

    while(!(coords.x === vent.to.x && coords.y === vent.to.y)) {
      if( ventType === VentType.horizontal || ventType === VentType.diagonal ) {
        if( vent.from.x < vent.to.x ) coords.x++;
        else coords.x--;
      }
      if( ventType === VentType.vertical || ventType === VentType.diagonal ) {
        if( vent.from.y < vent.to.y ) coords.y++;
        else coords.y--;
      }

      stringCoord = `${coords.x},${coords.y}`;
      if( visited.has(stringCoord) ) overlaps.add(stringCoord)
      visited.add(stringCoord)
    }
  }
  return overlaps.size;
}

async function runtime(argv: Arguments) {
  if( isInspecting() ) debugger;
  try {
    const data = await readData(!!argv.simple);
    console.log("Number of non-diagonal overlap points", getOverlaps(data, true));
    console.log("Number of ALL overlap points", getOverlaps(data))
  } catch (e) {
    console.error("Unable to read input data")
    throw e;
  }
}

export default {
  run: (argv: Arguments) => runtime(argv)
}
