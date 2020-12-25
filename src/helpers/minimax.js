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
    //helloWorld();
    //debugger;
    //todo: run code, pawn 54 to 38, 14 to 30
    // notice that in error, pawn 48 to 40 disappeared in map but not copyofmap- white side error- error in minimax not minimaxrunner
    // maybe try instead of making changes and undoing, make a copy and edit the copy
    console.log("brrr");
    //console.log(squares);

    if (depth < 1) {
        throw new InvalidDepthException();
    }
    // convert squares to a map for better access
    var map = squares.reduce((mapObj, obj, index) => {
        if (obj != null) {
            mapObj.set(index, obj);
        }
        return mapObj;
    }, new Map());

    const isMaximizingPlayer = player === 1 ? true : false;
    var bestMove = isMaximizingPlayer ? -9999 : 9999;
    var bestDest = 1000;
    var bestSrc = 1000;
    var alpha = -10000;
    var beta = 10000;
    var initialAliveSoldiers = undefined;
    var src = undefined;
    var dest = undefined;
    var lostPiece = undefined;
    var lostPieceObj = undefined;
    var score = undefined;
    if (isMaximizingPlayer) {
        initialAliveSoldiers = new Set(whiteAliveSoldiers);
        outerMaximizingLoop:
        for (src of initialAliveSoldiers) {
            for (dest of map.get(src).getPossibleMoves(src, squares)) {
                lostPiece = undefined;
                lostPieceObj = undefined;


                var copyMap = new Map(map);
                compareMapsAndSets(map, whiteAliveSoldiers, blackAliveSoldiers);


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
                score = minimax(map, whiteAliveSoldiers, blackAliveSoldiers, whiteFallenSoldiers, blackFallenSoldiers, depth - 1, 2, alpha, beta, squares);
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
                    bestDest = dest;
                    bestSrc = src;
                }

                compareMaps(copyMap, map);
                compareMapsAndSets(map, whiteAliveSoldiers, blackAliveSoldiers);


                alpha = Math.max(alpha, bestMove);
                if (alpha >= beta) {
                    break outerMaximizingLoop;
                }
            }
        }
    }
    else { // black's turn
        initialAliveSoldiers = new Set(blackAliveSoldiers);
        outerMinimizingLoop:
        for (src of initialAliveSoldiers) {
            for (dest of map.get(src).getPossibleMoves(src, squares)) {
                lostPiece = undefined;
                lostPieceObj = undefined;
                //var copyOfMap = new Map(map);


                var copyMap = new Map(map);
                compareMapsAndSets(map, whiteAliveSoldiers, blackAliveSoldiers);


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
                score = minimax(map, whiteAliveSoldiers, blackAliveSoldiers, whiteFallenSoldiers, blackFallenSoldiers, depth - 1, 1, alpha, beta, squares);
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
                    bestDest = dest;
                    bestSrc = src;
                }


                compareMaps(copyMap, map);
                compareMapsAndSets(map, whiteAliveSoldiers, blackAliveSoldiers);


                beta = Math.min(beta, bestMove);
                if (beta <= alpha) {
                    break outerMinimizingLoop;
                }
            }
        }
    }
    console.log("Score: " + bestMove);
    console.log("Best Source: " + bestSrc);
    console.log("Best Destination: " + bestDest);
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
    console.log("brrrr");
    if (depth < 1) {
        return evaluateScore(map, whiteAliveSoldiers, blackAliveSoldiers);
    }

    const isMaximizingPlayer = player === 1 ? true : false;
    var bestMove = isMaximizingPlayer ? -9999 : 9999;
    var initialAliveSoldiers = undefined;
    var src = undefined;
    var dest = undefined;
    var lostPiece = undefined;
    var lostPieceObj = undefined;
    var score = undefined;
    if (isMaximizingPlayer) {
        initialAliveSoldiers = new Set(whiteAliveSoldiers);
        outerMaximizingLoop:
        for (src of initialAliveSoldiers) {
            for (dest of map.get(src).getPossibleMoves(src, squares)) {
                lostPiece = undefined;
                lostPieceObj = undefined;
                // something wrong probably here?
                // map isnt updating correctly


                var copyMap = new Map(map);
                compareMapsAndSets(map, whiteAliveSoldiers, blackAliveSoldiers);


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
                score = minimax(map, whiteAliveSoldiers, blackAliveSoldiers, whiteFallenSoldiers, blackFallenSoldiers, depth - 1, 2, alpha, beta, squares);
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
                }


                compareMaps(copyMap, map); // might be beneficial to switch the order to check sets first then maps
                compareMapsAndSets(map, whiteAliveSoldiers, blackAliveSoldiers);


                alpha = Math.max(alpha, bestMove);
                if (alpha >= beta) {
                    break outerMaximizingLoop;
                }
            }
        }
    }
    else { // black's turn
        initialAliveSoldiers = new Set(blackAliveSoldiers);
        outerMinimizingLoop:
        for (src of initialAliveSoldiers) {
            for (dest of map.get(src).getPossibleMoves(src, squares)) {
                lostPiece = undefined;
                lostPieceObj = undefined;



                var copyMap = new Map(map);
                compareMapsAndSets(map, whiteAliveSoldiers, blackAliveSoldiers);


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
                score = minimax(map, whiteAliveSoldiers, blackAliveSoldiers, whiteFallenSoldiers, blackFallenSoldiers, depth - 1, 1, alpha, beta, squares);
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
                }


                compareMaps(copyMap, map);
                compareMapsAndSets(map, whiteAliveSoldiers, blackAliveSoldiers);


                beta = Math.min(beta, bestMove);
                if (beta <= alpha) {
                    break outerMinimizingLoop;
                }
            }
        }
    }
    return bestMove;
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
function compareMapsAndSets(map1, set1, set2) {
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