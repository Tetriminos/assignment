/**
 * Exits the app along with an invalid argument message
 * @param {String} message - printed in case of invalid argument
 */
const invalidArguments = (message) => {
  console.error(message);
  console.log('Type -h for help');
  process.exit(1);
};

/**
 * Tests if an argument value adheres to a pattern
 * @param {String} value
 * @param {RegExp} regex
 * @param {String} invalidMessage - message to be returned to user if argument is invalid
 * @returns {Boolean} - true if the argument is valid, otherwise the program exits
 */
const isArgumentValueValid = (value, regex, invalidMessage) => {
  if (!regex.test(value)) {
    invalidArguments(invalidMessage);
  }

  return true;
};

/**
 * Gets the value of a named command line argument
 * @param {Object} options - named function parameters
 * @param {String} options.argumentName
 * @param {Array} options.allArguments - all arguments passed to the program
 * @param {RegExp} options.validatorRegex - regex to validate the argument against
 * @param {String} invalidMessage - message to be returned to user if argument is invalid
 * @param {Boolean} options.isOptional - is the argument optional
 * @returns {String} - argument value
 */
const getArgument = ({
  argumentName,
  allArguments,
  validatorRegex,
  invalidMessage,
  isOptional,
}) => {
  let argument;
  for (let i = 1; i < allArguments.length; i += 2) {
    if (
      allArguments[i] === argumentName
      && isArgumentValueValid(allArguments[i + 1], validatorRegex, invalidMessage)
    ) {
      argument = allArguments[i + 1];
    }
  }

  if (!isOptional && !argument) {
    invalidArguments(`no ${argumentName} flag provided`);
  }

  return argument;
};

// route example: 'A-B-C'
const getRoute = args => getArgument({
  argumentName: '--route',
  allArguments: args,
  validatorRegex: new RegExp(/^[A-Z](?:-[A-Z])+$/g),
  invalidMessage: 'Invalid route provided',
});

// graph example: 'AB5,BC4,CD8,DC8,DE6,AD5,CE2,EB3,AE7'
const getGraph = args => getArgument({
  argumentName: '--graph',
  allArguments: args,
  validatorRegex: new RegExp(/^[A-Z]{2}[0-9]+(?:,[A-Z]{2}[0-9]+)+$/g),
  invalidMessage: 'Invalid graph provided',
});

const getMaxStops = (args, isOptional) => Number(getArgument({
  argumentName: '--maxStops',
  allArguments: args,
  validatorRegex: new RegExp(/^[0-9]+$/g),
  invalidMessage: 'Invalid max stops provided',
  isOptional,
}));

const getExactStops = (args, isOptional) => Number(getArgument({
  argumentName: '--exactStops',
  allArguments: args,
  validatorRegex: new RegExp(/^[0-9]+$/g),
  invalidMessage: 'Invalid exact stops provided',
  isOptional,
}));

const getMaxDistance = (args, isOptional) => Number(getArgument({
  argumentName: '--maxDistanceNonInclusive',
  allArguments: args,
  validatorRegex: new RegExp(/^[0-9]+$/g),
  invalidMessage: 'Invalid maximum distance provided',
  isOptional,
}));

/**
 * Prints help screen
 */
const printHelp = () => {
  console.info(`    -g
    --graph -> AB5,BC4,CD8,DC8,DE6,AD5,CE2,EB3,AE7
    routeDistance - get distance of a route
    --route -> A-B-C
    numberOfTrips - get number of trips from the start node to the end node
    --maxStops -> 3
    --exactStops -> 4
    --route -> C-C
    shortestRoute - get the length of the shortest route from the start node to the end nod
    --route -> A-C
    numberOfDifferentRoutes - get the number of different routes
    --maxDistanceNonInclusive -> 30
    --route -> C-C`);
};

module.exports = {
  invalidArguments,
  getRoute,
  getGraph,
  getMaxStops,
  getExactStops,
  getMaxDistance,
  printHelp,
};
