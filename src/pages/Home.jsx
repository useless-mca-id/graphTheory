import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Map, Navigation, Activity, GitBranch, Zap, Shield } from 'lucide-react'

const features = [
  {
    icon: <GitBranch size={22} />,
    title: 'Graph-Based Campus Model',
    desc: 'Campus locations modeled as nodes connected by weighted edges representing distance and crowd density.',
    color: '#4f6ef7',
    bg: 'var(--accent-soft)',
  },
  {
    icon: <Navigation size={22} />,
    title: 'Smart Route Finding',
    desc: 'Dijkstra\'s algorithm finds the optimal path considering both distance and crowd congestion.',
    color: '#22c55e',
    bg: 'var(--success-soft)',
  },
  {
    icon: <Activity size={22} />,
    title: 'Live Crowd Simulation',
    desc: 'Simulate crowd flow changes in real-time and observe how routes dynamically adapt.',
    color: '#f59e0b',
    bg: 'var(--warning-soft)',
  },
  {
    icon: <Zap size={22} />,
    title: 'Real-Time Visualization',
    desc: 'Color-coded edges and animated paths bring the campus graph to life with smooth transitions.',
    color: '#ef4444',
    bg: 'var(--danger-soft)',
  },
]

const navCards = [
  {
    to: '/map',
    icon: <Map size={28} />,
    title: 'Campus Map',
    desc: 'Explore the interactive campus graph with draggable nodes and real-time crowd indicators.',
    gradient: 'linear-gradient(135deg, #4f6ef7 0%, #6b8aff 100%)',
  },
  {
    to: '/route',
    icon: <Navigation size={28} />,
    title: 'Find Routes',
    desc: 'Select start and destination. Get the optimal path using Dijkstra or BFS algorithms.',
    gradient: 'linear-gradient(135deg, #22c55e 0%, #4ade80 100%)',
  },
  {
    to: '/simulation',
    icon: <Activity size={28} />,
    title: 'Simulation',
    desc: 'Control crowd density levels and see how the campus flow changes dynamically.',
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
  },
]

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08 }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } }
}

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ marginBottom: 40 }}
      >
        <div style={{ maxWidth: 640 }}>
          <div className="badge badge-accent" style={{ marginBottom: 12 }}>Graph Theory Application</div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, lineHeight: 1.2, marginBottom: 12 }}>
            Smart Crowd Flow<br />
            <span style={{ color: 'var(--accent)' }}>Campus Visualizer</span>
          </h1>
          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            An intelligent campus navigation system that models your college as a graph,
            finds optimal routes using Dijkstra's algorithm, and simulates crowd flow in real-time.
          </p>
        </div>
      </motion.div>

      {/* Nav Cards */}
      <motion.div
        className="grid-3"
        variants={container}
        initial="hidden"
        animate="show"
        style={{ marginBottom: 48 }}
      >
        {navCards.map(card => (
          <motion.div key={card.to} variants={item}>
            <Link to={card.to} style={{ display: 'block' }}>
              <div className="card card-interactive" style={{ position: 'relative', overflow: 'hidden' }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 'var(--radius-lg)',
                  background: card.gradient, display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  color: 'white', marginBottom: 16
                }}>
                  {card.icon}
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: 6 }}>{card.title}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{card.desc}</p>
                <div style={{
                  position: 'absolute', top: -40, right: -40,
                  width: 100, height: 100, borderRadius: '50%',
                  background: card.gradient, opacity: 0.06,
                }} />
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Features Section */}
      <div className="section-header">
        <h2>How It Works</h2>
        <p>The system uses graph theory fundamentals to model, analyze, and optimize campus navigation.</p>
      </div>

      <motion.div
        className="grid-2"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {features.map((feat, i) => (
          <motion.div key={i} variants={item}>
            <div className="card" style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <div style={{
                width: 44, height: 44, borderRadius: 'var(--radius-md)',
                background: feat.bg, display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                color: feat.color, flexShrink: 0
              }}>
                {feat.icon}
              </div>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: 4 }}>{feat.title}</h4>
                <p style={{ fontSize: '0.835rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{feat.desc}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Formula Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        style={{ marginTop: 32 }}
      >
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
          <div style={{
            width: 44, height: 44, borderRadius: 'var(--radius-md)',
            background: 'var(--accent-soft)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', flexShrink: 0
          }}>
            <Shield size={20} color="var(--accent)" />
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: 4 }}>Edge Weight Formula</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Each edge's cost is calculated as the sum of physical distance and current crowd density.
            </p>
          </div>
          <div style={{
            padding: '10px 20px', borderRadius: 'var(--radius-md)',
            background: 'var(--bg-tertiary)', fontFamily: 'monospace',
            fontSize: '0.9rem', fontWeight: 600, color: 'var(--accent)',
            border: '1px solid var(--border-light)',
          }}>
            weight = distance + crowd
          </div>
        </div>
      </motion.div>
    </div>
  )
}
