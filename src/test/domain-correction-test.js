
const domainCorrection = require('../domain-correction');
const expect = require('expect.js');

describe('domainCorrection', () => {
  describe('with default configuration', () => {
    let correct;
    before(() => {
      correct = domainCorrection();
    });

    describe('when given close mispellings of common email hosts', () => {
      const tests = {
        'gamil.com'     : 'gmail.com',
        'gmai.com'      : 'gmail.com',
        'gmail.cm'      : 'gmail.com',
        'gmail.co'      : 'gmail.com',
        'googlemai.com' : 'googlemail.com',
        'googlmail.com' : 'googlemail.com',
        'hotmai.co.uk'  : 'hotmail.co.uk',
        'hotmail.couk'  : 'hotmail.co.uk',
        'hormail.com'   : 'hotmail.com',
        'hotail.com'    : 'hotmail.com',
        'homail.fr'     : 'hotmail.fr',
        'ahoo.com'      : 'yahoo.com',
        'yahho.com'     : 'yahoo.com',
        'yaho.com'      : 'yahoo.com',
        'alo.com'       : 'aol.com',
        'ola.com'       : 'aol.com',
        'yindex.com'    : 'yandex.com',
        'outolok.com'   : 'outlook.com',
        'gmail.com'     : 'gmail.com',
        'googlemail.com': 'googlemail.com',
        'hotmail.co.uk' : 'hotmail.co.uk',
        'hotmail.com'   : 'hotmail.com',
        'hotmail.fr'    : 'hotmail.fr',
        'yahoo.com'     : 'yahoo.com',
        'aol.com'       : 'aol.com',
        'yandex.com'    : 'yandex.com',
        'outlook.com'   : 'outlook.com'
      };
      Object.keys(tests).forEach((badSpelling) => {
        const expectedHost = tests[badSpelling];
        it(`should normalize ${badSpelling} -> ${expectedHost}`, () => {
          expect(correct(badSpelling)).to.equal(expectedHost);
        });
      });
    });
    describe('when given upper or mixed-case input', () => {
      it('should suggest lower case for known hosts', () => {
        expect(correct('GMAIL.com')).to.equal('gmail.com');
      });
      it('should correct and suggest lower case', () => {
        expect(correct('GMA.IL.COM')).to.equal('gmail.com');
      });
      it('should suggest lower case for unknown hosts', () => {
        expect(correct('MyCoolEmail.com')).to.equal('mycoolemail.com');
      });
    });
    describe('when given unknown hosts', () => {
      it('should not suggest a correction', () => {
        expect(correct('awesomemail.com')).to.equal('awesomemail.com');
      });
    });
  });
  describe('with custom configuration', () => {
    describe('when adding custom hosts', () => {
      let correct;
      before(() => {
        correct = domainCorrection(['mycoolemail.com']);
      });
      it('should suggest one of the custom hosts', () => {
        expect(correct('myschoolemail.com')).to.equal('mycoolemail.com');
      });
      it('should still suggest known hosts', () => {
        expect(correct('gmail.vom')).to.equal('gmail.com');
      });
    });
    describe('when replacing custom hosts', () => {
      let correct;
      before(() => {
        correct = domainCorrection(['mycoolemail.com'], false);
      });
      it('should suggest one of the custom hosts', () => {
        expect(correct('myschoolemail.com')).to.equal('mycoolemail.com');
      });
      it('should not suggest known hosts', () => {
        expect(correct('gmail.vom')).to.equal('gmail.vom');
      });
    });
  });
});
