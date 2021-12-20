import data from './input.json';

console.log("Single Increases", getSingleIncreases(data));
console.log("Window Increases", getSlidingWindowIncreaseas(data));

function getSingleIncreases(data: number[]) {
  let increases = 0;
  data.forEach((depth, index, dataArr) => {
    if( index === 0 ) return;
    if( depth > dataArr[index-1] ) increases++;
  });
  return increases;
}

function getSlidingWindowIncreaseas(data: number[]) {
  let increases = 0;
  let depthWindow: number[] = data.slice(0,3);

  data.forEach((depth, index) => {
    let lastWindow = depthWindow[0] + depthWindow[1] + depthWindow[2];
    let thisWindow = depthWindow[1] + depthWindow[2] + depth;
    if( thisWindow > lastWindow ) increases++;
    depthWindow.shift();
    depthWindow.push(depth);
  });
  return increases;
}