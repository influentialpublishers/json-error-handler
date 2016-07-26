/*eslint-env node, mocha*/
const expect = require('chai').expect;
const ErrorHandler = require('../index');


describe('json-error-handler', () => {

  it('should accept a user provided logging function', (done) => {

    const test_message = 'This is a test, this is only a test.';

    const logger = (err) => {
      console.log('Error: ', err); //eslint-disable-line no-console
      expect(err.message).to.eql(test_message);
      return err;
    };


    const err = new Error(test_message);
    const handler = ErrorHandler(logger);

    const req = {};
    const res = {
      status: () => null
    , json: () => null
    };

    handler(err, req, res);
    done();
  });

});
