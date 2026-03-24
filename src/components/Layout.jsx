import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { Home, Map, Navigation, Activity, Sun, Moon, Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import useGraphStore from '../store/useGraphStore'

const navItems = [
  { path: '/',           label: 'Home',           icon: Home },
  { path: '/map',        label: 'Campus Map',     icon: Map },
  { path: '/route',      label: 'Route Finder',   icon: Navigation },
  { path: '/simulation', label: 'Simulation',     icon: Activity },
]

const pageNames = {
  '/':           'Dashboard',
  '/map':        'Campus Map',
  '/route':      'Route Finder',
  '/simulation': 'Crowd Simulation',
}

export default function Layout() {
  const location = useLocation()
  const { theme, toggleTheme } = useGraphStore()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Apply theme on mount
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <h1>
            <span className="logo-icon">CF</span>
            <div>
              CampusFlow
              <span>Crowd Flow Visualizer</span>
            </div>
          </h1>
        </div>

        <nav className="sidebar-nav">
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', padding: '0 14px' }}>
            <div style={{ fontWeight: 600, marginBottom: 4 }}>Graph Theory Project</div>
            <div>Campus Crowd Routing</div>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)',
            zIndex: 99, backdropFilter: 'blur(2px)'
          }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <main className="main-content">
        <header className="top-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              className="btn-icon btn-ghost mobile-menu-btn"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <span className="top-bar-title">{pageNames[location.pathname] || 'CampusFlow'}</span>
          </div>
          <div className="top-bar-actions">
            <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
          </div>
        </header>

        <div className="page-content">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
