
/**
 * The main error handler for Social Zombie
 */
const { inspect } = require('util');
const _           = require('ramda');


const inProductionMode = () => {
  return process.env.NODE_ENV === 'production';
}


// clearTrace :: Json -> Json
const clearTrace   = (err_json) => {
  // We don't want to give out debug info to our users.
  err_json.error.stack        = null;
  err_json.error.fileName     = null;
  err_json.error.lineNumber   = null;
  err_json.error.columnNumber = null;

  return err_json;

};


// errorJson :: Error -> Json
const errorJson    = (err) => {
  const json   = {
    message  : err.message
    , name   : err.name || 'UNKNOWN'
    , error  : err
    , status : err.status || 500
  };

  return json;
};


// logError :: Error -> Error
const logError     = (logger) => _.tap(_.when(
  _.both(
    _.compose(_.lt(499), _.prop('status'))
  , _.compose(_.not, _.isNil, _.prop('stack'))
  )
  , _.compose(logger, inspect)
));


// If we have an array of errors, use the first as the main error
// and attach the rest as an add on.
// arrayToError :: Array Error -> Error
const arrayToError = (err_array) => {
  let err       = _.head(err_array);
  err.list      = _.compose(errorTransform, _.tail)(err_array);

  return err;
};

const errorTransform = (error_logger) => _.compose(
  error_logger
, _.when(inProductionMode, clearTrace)
, errorJson
, _.when(Array.isArray, arrayToError)
);


const sendError    = (req, res) => (err) => {
  res.status(err.status || 500);
  return res.json(err)
};

// eslint-disable-next-line no-unused-vars
const ErrorHandler = (logger) => (err, req, res, next) => {
  _.compose(
    sendError(req, res)
  , errorTransform(logError(logger))
  )(err);
};


module.exports  = ErrorHandler;
