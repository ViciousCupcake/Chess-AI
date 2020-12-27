const diagonalDictionaryTLBR = require('../dictionaries/diagonalTopLeftBottomRight.json');
const diagonalDictionaryTRBL = require('../dictionaries/diagonalTopRightBottomLeft.json');
const rowDictionary = require('../dictionaries/row.json');
const columnDictionary = require('../dictionaries/column.json');

/**
 * Calculates if two indices are on the same row
 * @param {Number} src - An index from 0..63
 * @param {*} dest - An index from 0..63
 * @returns {boolean} Returns true if the two indices are on the same row
 */
export const isSameRow = (src, dest) => { // TODO: Make more efficient using math
  return !!(rowDictionary[src] && rowDictionary[src][dest]);
}

/**
 * Calculates if two indices are on the same column
 * @param {Number} src - An index from 0..63
 * @param {*} dest - An index from 0..63
 * @returns {boolean} Returns true if the two indices are on the same column
 */
export const isSameColumn = (src, dest) => {
  return !!(columnDictionary[src] && columnDictionary[src][dest]);
}

/**
 * Calculates if two indices are on the same diagonal
 * @param {Number} src - An index from 0..63
 * @param {*} dest - An index from 0..63
 * @returns {boolean} Returns true if the two indices are on the same diagonal
 */
export const isSameDiagonal = (src, dest) => {
  return !!((diagonalDictionaryTLBR[src] && diagonalDictionaryTLBR[src][dest]) ||
    (diagonalDictionaryTRBL[src] && diagonalDictionaryTRBL[src][dest]))
}

/**
 * Calculates if a given path has no pieces on it
 * @param {Number[]} srcToDestPath - The path to be checked
 * @param {Piece[]|Map<Number, Piece>} squares - The array/map that represents the locations of all pieces on the board
 * @returns {boolean} returns true if there are no pieces on the given path, and vice versa.
 */
export const isPathClean = (srcToDestPath, squares) => {
  var out = undefined;
  if (squares instanceof Map) {
    out = srcToDestPath.reduce((acc, curr) => { return !squares.get(curr) && acc; }, true);
  }
  else {
    out = srcToDestPath.reduce((acc, curr) => { return !squares[curr] && acc; }, true);
  }
  return out;
}

/**
 * Calculates if a index is calid
 * @param {Number} index - The index
 * @returns {boolean} If the index is valid or not
 */
export const isValidIndex = (index) => {
  return index >= 0 && index <= 63;
}

/**
 * Compares two maps for equality
 * @param {Map} map1 - One map to be compared
 * @param {Map} map2 - The second map to be compared
 * @returns {boolean} returns true if both maps are equal
 */
export const compareMaps = (map1, map2) => {
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

/**
 * Tests if the map contains all keys from two sets.
 * @param {Map} map1 - The map to test
 * @param {Set} set1 - One set to test
 * @param {Set} set2 - The other set to test
 * @returns {boolean} returns true if the map has only keys that are found within set1 and set2
 */
export const compareMapsAndSets = (map1, set1, set2) => {
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

/**
 * Converts an index to a chess location
 * @param {Number} index - The index to convert 0..63
 * @returns {string} The corresponding location on the board
 */
export const toChessLocation = (index) => {
  var row = 8 - Math.floor(index / 8);
  var col = index % 8;
  return String.fromCharCode(65 + col) + row;
}