let getGeneration = (cells, generations) => {
  let cellsPlusRing = grow2DarrayByRing(cells);
  for (let cycle = 0; cycle < generations; cycle++) {
    // Run live or die on every cell
    for (let i = 0; i < cellsPlusRing.length; i++) {
      for (let j = 0; j < cellsPlusRing[i].length; j++) {
        cellsPlusRing[i][j] = liveOrDie(cellsPlusRing, [i,j]);
      }
    }
    // Check ring for living cells. If so, add ring.
  }
  return cells;
};

let grow2Darray = (cells, dimension, positiveOrNegative) => {
  // Instantiate variable for new array
  let newCells;

  // Check if the incoming array cells is an array and
  if (Array.isArray(cells) === true) {
    newCells = duplicate2Darray(cells);
  } else {
    return cells;
  }
  // If we have a two dimensional array and the commands are correct
  if (
    Array.isArray(newCells[0]) &&
    typeof dimension === 'string' &&
    typeof positiveOrNegative === 'string'
  ) {
    switch (dimension.toUpperCase()) {
      // Grow in x dimension
      case 'X':
        // Increase in positive or negative direction
        let newRow = new Array(newCells[0].length);
        // Cannot use array methods with undefined elements
        for (let i = 0; i < newRow.length; i++) {
          // Initialize all elements to 0
          newRow[i] = 0;
        }
        switch (positiveOrNegative.toUpperCase()) {
          case 'POSITIVE':
            newCells.push(newRow);
            break;
          case 'NEGATIVE':
            newCells.unshift(newRow);
            break;
        }
        break;
      // Grow in y dimension
      case 'Y':
        // Increase in positive or negative direction
        switch (positiveOrNegative.toUpperCase()) {
          case 'POSITIVE':
            // Add a 0 to the end of every row
            newCells = newCells.map(row => {
              row.push(0);
              return row;
            });
            break;
          case 'NEGATIVE':
            // Add a 0 to the end of every row
            newCells = newCells.map(row => {
              row.unshift(0);
              return row;
            });
            break;
        }
        break;
    }
  }
  return newCells;
};

// This solves issues with array addressing
// Creates a new array in memory that is a copy of the 2D array passed as argument
let duplicate2Darray = twoDArray => {
  if (Array.isArray(twoDArray) && Array.isArray(twoDArray[0])) {
    let duplicate = new Array(twoDArray.length);
    for (let i = 0; i < twoDArray.length; i++) {
      duplicate[i] = new Array(twoDArray[i].length);
      for (let j = 0; j < twoDArray[i].length; j++) {
        duplicate[i][j] = twoDArray[i][j];
      }
    }
    return duplicate;
  } else {
    return [[]];
  }
};

// Helper function that grows a given 2x2 square array by 1 in all directions (adds a ring)
let grow2DarrayByRing = cells =>
  grow2Darray(
    grow2Darray(
      grow2Darray(grow2Darray(cells, 'y', 'negative'), 'x', 'negative'),
      'y',
      'positive'
    ),
    'x',
    'positive'
  );

/*
 *  Boolean function that, given a 2D array of binary digits and a set of x,y coordinates as
 *  a two dimensional array (i.e. [2, 4]), returns a boolean
 */

let liveOrDie = (cells, coords) => {
  let cellValue = cells[coords[0]][coords[1]];
  let liveCount = 0;
  for (let i = coords[0] - 1; i <= coords[0] + 1; i++) {
    // Make sure the row exists and isn't out of bounds
    if (i >= 0 && i < cells.length) {
      for (let j = coords[1] - 1; j <= coords[1] + 1; j++) {
        // Make sure the column exists and isn't out of bounds
        if (j >= 0 && j < cells[0].length) {
          // Check that we're not in the center (shouldn't be counted)
          if (!(coords[0] === i && coords[1] === j)) {
            if (cells[i][j] === 1) {
              liveCount++;
            }
          }
        }
      }
    }
  }
  // Conway's logic
  // If live cell...
  if (cellValue === 1) {
    if (liveCount < 2) {
      return false;
    } else if (liveCount > 3) {
      return false;
    }
  }
  // If dead cell...
  else if (cellValue === 0) {
    // if there are exactly 3 live neighbors
    if (liveCount === 3) {
      return true;
    }
  }
  return cellValue === 1;
};

let arr = [[1,1,1],[1,1,1],[1,1,1]];
let arrPlusRing = grow2DarrayByRing(arr);

