import { useState, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Navigation, ArrowRight, RotateCcw, Shuffle } from 'lucide-react'
import GraphCanvas from '../components/GraphCanvas'
import useGraphStore from '../store/useGraphStore'
import { dijkstra, bfs } from '../utils/algorithms'

export default function RouteFinder() {
  const { nodes, edges, getAdjacencyList, pathResult, setPathResult, clearPath } = useGraphStore()

  const [startNode, setStartNode] = useState('')
  const [endNode, setEndNode] = useState('')
  const [algorithm, setAlgorithm] = useState('dijkstra')
  const [highlightedNodes, setHighlightedNodes] = useState([])
  const [highlightedEdges, setHighlightedEdges] = useState([])
  const [animatingEdge, setAnimatingEdge] = useState(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const animationRef = useRef(null)

  const findRoute = useCallback(() => {
    if (!startNode || !endNode || startNode === endNode) return

    const adj = getAdjacencyList()
    const result = algorithm === 'dijkstra'
      ? dijkstra(adj, startNode, endNode)
      : bfs(adj, startNode, endNode)

    setPathResult(result)

    // Animate path step-by-step
    if (result.path.length > 0) {
      setIsAnimating(true)
      setHighlightedNodes([])
      setHighlightedEdges([])
      setAnimatingEdge(null)

      let step = 0
      const animateStep = () => {
        if (step < result.path.length) {
          setHighlightedNodes(prev => [...prev, result.path[step]])
          if (step > 0 && result.edgeIds[step - 1]) {
            setAnimatingEdge(result.edgeIds[step - 1])
            setTimeout(() => {
              setHighlightedEdges(prev => [...prev, result.edgeIds[step - 1]])
              setAnimatingEdge(null)
            }, 350)
          }
          step++
          animationRef.current = setTimeout(animateStep, 500)
        } else {
          setIsAnimating(false)
        }
      }
      animateStep()
    }
  }, [startNode, endNode, algorithm, getAdjacencyList, setPathResult])

  const reset = useCallback(() => {
    clearTimeout(animationRef.current)
    clearPath()
    setStartNode('')
    setEndNode('')
    setHighlightedNodes([])
    setHighlightedEdges([])
    setAnimatingEdge(null)
    setIsAnimating(false)
  }, [clearPath])

  const swapNodes = useCallback(() => {
    setStartNode(endNode)
    setEndNode(startNode)
  }, [startNode, endNode])

  useEffect(() => {
    return () => clearTimeout(animationRef.current)
  }, [])

  // Find edge details for the path
  const getPathEdgeDetails = () => {
    if (!pathResult || !pathResult.edgeIds.length) return []
    return pathResult.edgeIds.map(eid => {
      const edge = edges.find(e => e.id === eid)
      return edge
    }).filter(Boolean)
  }

  return (
    <div>
      <div className="section-header">
        <h2>Route Finder</h2>
        <p>Find the optimal path between two campus locations using Dijkstra's or BFS algorithm.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 20, alignItems: 'start' }}>
        {/* Controls Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Algorithm Selection */}
          <motion.div
            className="card"
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 12 }}>
              Algorithm
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                className={`btn btn-sm ${algorithm === 'dijkstra' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setAlgorithm('dijkstra')}
              >
                Dijkstra
              </button>
              <button
                className={`btn btn-sm ${algorithm === 'bfs' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setAlgorithm('bfs')}
              >
                BFS
              </button>
            </div>
          </motion.div>

          {/* Node Selection */}
          <motion.div
            className="card"
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="input-group">
                <label className="input-label">Start Location</label>
                <select
                  className="select"
                  value={startNode}
                  onChange={e => setStartNode(e.target.value)}
                >
                  <option value="">Select origin...</option>
                  {nodes.map(n => (
                    <option key={n.id} value={n.id} disabled={n.id === endNode}>
                      {n.icon} {n.label}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button className="btn btn-ghost btn-icon" onClick={swapNodes} title="Swap">
                  <Shuffle size={16} />
                </button>
              </div>

              <div className="input-group">
                <label className="input-label">Destination</label>
                <select
                  className="select"
                  value={endNode}
                  onChange={e => setEndNode(e.target.value)}
                >
                  <option value="">Select destination...</option>
                  {nodes.map(n => (
                    <option key={n.id} value={n.id} disabled={n.id === startNode}>
                      {n.icon} {n.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              <button
                className="btn btn-primary"
                onClick={findRoute}
                disabled={!startNode || !endNode || startNode === endNode || isAnimating}
                style={{ flex: 1 }}
              >
                <Navigation size={16} />
                Find Route
              </button>
              <button className="btn btn-secondary btn-icon" onClick={reset} title="Reset">
                <RotateCcw size={16} />
              </button>
            </div>
          </motion.div>

          {/* Results */}
          <AnimatePresence>
            {pathResult && (
              <motion.div
                className="card path-result"
                initial={{ opacity: 0, y: 16, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: 16 }}
                transition={{ duration: 0.3 }}
              >
                {pathResult.path.length > 0 ? (
                  <>
                    <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8 }}>
                      {algorithm === 'dijkstra' ? 'Optimal' : 'BFS'} Path Found
                    </div>

                    <div className="path-steps">
                      {pathResult.path.map((nodeId, i) => {
                        const node = nodes.find(n => n.id === nodeId)
                        return (
                          <span key={nodeId} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <motion.span
                              className="path-step"
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: i * 0.1 }}
                            >
                              {node?.icon} {node?.label}
                            </motion.span>
                            {i < pathResult.path.length - 1 && (
                              <ArrowRight size={14} className="path-arrow" />
                            )}
                          </span>
                        )
                      })}
                    </div>

                    <div className="path-cost">
                      <div className="path-cost-item">
                        <span className="cost-value">{pathResult.cost}</span>
                        <span className="cost-label">Total Cost</span>
                      </div>
                      <div className="path-cost-item">
                        <span className="cost-value">{pathResult.path.length - 1}</span>
                        <span className="cost-label">Hops</span>
                      </div>
                      <div className="path-cost-item">
                        <span className="cost-value">{pathResult.visited.length}</span>
                        <span className="cost-label">Nodes Explored</span>
                      </div>
                    </div>

                    {/* Edge breakdown */}
                    <div style={{ marginTop: 16, borderTop: '1px solid var(--border-light)', paddingTop: 12 }}>
                      <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8 }}>
                        Path Breakdown
                      </div>
                      {getPathEdgeDetails().map((edge, i) => {
                        const src = nodes.find(n => n.id === edge.source)
                        const tgt = nodes.find(n => n.id === edge.target)
                        return (
                          <div key={edge.id} style={{
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            padding: '6px 0', borderBottom: i < getPathEdgeDetails().length - 1 ? '1px solid var(--border-light)' : 'none',
                            fontSize: '0.8rem'
                          }}>
                            <span style={{ color: 'var(--text-secondary)' }}>
                              {src?.label} → {tgt?.label}
                            </span>
                            <span style={{ display: 'flex', gap: 10 }}>
                              <span style={{ color: 'var(--text-tertiary)' }}>d: {edge.distance}</span>
                              <span style={{ color: 'var(--text-tertiary)' }}>c: {edge.crowd}</span>
                              <span style={{ fontWeight: 600, color: 'var(--accent)' }}>{edge.distance + edge.crowd}</span>
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </>
                ) : (
                  <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                    No path found between selected locations.
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Graph */}
        <motion.div
          className="card"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          style={{ height: 560, padding: 0, overflow: 'hidden' }}
        >
          <GraphCanvas
            highlightedNodes={highlightedNodes}
            highlightedEdges={highlightedEdges}
            animatingEdge={animatingEdge}
          />
        </motion.div>
      </div>
    </div>
  )
}
