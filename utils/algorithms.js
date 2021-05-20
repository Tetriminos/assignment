const PriorityQueue = require('./../structures/PriorityQueue');

const NO_ROUTE = 'NO SUCH ROUTE';

/**
 * Returns distance for a given path
 * @param {Object} options - named function parameters
 * @param {Array} options.path - path to take
 * @param {Grah} options.graph
 * @returns {Number} - route distance or the 'NO SUCH ROUTE' message
 */
const getRouteDistance = ({ path, graph }) => {
  let distance = 0;

  for (let i = 0; i < path.length - 1; i++) {
    const currentStop = path[i];
    const nextStop = path[i + 1];

    const currentStopRoutes = graph.get(currentStop);
    if (currentStopRoutes.has(nextStop)) {
      distance += currentStopRoutes.get(nextStop);
    } else {
      return NO_ROUTE;
    }
  }

  return distance;
};

/**
 * Returns number of possible trips from the starting node to the ending node
 * according to a number of stops
 * @param {Object} options - named function parameters
 * @param {String} options.startNode
 * @param {String} options.endNode
 * @param {Graph} options.graph
 * @param {Number} [options.maxStops] - maximum amount of stops - inclusive
 * @param {Number} [options.exactStops] - exact amount of stops
 * @returns {Number} - number of possible trips or the 'NO SUCH ROUTE' message
 */
const getNumberOfTrips = ({
  startNode, endNode, graph, maxStops, exactStops,
}) => {
  const nodeStack = [];

  const foundPaths = depthFirstSearch({
    startNode,
    endNode,
    maxStops,
    exactStops,
    graph,
    nodeStack,
  });

  console.log('found paths', foundPaths);

  if (!foundPaths) {
    return NO_ROUTE;
  }

  return foundPaths.length;
};

/**
 * DFS algorithm which accounts for a maximum or an exact number of stops.
 * Returns all found paths
 * @param {Object} options - named function parameters
 * @param {String} options.startNode
 * @param {String} options.endNode
 * @param {Graph} options.graph
 * @param {Number} options.maxStops - maximum amount of stops - inclusive
 * @param {Number} options.exactStops - exact amount of stops
 * @param {Array} options.nodeStack - the path tried so far
 * @returns {Array} - found paths
 */
const depthFirstSearch = ({
  startNode, endNode, graph, maxStops, exactStops, nodeStack,
}) => {
  let foundPaths = [];
  if (
    (maxStops && nodeStack.length > maxStops)
    || (exactStops && nodeStack.length === exactStops + 1)
  ) {
    return;
  }

  if (
    startNode === endNode
    && (exactStops ? nodeStack.length === exactStops : nodeStack.length !== 0)
  ) {
    nodeStack.push(startNode);
    foundPaths.push(nodeStack.join('-'));
    nodeStack.pop();
  }

  nodeStack.push(startNode);

  const adjacentNodes = graph.getAdjacentNodes(startNode);
  adjacentNodes.forEach((adjacentNode) => {
    const path = depthFirstSearch({
      startNode: adjacentNode,
      endNode,
      maxStops,
      exactStops,
      graph,
      nodeStack,
    });
    if (path) {
      foundPaths = foundPaths.concat(path);
    }
  });

  nodeStack.pop();

  return foundPaths;
};

/**
 * Dijkstra's shortest path algorithm taken from [this](https://medium.com/@adriennetjohnson/a-walkthrough-of-dijkstras-algorithm-in-javascript-e94b74192026)
 * medium article. Modified to support cycles
 * @param {object} options - named function parameters
 * @param {string} options.startNode
 * @param {string} options.endNode
 * @param {Graph} options.graph
 * @returns {Number|String} - length of shortest route or the 'NO SUCH ROUTE' message
 */
const getShortestRoute = ({ startNode, endNode, graph }) => {
  const times = {};
  const backtrace = {};
  const pq = new PriorityQueue();

  times[startNode] = 0;

  const nodes = graph.getAllNodes();
  nodes.forEach((node) => {
    if (node !== startNode) {
      times[node] = Infinity;
    }
  });

  pq.enqueue([startNode, 0]);

  let sameStartEdgeCaseCount = startNode === endNode;

  while (!pq.isEmpty()) {
    const shortestStep = pq.dequeue();
    const currentNode = shortestStep[0];
    const adjacencyListNodes = graph.getAdjacentNodes(currentNode);
    const adjacencyListWeights = graph.getAdjacentNodeWeights(currentNode);
    adjacencyListNodes.forEach((neighbor, i) => {
      const time = times[currentNode] + adjacencyListWeights[i];
      if (time < times[neighbor]) {
        times[neighbor] = time;
        backtrace[neighbor] = currentNode;
        pq.enqueue([neighbor, time]);
      }
      if (sameStartEdgeCaseCount) {
        times[currentNode] = Infinity;
        sameStartEdgeCaseCount = false;
      }
    });
  }

  const path = [endNode];
  let lastStep = endNode;
  if (startNode === endNode) {
    path.unshift(backtrace[lastStep]);
    lastStep = backtrace[lastStep];
  }

  while (lastStep !== startNode) {
    path.unshift(backtrace[lastStep]);
    lastStep = backtrace[lastStep];
  }

  console.log(`Path is ${path} and time is ${times[endNode]}`);

  if (!times[endNode]) {
    return NO_ROUTE;
  }

  return times[endNode];
};

/**
 * Returns the number of different routes (with cycles) from the start node to
 * the end node under a certain distance
 * @param {Object} options - named function parameters
 * @param {String} options.startNode
 * @param {String} options.endNode
 * @param {Graph} options.graph
 * @param {Number} options.maxDistance
 * @returns {Number|String} - number of different routes or the 'NO SUCH ROUTE' message
 */
