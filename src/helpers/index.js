const diagonalDictionaryTLBR = require('../dictionaries/diagonalTopLeftBottomRight.json');
const diagonalDictionaryTRBL = require('../dictionaries/diagonalTopRightBottomLeft.json');
const rowDictionary = require('../dictionaries/row.json');
const columnDictionary = require('../dictionaries/column.json');

const isSameRow = (src, dest) => { // TODO: Make more efficient using math
  return !!(rowDictionary[src] && rowDictionary[src][dest]);
}

const isSameColumn = (src, dest) => {
  return !!(columnDictionary[src] && columnDictionary[src][dest]);
}

const isSameDiagonal = (src, dest) => {
  return !!((diagonalDictionaryTLBR[src] && diagonalDictionaryTLBR[src][dest]) ||
    (diagonalDictionaryTRBL[src] && diagonalDictionaryTRBL[src][dest]))
}

const isPathClean = (srcToDestPath, squares) => srcToDestPath.reduce((acc, curr) => {return !squares[curr] && acc;}, true)

const isValidIndex = (index) => {
  return index >= 0 && index <= 63;
}

module.exports = {
  isSameRow,
  isSameColumn,
  isSameDiagonal,
  isPathClean,
  isValidIndex
}