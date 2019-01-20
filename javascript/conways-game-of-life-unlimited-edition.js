/*
 * Solver function. Given a 2D array of 0s and 1s (0 representing a dead cell and
 * a 1 representing a living cell), compute what the 2D array would look like after
 * a given number of generations according to the rules of Conway's Game of Life.
 */

let getGeneration = (cells, generations) => {
  // Create a duplicate of the given cells with a ring of dead cells around it
  let cellsPlusRing = growOrShrink2DarrayByRing(cells, true);
  let newCells = duplicate2Darray(cellsPlusRing);
  for (let cycle = 0; cycle < generations; cycle++) {
    // Copy newCells into cellsPlusRing. Doing this ensures that changes in values
    // as the liveOrDie function is ran don't effect the computed life/death status.
    // So, computed values are transferred into newCells, then newCells get
    // transferred back into cellsPlusRing to run computation again until generations
    // have run out.
    cellsPlusRing = duplicate2Darray(newCells);
    // Run live or die on every cell in cellsPlusRing. Copy that value into newCells
    cellsPlusRing.forEach((row, i) =>
      cellsPlusRing[i].forEach(
        cell => (newCells[i][j] = liveOrDie(cell, [i, j]))
      )
    );
    // Check outer ring for living cells. If so, add ring.
    newCells = growOrShrink2DarrayByRing(newCells, true);
  }

  // Trim the cells of any dead outer rows or columns
  newCells = trimCells(newCells);

  return newCells;
};

let growOrShrink2Darray = (
  cells,
  growOrShrink,
  dimension,
  positiveOrNegative
) => {
  // Instantiate variable for new array
  let newCells;

  // Check if the incoming array cells is an array, return cells if not
  if (Array.isArray(cells) === true) {
    newCells = duplicate2Darray(cells);
  } else {
    // Should throw error
    return cells;
  }
  // If we have a two dimensional array and the commands are strings
  if (
    Array.isArray(newCells[0]) &&
    typeof dimension === 'string' &&
    typeof positiveOrNegative === 'string'
  ) {
    switch (dimension.toUpperCase()) {
      // Grow or shrink in x dimension
      case 'X':
        let newRow = new Array(newCells[0].length);
        // Initialize all elements to 0
        newRow.forEach((val, i) => newRow[i] = 0);
        // Switch for positive/negative direction (right side, left side)
        switch (positiveOrNegative.toUpperCase()) {
          case 'POSITIVE':
            if (growOrShrink) {
              newCells.push(newRow);
            } else {
              newCells.pop();
            }
            break;
          case 'NEGATIVE':
            if (growOrShrink) {
              newCells.unshift(newRow);
            } else {
              newCells.shift();
            }
            break;
        }
        break;
      // Grow or shrink in y dimension
      case 'Y':
        switch (positiveOrNegative.toUpperCase()) {
          case 'POSITIVE':
            if (growOrShrink) {
              // Add a 0 to the end of every row
              newCells = newCells.map(row => {
                row.push(0);
                return row;
              });
            } else {
              // Remove final element from every row
              newCells = newCells.map(row => {
                row.pop();
                return row;
              });
            }
            break;
          case 'NEGATIVE':
            if (growOrShrink) {
              // Add a 0 to the beginning of every row
              newCells = newCells.map(row => {
                row.unshift(0);
                return row;
              });
            } else {
              // Remove first element from the beginning of every row
              newCells = newCells.map(row => {
                row.shift();
                return row;
              });
            }
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
let growOrShrink2DarrayByRing = (cells, growOrShrink) =>
  growOrShrink2Darray(
    growOrShrink2Darray(
      growOrShrink2Darray(
        growOrShrink2Darray(cells, growOrShrink, 'y', 'negative'),
        growOrShrink,
        'x',
        'negative'
      ),
      growOrShrink,
      'y',
      'positive'
    ),
    growOrShrink,
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
      return 0;
    } else if (liveCount > 3) {
      return 0;
    }
  }
  // If dead cell...
  else if (cellValue === 0) {
    // if there are exactly 3 live neighbors
    if (liveCount === 3) {
      return 1;
    }
  }
  return cellValue;
};

// Trim a set of cells for any rows or columns with no life
let trimCells = cells => {
  let trimmed = duplicate2Darray(cells);
  let totalLife = 0;
  // Start from top
  do {
    totalLife = trimmed[0].reduce((acc, val) => acc + val);
    if (totalLife <= 0) {
      trimmed = growOrShrink2Darray(trimmed, false, 'x', 'negative');
    }
  } while (totalLife <= 0);
  // Start from bottom
  totalLife = 0;
  do {
    totalLife = trimmed[trimmed.length - 1].reduce((acc, val) => acc + val);
    if (totalLife <= 0) {
      trimmed = growOrShrink2Darray(trimmed, false, 'x', 'positive');
    }
  } while (totalLife <= 0);
  // Start from left
  totalLife = 0;
  do {
    let column = trimmed.reduce((acc, row) => {
      acc.push(row[0]);
      return acc;
    }, []);
    totalLife = column.reduce((acc, val) => acc + val);
    if (totalLife <= 0) {
      trimmed = growOrShrink2Darray(trimmed, false, 'y', 'negative');
    }
  } while (totalLife <= 0);
  // Start from right
  totalLife = 0;
  do {
    let column = trimmed.reduce((acc, row) => {
      acc.push(row[row.length - 1]);
      return acc;
    }, []);
    totalLife = column.reduce((acc, val) => acc + val);
    if (totalLife <= 0) {
      trimmed = growOrShrink2Darray(trimmed, false, 'y', 'positive');
    }
  } while (totalLife <= 0);

  return trimmed;
};

let arr = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 1, 1, 1, 1, 0, 0],
  [0, 0, 1, 1, 1, 1, 0, 0],
  [0, 0, 1, 1, 1, 1, 0, 0],
  [0, 0, 1, 1, 1, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0]
];

arr = growOrShrink2DarrayByRing(arr, true);

console.log(arr);
console.log(trimCells(arr));
