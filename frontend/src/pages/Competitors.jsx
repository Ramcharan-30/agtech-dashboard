import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchCompetitors, createCompetitor, deleteCompetitor as deleteCompetitorApi } from '../services/api';
import { FiPlus, FiDatabase, FiTrash2, FiChevronUp, FiChevronDown, FiExternalLink } from 'react-icons/fi';
import SearchBar from '../components/SearchBar';
import ConfirmModal from '../components/ConfirmModal';

const Competitors = () => {
  const navigate = useNavigate();
  const [competitors, setCompetitors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });

  // Delete modal state
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, competitor: null });
  const [isDeleting, setIsDeleting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    marketShare: '',
    revenue: '',
    businessModel: 'Direct Sales',
    activeFarmers: '',
    acreageCovered: '',
    techStack: ''
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
        techStack: formData.techStack.split(',').map(tech => tech.trim()).filter(Boolean)
      };

      await createCompetitor(payload);

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

  // Handle delete
  const handleDelete = async () => {
    if (!deleteModal.competitor) return;
    setIsDeleting(true);
    try {
      await deleteCompetitorApi(deleteModal.competitor._id);
      await loadCompetitors();
    } catch (err) {
      setError('Failed to delete competitor.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Sorting
  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) return <FiChevronUp style={{ opacity: 0.2 }} />;
    return sortConfig.direction === 'asc' ? <FiChevronUp /> : <FiChevronDown />;
  };

  // Filtered and sorted data
  const filteredCompetitors = useMemo(() => {
    let result = [...competitors];

    // Search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.businessModel.toLowerCase().includes(q) ||
        c.techStack.some(t => t.toLowerCase().includes(q))
      );
    }

    // Sort
    result.sort((a, b) => {
      let aVal, bVal;
      switch (sortConfig.key) {
        case 'name': aVal = a.name.toLowerCase(); bVal = b.name.toLowerCase(); break;
        case 'marketShare': aVal = a.marketShare; bVal = b.marketShare; break;
        case 'revenue': aVal = a.revenue; bVal = b.revenue; break;
        case 'businessModel': aVal = a.businessModel.toLowerCase(); bVal = b.businessModel.toLowerCase(); break;
        default: aVal = a.name; bVal = b.name;
      }
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [competitors, searchQuery, sortConfig]);

  if (isLoading) {
    return (
      <div className="animate-fade-in">
        <div className="page-header">
          <div className="skeleton skeleton-line" style={{ height: 28, width: 220, marginBottom: 8 }} />
          <div className="skeleton skeleton-line" style={{ height: 16, width: 340 }} />
        </div>
        <div className="skeleton-card" style={{ height: 400 }} />
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">Competitor Intelligence</h1>
        <p className="page-subtitle">Manage and track AgTech organizations in your database.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '20px', alignItems: 'start' }}>

        {/* Add Competitor Form */}
        <div className="glass-card-static animate-slide-up delay-1" style={{ padding: '24px' }}>
          <h3 style={{
            fontSize: '0.95rem',
            fontWeight: 600,
            color: 'var(--text-primary)',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}>
            <span style={{
              width: 28, height: 28,
              borderRadius: 'var(--radius-sm)',
              background: 'var(--accent-glow)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-accent)',
              fontSize: '0.85rem',
            }}>
              <FiPlus />
            </span>
            Add Organization
          </h3>

          {error && <div className="error-alert" style={{ marginBottom: 16 }}>{error}</div>}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label className="input-label">Company Name</label>
              <input required type="text" name="name" value={formData.name} onChange={handleInputChange} className="input-field" placeholder="e.g. CropTech AI" />
            </div>

            <div>
              <label className="input-label">Description</label>
              <textarea required name="description" value={formData.description} onChange={handleInputChange} rows="2" className="input-field" placeholder="Brief company description..." style={{ resize: 'vertical' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label className="input-label">Market Share (%)</label>
                <input required type="number" name="marketShare" value={formData.marketShare} onChange={handleInputChange} className="input-field" placeholder="0" />
              </div>
              <div>
                <label className="input-label">Revenue ($M)</label>
                <input required type="number" name="revenue" value={formData.revenue} onChange={handleInputChange} className="input-field" placeholder="0" />
              </div>
            </div>

            <div>
              <label className="input-label">Business Model</label>
              <select name="businessModel" value={formData.businessModel} onChange={handleInputChange} className="input-field">
                <option value="Direct Sales">Direct Sales</option>
                <option value="Machinery-as-a-Service">Machinery-as-a-Service</option>
                <option value="B2G">B2G</option>
                <option value="Subscription">Subscription</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label className="input-label">Active Farmers</label>
                <input type="number" name="activeFarmers" value={formData.activeFarmers} onChange={handleInputChange} className="input-field" placeholder="0" />
              </div>
              <div>
                <label className="input-label">Acreage (M)</label>
                <input type="number" name="acreageCovered" value={formData.acreageCovered} onChange={handleInputChange} className="input-field" placeholder="0" />
              </div>
            </div>

            <div>
              <label className="input-label">Tech Stack (comma separated)</label>
              <input type="text" name="techStack" value={formData.techStack} onChange={handleInputChange} placeholder="IoT, Drones, AI" className="input-field" />
            </div>

            <button type="submit" disabled={isSubmitting} className="btn-primary" style={{ width: '100%', marginTop: '4px' }}>
              {isSubmitting ? 'Saving...' : 'Save Competitor'}
            </button>
          </form>
        </div>

        {/* Data Table */}
        <div className="glass-card-static data-table-wrapper animate-slide-up delay-2">
          {/* Search Bar */}
          <div style={{ padding: '16px 18px 0 18px' }}>
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search competitors, tech, models..."
            />
          </div>

          {filteredCompetitors.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <FiDatabase />
              </div>
              <div className="empty-state-title">
                {searchQuery ? 'No matching competitors' : 'No competitors yet'}
              </div>
              <div className="empty-state-subtitle">
                {searchQuery ? 'Try adjusting your search query.' : 'Add your first organization using the form.'}
              </div>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th className="sortable-th" onClick={() => handleSort('name')}>
                      Organization <SortIcon columnKey="name" />
                    </th>
                    <th className="sortable-th" onClick={() => handleSort('businessModel')}>
                      Model <SortIcon columnKey="businessModel" />
                    </th>
                    <th className="sortable-th" onClick={() => handleSort('marketShare')}>
                      Share <SortIcon columnKey="marketShare" />
                    </th>
                    <th className="sortable-th" onClick={() => handleSort('revenue')}>
                      Revenue <SortIcon columnKey="revenue" />
                    </th>
                    <th>Key Tech</th>
                    <th style={{ width: 80, textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCompetitors.map((comp, idx) => (
                    <tr
                      key={comp._id}
                      className={`animate-slide-up delay-${Math.min(idx + 1, 6)} table-row-clickable`}
                      onClick={() => navigate(`/competitor/${comp._id}`)}
                    >
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div>
                            <div className="cell-primary">{comp.name}</div>
                            <div className="cell-description">{comp.description}</div>
                          </div>
                          <FiExternalLink style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem', opacity: 0, transition: 'opacity 0.2s' }} className="row-link-icon" />
                        </div>
                      </td>
                      <td>{comp.businessModel}</td>
                      <td className="cell-accent">{comp.marketShare}%</td>
                      <td>${comp.revenue}M</td>
                      <td>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                          {comp.techStack.slice(0, 2).map((tech, i) => (
                            <span key={i} className="badge-neutral badge">{tech}</span>
                          ))}
                          {comp.techStack.length > 2 && (
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', alignSelf: 'center' }}>
                              +{comp.techStack.length - 2}
                            </span>
                          )}
                        </div>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <button
                          className="icon-btn-danger"
                          title="Delete competitor"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteModal({ isOpen: true, competitor: comp });
                          }}
                        >
                          <FiTrash2 />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Result count */}
          {competitors.length > 0 && (
            <div style={{
              padding: '12px 18px',
              borderTop: '1px solid var(--border-subtle)',
              fontSize: '0.75rem',
              color: 'var(--text-tertiary)',
            }}>
              Showing {filteredCompetitors.length} of {competitors.length} competitors
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, competitor: null })}
        onConfirm={handleDelete}
        title="Delete Competitor"
        message={`Are you sure you want to delete "${deleteModal.competitor?.name}"? This action cannot be undone.`}
        confirmText={isDeleting ? 'Deleting...' : 'Delete'}
        isDestructive
      />
    </div>
  );
};

export default Competitors;