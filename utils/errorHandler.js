exports.handleError = (res, error, message) => {
    console.error(message, error);
    res.status(500).send(message);
};
