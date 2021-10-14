/*eslint-env node, mocha*/
const boom = require('@hapi/boom')
const expect = require('chai').expect
const ErrorHandler = require('../index')


describe('json-error-handler', () => {


  const req = {}
  const res = {
    status: () => null
  , json: () => null
  }


  it('should accept a user provided logging function', (done) => {

    const test_message = 'This is a test, this is only a test.'

    const logger = (err) => {
      expect(err).to.match(new RegExp(test_message))
    }

    const err = new Error(test_message)
    const handler = ErrorHandler(logger)

    handler(err, req, res)
    done()
  })


  it('should log out a stack trace when NODE_ENV is not production',
  (done) => {

    const test_logger = (err) => {
      expect(err).to.match(/This is a test/)
      expect(err).to.match(/at next/)
      expect(err).to.match(/at processImmediate/)
    }

    const err = new Error('This is a test')
    const handler = ErrorHandler(test_logger)

    handler(err, req, res)
    done()

  })

  it('should handle a`boom.notFound` error',
  (done) => {

    const test_logger = (err) => {
      expect(err.status).to.eql(404)
    }

    const err = boom.notFound('Not Found Test')
    const handler = ErrorHandler(test_logger)

    handler(err, req, res)
    done()

  })

  it('should handle a`boom.unauthorized` error',
  (done) => {

    const test_logger = (err) => {
      expect(err.status).to.eql(401)
    }

    const err = boom.unauthorized('Invalid Credentials')
    const handler = ErrorHandler(test_logger)

    handler(err, req, res)
    done()

  })

})
