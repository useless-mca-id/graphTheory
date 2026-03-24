// Campus Graph Data — initial nodes and edges

export const initialNodes = [
  { id: 'main-gate',     label: 'Main Gate',         icon: '🚪', type: 'entry',      x: 80,  y: 300 },
  { id: 'parking',       label: 'Parking Lot',       icon: '🅿️', type: 'facility',   x: 200, y: 150 },
  { id: 'admin',         label: 'Admin Block',       icon: '🏛️', type: 'academic',   x: 320, y: 300 },
  { id: 'library',       label: 'Library',           icon: '📚', type: 'academic',   x: 500, y: 150 },
  { id: 'canteen',       label: 'Canteen',           icon: '🍽️', type: 'facility',   x: 500, y: 450 },
  { id: 'cs-block',      label: 'CS Department',     icon: '💻', type: 'academic',   x: 700, y: 100 },
  { id: 'ee-block',      label: 'EE Department',     icon: '⚡', type: 'academic',   x: 700, y: 300 },
  { id: 'mech-block',    label: 'Mech Department',   icon: '⚙️', type: 'academic',   x: 700, y: 500 },
  { id: 'auditorium',    label: 'Auditorium',        icon: '🎭', type: 'facility',   x: 900, y: 200 },
  { id: 'sports',        label: 'Sports Complex',    icon: '🏀', type: 'facility',   x: 900, y: 450 },
  { id: 'hostel',        label: 'Hostel',            icon: '🏠', type: 'residential',x: 1100, y: 300 },
  { id: 'medical',       label: 'Medical Center',    icon: '🏥', type: 'facility',   x: 320, y: 500 },
]

export const initialEdges = [
  { id: 'e1',  source: 'main-gate',  target: 'parking',    distance: 3,  crowd: 2  },
  { id: 'e2',  source: 'main-gate',  target: 'admin',      distance: 5,  crowd: 4  },
  { id: 'e3',  source: 'main-gate',  target: 'medical',    distance: 6,  crowd: 1  },
  { id: 'e4',  source: 'parking',    target: 'library',    distance: 4,  crowd: 3  },
  { id: 'e5',  source: 'parking',    target: 'admin',      distance: 3,  crowd: 2  },
  { id: 'e6',  source: 'admin',      target: 'library',    distance: 4,  crowd: 5  },
  { id: 'e7',  source: 'admin',      target: 'canteen',    distance: 3,  crowd: 7  },
  { id: 'e8',  source: 'admin',      target: 'ee-block',   distance: 6,  crowd: 4  },
  { id: 'e9',  source: 'library',    target: 'cs-block',   distance: 4,  crowd: 6  },
  { id: 'e10', source: 'library',    target: 'ee-block',   distance: 5,  crowd: 3  },
  { id: 'e11', source: 'canteen',    target: 'mech-block', distance: 4,  crowd: 5  },
  { id: 'e12', source: 'canteen',    target: 'ee-block',   distance: 3,  crowd: 4  },
  { id: 'e13', source: 'canteen',    target: 'medical',    distance: 4,  crowd: 2  },
  { id: 'e14', source: 'cs-block',   target: 'auditorium', distance: 3,  crowd: 2  },
  { id: 'e15', source: 'ee-block',   target: 'auditorium', distance: 4,  crowd: 3  },
  { id: 'e16', source: 'ee-block',   target: 'mech-block', distance: 3,  crowd: 2  },
  { id: 'e17', source: 'mech-block', target: 'sports',     distance: 3,  crowd: 4  },
  { id: 'e18', source: 'auditorium', target: 'hostel',     distance: 5,  crowd: 3  },
  { id: 'e19', source: 'sports',     target: 'hostel',     distance: 4,  crowd: 2  },
  { id: 'e20', source: 'auditorium', target: 'sports',     distance: 3,  crowd: 1  },
]

// Build adjacency list from edges
export function buildAdjacencyList(nodes, edges) {
  const adj = {}
  nodes.forEach(n => { adj[n.id] = [] })
  edges.forEach(e => {
    const weight = e.distance + e.crowd
    adj[e.source]?.push({ node: e.target, weight, edgeId: e.id })
    adj[e.target]?.push({ node: e.source, weight, edgeId: e.id })
  })
  return adj
}

// Crowd level helper
export function getCrowdLevel(crowd) {
  if (crowd <= 3) return 'low'
  if (crowd <= 6) return 'medium'
  return 'high'
}

export function getCrowdColor(crowd) {
  if (crowd <= 3) return '#22c55e'   // green
  if (crowd <= 6) return '#f59e0b'   // yellow/amber
  return '#ef4444'                    // red
}

export function getEdgeThickness(crowd) {
  return Math.max(2, Math.min(8, crowd * 0.8 + 1))
}
