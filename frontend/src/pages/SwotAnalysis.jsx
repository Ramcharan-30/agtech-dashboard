import { useState, useEffect } from 'react';
import { fetchCompetitors, generateSwotAnalysis } from '../services/api';
import { FiTarget, FiAlertTriangle, FiTrendingUp, FiShieldOff } from 'react-icons/fi';

const SwotAnalysis = () => {
  const [competitors, setCompetitors] = useState([]);
  const [compOne, setCompOne] = useState('');
  const [compTwo, setCompTwo] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch the list of companies to populate our dropdown menus
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

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Comparative SWOT Engine</h2>
        <p className="text-slate-600">Automated strategic analysis of AgTech market leaders.</p>
      </div>

      {/* Control Panel */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1 w-full">
          <label className="block text-sm font-medium text-slate-700 mb-1">Competitor 1</label>
          <select 
            className="w-full border border-slate-300 rounded-md p-2 focus:ring-brand-500 focus:border-brand-500 bg-white"
            value={compOne}
            onChange={(e) => setCompOne(e.target.value)}
          >
            <option value="">Select a company...</option>
            {competitors.map(c => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="flex-1 w-full">
          <label className="block text-sm font-medium text-slate-700 mb-1">Competitor 2</label>
          <select 
            className="w-full border border-slate-300 rounded-md p-2 focus:ring-brand-500 focus:border-brand-500 bg-white"
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
          className="w-full md:w-auto bg-brand-600 hover:bg-brand-700 text-white font-medium py-2 px-6 rounded-md transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Analyzing...' : 'Generate Report'}
        </button>
      </div>

      {error && <div className="text-red-600 bg-red-50 p-3 rounded-md">{error}</div>}

      {/* 2x2 Strategy Grid */}
      {analysis && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* Strengths */}
          <div className="bg-emerald-50/50 p-6 rounded-lg border border-emerald-100">
            <div className="flex items-center gap-2 mb-4 text-emerald-800">
              <FiTarget className="text-xl" />
              <h3 className="text-lg font-bold">Strengths</h3>
            </div>
            <ul className="space-y-3">
              {analysis.swot.strengths.map((item, idx) => (
                <li key={idx} className="text-emerald-900 text-sm leading-relaxed flex items-start gap-2">
                  <span className="text-emerald-500 mt-1">•</span> {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Weaknesses */}
          <div className="bg-rose-50/50 p-6 rounded-lg border border-rose-100">
            <div className="flex items-center gap-2 mb-4 text-rose-800">
              <FiShieldOff className="text-xl" />
              <h3 className="text-lg font-bold">Weaknesses</h3>
            </div>
            <ul className="space-y-3">
              {analysis.swot.weaknesses.map((item, idx) => (
                <li key={idx} className="text-rose-900 text-sm leading-relaxed flex items-start gap-2">
                  <span className="text-rose-500 mt-1">•</span> {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Opportunities */}
          <div className="bg-blue-50/50 p-6 rounded-lg border border-blue-100">
            <div className="flex items-center gap-2 mb-4 text-blue-800">
              <FiTrendingUp className="text-xl" />
              <h3 className="text-lg font-bold">Opportunities</h3>
            </div>
            <ul className="space-y-3">
              {analysis.swot.opportunities.map((item, idx) => (
                <li key={idx} className="text-blue-900 text-sm leading-relaxed flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span> {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Threats */}
          <div className="bg-amber-50/50 p-6 rounded-lg border border-amber-100">
            <div className="flex items-center gap-2 mb-4 text-amber-800">
              <FiAlertTriangle className="text-xl" />
              <h3 className="text-lg font-bold">Threats</h3>
            </div>
            <ul className="space-y-3">
              {analysis.swot.threats.map((item, idx) => (
                <li key={idx} className="text-amber-900 text-sm leading-relaxed flex items-start gap-2">
                  <span className="text-amber-500 mt-1">•</span> {item}
                </li>
              ))}
            </ul>
          </div>

        </div>
      )}
    </div>
  );
};

export default SwotAnalysis;