export default class RouteSolver {
    static shortestRoute(network, startX, startY, endX, endY){
        if (!network.getNode(startX, startY) || !network.getNode(endX, endY)){
            return null;
        }
        var start = network.getNode(startX, startY);
        var goal =  network.getNode(endX, endY);
        
        // The set of nodes already evaluated
        var closedSet = new Set();
    
        // The set of currently discovered nodes that are not evaluated yet.
        // Initially, only the start node is known.
        var openSet = new Set();
        openSet.add(start);
    
        // For each node, which node it can most efficiently be reached from.
        // If a node can be reached from many nodes, cameFrom will eventually contain the
        // most efficient previous step.
        var cameFrom = new Map();
    
        // For each node, the cost of getting from the start node to that node.
        var gScore = new Map(); //map with default value of Infinity
    
        // The cost of going from start to start is zero.
        gScore.set(start, 0);
    
        // For each node, the total cost of getting from the start node to the goal
        // by passing by that node. That value is partly known, partly heuristic.
        var fScore = new Map(); //map with default value of Infinity
    
        // For the first node, that value is completely heuristic.
        fScore.set(start, this.estimateCost(start, goal));
    
        while (openSet.size != 0){
            var current = this.getLowest(fScore, openSet); //the node in openSet having the lowest fScore[] value
            if (current === goal){
                return this.reconstructPath(cameFrom, current);
            }                
    
            openSet.delete(current);
            closedSet.add(current);
    
            current.getConnections().forEach(neigbor => {
                if (closedSet.has(neighbor)){
                    return;		// Ignore the neighbor which is already evaluated.
                }

                if (!openSet.has(neighbor)){
                    // Discover a new node
                    openSet.add(neighbor);
                }
                
                // The distance from start to a neighbor
                //the "dist_between" function may vary as per the solution requirements.
                var tentative_gScore = gScore.get(current) + this.distBetween(current, neighbor);
                if (tentative_gScore >= gScore.get(neighbor)){
                    return;		// This is not a better path.
                }
                    

                // This path is the best until now. Record it!
                cameFrom.set(neighbor, current);
                gScore.set(neighbor, tentative_gScore);
                fScore.set(neighbor, gScore[neighbor] + this.estimateCost(neighbor, goal)); 
            });
                
        }
    
        return null;
    }

    static distBetween(current, neighbor){        
        return -2 * neighbor.level + 9;
    }

    static getLowest(gscore, openSet){
        var min = -1;
        var minNode;
        openSet.forEach(open => {
            if (min === -1 || gscore[open] < min){
                min = gscore[open];
                minNode = open;
            }
        });
        return minNode;
    }

    static estimateCost(start, end){
        return Math.sqrt(Math.pow(start.x - end.x, 2) + Math.pow(start.y -end.y, 2));
    }

    static reconstructPath(cameFrom, current){
        var totalPath = [current];
        while (cameFrom.has(current)){
            current = cameFrom[current];
            totalPath.push(current);
        }
        return totalPath;
    }
}