const Drawer = require('../../src/models/Drawer');
describe('Drawer class', () => {
    let drawer,
        teams = [],
        competitors = [];

    beforeEach(() => {
        drawer = new Drawer();
        teams = [
            {
                "attack": "88",
                "defense": "86",
                "league": "Liga BBVA",
                "midfield": "86",
                "team": "Real Madrid",
                "overall": "86",
                "stars": 4.5,
            },
            {
                "attack": "90",
                "defense": "87",
                "league": "Bundesliga",
                "midfield": "84",
                "team": "Werder Bremen",
                "overall": "88",
                "stars": 5,
            },
            {
                "attack": "90",
                "defense": "87",
                "league": "Bundesliga",
                "midfield": "84",
                "team": "RB Leipzig",
                "overall": "88",
                "stars": 5,
            },
            {
                "attack": "90",
                "defense": "87",
                "league": "Liga BBVA",
                "midfield": "84",
                "team": "Barcelona",
                "overall": "88",
                "stars": 5,
            }
        ];
        competitors = ['Bernd', 'Helmut', 'Horst', 'Rainer'];
    });

    describe('when you call the getRandomInt() method', () => {
        // I can only test if the random number is with a range when I set the range as small as possible.
        it('create random numbers within a range', () => {
            expect(drawer.getRandomInt(1, 1)).toBeLessThan(2);
            expect(drawer.getRandomInt(1, 1)).toBeGreaterThan(0);
        });
    });


    describe('the draw() method', () => {
        describe('when you pass the group count as parameter', () => {
            it('draws the correct amount of groups', () => {
                let result;
                for (let groupCount of [1, 2, 3, 4]) {
                    result = drawer.draw(teams, competitors, groupCount);
                    expect(Object.keys(result)).toHaveLength(groupCount);
                }
            });
        });

        describe('when you have more competitors than teams', ()=>{
            it('throws an error', () => {
                competitors.push('Gunnar');
                expect(() => {
                    drawer.draw(teams, competitors)
                }).toThrowError(Error, 'Please adjust your criteria');
            });
        });

        describe('when you have an even amount of competitors and groups', ()=>{
            it('draws competitors equally to each group', () => {
                let groups = drawer.draw(teams, competitors, 2);
                expect(Object.keys(groups['A']).length).toBe(Object.keys(groups['B']).length);
            });
        });

        describe('when you have enough teams', ()=>{
            it('each competitor was drawn and each team was assigned to a competitor', () => {
                let groups = drawer.draw(teams, competitors, 2);
                for (let group in groups) {
                    for (let competitor in groups[group]) {
                        expect(competitors.indexOf(competitor)).not.toBe(-1);
                        expect(teams).toContainEqual(groups[group][competitor]);
                    }
                }
            });
        });
    });
});
