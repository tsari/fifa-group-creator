const FifaindexParser = require('./models/FifaindexParser');
const Scraper = require('./models/Scraper');
const Drawer = require('./models/Drawer');

// Create a new promise that will resolve when all teams from all pages are parsed.
function getTeams(req, res) {
    let parser = new FifaindexParser();
    let scraper = new Scraper();

    return new Promise((resolve, reject) => {
        let teams = [];
        let page = 1;

        // function wrapper to enable recursion
        const recursiveGet = page => {
            scraper.getContent(parser.getUrl(req.body.stars, req.body.overallMin, req.body.overallMax, req.body.teamType, page))
                .then(html => {
                    teams = teams.concat(parser.parse(html));

                    if (parser.more(html)) {
                        recursiveGet(page + 1);
                    } else {
                        resolve(teams);
                    }
                })
                .catch(error => {
                    reject(error);
                });
        };

        recursiveGet(page);
    });
}

exports.getTeams = function (req, res) {
    let drawer = new Drawer();

    // call the promise chain
    getTeams(req, res)
        .then(teams => {
            let result = {};
            result['groups'] = drawer.draw(teams, req.body.competitors, req.body.groups);
            result['teamPoolSize'] = teams.length;

            return result;
        })
        .then(result => {
            return res.json(result);
        })
        .catch((error) => {
            console.log(error);
            return res.status(500).json(error.message);
        });
};

exports.reDraw = function (req, res) {

    let drawer = new Drawer();

    // call the promise chain
    getTeams(req, res)
        .then(teams => {
            // remove all teams, which are already drawn
            teams = teams.filter((element) => {
                return req.body.drawnTeams.indexOf(element.team) === -1;
            });

            return drawer.draw(teams, ['PseudoCompetitor'], 1);
        })
        .then(groups => {
            let newTeam = groups['A']['PseudoCompetitor'];

            return res.json(newTeam);
        })
        .catch((error) => {
            console.log(error);
            return res.status(500).json(error.message);
        });
};

