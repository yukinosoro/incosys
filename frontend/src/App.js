import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import EnhancedDashboard from './components/EnhancedDashboard';
import Inventory from './components/Inventory';
import Reports from './components/Reports';
import Graphs from './components/Graphs';
import Alerts from './components/Alerts';
import Transactions from './components/Transactions';
import './App.css';

// Theme configuration with all CSS variables
const THEME_CONFIG = {
  red: {
    '--primary': '#ff1e1e',
    '--primary-light': '#ff4343',
    '--primary-bright': '#ff8f8f',
    '--primary-dark': '#cc1818',
    '--primary-glow': 'rgba(255, 30, 30, 0.35)',
    '--primary-border': 'rgba(255, 30, 30, 0.25)',
    '--primary-border-strong': 'rgba(255, 30, 30, 0.6)',
    '--primary-border-hover': 'rgba(255, 30, 30, 0.9)',
    '--primary-bg-light': 'rgba(255, 30, 30, 0.08)',
    '--primary-bg-lighter': 'rgba(255, 30, 30, 0.03)',
    '--primary-focus': 'rgba(255, 30, 30, 0.5)',
    '--primary-table': 'rgba(255, 30, 30, 0.16)',
    '--primary-input-bg': 'rgba(255, 30, 30, 0.08)',
    '--primary-input-border': 'rgba(255, 30, 30, 0.3)',
    '--primary-alert-bg': 'rgba(255, 30, 30, 0.15)',
    '--primary-alert-border': 'rgba(255, 30, 30, 0.4)',
    '--primary-alert-border-left': 'rgba(255, 30, 30, 0.8)',
    '--primary-gradient': 'linear-gradient(90deg, rgba(255,30,30,0.9), rgba(180,10,10,0.95))',
    '--primary-card-gradient': 'linear-gradient(145deg, #111111, #1a1a1a)',
    '--accent-color': '#ff1e1e',
    '--shadow': 'rgba(255, 30, 30, 0.35)',
  },
  green: {
    '--primary': '#00ff88',
    '--primary-light': '#33ff99',
    '--primary-bright': '#8fffb0',
    '--primary-dark': '#00cc6a',
    '--primary-glow': 'rgba(0, 255, 136, 0.35)',
    '--primary-border': 'rgba(0, 255, 136, 0.25)',
    '--primary-border-strong': 'rgba(0, 255, 136, 0.6)',
    '--primary-border-hover': 'rgba(0, 255, 136, 0.9)',
    '--primary-bg-light': 'rgba(0, 255, 136, 0.08)',
    '--primary-bg-lighter': 'rgba(0, 255, 136, 0.03)',
    '--primary-focus': 'rgba(0, 255, 136, 0.5)',
    '--primary-table': 'rgba(0, 255, 136, 0.16)',
    '--primary-input-bg': 'rgba(0, 255, 136, 0.08)',
    '--primary-input-border': 'rgba(0, 255, 136, 0.3)',
    '--primary-alert-bg': 'rgba(0, 255, 136, 0.15)',
    '--primary-alert-border': 'rgba(0, 255, 136, 0.4)',
    '--primary-alert-border-left': 'rgba(0, 255, 136, 0.8)',
    '--primary-gradient': 'linear-gradient(90deg, rgba(0,255,136,0.9), rgba(0,204,106,0.95))',
    '--primary-card-gradient': 'linear-gradient(145deg, #111111, #1a1a1a)',
    '--accent-color': '#00ff88',
    '--shadow': 'rgba(0, 255, 136, 0.35)',
  },
  yellow: {
    '--primary': '#ffd700',
    '--primary-light': '#ffe555',
    '--primary-bright': '#ffe555',
    '--primary-dark': '#ccaa00',
    '--primary-glow': 'rgba(255, 215, 0, 0.35)',
    '--primary-border': 'rgba(255, 215, 0, 0.25)',
    '--primary-border-strong': 'rgba(255, 215, 0, 0.6)',
    '--primary-border-hover': 'rgba(255, 215, 0, 0.9)',
    '--primary-bg-light': 'rgba(255, 215, 0, 0.08)',
    '--primary-bg-lighter': 'rgba(255, 215, 0, 0.03)',
    '--primary-focus': 'rgba(255, 215, 0, 0.5)',
    '--primary-table': 'rgba(255, 215, 0, 0.16)',
    '--primary-input-bg': 'rgba(255, 215, 0, 0.08)',
    '--primary-input-border': 'rgba(255, 215, 0, 0.3)',
    '--primary-alert-bg': 'rgba(255, 215, 0, 0.15)',
    '--primary-alert-border': 'rgba(255, 215, 0, 0.4)',
    '--primary-alert-border-left': 'rgba(255, 215, 0, 0.8)',
    '--primary-gradient': 'linear-gradient(90deg, rgba(255,215,0,0.9), rgba(204,170,0,0.95))',
    '--primary-card-gradient': 'linear-gradient(145deg, #111111, #1a1a1a)',
    '--accent-color': '#ffd700',
    '--shadow': 'rgba(255, 215, 0, 0.35)',
  },
  orange: {
    '--primary': '#ff8800',
    '--primary-light': '#ffaa33',
    '--primary-bright': '#ffb366',
    '--primary-dark': '#cc6600',
    '--primary-glow': 'rgba(255, 136, 0, 0.35)',
    '--primary-border': 'rgba(255, 136, 0, 0.25)',
    '--primary-border-strong': 'rgba(255, 136, 0, 0.6)',
    '--primary-border-hover': 'rgba(255, 136, 0, 0.9)',
    '--primary-bg-light': 'rgba(255, 136, 0, 0.08)',
    '--primary-bg-lighter': 'rgba(255, 136, 0, 0.03)',
    '--primary-focus': 'rgba(255, 136, 0, 0.5)',
    '--primary-table': 'rgba(255, 136, 0, 0.16)',
    '--primary-input-bg': 'rgba(255, 136, 0, 0.08)',
    '--primary-input-border': 'rgba(255, 136, 0, 0.3)',
    '--primary-alert-bg': 'rgba(255, 136, 0, 0.15)',
    '--primary-alert-border': 'rgba(255, 136, 0, 0.4)',
    '--primary-alert-border-left': 'rgba(255, 136, 0, 0.8)',
    '--primary-gradient': 'linear-gradient(90deg, rgba(255,136,0,0.9), rgba(204,102,0,0.95))',
    '--primary-card-gradient': 'linear-gradient(145deg, #111111, #1a1a1a)',
    '--accent-color': '#ff8800',
    '--shadow': 'rgba(255, 136, 0, 0.35)',
  },
};

