import { useState, useEffect } from 'react';
import { fetchCompetitors, createCompetitor } from '../services/api';
import { FiPlus } from 'react-icons/fi';

const Competitors = () => {
  const [competitors, setCompetitors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    marketShare: '',
    revenue: '',
    businessModel: 'Direct Sales',
    activeFarmers: '',
    acreageCovered: '',
    techStack: '' // We will split this string into an array on submit
  });

  const loadCompetitors = async () => {
    try {
      const { data } = await fetchCompetitors();
      setCompetitors(data);
    } catch (err) {
      console.error("Failed to load competitors", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCompetitors();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Format data to match our Mongoose Schema
      const payload = {
        name: formData.name,
        description: formData.description,
        marketShare: Number(formData.marketShare),
        revenue: Number(formData.revenue),
        businessModel: formData.businessModel,
        adoptionMetrics: {
          activeFarmers: Number(formData.activeFarmers),
          acreageCovered: Number(formData.acreageCovered)
        },
        // Convert comma-separated string to an array, trim whitespace
        techStack: formData.techStack.split(',').map(tech => tech.trim()).filter(Boolean)
      };

      await createCompetitor(payload);
      
      // Reset form and reload data
      setFormData({
        name: '', description: '', marketShare: '', revenue: '',
        businessModel: 'Direct Sales', activeFarmers: '', acreageCovered: '', techStack: ''
      });
      await loadCompetitors();
      
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add competitor.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="p-8 text-slate-500">Loading competitor data...</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Competitor Intelligence</h2>
        <p className="text-slate-600">Manage and track AgTech organizations in your database.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Form to Add New Competitor */}
        <div className="xl:col-span-1 bg-white p-6 rounded-lg shadow-sm border border-slate-200 h-fit">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <FiPlus className="text-brand-600" /> Add Organization
          </h3>
          
          {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-md">{error}</div>}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
              <input required type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full border border-slate-300 rounded-md p-2 text-sm focus:ring-brand-500 focus:border-brand-500" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <textarea required name="description" value={formData.description} onChange={handleInputChange} rows="2" className="w-full border border-slate-300 rounded-md p-2 text-sm focus:ring-brand-500 focus:border-brand-500" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Market Share (%)</label>
                <input required type="number" name="marketShare" value={formData.marketShare} onChange={handleInputChange} className="w-full border border-slate-300 rounded-md p-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Revenue ($M)</label>
                <input required type="number" name="revenue" value={formData.revenue} onChange={handleInputChange} className="w-full border border-slate-300 rounded-md p-2 text-sm" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Business Model</label>
              <select name="businessModel" value={formData.businessModel} onChange={handleInputChange} className="w-full border border-slate-300 rounded-md p-2 text-sm">
                <option value="Direct Sales">Direct Sales</option>
                <option value="Machinery-as-a-Service">Machinery-as-a-Service</option>
                <option value="B2G">B2G</option>
                <option value="Subscription">Subscription</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Active Farmers</label>
                <input type="number" name="activeFarmers" value={formData.activeFarmers} onChange={handleInputChange} className="w-full border border-slate-300 rounded-md p-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Acreage (M)</label>
                <input type="number" name="acreageCovered" value={formData.acreageCovered} onChange={handleInputChange} className="w-full border border-slate-300 rounded-md p-2 text-sm" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tech Stack (comma separated)</label>
              <input type="text" name="techStack" value={formData.techStack} onChange={handleInputChange} placeholder="IoT, Drones, AI" className="w-full border border-slate-300 rounded-md p-2 text-sm" />
            </div>

            <button type="submit" disabled={isSubmitting} className="w-full bg-brand-600 hover:bg-brand-700 text-white font-medium py-2 rounded-md transition-colors disabled:opacity-50">
              {isSubmitting ? 'Saving...' : 'Save Competitor'}
            </button>
          </form>
        </div>

        {/* Data Table */}
        <div className="xl:col-span-2 bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-sm">
                  <th className="p-4 font-medium">Organization</th>
                  <th className="p-4 font-medium">Model</th>
                  <th className="p-4 font-medium">Share</th>
                  <th className="p-4 font-medium">Revenue</th>
                  <th className="p-4 font-medium">Key Tech</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {competitors.map((comp) => (
                  <tr key={comp._id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <div className="font-medium text-slate-900">{comp.name}</div>
                      <div className="text-xs text-slate-500 mt-1 line-clamp-1 max-w-xs">{comp.description}</div>
                    </td>
                    <td className="p-4 text-sm text-slate-700">{comp.businessModel}</td>
                    <td className="p-4 text-sm font-medium text-brand-600">{comp.marketShare}%</td>
                    <td className="p-4 text-sm text-slate-700">${comp.revenue}M</td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {comp.techStack.slice(0, 2).map((tech, i) => (
                          <span key={i} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full">{tech}</span>
                        ))}
                        {comp.techStack.length > 2 && <span className="text-xs text-slate-400">+{comp.techStack.length - 2}</span>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Competitors;