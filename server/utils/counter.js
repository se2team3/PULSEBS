module.exports = (() => {
    let count = 1;
    return {get: () => count++};
});