/**
 * Apply theme colors to the document
 */
const applyTheme = (themeName) => {
  const themeVars = THEME_CONFIG[themeName] || THEME_CONFIG['red'];
  const root = document.documentElement;
  
  Object.entries(themeVars).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
  
  // Also set the data-theme attribute for CSS selector support
  root.setAttribute('data-theme', themeName);
};

const navItems = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/inventory', label: 'Inventory' },
  { to: '/alerts', label: 'Alerts' },
  { to: '/transactions', label: 'Transactions' },
  { to: '/reports', label: 'Reports' }
];

const MainLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const [theme, setTheme] = React.useState(localStorage.getItem('theme') || 'red');

  React.useEffect(() => {
    // Apply theme colors via CSS variables
    applyTheme(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const authToken = localStorage.getItem('token');
  if (!authToken) return <Navigate to="/login" />;

  return (
    <div className="App layout">
      <aside className="sidebar">
        <h1>ICOSYS</h1>
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`nav-link ${location.pathname === item.to ? 'active' : ''}`}
          >
            {item.label}
          </Link>
        ))}
      </aside>
      <main>
        <header className="topbar">
          <h2>ICOSYS Dashboard</h2>
          <div className="top-actions">
            <select
              className="theme-switcher"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              title="Switch theme"
            >
              <option value="red">🔴 Red</option>
              <option value="green">🟢 Green</option>
              <option value="yellow">🟡 Yellow</option>
              <option value="orange">🟠 Orange</option>
            </select>
            <span className="user-chip">{user?.username || 'Manager'}</span>
            <button className="logout-btn" onClick={logout}>Logout</button>
          </div>
        </header>
        <section className="content-area">
          <Outlet />
        </section>
      </main>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<MainLayout />}>
          <Route path="dashboard" element={<EnhancedDashboard />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="alerts" element={<Alerts />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="reports" element={<Reports />} />
          <Route path="" element={<Navigate to="dashboard" />} />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;