describe('Test parsing methods for html source code', () => {
    const TeamParser = require('../../src/models/TeamParser');
    let parser;

    beforeEach(() => {
        parser = new TeamParser();
    });

    it('parses a css class "next" from source code and returns a boolean', () => {
        expect(parser.more('<li class="next">Foo</li>')).toBe(true);
        expect(parser.more('<li class="something else">Bar</li>')).toBe(false);
    });

    it('parses teams from html source code into an array of team objects', () => {
        const fs = require('fs');
        fs.readFile(`${__dirname}/TeamParser.fixture.html`, (err, html) => {
            if (err) {
                return console.log(err);
            }

            let expected = {
                "attack": "88",
                "defense": "86",
                "league": "Liga BBVA",
                "midfield": "86",
                "name": "Real Madrid",
                "overall": "86",
                "stars": 5,
            };

            expect(parser.parse(html)).toContainEqual(expected);
        });
    });
});