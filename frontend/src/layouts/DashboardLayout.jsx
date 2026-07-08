import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { FiPieChart, FiUsers, FiActivity, FiMenu, FiLogOut, FiChevronLeft, FiTrendingUp, FiBarChart2, FiSettings, FiBell } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import '../App.css';

const DashboardLayout = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  // Persist sidebar state in localStorage
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const stored = localStorage.getItem('agtech_sidebar_collapsed');
    return stored === 'true';
  });

  const [hasNotification] = useState(true);

  useEffect(() => {
    localStorage.setItem('agtech_sidebar_collapsed', isCollapsed);
  }, [isCollapsed]);

  const toggleSidebar = () => setIsCollapsed(prev => !prev);

  const navItems = [
    { name: 'Market Overview', path: '/', icon: <FiPieChart /> },
    { name: 'Competitors', path: '/competitors', icon: <FiUsers /> },
    { name: 'SWOT Engine', path: '/swot', icon: <FiActivity /> },
    { name: 'Market Trends', path: '/trends', icon: <FiTrendingUp /> },
    { name: 'Analytics', path: '/analytics', icon: <FiBarChart2 /> },
    { name: 'Settings', path: '/settings', icon: <FiSettings /> },
  ];

  // Generate initials for avatar
  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  // Match route — handle /competitor/:id as part of Competitors
  const getActiveItem = () => {
    if (location.pathname.startsWith('/competitor/')) return 'Competitors';
    return navItems.find(item => item.path === location.pathname)?.name || 'Dashboard';
  };

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* Sidebar */}
      <aside className={`sidebar ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <FiActivity />
          </div>
          {!isCollapsed && <span className="sidebar-logo-text">AgTech Intel</span>}
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const isActive = item.path === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`nav-item ${isActive ? 'active' : ''}`}
                title={isCollapsed ? item.name : undefined}
              >
                <span className="nav-item-icon">{item.icon}</span>
                {!isCollapsed && <span className="nav-item-label">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar footer — collapse toggle */}
        <div className="sidebar-footer">
          <button className="sidebar-toggle-btn" onClick={toggleSidebar} title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
            <FiChevronLeft className={`sidebar-toggle-icon ${isCollapsed ? 'rotated' : ''}`} />
            {!isCollapsed && <span>Collapse</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="main-content">
        <header className="app-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button className="header-menu-btn" onClick={toggleSidebar} title="Toggle sidebar">
              <FiMenu />
            </button>
            <h2 className="app-header-title">
              {getActiveItem()}
            </h2>
          </div>

          <div className="app-header-right">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div className="header-status-dot" />
              <span className="header-status-text">Live Data</span>
            </div>

            {/* Notification bell */}
            <button className="header-notification-btn" title="Notifications">
              <FiBell />
              {hasNotification && <span className="notification-dot" />}
            </button>

            {/* User info */}
            <div className="header-user-info">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="header-avatar-img" referrerPolicy="no-referrer" />
              ) : (
                <div className="header-avatar">{getInitials(user?.name)}</div>
              )}
              <span className="header-user-name">{user?.name}</span>
            </div>

            <button className="header-logout-btn" onClick={logout} title="Sign out">
              <FiLogOut />
            </button>
          </div>
        </header>

        {/* Animated background mesh */}
        <div className="content-bg-mesh" />

        {/* Dynamic Page Content */}
        <div className="content-area">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;