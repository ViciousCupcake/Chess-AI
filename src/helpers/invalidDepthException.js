/**
 * The exception that gets thrown if an invalid depth was specified in the minimax function
 */
export default function InvalidDepthException() {
    this.message = "Invalid Depth was Provided! Depth must be >= 1";
    // Use V8's native method if available, otherwise fallback
    if ("captureStackTrace" in Error)
        Error.captureStackTrace(this, InvalidDepthException);
    else
        this.stack = (new Error()).stack;
}

InvalidDepthException.prototype = Object.create(Error.prototype);
InvalidDepthException.prototype.name = "InvalidDepthException";
InvalidDepthException.prototype.constructor = InvalidDepthException;