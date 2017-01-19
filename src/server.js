var express = require('express');
var fs = require('fs');
var request = require('request');
var bodyParser = require('body-parser');
var TeamParser = require('./models/TeamParser');
var cache = require('memory-cache');
var hash = require('object-hash');
var app = express();

var teams;

function getUrl(stars, overallMin, overallMax, teamType, page) {
    let url = `https://www.fifaindex.com/teams/${page}/?`;

    if (overallMin > 0 && overallMax < 100 && overallMin < overallMax) {
        url += `attackrating_0=${overallMin}&attackrating_1=${overallMax}&`;
        url += `midfieldrating_0=${overallMin}&midfieldrating_1=${overallMax}&`;
        url += `defenserating_0=${overallMin}&defenserating_1=${overallMax}&`;
        url += `overallrating_0=${overallMin}&overallrating_1=${overallMax}&`;
    }

    url += `stars=${stars}&`;
    url += `type=${teamType}`;

    return url;
}

// Returns a random integer between min (included) and max (included)
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function draw(req, res) {

    // check if count team greater than players
    if (teams.length < req.body.competitors.length) {
        res.status(422).json(`Found only ${teams.length} teams for ${req.body.competitors.length} competitors. Please adjust your criteria.`);
    } else {

        let competitors = req.body.competitors.slice();
        let groups = {};
        let groupNames = [];
        let maxPerGroup = Math.ceil(req.body.competitors.length / req.body.groups);
        let charList = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

        for (let group = 0; group < req.body.groups; group++) {
            groups[charList.charAt(group)] = {};
            groupNames.push(charList.charAt(group));
        }

        for (let i = 1; i <= req.body.competitors.length; i++) {

            // draw competitor
            let competitorKey = getRandomInt(0, competitors.length - 1);
            let competitor = competitors[competitorKey];

            competitors.splice(competitorKey, 1);

            // draw team and remove from haystack
            let team = getRandomInt(0, teams.length - 1);
            team = teams.splice(team, 1);

            // draw group
            let groupNumber = getRandomInt(0, groupNames.length - 1);
            group = groupNames[groupNumber];

            // add competitor and the team to the final result
            groups[group][competitor] = {
                team: team[0].name,
                league: team[0].league,
                attack: team[0].attack,
                midfield: team[0].midfield,
                defense: team[0].defense,
                overall: team[0].overall,
                stars: team[0].stars
            };

            if (Object.keys(groups[group]).length >= maxPerGroup) {
                groupNames.splice(groupNumber, 1);
            }
        }

        res.json(groups);
    }
}


function scrape(req, res, parser, page = 1) {
    let url = getUrl(req.body.stars, req.body.overallMin, req.body.overallMax, req.body.teamType, page);
    request(url, handleResponse);

    function handleResponse(error, response, html) {
        switch (response.statusCode) {
            case 200:
                teams = teams.concat(teams, parser.parse(html));

                // check if more pages with teams are present and continue parsing data, or
                if (parser.more(html)) {
                    page++;
                    scrape(req, res, parser, page);
                } else {
                    draw(req, res);
                }
                break;

            default:
                res.status(500).json('Something unexpected happened!');
                console.log(error);
        }
    }
}


// enable CORS (http://enable-cors.org/server_expressjs.html), but we may switch to https://github.com/expressjs/cors
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(bodyParser.json()); // for parsing application/json
app.post('/scrape', function (req, res) {
    teams = [];
    let parser = new TeamParser();

    scrape(req, res, parser);
});

app.listen('8081');
console.log('Magic happens on port 8081');
exports = module.exports = app;