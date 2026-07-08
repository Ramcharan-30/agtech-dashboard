import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
  Tooltip
} from 'recharts';
import { FiArrowLeft, FiDollarSign, FiUsers, FiLayers, FiCpu, FiTrendingUp, FiGlobe } from 'react-icons/fi';
import AnimatedCounter from '../components/AnimatedCounter';
import { fetchCompetitors } from '../services/api';

const CompetitorDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [competitor, setCompetitor] = useState(null);
  const [allCompetitors, setAllCompetitors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const { data } = await fetchCompetitors();
        setAllCompetitors(data);
        const found = data.find(c => c._id === id);
        setCompetitor(found || null);
      } catch (error) {
        console.error("Failed to fetch competitor", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [id]);

  // Radar chart data: normalize metrics against the max in the dataset
  const radarData = useMemo(() => {
    if (!competitor || allCompetitors.length === 0) return [];
    const maxRevenue = Math.max(...allCompetitors.map(c => c.revenue), 1);
    const maxShare = Math.max(...allCompetitors.map(c => c.marketShare), 1);
    const maxFarmers = Math.max(...allCompetitors.map(c => c.adoptionMetrics?.activeFarmers || 0), 1);
    const maxAcreage = Math.max(...allCompetitors.map(c => c.adoptionMetrics?.acreageCovered || 0), 1);
    const maxTech = Math.max(...allCompetitors.map(c => c.techStack.length), 1);

    return [
      { metric: 'Revenue', value: Math.round((competitor.revenue / maxRevenue) * 100), fullMark: 100 },
      { metric: 'Market Share', value: Math.round((competitor.marketShare / maxShare) * 100), fullMark: 100 },
      { metric: 'Active Farmers', value: Math.round(((competitor.adoptionMetrics?.activeFarmers || 0) / maxFarmers) * 100), fullMark: 100 },
      { metric: 'Acreage', value: Math.round(((competitor.adoptionMetrics?.acreageCovered || 0) / maxAcreage) * 100), fullMark: 100 },
      { metric: 'Tech Diversity', value: Math.round((competitor.techStack.length / maxTech) * 100), fullMark: 100 },
    ];
  }, [competitor, allCompetitors]);

  // Metric cards
  const metrics = useMemo(() => {
    if (!competitor) return [];
    return [
      { label: 'Annual Revenue', value: competitor.revenue, prefix: '$', suffix: 'M', icon: <FiDollarSign />, color: '#10b981' },
      { label: 'Market Share', value: competitor.marketShare, suffix: '%', icon: <FiTrendingUp />, color: '#06b6d4' },
      { label: 'Active Farmers', value: competitor.adoptionMetrics?.activeFarmers || 0, icon: <FiUsers />, color: '#8b5cf6' },
      { label: 'Acreage Covered', value: competitor.adoptionMetrics?.acreageCovered || 0, suffix: 'M', icon: <FiLayers />, color: '#f59e0b' },
      { label: 'Technologies', value: competitor.techStack.length, icon: <FiCpu />, color: '#ef4444' },
      { label: 'Business Model', value: null, displayText: competitor.businessModel, icon: <FiGlobe />, color: '#ec4899' },
    ];
  }, [competitor]);

  // Rank among all competitors
  const rank = useMemo(() => {
    if (!competitor || allCompetitors.length === 0) return 0;
    const sorted = [...allCompetitors].sort((a, b) => b.revenue - a.revenue);
    return sorted.findIndex(c => c._id === competitor._id) + 1;
  }, [competitor, allCompetitors]);

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    return (
      <div style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-md)',
        padding: '10px 14px',
        boxShadow: 'var(--shadow-lg)',
      }}>
        <p style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.85rem' }}>
          {payload[0]?.payload?.metric}: {payload[0]?.value}%
        </p>
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
        <div className="skeleton-card" style={{ height: 500 }} />
      </div>
    );
  }

  if (!competitor) {
    return (
      <div className="animate-fade-in">
        <div className="page-header">
          <h1 className="page-title">Competitor Not Found</h1>
          <p className="page-subtitle">This competitor doesn't exist or has been removed.</p>
        </div>
        <button className="btn-primary" onClick={() => navigate('/competitors')}>
          <FiArrowLeft /> Back to Competitors
        </button>
      </div>
    );
  }

  // Tech stack color mapping
  const techColors = ['#10b981', '#06b6d4', '#8b5cf6', '#f59e0b', '#ef4444', '#ec4899', '#6366f1', '#14b8a6'];

  return (
    <div className="animate-fade-in">
      {/* Back Navigation */}
      <button
        onClick={() => navigate('/competitors')}
        className="back-button animate-slide-in-left"
      >
        <FiArrowLeft /> Back to Competitors
      </button>

      {/* Page Header */}
      <div className="page-header" style={{ marginTop: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div className="detail-avatar">
            {competitor.name.charAt(0)}
          </div>
          <div>
            <h1 className="page-title">{competitor.name}</h1>
            <p className="page-subtitle">{competitor.description}</p>
          </div>
        </div>
        <div style={{ marginTop: 10 }}>
          <span className="badge" style={{ fontSize: '0.75rem' }}>
            Rank #{rank} of {allCompetitors.length}
          </span>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="detail-metrics-grid">
        {metrics.map((m, i) => (
          <div key={m.label} className={`glass-card detail-metric-card animate-slide-up delay-${i + 1}`}>
            <div className="detail-metric-icon" style={{ background: `${m.color}20`, color: m.color }}>
              {m.icon}
            </div>
            <div className="detail-metric-label">{m.label}</div>
            <div className="detail-metric-value">
              {m.value !== null ? (
                <AnimatedCounter end={m.value} prefix={m.prefix || ''} suffix={m.suffix || ''} />
              ) : (
                m.displayText
              )}
            </div>
            {/* Progress bar relative to max */}
            {m.value !== null && (
              <div className="detail-metric-progress">
                <div
                  className="detail-metric-progress-fill animate-grow-width"
                  style={{
                    width: `${Math.min((m.value / Math.max(...allCompetitors.map(c => {
                      if (m.label === 'Annual Revenue') return c.revenue;
                      if (m.label === 'Market Share') return c.marketShare;
                      if (m.label === 'Active Farmers') return c.adoptionMetrics?.activeFarmers || 0;
                      if (m.label === 'Acreage Covered') return c.adoptionMetrics?.acreageCovered || 0;
                      if (m.label === 'Technologies') return c.techStack.length;
                      return 1;
                    }), 1)) * 100, 100)}%`,
                    background: m.color,
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="chart-grid" style={{ marginTop: 20 }}>
        {/* Radar Chart */}
        <div className="glass-card chart-card animate-slide-up delay-5">
          <div className="chart-card-title">Performance Radar</div>
          <div style={{ height: 340 }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(148,163,184,0.1)" />
                <PolarAngleAxis dataKey="metric" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Radar
                  name={competitor.name}
                  dataKey="value"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="glass-card chart-card animate-slide-up delay-6">
          <div className="chart-card-title">Technology Stack</div>
          <div className="tech-grid">
            {competitor.techStack.length > 0 ? (
              competitor.techStack.map((tech, idx) => (
                <div
                  key={tech}
                  className={`tech-card animate-scale-in delay-${Math.min(idx + 1, 6)}`}
                  style={{ borderColor: `${techColors[idx % techColors.length]}40` }}
                >
                  <div
                    className="tech-card-dot"
                    style={{ background: techColors[idx % techColors.length] }}
                  />
                  <span>{tech}</span>
                </div>
              ))
            ) : (
              <div className="empty-state" style={{ padding: 32, gridColumn: '1 / -1' }}>
                <div className="empty-state-title">No technologies listed</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompetitorDetail;
