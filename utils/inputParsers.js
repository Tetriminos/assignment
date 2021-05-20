const Graph = require('./../structures/Graph');
/**
 * Parses a string graph representation into a graph object
 * @param {String} graphRepresentation - e.g. 'AB5,BC4,CD8,DC8,DE6,AD5,CE2,EB3,AE7'
 * @returns {Graph} - directed graph
 */
const parseGraph = graphRepresentation => new Graph(graphRepresentation);

/**
 * Parses a string path representation into a path array usable by the rest of the app
 * @param {String} pathRepresentation - e.g. 'A-D-C'
 * @returns {Array} - path, e.g. ['A', 'D', 'C']
 */
const parsePath = route => route.split('-');

/**
 * Parses a string route representation into a pair (array) of values, start and end node
 * @param {String} route - e.g. 'A-C'
 * @returns {Array} - start and end node, e.g. ['A', 'C'];
 */
const parseStartAndEndNode = route => [route[0], route[2]];

module.exports = {
  parseGraph,
  parsePath,
  parseStartAndEndNode,
};
