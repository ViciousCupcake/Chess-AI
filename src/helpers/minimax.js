import Piece from "../pieces/piece";
import InvalidDepthException from "./invalidDepthException";

/**
 * Calculates the best move and plays it
 * @param {Piece[]} squares - Array representing the Pieces on the board
 * @param {Set<Number>} whiteAliveSoldiers - Set of the indices of all alive white soldiers
 * @param {Set<Number>} blackAliveSoldiers - Set of the indices of all alive black soldiers
 * @param {Piece[]} whiteFallenSoldiers - Set of the indices of all fallen white soldiers
 * @param {Piece[]} blackFallenSoldiers - Set of the indices of all fallen black soldiers
 * @param {Number} depth - Depth of recursive call to calculate best moves from
 * @param {Number} player - Which player to move (1 or 2)
 * @param {Object} self - A pointer to the object that called this function (i.e. this)
 * @throws Exception if depth < 1
 */
export default function minimaxRunner(squares, whiteAliveSoldiers, blackAliveSoldiers, whiteFallenSoldiers, blackFallenSoldiers, depth, player, self) {
    /*console.log(a);
    console.log(b);
    self.handleClick(8);
    self.handleClick(16);*/
    //helloWorld();

    //console.log(squares);
    //Figure out why it crashes after a piece has fallen- likely these sets aren't being updated properly

    if (depth < 1) {
        throw new InvalidDepthException();
    }
    // convert squares to a map for better access
    var map = squares.reduce((mapObj, obj, index) => {
        //console.log(map);
        if (obj != null) {
            mapObj.set(index, obj);
            /*console.log(index);
            console.log(obj);
            console.log(mapObj);*/

        }
        return mapObj;
    }, new Map());
    /*var map = new Map();
    console.log(map);
    var indexCounter = 1000;
    for(indexCounter = 0; indexCounter < squares.length; indexCounter++){
        if(squares[indexCounter] != null){
            map.set(indexCounter, squares[indexCounter]);
            console.log(indexCounter);
            console.log(squares[indexCounter]);
            console.log(map);
        }
    }*/
    //console.log(squares);
    //console.log(map);
    const isMaximizingPlayer = player === 1 ? true : false;
    var bestMove = isMaximizingPlayer ? -9999 : 9999;
    var bestMoveFound = 1000;
    var bestPieceToMove = 1000;
    var initialAliveSoldiers = undefined;
    if (isMaximizingPlayer) {
        initialAliveSoldiers = new Set(whiteAliveSoldiers);
        initialAliveSoldiers.forEach(src => {
            map.get(src).getPossibleMoves(src, squares).forEach(dest => {
                var lostPiece = undefined;
                var lostPieceObj = undefined;
                // If destination results in opposite side losing a piece
                if (blackAliveSoldiers.has(dest)) {
                    blackAliveSoldiers.delete(dest);
                    blackFallenSoldiers.push(map.get(dest));
                    lostPieceObj = map.get(dest);
                    map.delete(dest);
                    lostPiece = dest;
                }
                whiteAliveSoldiers.delete(src);
                whiteAliveSoldiers.add(dest);
                map.set(dest, map.get(src));
                map.delete(src);
                var score = minimax(map, whiteAliveSoldiers, blackAliveSoldiers, whiteFallenSoldiers, blackFallenSoldiers, depth - 1, 2, -10000, 10000, squares);
                // Undo the previous move (better to undo than make copies of arrays, undo is better big-O)
                map.set(src, map.get(dest));
                map.delete(dest);
                whiteAliveSoldiers.delete(dest);
                whiteAliveSoldiers.add(src);
                if (lostPiece !== undefined) {
                    blackAliveSoldiers.add(lostPiece);
                    blackFallenSoldiers.pop();
                    map.set(dest, lostPieceObj);
                }
                if (score > bestMove) {
                    bestMove = score;
                    bestMoveFound = dest;
                    bestPieceToMove = src;
                }
            });
        });
    }
    else { // black's turn
        initialAliveSoldiers = new Set(blackAliveSoldiers);
        initialAliveSoldiers.forEach(src => {
            map.get(src).getPossibleMoves(src, squares).forEach(dest => {
                var lostPiece = undefined;
                var lostPieceObj = undefined;
                //var copyOfMap = new Map(map);
                // If destination results in opposite side losing a piece
                if (whiteAliveSoldiers.has(dest)) {
                    whiteAliveSoldiers.delete(dest);
                    whiteFallenSoldiers.push(map.get(dest));
                    lostPieceObj = map.get(dest);
                    map.delete(dest);
                    lostPiece = dest;
                }
                blackAliveSoldiers.delete(src);
                blackAliveSoldiers.add(dest);
                map.set(dest, map.get(src));
                map.delete(src);
                var score = minimax(map, whiteAliveSoldiers, blackAliveSoldiers, whiteFallenSoldiers, blackFallenSoldiers, depth - 1, 1, -10000, 10000, squares);
                // Undo the previous move (better to undo than make copies of arrays, undo is better big-O)
                map.set(src, map.get(dest));
                map.delete(dest);
                blackAliveSoldiers.delete(dest);
                blackAliveSoldiers.add(src);
                if (lostPiece !== undefined) {
                    whiteAliveSoldiers.add(lostPiece);
                    whiteFallenSoldiers.pop();
                    map.set(dest, lostPieceObj);
                }
                //console.log(compareMaps(map, copyOfMap));
                if (score < bestMove) {
                    bestMove = score;
                    bestMoveFound = dest;
                    bestPieceToMove = src;
                }
            });
        });
    }
    console.log("Score: " + bestMove);
    console.log("Best Source: " + bestPieceToMove);
    console.log("Best Destination: " + bestMoveFound);
}

