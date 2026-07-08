import { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { FiUsers, FiDollarSign, FiTrendingUp, FiAward, FiClock } from 'react-icons/fi';
import AnimatedCounter from '../components/AnimatedCounter';
import { fetchCompetitors } from '../services/api';

const Dashboard = () => {
  const [competitors, setCompetitors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const { data } = await fetchCompetitors();
        setCompetitors(data);
      } catch (error) {
        console.error("Failed to fetch market data", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  if (isLoading) {
    return <SkeletonDashboard />;
  }

  // Format data for Recharts
  const chartData = competitors.map(comp => ({
    name: comp.name,
    Revenue: comp.revenue,
    MarketShare: comp.marketShare
  }));

  // Compute KPIs
  const totalCompanies = competitors.length;
  const totalRevenue = competitors.reduce((sum, c) => sum + c.revenue, 0);
  const avgMarketShare = totalCompanies > 0
    ? (competitors.reduce((sum, c) => sum + c.marketShare, 0) / totalCompanies).toFixed(1)
    : 0;
  const topPlayer = competitors.reduce((top, c) => c.revenue > (top?.revenue || 0) ? c : top, null);
  const totalFarmers = competitors.reduce((s, c) => s + (c.adoptionMetrics?.activeFarmers || 0), 0);

  const COLORS = ['#10b981', '#06b6d4', '#8b5cf6', '#f59e0b', '#ef4444', '#ec4899'];

  const kpis = [
    { label: 'Total Companies', value: totalCompanies, sub: 'In database', icon: <FiUsers />, numericValue: totalCompanies },
    { label: 'Combined Revenue', value: `$${totalRevenue}M`, sub: 'Annual total', icon: <FiDollarSign />, numericValue: totalRevenue, prefix: '$', suffix: 'M' },
    { label: 'Avg Market Share', value: `${avgMarketShare}%`, sub: 'Per company', icon: <FiTrendingUp />, numericValue: Number(avgMarketShare), suffix: '%', decimals: 1 },
    { label: 'Market Leader', value: topPlayer?.name || '—', sub: topPlayer ? `$${topPlayer.revenue}M revenue` : '', icon: <FiAward />, isText: true },
  ];

  // Generate trend data for area chart
  const trendData = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, idx) => ({
    month,
    revenue: Math.round(totalRevenue * (0.7 + (idx * 0.06) + Math.sin(idx * 0.5) * 0.02)),
    farmers: Math.round(totalFarmers * (0.5 + (idx * 0.1))),
  }));

  // Generate simulated activity
  const activities = [
    { time: '2 min ago', action: 'Dashboard accessed', type: 'view' },
    { time: '15 min ago', action: `${topPlayer?.name || 'Competitor'} data refreshed`, type: 'update' },
    { time: '1 hr ago', action: 'SWOT analysis generated', type: 'analysis' },
    { time: '3 hrs ago', action: 'New competitor added to database', type: 'create' },
    { time: '6 hrs ago', action: 'Market report exported', type: 'export' },
  ];

  const activityColors = {
    view: '#06b6d4',
    update: '#10b981',
    analysis: '#8b5cf6',
    create: '#f59e0b',
    export: '#ec4899',
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-md)',
        padding: '12px 16px',
        boxShadow: 'var(--shadow-lg)',
      }}>
        <p style={{ color: 'var(--text-primary)', fontWeight: 600, marginBottom: 6, fontSize: '0.85rem' }}>{label}</p>
        {payload.map((entry, idx) => (
          <p key={idx} style={{ color: entry.color, fontSize: '0.8rem', margin: '2px 0' }}>
            {entry.name}: {entry.name === 'Revenue' || entry.name === 'revenue' ? `$${entry.value}M` : `${entry.value}%`}
          </p>
        ))}
      </div>
    );
  };

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">Market Overview</h1>
        <p className="page-subtitle">High-level comparison of AgTech industry leaders.</p>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        {kpis.map((kpi, i) => (
          <div key={kpi.label} className={`glass-card kpi-card animate-slide-up delay-${i + 1}`}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div className="kpi-label">{kpi.label}</div>
                <div className="kpi-value">
                  {kpi.isText ? kpi.value : (
                    <AnimatedCounter
                      end={kpi.numericValue}
                      prefix={kpi.prefix || ''}
                      suffix={kpi.suffix || ''}
                      decimals={kpi.decimals || 0}
                    />
                  )}
                </div>
                {kpi.sub && <div className="kpi-subtext">{kpi.sub}</div>}
              </div>
              <div style={{
                width: 40, height: 40,
                borderRadius: 'var(--radius-md)',
                background: 'var(--accent-glow)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-accent)',
                fontSize: '1.1rem',
              }}>
                {kpi.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="chart-grid">
        {/* Market Share Pie Chart */}
        <div className="glass-card chart-card animate-slide-up delay-5">
          <div className="chart-card-title">Market Share Distribution</div>
          <div style={{ height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={3}
                  dataKey="MarketShare"
                  stroke="none"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                      style={{ filter: 'drop-shadow(0 0 4px rgba(16, 185, 129, 0.15))' }}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Bar Chart */}
        <div className="glass-card chart-card animate-slide-up delay-6">
          <div className="chart-card-title">Annual Revenue (Millions USD)</div>
          <div style={{ height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148,163,184,0.06)" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 12 }}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(148,163,184,0.04)' }} />
                <Legend
                  wrapperStyle={{ color: '#94a3b8', fontSize: '0.8rem' }}
                />
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                </defs>
                <Bar
                  dataKey="Revenue"
                  fill="url(#barGradient)"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={48}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 2: Trend Chart + Activity */}
      <div className="chart-grid" style={{ marginTop: 20 }}>
        {/* Revenue Trend Area Chart */}
        <div className="glass-card chart-card animate-slide-up delay-5">
          <div className="chart-card-title">Revenue Trend (6-Month)</div>
          <div style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
                <defs>
                  <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148,163,184,0.06)" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="revenue" stroke="#06b6d4" fill="url(#trendGradient)" strokeWidth={2} name="Revenue" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Activity Timeline */}
        <div className="glass-card chart-card animate-slide-up delay-6">
          <div className="chart-card-title">Recent Activity</div>
          <div className="activity-timeline">
            {activities.map((act, idx) => (
              <div key={idx} className={`activity-item animate-slide-up delay-${Math.min(idx + 1, 6)}`}>
                <div className="activity-dot" style={{ background: activityColors[act.type] }} />
                <div className="activity-content">
                  <div className="activity-action">{act.action}</div>
                  <div className="activity-time">
                    <FiClock style={{ fontSize: '0.7rem' }} /> {act.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── Skeleton Loading State ─── */
const SkeletonDashboard = () => (
  <div className="animate-fade-in">
    <div className="page-header">
      <div className="skeleton skeleton-line" style={{ height: 28, width: 200, marginBottom: 8 }} />
      <div className="skeleton skeleton-line" style={{ height: 16, width: 320 }} />
    </div>

    <div className="skeleton-kpi-grid">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="skeleton-card">
          <div className="skeleton skeleton-line sm" style={{ marginBottom: 12 }} />
          <div className="skeleton skeleton-line lg" style={{ marginBottom: 6 }} />
          <div className="skeleton skeleton-line md" />
        </div>
      ))}
    </div>

    <div className="chart-grid">
      {[1, 2].map(i => (
        <div key={i} className="skeleton-card" style={{ padding: 24 }}>
          <div className="skeleton skeleton-line md" style={{ marginBottom: 20 }} />
          <div className="skeleton skeleton-line xl" />
        </div>
      ))}
    </div>
  </div>
);

export default Dashboard;