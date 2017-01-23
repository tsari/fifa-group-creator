const FifaindexParser = require('./models/FifaindexParser');
const Scraper = require('./models/Scraper');
const Drawer = require('./models/Drawer');

exports.getTeams = function (req, res) {
    let parser = new FifaindexParser();
    let scraper = new Scraper();
    let drawer = new Drawer();


    // Create a new promise that will resolve when all teams from all pages are parsed.
    const getTeams = () => {
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
    };

    // call the promise chain
    getTeams()
        .then(teams => {
            return drawer.draw(teams, req.body.competitors, req.body.groups);
        })
        .then(groups => {
            return res.json(groups);
        })
        .catch((error) => {
            console.log(error);
            return res.status(500).json(error.message);
        });
};

