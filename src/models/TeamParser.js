var cheerio = require('cheerio');

class TeamParser {

    /**
     Parse team data from html source.

     @param html string HTML code
     @return Array of team objects
     */
    parse(html) {
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
                            team.name = data.children().first().text();
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
        let $ = cheerio.load(html);
        return $('li[class=\'next\']').length === 1;
    }
}
;

module.exports = TeamParser;