const getNumberOfDifferentRoutes = ({
  startNode, endNode, graph, maxDistance,
}) => {
  // we get all possible routes without cycles from the start node to the end node,
  // and filter those with too large of a distance
  const allPossibleRoutes = getAllPossibleRoutes({
    startNode,
    graph,
    visited: new Set(),
    endNode,
    nodeStack: [],
    distance: 0,
  }).filter((possibleRoute) => {
    if (possibleRoute.distance < maxDistance) {
      return possibleRoute;
    }

    return false;
  });

  if (allPossibleRoutes.length === 0) {
    return NO_ROUTE;
  }

  const shortestRouteLength = Math.min(
    ...allPossibleRoutes.map(possibleRoute => possibleRoute.distance),
  );

  // we get all possible cycles on the graph, and filter those with too
  // large of a distance when combined with our shortest route
  const allNodes = graph.getAllNodes();
  const allCycles = new Map();
  allNodes.forEach((node) => {
    const allShorterCyclesForNode = allCyclesForNode({ node, graph })
      .filter(cycle => shortestRouteLength + cycle.distance < maxDistance);

    allCycles.set(node, allShorterCyclesForNode);
  });

  const differentRoutes = new Set();

  // we find all possible permutations of our routes
  allPossibleRoutes.forEach((possibleRoute) => {
    combine({
      routeToCombine: possibleRoute,
      cycles: allCycles,
      maxDistance,
      indexToStartWith: 0,
      differentRoutes,
    });
    differentRoutes.add(possibleRoute.route);
  });

  if (!differentRoutes) {
    return NO_ROUTE;
  }

  return differentRoutes.size;
};

/**
 * Returns all possible routes without cycles from the starting node to the ending node along
 * with their distances
 * @param {object} options - named function parameters
 * @param {string} options.startNode
 * @param {string} options.endNode
 * @param {Graph} options.graph
 * @param {Set} options.visited - all nodes which were visited
 * @param {Array} options.nodeStack - the path tried so far
 * @param {Number} options.distance - currently travelled distance
 * @returns {Array} - all possible routes along with their distances
 */
const getAllPossibleRoutes = ({
  startNode, endNode, graph, visited, nodeStack, distance,
}) => {
  let allRoutes = [];
  nodeStack.push(startNode);
  visited.add(startNode);


  if (startNode === endNode && nodeStack.length > 1) {
    allRoutes.push({
      route: nodeStack.join(''),
      steps: nodeStack.length,
      distance,
    });
  } else {
    const adjacentNodes = graph.getAdjacentNodes(startNode);
    const adjacentNodeWeights = graph.getAdjacentNodeWeights(startNode);

    adjacentNodes.forEach((adjacentNode, i) => {
      if (adjacentNode === endNode && nodeStack[0] === endNode) {
        nodeStack.push(adjacentNode);
        allRoutes.push({
          route: nodeStack.join(''),
          steps: nodeStack.length,
          distance: distance + adjacentNodeWeights[i],
        });
        nodeStack.pop();
      } else if (!visited.has(adjacentNode)) {
        allRoutes = allRoutes.concat(
          getAllPossibleRoutes({
            startNode: adjacentNode,
            graph,
            visited,
            endNode,
            nodeStack,
            distance: distance + adjacentNodeWeights[i],
          }),
        );
      }
    });
  }

  nodeStack.pop();
  visited.delete(startNode);

  return allRoutes;
};

/**
 * Returns all cycles for a node (paths which start and end on it) along with their distances
 * @param {Object} options - named function parameters
 * @param {String} options.node
 * @param {Graph} options.graph
 * @returns {Array} - all cyclical routes along with their distances
 */
const allCyclesForNode = ({ node, graph }) => {
  const visited = new Set();
  const nodeStack = [];
  const distance = 0;
  return getAllPossibleRoutes({
    startNode: node,
    graph,
    visited,
    endNode: node,
    nodeStack,
    distance,
  });
};

/**
 * Generates all permutations of a route with all possible cycles which are
 * shorter than the max distance
 * @param {Object} options - named function parameters
 * @param {Object} options.routeToCombine - route to be combined with cycles
 * @param {Map} options.cycles - all cycles for each of the nodes
 * @param {Number} options.maxDistance - maximum route distance
 * @param {Number} options.indexToStartWith - index to start recursive calls with,
 *                                            so we do not repeat work
 * @param {Set} options.differentRoutes - set we mutate (ugh) and add new possible routes to
 */
const combine = ({
  routeToCombine, cycles, maxDistance, indexToStartWith, differentRoutes,
}) => {
  for (let i = indexToStartWith; i < routeToCombine.route.length; i++) {
    const cyclesForNode = cycles.get(routeToCombine.route[i]);
    for (let j = 0; j < cyclesForNode.length; j++) {
      const newDistance = routeToCombine.distance + cyclesForNode[j].distance;
      if (newDistance < maxDistance) {
        const newRouteRoute = routeToCombine.route.slice(0, i)
          + cyclesForNode[j].route
          + routeToCombine.route.slice(i + 1);

        if (differentRoutes.has(newRouteRoute)) {
          continue;
        }

        // if the combined distance is smaller and the path hasn't been found before,
        // we add it to the different routes set and try to combine it with all the cycles
        differentRoutes.add(newRouteRoute);
        const newRoute = {
          route: newRouteRoute,
          distance: newDistance,
          steps: routeToCombine.steps + cyclesForNode[j].steps,
        };

        combine({
          routeToCombine: newRoute,
          cycles,
          maxDistance,
          indexToStartWith: i,
          differentRoutes,
        });
      }
    }
  }
};

module.exports = {
  getRouteDistance,
  getNumberOfTrips,
  getShortestRoute,
  getNumberOfDifferentRoutes,
};
