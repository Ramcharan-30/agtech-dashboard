import { Outlet, Link, useLocation } from 'react-router-dom';
import { FiPieChart, FiUsers, FiActivity } from 'react-icons/fi';

const DashboardLayout = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Market Overview', path: '/', icon: <FiPieChart /> },
    { name: 'Competitors', path: '/competitors', icon: <FiUsers /> },
    { name: 'SWOT Engine', path: '/swot', icon: <FiActivity /> },
  ];

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shadow-sm">
        <div className="h-16 flex items-center px-6 border-b border-slate-200">
          <h1 className="text-xl font-bold text-brand-900 tracking-tight">AgTech Intel</h1>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                  isActive
                    ? 'bg-brand-50 text-brand-600 font-medium'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-8 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800">
            {navItems.find(item => item.path === location.pathname)?.name || 'Dashboard'}
          </h2>
        </header>
        
        {/* Dynamic Page Content Rendered Here */}
        <div className="flex-1 overflow-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;