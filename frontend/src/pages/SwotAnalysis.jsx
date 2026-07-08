import { useState, useEffect } from 'react';
import { fetchCompetitors, generateSwotAnalysis } from '../services/api';
import { FiTarget, FiAlertTriangle, FiTrendingUp, FiShieldOff, FiZap, FiDownload, FiDollarSign, FiUsers } from 'react-icons/fi';

const SwotAnalysis = () => {
  const [competitors, setCompetitors] = useState([]);
  const [compOne, setCompOne] = useState('');
  const [compTwo, setCompTwo] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadCompetitors = async () => {
      try {
        const { data } = await fetchCompetitors();
        setCompetitors(data);
      } catch (err) {
        console.error("Failed to load competitors", err);
      }
    };
    loadCompetitors();
  }, []);

  const handleGenerate = async () => {
    if (!compOne || !compTwo) {
      setError('Please select two competitors to compare.');
      return;
    }
    if (compOne === compTwo) {
      setError('Please select two different competitors.');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const { data } = await generateSwotAnalysis(compOne, compTwo);
      setAnalysis(data);
    } catch (err) {
      setError('Failed to generate analysis. Ensure the backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    if (!analysis) return;
    const blob = new Blob([JSON.stringify(analysis, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `swot-analysis-${analysis.targetCompanies?.join('-') || 'report'}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Get full competitor objects for comparison header
  const comp1Data = competitors.find(c => c._id === compOne);
  const comp2Data = competitors.find(c => c._id === compTwo);

  return (
    <div className="animate-fade-in" style={{ maxWidth: 1100, margin: '0 auto' }}>
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">Comparative SWOT Engine</h1>
        <p className="page-subtitle">Automated strategic analysis of AgTech market leaders.</p>
      </div>

      {/* Control Panel */}
      <div className="glass-card-static animate-slide-up delay-1" style={{ padding: '24px', marginBottom: '24px' }}>
        <div style={{
          display: 'flex',
          gap: '16px',
          alignItems: 'flex-end',
          flexWrap: 'wrap',
        }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <label className="input-label">Competitor 1</label>
            <select
              className="input-field"
              value={compOne}
              onChange={(e) => setCompOne(e.target.value)}
            >
              <option value="">Select a company...</option>
              {competitors.map(c => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 36,
            height: 36,
            marginBottom: 2,
            borderRadius: '50%',
            background: 'var(--accent-glow)',
            color: 'var(--text-accent)',
            fontSize: '0.85rem',
            flexShrink: 0,
          }}>
            vs
          </div>

          <div style={{ flex: 1, minWidth: 200 }}>
            <label className="input-label">Competitor 2</label>
            <select
              className="input-field"
              value={compTwo}
              onChange={(e) => setCompTwo(e.target.value)}
            >
              <option value="">Select a company...</option>
              {competitors.map(c => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="btn-primary"
            style={{ minWidth: 160 }}
          >
            <FiZap />
            {isLoading ? 'Analyzing...' : 'Generate Report'}
          </button>
        </div>
      </div>

      {error && <div className="error-alert animate-scale-in" style={{ marginBottom: 24 }}>{error}</div>}

      {/* Comparison Summary Header */}
      {analysis && comp1Data && comp2Data && (
        <div className="comparison-header glass-card-static animate-slide-up delay-1" style={{ marginBottom: 24 }}>
          <div className="comparison-side">
            <div className="comparison-avatar">{comp1Data.name.charAt(0)}</div>
            <div className="comparison-name">{comp1Data.name}</div>
            <div className="comparison-stats">
              <div className="comparison-stat">
                <FiDollarSign style={{ fontSize: '0.8rem' }} />
                ${comp1Data.revenue}M
              </div>
              <div className="comparison-stat">
                <FiTrendingUp style={{ fontSize: '0.8rem' }} />
                {comp1Data.marketShare}%
              </div>
              <div className="comparison-stat">
                <FiUsers style={{ fontSize: '0.8rem' }} />
                {comp1Data.adoptionMetrics?.activeFarmers || 0}
              </div>
            </div>
          </div>
          <div className="comparison-vs">VS</div>
          <div className="comparison-side">
            <div className="comparison-avatar alt">{comp2Data.name.charAt(0)}</div>
            <div className="comparison-name">{comp2Data.name}</div>
            <div className="comparison-stats">
              <div className="comparison-stat">
                <FiDollarSign style={{ fontSize: '0.8rem' }} />
                ${comp2Data.revenue}M
              </div>
              <div className="comparison-stat">
                <FiTrendingUp style={{ fontSize: '0.8rem' }} />
                {comp2Data.marketShare}%
              </div>
              <div className="comparison-stat">
                <FiUsers style={{ fontSize: '0.8rem' }} />
                {comp2Data.adoptionMetrics?.activeFarmers || 0}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!analysis && !isLoading && (
        <div className="glass-card-static animate-slide-up delay-2">
          <div className="empty-state">
            <div className="empty-state-icon">⚡</div>
            <div className="empty-state-title">Ready to Analyze</div>
            <div className="empty-state-subtitle">Select two competitors above and generate a strategic SWOT comparison.</div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="swot-grid animate-fade-in">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="skeleton-card" style={{ padding: 24 }}>
              <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
                <div className="skeleton" style={{ width: 36, height: 36, borderRadius: 'var(--radius-sm)' }} />
                <div className="skeleton skeleton-line md" style={{ alignSelf: 'center' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div className="skeleton skeleton-line" style={{ height: 14, width: '90%' }} />
                <div className="skeleton skeleton-line" style={{ height: 14, width: '75%' }} />
                <div className="skeleton skeleton-line" style={{ height: 14, width: '85%' }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SWOT Results Grid */}
      {analysis && (
        <>
          {/* Export Button */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
            <button className="btn-secondary" onClick={handleExport}>
              <FiDownload /> Export Report
            </button>
          </div>

          <div className="swot-grid">
            {/* Strengths */}
            <div className="swot-card strengths animate-scale-in delay-1">
              <div className="swot-card-header">
                <div className="swot-card-icon"><FiTarget /></div>
                <div className="swot-card-title">Strengths</div>
              </div>
              <ul className="swot-list">
                {analysis.swot.strengths.map((item, idx) => (
                  <li key={idx} className="swot-list-item">
                    <span className="swot-list-dot" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Weaknesses */}
            <div className="swot-card weaknesses animate-scale-in delay-2">
              <div className="swot-card-header">
                <div className="swot-card-icon"><FiShieldOff /></div>
                <div className="swot-card-title">Weaknesses</div>
              </div>
              <ul className="swot-list">
                {analysis.swot.weaknesses.map((item, idx) => (
                  <li key={idx} className="swot-list-item">
                    <span className="swot-list-dot" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Opportunities */}
            <div className="swot-card opportunities animate-scale-in delay-3">
              <div className="swot-card-header">
                <div className="swot-card-icon"><FiTrendingUp /></div>
                <div className="swot-card-title">Opportunities</div>
              </div>
              <ul className="swot-list">
                {analysis.swot.opportunities.map((item, idx) => (
                  <li key={idx} className="swot-list-item">
                    <span className="swot-list-dot" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Threats */}
            <div className="swot-card threats animate-scale-in delay-4">
              <div className="swot-card-header">
                <div className="swot-card-icon"><FiAlertTriangle /></div>
                <div className="swot-card-title">Threats</div>
              </div>
              <ul className="swot-list">
                {analysis.swot.threats.map((item, idx) => (
                  <li key={idx} className="swot-list-item">
                    <span className="swot-list-dot" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SwotAnalysis;