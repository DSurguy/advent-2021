import input from './input.json';
import { Arguments } from 'yargs-parser';
import { isInspecting } from '../utils';

type Direction = 'forward' | 'down' | 'up';

type Command = {
  magnitude: number;
  direction: Direction;
}

function processData(data: string[]): Command[] {
  return data.map(commandString => {
    let [direction, magnitude] = commandString.split(' ') as [Direction, string];
    return {
      magnitude: parseInt(magnitude),
      direction
    }
  })
}

function simplePositionByDepth(commands: Command[]): number {
  let position = 0;
  let depth = 0;
  for( let { magnitude, direction } of commands ) {
    if( direction === 'forward' ) position += magnitude;
    if( direction === 'down' ) depth += magnitude;
    if( direction === 'up' ) depth -= magnitude;
  }
  return position * depth;
}

function aimedPositionByDepth(commands: Command[]): number {
  let aim = 0;
  let position = 0;
  let depth = 0;

  for( let { magnitude, direction } of commands ) {
    if( direction === 'forward' ) {
      position += magnitude;
      depth += aim * magnitude;
    }
    if( direction === 'down' ) aim += magnitude;
    if( direction === 'up' ) aim -= magnitude;
  }
  return position * depth;

  return 0;
}

function runtime(argv: Arguments) {
  if( isInspecting() ) debugger;

  console.log("Simple Position x Depth", simplePositionByDepth(processData(input)));
  console.log("Aimed Position x Depth", aimedPositionByDepth(processData(input)));
}

export default {
  run: (argv: Arguments) => runtime(argv)
}
