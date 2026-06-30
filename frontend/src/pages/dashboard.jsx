import { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { fetchCompetitors } from '../services/api';

const Dashboard = () => {
  const [competitors, setCompetitors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Fetch data when the component mounts
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
    return <div className="p-8 text-slate-500 font-medium">Loading market intelligence...</div>;
  }

  // 2. Format data specifically for Recharts
  const chartData = competitors.map(comp => ({
    name: comp.name,
    Revenue: comp.revenue,
    MarketShare: comp.marketShare
  }));

  // Brand colors matching our Tailwind config
  const COLORS = ['#0284c7', '#0c4a6e', '#38bdf8', '#7dd3fc'];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Market Overview</h2>
        <p className="text-slate-600">High-level comparison of AgTech industry leaders.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Market Share Pie Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Market Share Distribution (%)</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="MarketShare"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Bar Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Annual Revenue (Millions USD)</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: '#f8fafc' }} />
                <Legend />
                <Bar dataKey="Revenue" fill="#0284c7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;