import { useState, useEffect, useMemo } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend
} from 'recharts';
import { FiTrendingUp, FiActivity, FiLayers, FiCalendar } from 'react-icons/fi';
import AnimatedCounter from '../components/AnimatedCounter';
import { fetchCompetitors } from '../services/api';

const MarketTrends = () => {
  const [competitors, setCompetitors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timePeriod, setTimePeriod] = useState('quarterly');

  useEffect(() => {
    const loadData = async () => {
      try {
        const { data } = await fetchCompetitors();
        setCompetitors(data);
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // Generate quarterly revenue projections based on actual competitor data
  const projectionData = useMemo(() => {
    if (competitors.length === 0) return [];
    const quarters = timePeriod === 'quarterly'
      ? ['Q1 2025', 'Q2 2025', 'Q3 2025', 'Q4 2025', 'Q1 2026', 'Q2 2026', 'Q3 2026', 'Q4 2026']
      : ['2021', '2022', '2023', '2024', '2025', '2026'];

    return quarters.map((period, idx) => {
      const entry = { period };
      competitors.forEach(comp => {
        // Simulate growth trajectory from a lower base to current revenue
        const growthFactor = timePeriod === 'quarterly'
          ? 0.6 + (idx / (quarters.length - 1)) * 0.5 + (Math.sin(idx * 0.8) * 0.05)
          : 0.3 + (idx / (quarters.length - 1)) * 0.8;
        entry[comp.name] = Math.round(comp.revenue * growthFactor * 10) / 10;
      });
      return entry;
    });
  }, [competitors, timePeriod]);

  // Build technology heatmap data from actual competitor tech stacks
  const techHeatmap = useMemo(() => {
    if (competitors.length === 0) return { allTechs: [], data: [] };
    const techSet = new Set();
    competitors.forEach(c => c.techStack.forEach(t => techSet.add(t)));
    const allTechs = Array.from(techSet).sort();

    const data = competitors.map(comp => ({
      name: comp.name,
      techs: allTechs.map(tech => ({
        name: tech,
        has: comp.techStack.includes(tech)
      }))
    }));

    return { allTechs, data };
  }, [competitors]);

  // Market growth indicators
  const growthIndicators = useMemo(() => {
    if (competitors.length === 0) return [];
    const totalRevenue = competitors.reduce((s, c) => s + c.revenue, 0);
    const totalFarmers = competitors.reduce((s, c) => s + (c.adoptionMetrics?.activeFarmers || 0), 0);
    const totalAcreage = competitors.reduce((s, c) => s + (c.adoptionMetrics?.acreageCovered || 0), 0);
    const avgTechCount = competitors.length > 0
      ? (competitors.reduce((s, c) => s + c.techStack.length, 0) / competitors.length).toFixed(1)
      : 0;

    return [
      { label: 'Total Market Revenue', value: totalRevenue, suffix: 'M', prefix: '$', growth: '+18.4%', icon: <FiTrendingUp /> },
      { label: 'Active Farmers Served', value: totalFarmers, suffix: '', prefix: '', growth: '+24.2%', icon: <FiActivity /> },
      { label: 'Acreage Covered', value: totalAcreage, suffix: 'M', prefix: '', growth: '+12.7%', icon: <FiLayers /> },
      { label: 'Avg Technologies', value: Number(avgTechCount), suffix: '', prefix: '', growth: '+3.1', icon: <FiCalendar />, decimals: 1 },
    ];
  }, [competitors]);

  const CHART_COLORS = ['#10b981', '#06b6d4', '#8b5cf6', '#f59e0b', '#ef4444', '#ec4899', '#6366f1', '#14b8a6'];

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
            {entry.name}: ${entry.value}M
          </p>
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="animate-fade-in">
        <div className="page-header">
          <div className="skeleton skeleton-line" style={{ height: 28, width: 220, marginBottom: 8 }} />
          <div className="skeleton skeleton-line" style={{ height: 16, width: 340 }} />
        </div>
        <div className="kpi-grid" style={{ marginBottom: 24 }}>
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="skeleton-card">
              <div className="skeleton skeleton-line sm" style={{ marginBottom: 12 }} />
              <div className="skeleton skeleton-line lg" style={{ marginBottom: 6 }} />
              <div className="skeleton skeleton-line md" />
            </div>
          ))}
        </div>
        <div className="skeleton-card" style={{ height: 400 }} />
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">Market Trends</h1>
        <p className="page-subtitle">Revenue projections, technology adoption patterns, and growth analytics.</p>
      </div>

      {/* Growth Indicator Cards */}
      <div className="kpi-grid">
        {growthIndicators.map((item, i) => (
          <div key={item.label} className={`glass-card kpi-card animate-slide-up delay-${i + 1}`}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div className="kpi-label">{item.label}</div>
                <div className="kpi-value">
                  <AnimatedCounter end={item.value} prefix={item.prefix} suffix={item.suffix} decimals={item.decimals || 0} />
                </div>
                <div className="kpi-subtext" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span className="growth-badge positive">{item.growth}</span>
                  <span style={{ color: 'var(--text-tertiary)', fontSize: '0.72rem' }}>vs last year</span>
                </div>
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
                {item.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue Projections Chart */}
      <div className="glass-card chart-card animate-slide-up delay-5" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div className="chart-card-title" style={{ margin: 0 }}>Revenue Projections</div>
          <div className="toggle-group">
            <button
              className={`toggle-btn ${timePeriod === 'quarterly' ? 'active' : ''}`}
              onClick={() => setTimePeriod('quarterly')}
            >
              Quarterly
            </button>
            <button
              className={`toggle-btn ${timePeriod === 'yearly' ? 'active' : ''}`}
              onClick={() => setTimePeriod('yearly')}
            >
              Yearly
            </button>
          </div>
        </div>
        <div style={{ height: 360 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={projectionData} margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
              <defs>
                {competitors.map((comp, idx) => (
                  <linearGradient key={comp._id} id={`gradient-${idx}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={CHART_COLORS[idx % CHART_COLORS.length]} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={CHART_COLORS[idx % CHART_COLORS.length]} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148,163,184,0.06)" />
              <XAxis dataKey="period" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ color: '#94a3b8', fontSize: '0.8rem' }} />
              {competitors.map((comp, idx) => (
                <Area
                  key={comp._id}
                  type="monotone"
                  dataKey={comp.name}
                  stroke={CHART_COLORS[idx % CHART_COLORS.length]}
                  fill={`url(#gradient-${idx})`}
                  strokeWidth={2}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Technology Adoption Heatmap */}
      <div className="glass-card animate-slide-up delay-6" style={{ padding: 24 }}>
        <div className="chart-card-title">Technology Adoption Matrix</div>
        {techHeatmap.allTechs.length > 0 ? (
          <div className="heatmap-container">
            {/* Header Row */}
            <div className="heatmap-row heatmap-header">
              <div className="heatmap-label" />
              {techHeatmap.allTechs.map(tech => (
                <div key={tech} className="heatmap-col-header">{tech}</div>
              ))}
            </div>
            {/* Data Rows */}
            {techHeatmap.data.map((comp, ri) => (
              <div key={comp.name} className={`heatmap-row animate-slide-up delay-${Math.min(ri + 1, 6)}`}>
                <div className="heatmap-label">{comp.name}</div>
                {comp.techs.map((tech) => (
                  <div
                    key={tech.name}
                    className={`heatmap-cell ${tech.has ? 'active' : 'inactive'}`}
                    title={`${comp.name} — ${tech.name}: ${tech.has ? 'Yes' : 'No'}`}
                  >
                    {tech.has ? '✓' : '—'}
                  </div>
                ))}
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state" style={{ padding: 32 }}>
            <div className="empty-state-title">No technology data available</div>
            <div className="empty-state-subtitle">Add competitors with tech stacks to see the adoption matrix.</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketTrends;
