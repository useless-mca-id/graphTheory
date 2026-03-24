import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Layers, Circle } from 'lucide-react'
import GraphCanvas from '../components/GraphCanvas'
import useGraphStore from '../store/useGraphStore'
import { getCrowdLevel, getCrowdColor } from '../utils/graphData'

export default function CampusMap() {
  const { nodes, edges } = useGraphStore()

  const stats = useMemo(() => {
    const lowCount = edges.filter(e => getCrowdLevel(e.crowd) === 'low').length
    const medCount = edges.filter(e => getCrowdLevel(e.crowd) === 'medium').length
    const highCount = edges.filter(e => getCrowdLevel(e.crowd) === 'high').length
    const avgCrowd = (edges.reduce((s, e) => s + e.crowd, 0) / edges.length).toFixed(1)
    return { lowCount, medCount, highCount, avgCrowd }
  }, [edges])

  return (
    <div>
      <div className="section-header">
        <h2>Campus Map</h2>
        <p>Interactive graph visualization of the campus. Drag nodes to rearrange. Edges are color-coded by crowd density.</p>
      </div>

      {/* Stats row */}
      <motion.div
        className="grid-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        style={{ marginBottom: 20 }}
      >
        <div className="card stat-card">
          <div className="stat-value">{nodes.length}</div>
          <div className="stat-label">Locations</div>
        </div>
        <div className="card stat-card">
          <div className="stat-value">{edges.length}</div>
          <div className="stat-label">Paths</div>
        </div>
        <div className="card stat-card">
          <div className="stat-value">{stats.avgCrowd}</div>
          <div className="stat-label">Avg. Crowd</div>
        </div>
        <div className="card stat-card">
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span className="badge badge-success">{stats.lowCount}</span>
            <span className="badge badge-warning">{stats.medCount}</span>
            <span className="badge badge-danger">{stats.highCount}</span>
          </div>
          <div className="stat-label">Density Levels</div>
        </div>
      </motion.div>

      {/* Graph */}
      <div
        className="card"
        style={{ height: 520, padding: 0, overflow: 'hidden' }}
      >
        <GraphCanvas key="campus-map-graph" />
      </div>

      {/* Legend */}
      <motion.div
        className="card"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 28, flexWrap: 'wrap', padding: '16px 24px' }}
      >
        <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          Legend
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 28, height: 4, borderRadius: 2, background: '#22c55e' }} />
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Low crowd (1-3)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 28, height: 4, borderRadius: 2, background: '#f59e0b' }} />
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Medium crowd (4-6)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 28, height: 4, borderRadius: 2, background: '#ef4444' }} />
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>High crowd (7-10)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 24, height: 4, borderRadius: 2, background: 'var(--border)', position: 'relative' }}>
            <div style={{ position: 'absolute', top: -2, left: 0, width: 24, height: 8, borderRadius: 4, background: 'var(--border)' }} />
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Edge thickness = traffic level</span>
        </div>
      </motion.div>
    </div>
  )
}
