const R = require('ramda')
const { inspect } = require('util')

const inProductionMode = () => {
  return process.env.NODE_ENV === 'production'
}

// clearTrace :: Json -> Json
const clearTrace   = (err_json) => {
  // We don't want to give out debug info to our users.
  err_json.error.stack        = null
  err_json.error.fileName     = null
  err_json.error.lineNumber   = null
  err_json.error.columnNumber = null

  return err_json
}

// boomJson :: BoomError -> Json
const boomJson = (err) => {
  const json = {
    message : err.message
  , name    : err.name || 'UNKNOWN'
  , error   : err
  , status  : err.output.statusCode
  }
  return json
}


// errorJson :: Error -> Json
const errorJson    = (err) => {
  const json   = {
    message  : err.message
    , name   : err.name || 'UNKNOWN'
    , error  : err
    , status : err.status || err.statusCode || 500
  }

  return json
}

const toJson = R.cond([
  [ R.prop('isBoom'), boomJson ],
  [ R.T, errorJson ]
])


// logError :: Error -> Error
const logError     = (logger) => R.tap(R.when(
  R.both(
    R.compose(R.lt(499), R.prop('status'))
  , R.compose(R.not, R.isNil, R.path(['error', 'stack']))
  )
  , R.compose(logger, inspect)
))


// If we have an array of errors, use the first as the main error
// and attach the rest as an add on.
// arrayToError :: Array Error -> Error
const arrayToError = (err_array) => {
  let err       = R.head(err_array)
  err.list      = R.compose(errorTransform, R.tail)(err_array)

  return err
}

const errorTransform = (error_logger) => R.compose(
  R.when(inProductionMode, clearTrace)
, R.tap(error_logger)
, toJson
, R.when(Array.isArray, arrayToError)
)


const sendError    = (req, res) => (err) => {
  res.status(err.status || 500)
  return res.json(err)
}

// eslint-disable-next-line no-unused-vars
const ErrorHandler = (logger) => (err, req, res, next) => {
  R.compose(
    sendError(req, res)
  , errorTransform(logError(logger))
  )(err)
}

module.exports  = ErrorHandler
