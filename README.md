### Table of contents
- [How to run](#how-to-run)
  - [Get all trips with no more than 3 stops](#get-all-trips-with-no-more-than-3-stops)
  - [Get all trips with exactly 4 stops](#get-all-trips-with-exactly-4-stops)
  - [Get shortest route](#get-shortest-route)
  - [Get different routes with distance less than 30](#get-different-routes-with-distance-less-than-30)
- [Test suite](#test-suite)
- [Assumptions](#assumptions)
- [Design decisions](#design-decisions)
- [Possible future improvements](#possible-future-improvements)
- [Notes](#notes)

## How to run
Make sure Node.js is installed:
```bash
node -v
```

And run the program with, for example, the first test input:
```bash
node index routeDistance --graph AB5,BC4,CD8,DC8,DE6,AD5,CE2,EB3,AE7 --route A-B-C
```

Or make the script executable for the current user:
```bash
chmod +x index.js
```
And run it as any ol' script:
```bash
./index.js routeDistance --graph AB5,BC4,CD8,DC8,DE6,AD5,CE2,EB3,AE7 --route A-B-C
```

### Get all trips with no more than 3 stops
```bash
node index numberOfTrips --graph AB5,BC4,CD8,DC8,DE6,AD5,CE2,EB3,AE7 --route C-C --maxStops 3
```
### Get all trips with exactly 4 stops
```bash
node index numberOfTrips --graph AB5,BC4,CD8,DC8,DE6,AD5,CE2,EB3,AE7 --route A-C --exactStops 4
```
### Get shortest route
```bash
node index shortestRoute --graph AB5,BC4,CD8,DC8,DE6,AD5,CE2,EB3,AE7 --route A-C
```
### Get different routes with distance less than 30
```bash
node index numberOfDifferentRoutes --graph AB5,BC4,CD8,DC8,DE6,AD5,CE2,EB3,AE7 --route C-C --maxDistanceNonInclusive 30
```

## Test suite
To run the algorithms on all the test inputs given in the assignment, first install the dev dependencies via:
```bash
npm install
```
And then do:
```bash
npm test
```
Which will run Mocha tests, utilizing the chai assertion library (specifically, expect)

## Assumptions
* I took the careful approach and assumed that *no dependencies* meant no CLI argument parsing dependencies neither, this took a good chunk of my time
* I implicitly return `NO SUCH ROUTE` if no route exists for inputs such as 6-10.
* This is a small program, that _shouldn't_ grow too rapidly

## Design decisions
* The first working iteration used completely naive algorithms, which have since been slightly optimized (2x-3x)
* For test input 10, I first check for all possible routes without cycles that are at a smaller distance, than all cycles, to save compute time on recomputing cycles. Those routes and cycles are then combined in all possible permutations (still staying under the max distance)
* I've separated the command invoking logic, the input parsing logic and the actual algorithm logic, to have them slightly decoupled. But *not* completely, due to the assumption that this is a small program, and decoupling everything in small to medium programs unnecessarily increases the developers cognitive load, _in my opinion_...
* I've separated the Graph class from the algorithms not to clutter it too much. They are coupled by nature tho, so I'm on the fence wether it was a _good_ decision.

## Possible future improvements
* Instead of a set of strings to note all possible routes, a tree structure should be used to save space, and to make it possible to have multi letter cities without using much more space for a delimiter
* inputs 6 and 7 are not optimized in the same way as 10 is, they should be
* There are small optimizations to be made on all the algorithms
* The algorithms are not completely DRY (inputs 6, 7 and 10 should probably be one algorithm)
* Add and improve error handling
* Right now we can only account for 25 cities (A-Z)

## Notes
This is the first time I've been tasked to write 'production-quality code' that involves usage of _actual_ cs algorithms (if you catch my drift). I also had to give myself a refresher on graphs and their accompanying algorithms.

Also a first time writing a CLI without a nice option parsing library.

All in all, I was out of my depth, which slowed me down significantly.

Thus I would highly prefer to call this 'production-ready' code, it's usable, understandable, it's code which could become production quality with a nice (or to say, SOLID) round of refactoring.
^ Those are my excuses.

In hindsight, there are a lot of things I would do differently.

If you have any questions on some of my decisions, or if you want to know on how I would further improve things, I'm pretty confident that I will be able provide concrete, meaningful answers at the interview.

If you have any critiques, *please* share them with me, I'm always looking to improve.
