class Drawer{
    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * Draw competitors, teams, groups and bring it all together.
     *
     * @param teams
     * @param competitorsList
     * @param groupCount
     * @return {{}}
     */
    draw(teams, competitorsList, groupCount) {

        // check if count team greater than competitorsList
        if (teams.length < competitorsList.length) {
            throw new Error(`Found only ${teams.length} teams for ${competitorsList.length} competitors. Please adjust your criteria.`, 422);
        } else {

            let competitors = competitorsList.slice();
            let groups = {};
            let groupNames = [];
            let maxPerGroup = Math.ceil(competitorsList.length / groupCount);
            let charList = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

            for (let group = 0; group < groupCount; group++) {
                groups[charList.charAt(group)] = {};
                groupNames.push(charList.charAt(group));
            }

            for (let i = 1; i <= competitorsList.length; i++) {

                // draw competitor
                let competitorKey = this.getRandomInt(0, competitors.length - 1);
                let competitor = competitors[competitorKey];

                competitors.splice(competitorKey, 1);

                // draw team and remove from haystack
                let team = this.getRandomInt(0, teams.length - 1);
                team = teams.splice(team, 1);

                // draw group
                let groupNumber = this.getRandomInt(0, groupNames.length - 1);
                let group = groupNames[groupNumber];

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

            return groups;
        }
    }
}

module.exports = Drawer;