import Piece from "../pieces/piece";
import InvalidDepthException from "./invalidDepthException";
import { toChessLocation } from "./index"
var computationsPerformed = 0;

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
            for (dest of map.get(src).getPossibleMoves(src, map)) {
                computationsPerformed++;
                lostPiece = undefined;
                lostPieceObj = undefined;

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
            for (dest of map.get(src).getPossibleMoves(src, map)) {
                computationsPerformed++;
                lostPiece = undefined;
                lostPieceObj = undefined;
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
                if (score < bestMove) {
                    bestMove = score;
                    bestDest = dest;
                    bestSrc = src;
                }

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
    console.log("Repetitions: " + computationsPerformed);

    self.setState(oldState => ({
        score: bestMove,
        bestSrc: toChessLocation(bestSrc),
        bestDest: toChessLocation(bestDest),
        computations: computationsPerformed
    }));
    self.handleClick(bestSrc);
    self.handleClick(bestDest);
    computationsPerformed = 0;
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
            for (dest of map.get(src).getPossibleMoves(src, map)) {
                computationsPerformed++;
                lostPiece = undefined;
                lostPieceObj = undefined;
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
            for (dest of map.get(src).getPossibleMoves(src, map)) {
                computationsPerformed++;
                lostPiece = undefined;
                lostPieceObj = undefined;
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
                if (score < bestMove) {
                    bestMove = score;
                }

                beta = Math.min(beta, bestMove);
                if (beta <= alpha) {
                    break outerMinimizingLoop;
                }
            }
        }
    }
    return bestMove;
}

/**
 * Calculate the current score of the board, with white being positive and black being negative
 * @param {ap<Number, Piece>} map - The Map representing the pieces on the board
 * @param {Set<Number>} whiteAliveSoldiers - The indices of the alive white pieces on the board
 * @param {Set<Number>} blackAliveSoldiers - The indices of the alive black pieces on the board
 */
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

/**
 * Swaps two keys in a map, even if the mapping is undefined
 * @param {Map<Number, Piece>} map - The Map of which the keys should be swapped
 * @param {*} a - The first key of the value to be swapped
 * @param {*} b - The second key of the value to be swapped
 */
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

