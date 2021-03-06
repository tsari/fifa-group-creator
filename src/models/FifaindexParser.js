var cheerio = require('cheerio');

class FifaindexParser {

    /**
     * Parse team data from html source.
     *
     * @param html string HTML code
     * @return {Array} of team objects
     *
     * @throws TypeError if param isn't a string
     */
    parse(html) {

        if (typeof html !== 'string') {
            throw new TypeError('Passed parameter must be type of string!');
        }

        let $ = cheerio.load(html);
        let teams = [];

        $('#no-more-tables table.teams tbody').children('tr').each(function () {
            let team = {};

            // we have eight attributes per team, so a row with team info must have this length as well
            if ($(this).children('td').length == 8 && $(this).children('td').first().children().first().attr('title') != 'None') {
                $(this).children('td').each(function () {
                    let data = $(this);
                    switch (data.attr('data-title')) {
                        case 'Name':
                            team.team = data.children().first().text();
                            break;
                        case 'League':
                            team.league = data.children().first().text();
                            break;
                        case 'ATT':
                            team.attack = data.children().first().text();
                            break;
                        case 'MID':
                            team.midfield = data.children().first().text();
                            break;
                        case 'DEF':
                            team.defense = data.children().first().text();
                            break;
                        case 'OVR':
                            team.overall = data.children().first().text();
                            break;
                        case 'Team Rating':
                            team.stars = data.find('span.star').children('i.fa-star').length;
                            team.stars += (data.find('span.star').children('i.fa-star-half-o').length * 0.5);
                            break;
                    }
                });

                teams.push(team);
            }
        });

        return teams;
    }

    /**
     * Check if more pages with teams are present
     *
     * @param html string Cheerio object
     */
    more(html) {
        if (typeof html !== 'string') {
            return false;
        }

        let $ = cheerio.load(html);
        return $('li[class=\'next\']').length === 1;
    }

    /**
     * Create the url to where the content to parse comes from.
     *
     * @param stars
     * @param overallMin
     * @param overallMax
     * @param teamType
     * @param page
     * @return {string}
     */
    getUrl(stars, overallMin, overallMax, teamType = 0, page = 1) {
        let url = `https://www.fifaindex.com/teams/${page}/?`;

        if (overallMin > 0 && overallMax < 100 && overallMin < overallMax) {
            url += `attackrating_0=${overallMin}&attackrating_1=${overallMax}&`;
            url += `midfieldrating_0=${overallMin}&midfieldrating_1=${overallMax}&`;
            url += `defenserating_0=${overallMin}&defenserating_1=${overallMax}&`;
            url += `overallrating_0=${overallMin}&overallrating_1=${overallMax}&`;
        }

        if (stars && stars > 0) {
            url += `stars=${stars}&`;
        }

        // types are available from 0 to 2
        let teamTypes = [0, 1, 2];
        if (teamTypes.indexOf(teamType) !== -1) {
            url += `type=${teamType}`;
        }

        return url;
    }
}

module.exports = FifaindexParser;