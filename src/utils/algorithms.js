// Dijkstra's Algorithm — finds shortest path based on weight = distance + crowd
export function dijkstra(adjacencyList, startId, endId) {
  const dist = {}
  const prev = {}
  const visited = new Set()
  const pq = [] // simple priority queue [{node, dist}]

  // Initialize
  for (const nodeId of Object.keys(adjacencyList)) {
    dist[nodeId] = Infinity
    prev[nodeId] = null
  }
  dist[startId] = 0
  pq.push({ node: startId, dist: 0 })

  while (pq.length > 0) {
    // Sort and pick smallest
    pq.sort((a, b) => a.dist - b.dist)
    const { node: current } = pq.shift()

    if (visited.has(current)) continue
    visited.add(current)

    if (current === endId) break

    const neighbors = adjacencyList[current] || []
    for (const { node: neighbor, weight, edgeId } of neighbors) {
      if (visited.has(neighbor)) continue
      const newDist = dist[current] + weight
      if (newDist < dist[neighbor]) {
        dist[neighbor] = newDist
        prev[neighbor] = { node: current, edgeId }
        pq.push({ node: neighbor, dist: newDist })
      }
    }
  }

  // Reconstruct path
  if (dist[endId] === Infinity) {
    return { path: [], edgeIds: [], cost: Infinity, visited: [...visited] }
  }

  const path = []
  const edgeIds = []
  let curr = endId
  while (curr !== null) {
    path.unshift(curr)
    if (prev[curr]) {
      edgeIds.unshift(prev[curr].edgeId)
      curr = prev[curr].node
    } else {
      curr = null
    }
  }

  return {
    path,
    edgeIds,
    cost: dist[endId],
    visited: [...visited]
  }
}

// BFS — finds path with fewest hops (unweighted)
export function bfs(adjacencyList, startId, endId) {
  const visited = new Set()
  const prev = {}
  const queue = [startId]
  const visitOrder = []

  visited.add(startId)
  prev[startId] = null

  while (queue.length > 0) {
    const current = queue.shift()
    visitOrder.push(current)

    if (current === endId) break

    const neighbors = adjacencyList[current] || []
    for (const { node: neighbor, edgeId } of neighbors) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor)
        prev[neighbor] = { node: current, edgeId }
        queue.push(neighbor)
      }
    }
  }

  // Reconstruct path
  if (!visited.has(endId)) {
    return { path: [], edgeIds: [], cost: 0, visited: visitOrder }
  }

  const path = []
  const edgeIds = []
  let curr = endId
  while (curr !== null) {
    path.unshift(curr)
    if (prev[curr]) {
      edgeIds.unshift(prev[curr].edgeId)
      curr = prev[curr].node
    } else {
      curr = null
    }
  }

  // Calculate total weight along BFS path
  let totalCost = 0
  for (let i = 0; i < path.length - 1; i++) {
    const neighbors = adjacencyList[path[i]] || []
    const edge = neighbors.find(n => n.node === path[i + 1])
    if (edge) totalCost += edge.weight
  }

  return {
    path,
    edgeIds,
    cost: totalCost,
    visited: visitOrder
  }
}
