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
/**
 * 
 * @param {Number[]} srcToDestPath 
 * @param {Map|Piece[]} squares 
 */
const isPathClean = (srcToDestPath, squares) => {
  var out = undefined;
  if (squares instanceof Map) {
    out = srcToDestPath.reduce((acc, curr) => { return !squares.get(curr) && acc; }, true);
  }
  else{
    out = srcToDestPath.reduce((acc, curr) => { return !squares[curr] && acc; }, true);
  }
  return out;
}

const isValidIndex = (index) => {
  return index >= 0 && index <= 63;
}

const compareMaps = (map1, map2) => {
  var testVal;
  if (map1.size !== map2.size) {
      console.log(map1);
      console.log(map2);
      console.log("maps not equal");

      return false;
  }
  for (var [key, val] of map1) {
      testVal = map2.get(key);
      // in cases of an undefined value, make sure the key
      // actually exists on the object so there are no false positives
      if (testVal !== val || (testVal === undefined && !map2.has(key))) {
          console.log(map1);
          console.log(map2);
          console.log("maps not equal");
          return false;
      }
  }
  return true;
}
const compareMapsAndSets = (map1, set1, set2) => {
  if (map1.size !== (set1.size + set2.size)) {
      console.log("Differing sizes");
      console.log(map1);
      console.log(set1);
      console.log(set2);
      return false;
  }
  for (var [key, val] of map1) {
      // in cases of an undefined value, make sure the key
      // actually exists on the object so there are no false positives
      if (!(set1.has(key) || set2.has(key))) {
          console.log("Key not found");
          console.log(map1);
          console.log(set1);
          console.log(set2);
          return false;
      }
  }
  return true;
}


module.exports = {
  isSameRow,
  isSameColumn,
  isSameDiagonal,
  isPathClean,
  isValidIndex,
  compareMaps,
  compareMapsAndSets
}