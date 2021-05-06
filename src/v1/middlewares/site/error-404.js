const path = require('path');

module.exports = async (req, res) => {
    res.status(404).sendFile(path.resolve(__dirname, '../../views/site/error-404.html'));
};