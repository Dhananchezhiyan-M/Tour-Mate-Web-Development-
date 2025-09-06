class AppError extends Error {//class can be any name
    constructor(message, status) {
        super();
        this.message = message;
        this.status = status;
    }
}

module.exports = AppError;//class name