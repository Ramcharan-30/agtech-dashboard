import { useState, useEffect, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ScatterChart, Scatter, ZAxis, PieChart, Pie, Cell, Legend
} from 'recharts';
import { FiBarChart2, FiTarget, FiBox, FiHash } from 'react-icons/fi';
import AnimatedCounter from '../components/AnimatedCounter';
import { fetchCompetitors } from '../services/api';

const Analytics = () => {
  const [competitors, setCompetitors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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

  // Statistical summaries
  const stats = useMemo(() => {
    if (competitors.length === 0) return null;
    const revenues = competitors.map(c => c.revenue).sort((a, b) => a - b);
    const shares = competitors.map(c => c.marketShare).sort((a, b) => a - b);
    const n = revenues.length;

    const median = n % 2 === 0
      ? (revenues[n / 2 - 1] + revenues[n / 2]) / 2
      : revenues[Math.floor(n / 2)];

    const mean = revenues.reduce((s, v) => s + v, 0) / n;
    const stdDev = Math.sqrt(revenues.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / n);

    return {
      medianRevenue: median,
      stdDevRevenue: Math.round(stdDev * 10) / 10,
      minRevenue: revenues[0],
      maxRevenue: revenues[n - 1],
      totalMarketShare: shares.reduce((s, v) => s + v, 0),
      competitorCount: n,
    };
  }, [competitors]);

  // Scatter plot data: Revenue vs Market Share
  const scatterData = useMemo(() => {
    return competitors.map(c => ({
      name: c.name,
      revenue: c.revenue,
      marketShare: c.marketShare,
      farmers: c.adoptionMetrics?.activeFarmers || 100,
    }));
  }, [competitors]);

  // Business model distribution
  const modelDistribution = useMemo(() => {
    const counts = {};
    competitors.forEach(c => {
      counts[c.businessModel] = (counts[c.businessModel] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [competitors]);

  // Top technologies ranking
  const techRanking = useMemo(() => {
    const counts = {};
    competitors.forEach(c => {
      c.techStack.forEach(tech => {
        counts[tech] = (counts[tech] || 0) + 1;
      });
    });
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count, percentage: Math.round((count / competitors.length) * 100) }))
      .sort((a, b) => b.count - a.count);
  }, [competitors]);

  const COLORS = ['#10b981', '#06b6d4', '#8b5cf6', '#f59e0b', '#ef4444', '#ec4899'];

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
        <p style={{ color: 'var(--text-primary)', fontWeight: 600, marginBottom: 4, fontSize: '0.85rem' }}>
          {label || payload[0]?.payload?.name}
        </p>
        {payload.map((entry, idx) => (
          <p key={idx} style={{ color: entry.color || '#94a3b8', fontSize: '0.8rem', margin: '2px 0' }}>
            {entry.name}: {entry.value}{entry.name === 'marketShare' ? '%' : entry.name === 'revenue' ? 'M' : ''}
          </p>
        ))}
      </div>
    );
  };

  const ScatterTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const data = payload[0]?.payload;
    return (
      <div style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-md)',
        padding: '12px 16px',
        boxShadow: 'var(--shadow-lg)',
      }}>
        <p style={{ color: 'var(--text-primary)', fontWeight: 600, marginBottom: 4, fontSize: '0.85rem' }}>{data?.name}</p>
        <p style={{ color: '#10b981', fontSize: '0.8rem', margin: '2px 0' }}>Revenue: ${data?.revenue}M</p>
        <p style={{ color: '#06b6d4', fontSize: '0.8rem', margin: '2px 0' }}>Market Share: {data?.marketShare}%</p>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="animate-fade-in">
        <div className="page-header">
          <div className="skeleton skeleton-line" style={{ height: 28, width: 200, marginBottom: 8 }} />
          <div className="skeleton skeleton-line" style={{ height: 16, width: 320 }} />
        </div>
        <div className="chart-grid">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="skeleton-card" style={{ height: 300 }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">Advanced Analytics</h1>
        <p className="page-subtitle">Deep statistical insights and correlations across the AgTech landscape.</p>
      </div>

      {/* Stats Summary Cards */}
      {stats && (
        <div className="kpi-grid">
          <div className="glass-card kpi-card animate-slide-up delay-1">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div className="kpi-label">Median Revenue</div>
                <div className="kpi-value"><AnimatedCounter end={stats.medianRevenue} prefix="$" suffix="M" /></div>
                <div className="kpi-subtext">Central tendency</div>
              </div>
              <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: 'var(--accent-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-accent)', fontSize: '1.1rem' }}><FiBarChart2 /></div>
            </div>
          </div>
          <div className="glass-card kpi-card animate-slide-up delay-2">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div className="kpi-label">Std Deviation</div>
                <div className="kpi-value"><AnimatedCounter end={stats.stdDevRevenue} prefix="±$" suffix="M" decimals={1} /></div>
                <div className="kpi-subtext">Revenue spread</div>
              </div>
              <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: 'rgba(139, 92, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a78bfa', fontSize: '1.1rem' }}><FiTarget /></div>
            </div>
          </div>
          <div className="glass-card kpi-card animate-slide-up delay-3">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div className="kpi-label">Revenue Range</div>
                <div className="kpi-value" style={{ fontSize: '1.3rem' }}>${stats.minRevenue}M — ${stats.maxRevenue}M</div>
                <div className="kpi-subtext">Min to Max</div>
              </div>
              <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: 'rgba(6, 182, 212, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#22d3ee', fontSize: '1.1rem' }}><FiBox /></div>
            </div>
          </div>
          <div className="glass-card kpi-card animate-slide-up delay-4">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div className="kpi-label">Total Coverage</div>
                <div className="kpi-value"><AnimatedCounter end={stats.totalMarketShare} suffix="%" /></div>
                <div className="kpi-subtext">Combined market share</div>
              </div>
              <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fbbf24', fontSize: '1.1rem' }}><FiHash /></div>
            </div>
          </div>
        </div>
      )}

      {/* Charts Grid */}
      <div className="chart-grid">
        {/* Scatter Plot: Revenue vs Market Share */}
        <div className="glass-card chart-card animate-slide-up delay-5">
          <div className="chart-card-title">Revenue vs Market Share Correlation</div>
          <div style={{ height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 30, bottom: 10, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.06)" />
                <XAxis
                  type="number" dataKey="revenue" name="Revenue ($M)"
                  axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }}
                  label={{ value: 'Revenue ($M)', position: 'bottom', offset: -5, fill: '#64748b', fontSize: 11 }}
                />
                <YAxis
                  type="number" dataKey="marketShare" name="Market Share (%)"
                  axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }}
                  label={{ value: 'Share (%)', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 11 }}
                />
                <ZAxis type="number" dataKey="farmers" range={[80, 400]} name="Farmers" />
                <Tooltip content={<ScatterTooltip />} />
                <Scatter data={scatterData} fill="#10b981" strokeWidth={1} stroke="#059669" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Business Model Distribution */}
        <div className="glass-card chart-card animate-slide-up delay-6">
          <div className="chart-card-title">Business Model Distribution</div>
          <div style={{ height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={modelDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={4}
                  dataKey="value"
                  stroke="none"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {modelDistribution.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ color: '#94a3b8', fontSize: '0.8rem' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Technology Ranking */}
      <div className="glass-card animate-slide-up delay-5" style={{ padding: 24, marginTop: 20 }}>
        <div className="chart-card-title">Technology Adoption Ranking</div>
        {techRanking.length > 0 ? (
          <div className="tech-ranking-list">
            {techRanking.map((tech, idx) => (
              <div key={tech.name} className={`tech-rank-item animate-slide-up delay-${Math.min(idx + 1, 6)}`}>
                <div className="tech-rank-info">
                  <span className="tech-rank-position">#{idx + 1}</span>
                  <span className="tech-rank-name">{tech.name}</span>
                  <span className="tech-rank-count">{tech.count} {tech.count === 1 ? 'company' : 'companies'}</span>
                </div>
                <div className="tech-rank-bar-bg">
                  <div
                    className="tech-rank-bar-fill animate-grow-width"
                    style={{
                      width: `${tech.percentage}%`,
                      background: COLORS[idx % COLORS.length],
                      animationDelay: `${idx * 0.1}s`,
                    }}
                  />
                </div>
                <span className="tech-rank-pct">{tech.percentage}%</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state" style={{ padding: 32 }}>
            <div className="empty-state-title">No technology data available</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;
