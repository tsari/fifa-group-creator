const FifaindexParser = require('../../src/models/FifaindexParser');

describe('Test parsing methods for html source code', () => {
        let parser;

        beforeEach(() => {
            parser = new FifaindexParser();
        });

        it('parse a css class "next" from source code and returns a boolean', () => {
            expect(parser.more('<li class="next">Foo</li>')).toBe(true);
            expect(parser.more('<li class="something else">Bar</li>')).toBe(false);
            expect(parser.more('')).toBe(false);
            expect(parser.more()).toBe(false);
            expect(parser.more([])).toBe(false);
            expect(parser.more({})).toBe(false);
        });

        it('parse teams from html source code into an array of team objects', () => {
            const fs = require('fs');
            fs.readFile(`${__dirname}/FifaindexParser.fixture.html`, 'utf-8', (err, html) => {
                if (err) {
                    return console.log(err);
                }

                let expected = {
                    "attack": "88",
                    "defense": "86",
                    "league": "Liga BBVA",
                    "midfield": "86",
                    "team": "Real Madrid",
                    "overall": "86",
                    "stars": 5,
                };

                expect(parser.parse(html)).toContainEqual(expected);
            });

            expect(parser.parse('')).toEqual([]);
            expect(() => {
                parser.parse()
            }).toThrowError(TypeError, 'Passed parameter must be type of string!');

            expect(() => {
                parser.parse([])
            }).toThrowError(TypeError, 'Passed parameter must be type of string!');

            expect(() => {
                parser.parse({})
            }).toThrowError(TypeError, 'Passed parameter must be type of string!');
        });

        it('create an url from different parameters', () => {
            expect(parser.getUrl()).not.toMatch('undefined');
            expect(parser.getUrl()).toMatch('fifaindex.com');

            expect(parser.getUrl(3)).toMatch('stars=3');
            expect(parser.getUrl(-3)).not.toMatch('stars=-3');

            expect(parser.getUrl(3, 60, 70, 0)).toMatch('type=0');
            expect(parser.getUrl(3, 60, 70, 4)).not.toMatch('type=4');
            expect(parser.getUrl(3, 60, 70, -1)).not.toMatch('type=-1');

            let min = 60,
                max = 70;
            let ratingString = `attackrating_0=${min}&attackrating_1=${max}&midfieldrating_0=${min}&midfieldrating_1=${max}&defenserating_0=${min}&defenserating_1=${max}&overallrating_0=${min}&overallrating_1=${max}`;
            expect(parser.getUrl(3, min, max)).toMatch(ratingString);

            min = -1;
            max = 101;
            ratingString = `attackrating_0=${min}&attackrating_1=${max}&midfieldrating_0=${min}&midfieldrating_1=${max}&defenserating_0=${min}&defenserating_1=${max}&overallrating_0=${min}&overallrating_1=${max}`;
            expect(parser.getUrl(3, min, max)).not.toMatch(ratingString);

            min = 90;
            max = 10;
            ratingString = `attackrating_0=${min}&attackrating_1=${max}&midfieldrating_0=${min}&midfieldrating_1=${max}&defenserating_0=${min}&defenserating_1=${max}&overallrating_0=${min}&overallrating_1=${max}`;
            expect(parser.getUrl(3, min, max)).not.toMatch(ratingString);
        });
    }
);