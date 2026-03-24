import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import CampusMap from './pages/CampusMap'
import RouteFinder from './pages/RouteFinder'
import Simulation from './pages/Simulation'
import GraphEditor from './pages/GraphEditor'

function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/map" element={<CampusMap />} />
          <Route path="/route" element={<RouteFinder />} />
          <Route path="/simulation" element={<Simulation />} />
          <Route path="/editor" element={<GraphEditor />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App

