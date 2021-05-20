/* eslint-disable no-undef */
const { expect } = require('chai');

const {
  getRouteDistance,
  getNumberOfTrips,
  getShortestRoute,
  getNumberOfDifferentRoutes,
} = require('./../utils/algorithms');

const Graph = require('./../structures/Graph');

const graph = new Graph('AB5,BC4,CD8,DC8,DE6,AD5,CE2,EB3,AE7');

describe('getRouteDistance', () => {
  it('should calculate route distances correctly', () => {
    expect(getRouteDistance({ path: ['A', 'B', 'C'], graph })).to.equal(9);
    expect(getRouteDistance({ path: ['A', 'D'], graph })).to.equal(5);
    expect(getRouteDistance({ path: ['A', 'D', 'C'], graph })).to.equal(13);
    expect(getRouteDistance({ path: ['A', 'E', 'B', 'C', 'D'], graph })).to.equal(22);
  });

  it('should return NO SUCH ROUTE if no routes exist', () => {
    expect(getRouteDistance({ path: ['A', 'E', 'D'], graph })).to.equal('NO SUCH ROUTE');
  });
});

describe('numberOfTrips', () => {
  it('max trips', () => {
    expect(
      getNumberOfTrips({
        startNode: 'C',
        endNode: 'C',
        maxStops: 3,
        graph,
      }),
    ).to.equal(2);
  });

  it('exact trips', () => {
    expect(
      getNumberOfTrips({
        startNode: 'A',
        endNode: 'C',
        exactStops: 4,
        graph,
      }),
    ).to.equal(3);
  });
});

describe('shortest path', () => {
  it('should return the correct shortest path', () => {
    expect(getShortestRoute({ startNode: 'A', endNode: 'C', graph })).to.equal(9);
    expect(getShortestRoute({ startNode: 'B', endNode: 'B', graph })).to.equal(9);
  });
});

describe('numberOfDifferentRoutes', () => {
  it('should return the correct number of different routes', () => {
    expect(
      getNumberOfDifferentRoutes({
        startNode: 'C', endNode: 'C', maxDistance: 30, graph,
      }),
    ).to.equal(7);
  });
});
