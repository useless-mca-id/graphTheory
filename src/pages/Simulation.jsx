import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause, RefreshCw, Sliders, Zap } from 'lucide-react'
import GraphCanvas from '../components/GraphCanvas'
import useGraphStore from '../store/useGraphStore'
import { getCrowdLevel, getCrowdColor } from '../utils/graphData'

export default function Simulation() {
  const { nodes, edges, updateEdgeCrowd, randomizeCrowd, isSimulating, setSimulating, resetGraph } = useGraphStore()
  const intervalRef = useRef(null)
  const [speed, setSpeed] = useState(1500)
  const [selectedEdge, setSelectedEdge] = useState(null)

  // Auto-simulation: randomly shift crowd values
  const startSimulation = useCallback(() => {
    setSimulating(true)
    intervalRef.current = setInterval(() => {
      const { edges: currentEdges } = useGraphStore.getState()
      const randomIdx = Math.floor(Math.random() * currentEdges.length)
      const edge = currentEdges[randomIdx]
      const delta = Math.random() > 0.5 ? 1 : -1
      const newCrowd = Math.max(1, Math.min(10, edge.crowd + delta))
      updateEdgeCrowd(edge.id, newCrowd)
    }, speed)
  }, [speed, updateEdgeCrowd, setSimulating])

  const stopSimulation = useCallback(() => {
    setSimulating(false)
    clearInterval(intervalRef.current)
  }, [setSimulating])

  const toggleSimulation = useCallback(() => {
    if (isSimulating) {
      stopSimulation()
    } else {
      startSimulation()
    }
  }, [isSimulating, startSimulation, stopSimulation])

  useEffect(() => {
    return () => clearInterval(intervalRef.current)
  }, [])

  // Restart interval when speed changes during simulation
  useEffect(() => {
    if (isSimulating) {
      clearInterval(intervalRef.current)
      startSimulation()
    }
  }, [speed])

  const stats = useMemo(() => {
    const lowCount = edges.filter(e => getCrowdLevel(e.crowd) === 'low').length
    const medCount = edges.filter(e => getCrowdLevel(e.crowd) === 'medium').length
    const highCount = edges.filter(e => getCrowdLevel(e.crowd) === 'high').length
    const avg = (edges.reduce((s, e) => s + e.crowd, 0) / edges.length).toFixed(1)
    return { lowCount, medCount, highCount, avg }
  }, [edges])

  return (
    <div>
      <div className="section-header">
        <h2>Crowd Simulation</h2>
        <p>Simulate crowd flow changes and observe how path weights update in real-time.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 20, alignItems: 'start' }}>
        {/* Controls Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Simulation Controls */}
          <motion.div
            className="card"
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 14 }}>
              Simulation Controls
            </div>

            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              <button
                className={`btn ${isSimulating ? 'btn-danger' : 'btn-primary'}`}
                onClick={toggleSimulation}
                style={{ flex: 1 }}
              >
                {isSimulating ? <Pause size={16} /> : <Play size={16} />}
                {isSimulating ? 'Pause' : 'Start'} Simulation
              </button>
            </div>

            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              <button className="btn btn-secondary btn-sm" onClick={randomizeCrowd} style={{ flex: 1 }}>
                <Zap size={14} />
                Randomize
              </button>
              <button className="btn btn-secondary btn-sm" onClick={resetGraph} style={{ flex: 1 }}>
                <RefreshCw size={14} />
                Reset
              </button>
            </div>

            <div className="input-group">
              <label className="input-label">Speed: {speed}ms</label>
              <input
                type="range"
                className="range-slider"
                min={300}
                max={3000}
                step={100}
                value={speed}
                onChange={e => setSpeed(Number(e.target.value))}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>
                <span>Fast</span>
                <span>Slow</span>
              </div>
            </div>
          </motion.div>

          {/* Live Stats */}
          <motion.div
            className="card"
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 14 }}>
              Live Statistics
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="stat-card card" style={{ padding: 14 }}>
                <div className="stat-value" style={{ fontSize: '1.25rem' }}>{stats.avg}</div>
                <div className="stat-label" style={{ fontSize: '0.68rem' }}>Avg Crowd</div>
              </div>
              <div className="stat-card card" style={{ padding: 14 }}>
                <div style={{ display: 'flex', gap: 6 }}>
                  <span className="badge badge-success" style={{ fontSize: '0.68rem' }}>{stats.lowCount}</span>
                  <span className="badge badge-warning" style={{ fontSize: '0.68rem' }}>{stats.medCount}</span>
                  <span className="badge badge-danger" style={{ fontSize: '0.68rem' }}>{stats.highCount}</span>
                </div>
                <div className="stat-label" style={{ fontSize: '0.68rem' }}>Density</div>
              </div>
            </div>
          </motion.div>

          {/* Edge Controls */}
          <motion.div
            className="card"
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            style={{ maxHeight: 340, overflowY: 'auto' }}
          >
            <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 14 }}>
              <Sliders size={14} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />
              Edge Crowd Controls
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {edges.map(edge => {
                const src = nodes.find(n => n.id === edge.source)
                const tgt = nodes.find(n => n.id === edge.target)
                const crowdLevel = getCrowdLevel(edge.crowd)
                const crowdColor = getCrowdColor(edge.crowd)
                return (
                  <div key={edge.id} style={{
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-light)',
                  }}>
                    <div style={{
                      display: 'flex', justifyContent: 'space-between',
                      alignItems: 'center', marginBottom: 6
                    }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
                        {src?.label} → {tgt?.label}
                      </span>
                      <span className={`badge badge-${crowdLevel === 'low' ? 'success' : crowdLevel === 'medium' ? 'warning' : 'danger'}`}>
                        {edge.crowd}
                      </span>
                    </div>
                    <input
                      type="range"
                      className="range-slider"
                      min={1}
                      max={10}
                      value={edge.crowd}
                      onChange={e => updateEdgeCrowd(edge.id, Number(e.target.value))}
                      style={{
                        background: `linear-gradient(to right, ${crowdColor} 0%, ${crowdColor} ${(edge.crowd / 10) * 100}%, var(--border) ${(edge.crowd / 10) * 100}%, var(--border) 100%)`
                      }}
                    />
                  </div>
                )
              })}
            </div>
          </motion.div>
        </div>

        <div
          className="card"
          style={{ height: 620, padding: 0, overflow: 'hidden' }}
        >
          <GraphCanvas key="sim-graph" />
        </div>
      </div>
    </div>
  )
}
