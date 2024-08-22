let queue = [];

exports.push = (item) => {
        queue.push(item);
};

exports.getAll = () => {
    return queue;
};

exports.clear = () => {
    queue = [];
};
