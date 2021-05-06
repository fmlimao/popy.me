const path = require('path');

module.exports = (err, req, res) => {
    res.status(500).sendFile(path.resolve(__dirname, '../../views/site/error-500.html'));
};
