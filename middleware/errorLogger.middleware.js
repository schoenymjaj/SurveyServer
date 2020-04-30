module.exports = function logError(error, req, res, next) {
    console.log("ERR: ");
    console.log(error)
};
