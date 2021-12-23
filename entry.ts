const path = require('path');
const argv = require('yargs-parser')(process.argv.slice(2));

if( argv.day === undefined && argv._[0] === undefined ){
  console.error("Argument `day` is required, such as `--day=5`, or just 5");
  process.exit(1);
}

if( argv._[0] && !argv.day ) argv.day = argv._[0];

if( typeof argv.day !== 'number' ){
  console.error("Day argument must be a valid day number, such as 5");
  process.exit(1);
}

const day = require(path.resolve(__dirname, `day-${argv.day}`)).default;

day.run(argv);