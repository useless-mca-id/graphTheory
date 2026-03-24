import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, PenLine, MapPin, Route, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react'
import GraphCanvas from '../components/GraphCanvas'
import useGraphStore from '../store/useGraphStore'
import { getCrowdLevel, getCrowdColor } from '../utils/graphData'

const NODE_TYPES = [
  { value: 'academic', label: 'Academic', icon: '🏛️' },
  { value: 'facility', label: 'Facility', icon: '🏢' },
  { value: 'residential', label: 'Residential', icon: '🏠' },
  { value: 'entry', label: 'Entry Point', icon: '🚪' },
]

const EMOJI_OPTIONS = ['🏛️', '📚', '💻', '⚡', '⚙️', '🍽️', '🏀', '🎭', '🏠', '🏥', '🚪', '🅿️', '🔬', '🎓', '🏗️', '🌳', '🚌', '🛒']

let nodeCounter = 100

export default function GraphEditor() {
  const {
    nodes, edges,
    addNode, removeNode, updateNode,
    addEdge, removeEdge, updateEdge,
    updateEdgeCrowd, updateEdgeDistance,
    resetGraph
  } = useGraphStore()

  // Add node form state
  const [newLabel, setNewLabel] = useState('')
  const [newIcon, setNewIcon] = useState('🏛️')
  const [newType, setNewType] = useState('academic')
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)

  // Add edge form state
  const [edgeSource, setEdgeSource] = useState('')
  const [edgeTarget, setEdgeTarget] = useState('')
  const [edgeDistance, setEdgeDistance] = useState(5)
  const [edgeCrowd, setEdgeCrowd] = useState(3)

  // Panel collapse states
  const [nodesExpanded, setNodesExpanded] = useState(true)
  const [edgesExpanded, setEdgesExpanded] = useState(true)

  // Editing node
  const [editingNodeId, setEditingNodeId] = useState(null)
  const [editLabel, setEditLabel] = useState('')

  const handleAddNode = () => {
    if (!newLabel.trim()) return
    const id = `node-${++nodeCounter}`
    const angle = Math.random() * Math.PI * 2
    const radius = 200 + Math.random() * 300
    const x = 500 + Math.cos(angle) * radius
    const y = 300 + Math.sin(angle) * radius
    addNode({ id, label: newLabel.trim(), icon: newIcon, type: newType, x: Math.round(x), y: Math.round(y) })
    setNewLabel('')
  }

  const handleAddEdge = () => {
    if (!edgeSource || !edgeTarget || edgeSource === edgeTarget) return
    const exists = edges.some(
      e => (e.source === edgeSource && e.target === edgeTarget) ||
           (e.source === edgeTarget && e.target === edgeSource)
    )
    if (exists) return
    const id = `e-${Date.now()}`
    addEdge({ id, source: edgeSource, target: edgeTarget, distance: edgeDistance, crowd: edgeCrowd })
    setEdgeSource('')
    setEdgeTarget('')
    setEdgeDistance(5)
    setEdgeCrowd(3)
  }

  const startEditNode = (node) => {
    setEditingNodeId(node.id)
    setEditLabel(node.label)
  }

  const saveEditNode = () => {
    if (editLabel.trim() && editingNodeId) {
      updateNode(editingNodeId, { label: editLabel.trim() })
    }
    setEditingNodeId(null)
    setEditLabel('')
  }

  const stats = useMemo(() => ({
    totalNodes: nodes.length,
    totalEdges: edges.length,
    avgWeight: edges.length > 0
      ? (edges.reduce((s, e) => s + e.distance + e.crowd, 0) / edges.length).toFixed(1)
      : '0',
  }), [nodes, edges])

  return (
    <div>
      <div className="section-header">
        <h2>Graph Editor</h2>
        <p>Add or remove nodes and edges, and adjust weights to customize your campus graph.</p>
      </div>

      {/* Quick Stats */}
      <motion.div
        className="grid-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{ marginBottom: 20 }}
      >
        <div className="card stat-card" style={{ padding: 16 }}>
          <div className="stat-value" style={{ fontSize: '1.4rem' }}>{stats.totalNodes}</div>
          <div className="stat-label" style={{ fontSize: '0.68rem' }}>Nodes</div>
        </div>
        <div className="card stat-card" style={{ padding: 16 }}>
          <div className="stat-value" style={{ fontSize: '1.4rem' }}>{stats.totalEdges}</div>
          <div className="stat-label" style={{ fontSize: '0.68rem' }}>Edges</div>
        </div>
        <div className="card stat-card" style={{ padding: 16 }}>
          <div className="stat-value" style={{ fontSize: '1.4rem' }}>{stats.avgWeight}</div>
          <div className="stat-label" style={{ fontSize: '0.68rem' }}>Avg Weight</div>
        </div>
      </motion.div>

      <div className="editor-layout" style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: 20, alignItems: 'start' }}>
        {/* Editor Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* ─── Add Node Form ─── */}
          <motion.div className="card" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}>
            <div className="editor-section-title">
              <Plus size={14} /> Add Node
            </div>

            <div className="editor-form-row">
              {/* Emoji Picker */}
              <div style={{ position: 'relative' }}>
                <button
                  className="emoji-picker-btn"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  title="Pick icon"
                >
                  {newIcon}
                </button>
                <AnimatePresence>
                  {showEmojiPicker && (
                    <motion.div
                      className="emoji-grid"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                    >
                      {EMOJI_OPTIONS.map(e => (
                        <button
                          key={e}
                          className={`emoji-option ${newIcon === e ? 'active' : ''}`}
                          onClick={() => { setNewIcon(e); setShowEmojiPicker(false) }}
                        >
                          {e}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <input
                className="editor-input"
                placeholder="Node label..."
                value={newLabel}
                onChange={e => setNewLabel(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddNode()}
                style={{ flex: 1 }}
              />
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <select
                className="editor-select"
                value={newType}
                onChange={e => setNewType(e.target.value)}
                style={{ flex: 1 }}
              >
                {NODE_TYPES.map(t => (
                  <option key={t.value} value={t.value}>{t.icon} {t.label}</option>
                ))}
              </select>
              <button className="editor-add-btn" onClick={handleAddNode} disabled={!newLabel.trim()} style={{ flex: '0 0 auto', width: 'auto', padding: '10px 18px' }}>
                <Plus size={14} /> Add
              </button>
            </div>
          </motion.div>

          {/* ─── Add Edge Form ─── */}
          <motion.div className="card" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.08 }}>
            <div className="editor-section-title">
              <Route size={14} /> Add Edge
            </div>

            <div className="editor-form-row">
              <select className="editor-select" value={edgeSource} onChange={e => setEdgeSource(e.target.value)} style={{ flex: 1 }}>
                <option value="">Source...</option>
                {nodes.map(n => (
                  <option key={n.id} value={n.id} disabled={n.id === edgeTarget}>{n.icon} {n.label}</option>
                ))}
              </select>
              <select className="editor-select" value={edgeTarget} onChange={e => setEdgeTarget(e.target.value)} style={{ flex: 1 }}>
                <option value="">Target...</option>
                {nodes.map(n => (
                  <option key={n.id} value={n.id} disabled={n.id === edgeSource}>{n.icon} {n.label}</option>
                ))}
              </select>
            </div>

            <div className="editor-form-grid">
              <div className="editor-slider-group">
                <div className="editor-slider-label">
                  <span>Distance</span>
                  <span className="editor-slider-value">{edgeDistance}</span>
                </div>
                <input
                  type="range" className="editor-slider"
                  min={1} max={20} value={edgeDistance}
                  onChange={e => setEdgeDistance(Number(e.target.value))}
                />
              </div>
              <div className="editor-slider-group">
                <div className="editor-slider-label">
                  <span>Crowd</span>
                  <span className="editor-slider-value">{edgeCrowd}</span>
                </div>
                <input
                  type="range" className="editor-slider"
                  min={1} max={10} value={edgeCrowd}
                  onChange={e => setEdgeCrowd(Number(e.target.value))}
                />
              </div>
            </div>

            <button
              className="editor-add-btn"
              onClick={handleAddEdge}
              disabled={!edgeSource || !edgeTarget || edgeSource === edgeTarget}
            >
              <Plus size={14} /> Add Edge <span className="weight-badge">w: {edgeDistance + edgeCrowd}</span>
            </button>
          </motion.div>

          {/* ─── Reset Button ─── */}
          <button className="editor-reset-btn" onClick={resetGraph}>
            <RotateCcw size={14} /> Reset to Default Campus
          </button>

          {/* ─── Node List ─── */}
          <motion.div
            className="card"
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.16 }}
          >
            <div
              className="editor-collapse-header"
              onClick={() => setNodesExpanded(!nodesExpanded)}
            >
              <div className="editor-section-title" style={{ marginBottom: 0, paddingBottom: 0, borderBottom: 'none' }}>
                <MapPin size={14} /> Nodes ({nodes.length})
              </div>
              {nodesExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
            <AnimatePresence>
              {nodesExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  style={{ overflow: 'hidden', maxHeight: 280, overflowY: 'auto' }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 14 }}>
                    {nodes.map(node => (
                      <div key={node.id} className="editor-list-item">
                        <span className="editor-list-icon">{node.icon}</span>
                        {editingNodeId === node.id ? (
                          <input
                            className="editor-input editor-inline-input"
                            value={editLabel}
                            onChange={e => setEditLabel(e.target.value)}
                            onBlur={saveEditNode}
                            onKeyDown={e => e.key === 'Enter' && saveEditNode()}
                            autoFocus
                          />
                        ) : (
                          <span className="editor-list-label">{node.label}</span>
                        )}
                        <span className="editor-list-type">{node.type}</span>
                        <div className="editor-list-actions">
                          <button className="btn-icon btn-ghost" onClick={() => startEditNode(node)} title="Rename">
                            <PenLine size={13} />
                          </button>
                          <button className="btn-icon btn-ghost editor-delete-btn" onClick={() => removeNode(node.id)} title="Delete node">
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* ─── Edge List ─── */}
          <motion.div
            className="card"
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.24 }}
          >
            <div
              className="editor-collapse-header"
              onClick={() => setEdgesExpanded(!edgesExpanded)}
            >
              <div className="editor-section-title" style={{ marginBottom: 0, paddingBottom: 0, borderBottom: 'none' }}>
                <Route size={14} /> Edges ({edges.length})
              </div>
              {edgesExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
            <AnimatePresence>
              {edgesExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  style={{ overflow: 'hidden', maxHeight: 420, overflowY: 'auto' }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 14 }}>
                    {edges.map(edge => {
                      const src = nodes.find(n => n.id === edge.source)
                      const tgt = nodes.find(n => n.id === edge.target)
                      const crowdColor = getCrowdColor(edge.crowd)
                      const crowdLevel = getCrowdLevel(edge.crowd)
                      return (
                        <div key={edge.id} className="editor-edge-item">
                          <div className="editor-edge-header">
                            <span className="editor-edge-route">
                              {src?.icon} {src?.label} → {tgt?.icon} {tgt?.label}
                            </span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <span className="editor-edge-weight">
                                w: {edge.distance + edge.crowd}
                              </span>
                              <button
                                className="btn-icon btn-ghost editor-delete-btn"
                                onClick={() => removeEdge(edge.id)}
                                title="Delete edge"
                                style={{ width: 28, height: 28, padding: 4 }}
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>
                          <div className="editor-form-grid" style={{ marginBottom: 0, marginTop: 10 }}>
                            <div className="editor-slider-group">
                              <div className="editor-slider-label">
                                <span>Distance</span>
                                <span className="editor-slider-value">{edge.distance}</span>
                              </div>
                              <input
                                type="range" className="editor-slider"
                                min={1} max={20} value={edge.distance}
                                onChange={e => updateEdgeDistance(edge.id, Number(e.target.value))}
                              />
                            </div>
                            <div className="editor-slider-group">
                              <div className="editor-slider-label">
                                <span>Crowd</span>
                                <span className={`badge badge-${crowdLevel === 'low' ? 'success' : crowdLevel === 'medium' ? 'warning' : 'danger'}`}
                                  style={{ fontSize: '0.6rem', padding: '1px 7px' }}>
                                  {edge.crowd}
                                </span>
                              </div>
                              <input
                                type="range" className="editor-slider"
                                min={1} max={10} value={edge.crowd}
                                onChange={e => updateEdgeCrowd(edge.id, Number(e.target.value))}
                                style={{
                                  background: `linear-gradient(to right, ${crowdColor} 0%, ${crowdColor} ${(edge.crowd / 10) * 100}%, var(--border) ${(edge.crowd / 10) * 100}%, var(--border) 100%)`
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Graph Canvas */}
        <div className="card" style={{ height: 680, padding: 0, overflow: 'hidden' }}>
          <GraphCanvas key="editor-graph" />
        </div>
      </div>
    </div>
  )
}
