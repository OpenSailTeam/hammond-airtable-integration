let queue = [];

exports.push = (item) => {
    const exists = queue.some(existingItem => existingItem.id === item.id);

    if (!exists) {
        queue.push(item);
    }
};

exports.getAll = () => {
    return queue;
};

exports.clear = () => {
    queue = [];
};
