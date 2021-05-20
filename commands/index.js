/**
 * Interface between the command line arguments and the algorithms to be run in each case
 */
const {
  invalidArguments,
  getRoute,
  getGraph,
  getMaxStops,
  getExactStops,
  getMaxDistance,
  printHelp,
} = require('./../utils/cli');
const {
  parseGraph,
  parsePath,
  parseStartAndEndNode,
} = require('./../utils/inputParsers');
const {
  getRouteDistance,
  getNumberOfTrips,
  getShortestRoute,
  getNumberOfDifferentRoutes,
} = require('../utils/algorithms');

const IS_OPTIONAL = true;

const routeDistance = (args) => {
  const options = {};

  if (args.length !== 5) {
    invalidArguments('Invalid number of arguments');
  }

  const route = getRoute(args);
  options.path = parsePath(route);

  const graphRepresentation = getGraph(args);
  options.graph = parseGraph(graphRepresentation);

  console.log(getRouteDistance(options));
};

const numberOfTrips = (args) => {
  const options = {};

  if (args.length !== 7 && args.length !== 9) {
    invalidArguments('Invalid number of arguments');
  }

  const route = getRoute(args);
  const [startNode, endNode] = parseStartAndEndNode(route);
  options.startNode = startNode;
  options.endNode = endNode;

  const graphRepresentation = getGraph(args);
  options.graph = parseGraph(graphRepresentation);

  options.maxStops = getMaxStops(args, IS_OPTIONAL);
  options.exactStops = getExactStops(args, IS_OPTIONAL);

  if (!options.exactStops && !options.maxStops) {
    invalidArguments('You need to provide either --exactStops or --maxStops');
  }

  if (options.maxStops && options.exactStops && options.maxStops < options.exactStops) {
    invalidArguments('Exact stops cannot be larger than max stops');
  }

  console.log(getNumberOfTrips(options));
};

const shortestRoute = (args) => {
  const options = {};

  if (args.length !== 5) {
    invalidArguments('Invalid number of arguments');
  }

  const route = getRoute(args);
  const [startNode, endNode] = parseStartAndEndNode(route);
  options.startNode = startNode;
  options.endNode = endNode;

  const graphRepresentation = getGraph(args);
  options.graph = parseGraph(graphRepresentation);

  console.log(getShortestRoute(options));
};

const numberOfDifferentRoutes = (args) => {
  const options = {};

  if (args.length !== 7) {
    invalidArguments('Invalid number of arguments');
  }

  const route = getRoute(args);
  const [startNode, endNode] = parseStartAndEndNode(route);
  options.startNode = startNode;
  options.endNode = endNode;

  const graphRepresentation = getGraph(args);
  const graph = parseGraph(graphRepresentation);
  options.graph = graph;

  options.maxDistance = getMaxDistance(args);

  console.log(getNumberOfDifferentRoutes(options));
};

module.exports = {
  routeDistance,
  numberOfTrips,
  shortestRoute,
  numberOfDifferentRoutes,
  printHelp,
};
