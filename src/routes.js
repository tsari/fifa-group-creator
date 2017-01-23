const Controller = require('./controller');

module.exports = function (app) {
    app.post('/scrape', Controller.getTeams);
};