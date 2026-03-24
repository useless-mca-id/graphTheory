import { useCallback, useState, useRef, useEffect } from 'react'
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  Handle,
  Position,
  useNodesState,
  useEdgesState,
  MarkerType,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { getCrowdColor, getEdgeThickness } from '../utils/graphData'
import useGraphStore from '../store/useGraphStore'
import { motion, AnimatePresence } from 'framer-motion'

// Custom campus node with handles for edge connections
function CampusNode({ data }) {
  const isHighlighted = data.highlighted
  return (
    <div className={`campus-node ${isHighlighted ? 'highlighted' : ''}`}>
      <Handle type="target" position={Position.Top} style={{ opacity: 0, width: 8, height: 8 }} />
      <Handle type="target" position={Position.Left} id="left-target" style={{ opacity: 0, width: 8, height: 8 }} />
      <div className="node-icon">{data.icon}</div>
      <div className="node-label">{data.label}</div>
      <div className="node-type">{data.nodeType}</div>
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0, width: 8, height: 8 }} />
      <Handle type="source" position={Position.Right} id="right-source" style={{ opacity: 0, width: 8, height: 8 }} />
    </div>
  )
}

const nodeTypes = { campus: CampusNode }

// Stable empty array references to prevent useEffect re-render loops
// When CampusMap/Simulation don't pass these props, they get STABLE references
// instead of creating new [] on every render
const EMPTY_ARRAY = []

function buildRfNodes(graphNodes, highlightedNodes) {
  return graphNodes.map(n => ({
    id: n.id,
    type: 'campus',
    position: { x: n.x, y: n.y },
    data: {
      label: n.label,
      icon: n.icon,
      nodeType: n.type,
      highlighted: highlightedNodes.includes(n.id),
    },
    draggable: true,
  }))
}

function buildRfEdges(graphEdges, highlightedEdges, animatingEdge) {
  return graphEdges.map(e => {
    const crowdColor = getCrowdColor(e.crowd)
    const thickness = getEdgeThickness(e.crowd)
    const isHighlighted = highlightedEdges.includes(e.id)
    const isAnimating = animatingEdge === e.id
    return {
      id: e.id,
      source: e.source,
      target: e.target,
      type: 'default',
      style: {
        stroke: isHighlighted ? '#4f6ef7' : crowdColor,
        strokeWidth: isHighlighted ? thickness + 2 : thickness,
        opacity: (highlightedEdges.length > 0 && !isHighlighted) ? 0.25 : 1,
        transition: 'all 0.4s ease',
        ...(isAnimating ? { strokeDasharray: '8 4', animation: 'pathGlow 1s ease infinite' } : {}),
      },
      animated: isHighlighted || isAnimating,
      label: `${e.distance + e.crowd}`,
      labelStyle: {
        fill: 'var(--text-secondary)',
        fontWeight: 600,
        fontSize: 11,
        fontFamily: 'Inter',
      },
      labelBgStyle: {
        fill: 'var(--bg-secondary)',
        stroke: 'var(--border)',
        strokeWidth: 1,
        rx: 6,
        ry: 6,
      },
      labelBgPadding: [6, 4],
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: isHighlighted ? '#4f6ef7' : crowdColor,
        width: 16,
        height: 16,
      },
    }
  })
}

function GraphCanvasInner({ highlightedNodes = EMPTY_ARRAY, highlightedEdges = EMPTY_ARRAY, animatingEdge = null }) {
  const graphNodes = useGraphStore(s => s.nodes)
  const graphEdges = useGraphStore(s => s.edges)
  const [tooltip, setTooltip] = useState(null)
  const containerRef = useRef(null)

  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])

  // Sync when store data or highlighting changes
  useEffect(() => {
    setNodes(buildRfNodes(graphNodes, highlightedNodes))
  }, [graphNodes, highlightedNodes, setNodes])

  useEffect(() => {
    setEdges(buildRfEdges(graphEdges, highlightedEdges, animatingEdge))
  }, [graphEdges, highlightedEdges, animatingEdge, setEdges])

  // Tooltip on node hover
  const onNodeMouseEnter = useCallback((event, node) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (rect) {
      setTooltip({
        label: node.data.label,
        type: node.data.nodeType,
        x: event.clientX - rect.left + 12,
        y: event.clientY - rect.top - 12,
      })
    }
  }, [])

  const onNodeMouseLeave = useCallback(() => {
    setTooltip(null)
  }, [])

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'relative' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        onNodeMouseEnter={onNodeMouseEnter}
        onNodeMouseLeave={onNodeMouseLeave}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        minZoom={0.3}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="var(--border-light)" gap={24} size={1} />
        <Controls
          showInteractive={false}
          style={{
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-sm)',
          }}
        />
      </ReactFlow>

      {/* Tooltip */}
      <AnimatePresence>
        {tooltip && (
          <motion.div
            className="node-tooltip"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.12 }}
            style={{
              position: 'absolute',
              left: tooltip.x,
              top: tooltip.y,
              transform: 'translateY(-100%)',
            }}
          >
            <h4>{tooltip.label}</h4>
            <p>Type: {tooltip.type}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Wrap with ReactFlowProvider for each instance
export default function GraphCanvas(props) {
  return (
    <ReactFlowProvider>
      <GraphCanvasInner {...props} />
    </ReactFlowProvider>
  )
}
