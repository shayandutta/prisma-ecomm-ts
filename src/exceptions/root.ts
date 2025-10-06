//this is the root exception class
//in error message we want to send
//1. error message  2. status code  3. error codes(frontend determines the error messages to be displayed depending on the error codes), actual error
//default error class of JS do not provide these things upfront, so we will create one on top of the JS error class

export class HttpException extends Error{
    message: string;
    errorCode: any;
    statusCode: number;
    errors: ErrorCodes;

    constructor(message:string, errorCode:ErrorCodes, statusCode:number, errors:any){
        super(message) //super method calls the parent Error class ka constructor
        this.message = message
        this.errorCode = errorCode
        this.statusCode = statusCode
        this.errors = errors
    }
}

export enum ErrorCodes {
    USER_NOT_FOUND = 1001,
    USER_ALREADY_EXISTS = 1002,
    INCORRECT_PASSWORD = 1003,
    UNPROCESSIBLE_ENTITY = 2001,
    INTERNAL_EXCEPTION =3001,
    UNAUTHORIZED=4001,
    PRODUCT_NOT_FOUND=5001,
    ADDRESS_NOT_FOUND=5002
}

//flow 
// When you call: new HttpException("User not found", "USER_NOT_FOUND", 404, {})

// Step 1: super("User not found") executes
// This is equivalent to calling: new Error("User not found")
// The Error constructor creates an object with:
// - message: "User not found"
// - stack: [stack trace information]
// - name: "Error"

// Step 2: Then your custom properties are added
// this.message = "User not found"
// this.errorCode = "USER_NOT_FOUND"
// this.statusCode = 404
// this.errors = {}


//this -> keyword -> this refers to the current instance of the class.
// When you create an instance:
// const error1 = new HttpException("User not found", "USER_NOT_FOUND", 404, {});
// const error2 = new HttpException("Invalid email", "INVALID_EMAIL", 400, {});

// For error1:
// this.message = "User not found"
// this.errorCode = "USER_NOT_FOUND"
// this.statusCode = 404
// this.errors = {}

// For error2:
// this.message = "Invalid email"
// this.errorCode = "INVALID_EMAIL"
// this.statusCode = 400
// this.errors = {}