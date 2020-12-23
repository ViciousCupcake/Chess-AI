export default function minimaxRunner(a, b, self, squares, whiteAliveSoldiers, blackAliveSoldiers) {
    /*console.log(a);
    console.log(b);
    self.handleClick(8);
    self.handleClick(16);*/
    //helloWorld();
    console.log(evaluateScore(squares, whiteAliveSoldiers, blackAliveSoldiers));
}

// White is positive, black is negative
function evaluateScore(squares, whiteAliveSoldiers, blackAliveSoldiers) {
    var sum = 0;
    whiteAliveSoldiers.forEach(element => {
        sum+=squares[element].getValue();
    });
    blackAliveSoldiers.forEach(element => {
        sum-=squares[element].getValue();
    });
    return sum;
}