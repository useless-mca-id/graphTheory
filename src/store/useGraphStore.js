import { create } from 'zustand'
import { initialNodes, initialEdges, buildAdjacencyList } from '../utils/graphData'

const useGraphStore = create((set, get) => ({
  // Graph data
  nodes: [...initialNodes],
  edges: [...initialEdges],

  // UI state
  theme: localStorage.getItem('cf-theme') || 'light',

  // Route finder state
  selectedPath: null,
  pathResult: null,
  animatingPath: false,

  // Simulation state
  isSimulating: false,

  // Actions
  setTheme: (theme) => {
    localStorage.setItem('cf-theme', theme)
    document.documentElement.setAttribute('data-theme', theme)
    set({ theme })
  },

  toggleTheme: () => {
    const current = get().theme
    const next = current === 'light' ? 'dark' : 'light'
    get().setTheme(next)
  },

  // Get adjacency list
  getAdjacencyList: () => {
    const { nodes, edges } = get()
    return buildAdjacencyList(nodes, edges)
  },

  // Set path result
  setPathResult: (result) => set({ pathResult: result }),
  clearPath: () => set({ pathResult: null, animatingPath: false }),

  setAnimatingPath: (val) => set({ animatingPath: val }),

  // Update edge crowd
  updateEdgeCrowd: (edgeId, crowd) => {
    set(state => ({
      edges: state.edges.map(e =>
        e.id === edgeId ? { ...e, crowd: Math.max(0, Math.min(10, crowd)) } : e
      )
    }))
  },

  // Randomize crowd
  randomizeCrowd: () => {
    set(state => ({
      edges: state.edges.map(e => ({
        ...e,
        crowd: Math.floor(Math.random() * 10) + 1
      }))
    }))
  },

  // Simulation — gradually shift crowd over time
  setSimulating: (val) => set({ isSimulating: val }),

  // Add node
  addNode: (node) => {
    set(state => ({ nodes: [...state.nodes, node] }))
  },

  // Remove node
  removeNode: (nodeId) => {
    set(state => ({
      nodes: state.nodes.filter(n => n.id !== nodeId),
      edges: state.edges.filter(e => e.source !== nodeId && e.target !== nodeId)
    }))
  },

  // Add edge
  addEdge: (edge) => {
    set(state => ({ edges: [...state.edges, edge] }))
  },

  // Remove edge
  removeEdge: (edgeId) => {
    set(state => ({
      edges: state.edges.filter(e => e.id !== edgeId)
    }))
  },

  // Update edge
  updateEdge: (edgeId, updates) => {
    set(state => ({
      edges: state.edges.map(e =>
        e.id === edgeId ? { ...e, ...updates } : e
      )
    }))
  },

  // Reset to initial
  resetGraph: () => {
    set({
      nodes: [...initialNodes],
      edges: [...initialEdges],
      pathResult: null,
      animatingPath: false
    })
  }
}))

export default useGraphStore
