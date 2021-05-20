#!/usr/bin/env node
const {
  routeDistance,
  numberOfTrips,
  shortestRoute,
  numberOfDifferentRoutes,
  printHelp,
} = require('./commands');
const { invalidArguments } = require('./utils/cli');

const args = process.argv.slice(2);

const command = args[0];

switch (command) {
  case 'routeDistance': {
    routeDistance(args);
    break;
  }
  case 'numberOfTrips': {
    numberOfTrips(args);
    break;
  }
  case 'shortestRoute': {
    shortestRoute(args);
    break;
  }
  case 'numberOfDifferentRoutes': {
    numberOfDifferentRoutes(args);
    break;
  }
  case '-h':
  case '--help':
  case 'help': {
    printHelp();
    break;
  }
  default: {
    invalidArguments(`The command '${args[0]}' does not exist`);
    break;
  }
}
