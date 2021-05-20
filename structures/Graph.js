/**
 * Directed graph structure implemented using a JS map
 */
class Graph {
  /**
   * Initializes the graph with its adjacency list
   * @param {String} graphRepresentation - string representation of a directed graph,
   *                                       e.g. 'AB5,BC4,CD8,DC8,DE6,AD5,CE2,EB3,AE7'
   */
  constructor(graphRepresentation) {
    this.constructAdjacencyList(graphRepresentation);
  }

  /**
   * Creates an adjacency list from a string
   * @param {String} graphRepresentation - e.g. 'AB5,BC4,CD8,DC8,DE6,AD5,CE2,EB3,AE7'
   */
  constructAdjacencyList(graphRepresentation) {
    this.adjacencyList = new Map();

    const routes = graphRepresentation.split(',');

    routes.forEach((value) => {
      const source = value[0];
      const destination = value[1];
      const distance = Number(value.substring(2));

      if (this.adjacencyList.has(source)) {
        this.adjacencyList.get(source).set(destination, distance);
      } else {
        this.adjacencyList.set(source, new Map([[destination, distance]]));
      }
    });
  }

  /**
   * Get all nodes (and their weights) adjacent to the passed in node
   * @param {String} node - node name
   * @returns {Map} - all nodes connected to the passed in node along with their weights
   */
  get(node) {
    return this.adjacencyList.get(node);
  }

  /**
   * Get all nodes which have neighbours
   * @returns {Array} - list of all nodes
   */
  getAllNodes() {
    return Array.from(this.adjacencyList.keys());
  }

  /**
   * Get all nodes adjacent to the passed in node
   * @param {String} node - node name
   * @returns {Array} - list of all adjacent nodes
   */
  getAdjacentNodes(node) {
    return Array.from(this.adjacencyList.get(node).keys());
  }

  /**
   * Get all node weights adjacent to the passed in node
   * @param {String} node - node name
   * @returns {Array} - list of weights of all adjacent nodes
   */
  getAdjacentNodeWeights(node) {
    return Array.from(this.adjacencyList.get(node).values());
  }
}

module.exports = Graph;