/**
 * Internal Function that does Minimax AB
 * @param {Map<Number, Piece>} map - Map representing locations of pieces on the board
 * @param {Set<Number>} whiteAliveSoldiers - Set of the indices of all alive white soldiers
 * @param {Set<Number>} blackAliveSoldiers - Set of the indices of all alive black soldiers
 * @param {Piece[]} whiteFallenSoldiers - Set of the indices of all fallen white soldiers
 * @param {Piece[]} blackFallenSoldiers - Set of the indices of all fallen black soldiers
 * @param {Number} depth - Depth of recursive call to calculate best moves from
 * @param {Number} player - Which player to move (1 or 2)
 * @param {Number} alpha - Alpha value
 * @param {Number} beta - Beta value
 * @param {Piece[]} squares - Array representing the Pieces on the board
 */
function minimax(map, whiteAliveSoldiers, blackAliveSoldiers, whiteFallenSoldiers, blackFallenSoldiers, depth, player, alpha, beta, squares) {
    return evaluateScore(map, whiteAliveSoldiers, blackAliveSoldiers);
}

// White is positive, black is negative
function evaluateScore(map, whiteAliveSoldiers, blackAliveSoldiers) {
    var sum = 0;
    //console.log(map);
    whiteAliveSoldiers.forEach(element => {
        sum += map.get(element).getValue();
    });
    blackAliveSoldiers.forEach(element => {
        sum -= map.get(element).getValue();
    });
    return sum;
}

function swapInMap(map, a, b) {
    //console.log(map instanceof Map);
    var itemAtA = map.get(a);
    var itemAtB = map.get(b);
    map.delete(a);
    map.delete(b);
    if (itemAtA !== undefined) {
        map.set(b, itemAtA);
    }
    if (itemAtB !== undefined) {
        map.set(a, itemAtB);
    }
}

function compareMaps(map1, map2) {
    var testVal;
    if (map1.size !== map2.size) {
        return false;
    }
    for (var [key, val] of map1) {
        testVal = map2.get(key);
        // in cases of an undefined value, make sure the key
        // actually exists on the object so there are no false positives
        if (testVal !== val || (testVal === undefined && !map2.has(key))) {
            return false;
        }
    }
    return true;
}