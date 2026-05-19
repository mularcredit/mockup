import { useEffect, useState } from 'react';
import { BranchCard } from './BranchCard';
import { jobPositions } from '../constants/jobPositions';
import { StatusBadge } from '../StatusBadge';
import GlowButton from '../../../UI/GlowButton';
import { Edit, Save, X, Plus } from 'lucide-react';
import { supabase } from '../../../../lib/supabase';
import toast from 'react-hot-toast';

interface KenyaOfficeLocation {
  id: string;
  name: string;
  location: string;
  hiring_status: string;
  total_positions?: number;
  critically_needed?: number;
  urgent_positions?: number;
  contact_email?: string;
  contact_phone?: string;
  address?: string;
  town?: string;
  county?: string;
  country?: string;
  is_active?: boolean;
  created_at: string;
}

export const BranchesSection = () => {
  const [kenyaOfficeLocations, setKenyaOfficeLocations] = useState<KenyaOfficeLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<KenyaOfficeLocation>>({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [newOffice, setNewOffice] = useState<Partial<KenyaOfficeLocation>>({
    hiring_status: 'active',
    country: 'Kenya',
    is_active: true
  });

  // Fetch Kenya office locations from Supabase
  const fetchKenyaOfficeLocations = async () => {
    try {
      setLoading(true);
      setError(null);
 
      const { data, error: supabaseError } = await supabase
        .from('kenya_office_locations')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (supabaseError) {
        throw supabaseError;
      }

      setKenyaOfficeLocations(data || []);
    } catch (err) {
      console.error('Error fetching Kenya office locations:', err);
      setError('Failed to load office locations data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKenyaOfficeLocations();
  }, []);

  // Start editing an office
  const startEditing = (office: KenyaOfficeLocation) => {
    setEditingId(office.id);
    setEditForm({ ...office });
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingId(null);
    setEditForm({});
  };

  // Save edited office
  const saveEdit = async () => {
    if (!editingId) return;

    try {
      const { error } = await supabase
        .from('kenya_office_locations')
        .update(editForm)
        .eq('id', editingId);

      if (error) throw error;

      // Refresh the data
      await fetchKenyaOfficeLocations();
      setEditingId(null);
      setEditForm({});
      toast.success('Office updated successfully!');
    } catch (err) {
      console.error('Error updating office:', err);
      toast.error('Failed to update office');
    }
  };

  // Add new office
  const addNewOffice = async () => {
    try {
      const { error } = await supabase
        .from('kenya_office_locations')
        .insert([newOffice]);

      if (error) throw error;

      // Refresh the data
      await fetchKenyaOfficeLocations();
      setShowAddForm(false);
      setNewOffice({
        hiring_status: 'active',
        country: 'Kenya',
        is_active: true
      });
      toast.success('Office added successfully!');
    } catch (err) {
      console.error('Error adding office:', err);
      toast.error('Failed to add office');
    }
  };

  // Calculate position counts for each location
  const getLocationStats = (locationId: string) => {
    const locationPositions = jobPositions.filter(p => p.branch === locationId);
    const criticalPositions = locationPositions.filter(p => p.status === 'Critically Needed').length;
    const urgentPositions = locationPositions.filter(p => p.status === 'Urgent').length;
    
    return {
      total: locationPositions.length,
      critical: criticalPositions,
      urgent: urgentPositions
    };
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--p)]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[var(--card)] rounded-xl border border-[var(--p-line)] p-6">
        <div className="text-center">
          <p className="text-red-400 mb-4 text-xs font-semibold">{error}</p>
          <GlowButton onClick={fetchKenyaOfficeLocations} size="sm">
            Retry
          </GlowButton>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Grid of branch cards */}
      <div className="bg-[var(--card)] rounded-xl border border-[var(--p-line)] p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-base font-bold text-white tracking-wide">Kenya Office Hiring Needs</h2>
          <div className="flex gap-2">
            <GlowButton onClick={fetchKenyaOfficeLocations} size="sm" variant="secondary">
              Refresh
            </GlowButton>
            <GlowButton 
              onClick={() => setShowAddForm(true)} 
              icon={Plus} 
              size="sm"
            >
              Add Office
            </GlowButton>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {kenyaOfficeLocations.map((location) => {
            return (
              <BranchCard 
                key={location.id} 
                branch={location} 
                positions={jobPositions.filter((p) => p.branch === location.id)} 
              />
            );
          })}
        </div>
        
        {kenyaOfficeLocations.length === 0 && (
          <div className="text-center py-8">
            <p className="text-[var(--t3)] text-xs">No office locations found</p>
          </div>
        )}
      </div>

      {/* Table view */}
      <div className="bg-[var(--card)] rounded-xl border border-[var(--p-line)] p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-base font-bold text-white tracking-wide">Kenya Office Hiring Status</h2>
          <GlowButton onClick={fetchKenyaOfficeLocations} size="sm" variant="secondary">
            Refresh
          </GlowButton>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[var(--p-line)]">
                <th className="text-left py-3.5 px-4 text-[var(--t3)] font-bold uppercase tracking-wider bg-[var(--p-dim)]/20">Office</th>
                <th className="text-left py-3.5 px-4 text-[var(--t3)] font-bold uppercase tracking-wider bg-[var(--p-dim)]/20">Location</th>
                <th className="text-left py-3.5 px-4 text-[var(--t3)] font-bold uppercase tracking-wider bg-[var(--p-dim)]/20">County</th>
                <th className="text-left py-3.5 px-4 text-[var(--t3)] font-bold uppercase tracking-wider bg-[var(--p-dim)]/20">Hiring Status</th>
                <th className="text-right py-3.5 px-4 text-[var(--t3)] font-bold uppercase tracking-wider bg-[var(--p-dim)]/20">Total Positions</th>
                <th className="text-right py-3.5 px-4 text-[var(--t3)] font-bold uppercase tracking-wider bg-[var(--p-dim)]/20">Critically Needed</th>
                <th className="text-right py-3.5 px-4 text-[var(--t3)] font-bold uppercase tracking-wider bg-[var(--p-dim)]/20">Urgent</th>
                <th className="text-center py-3.5 px-4 text-[var(--t3)] font-bold uppercase tracking-wider bg-[var(--p-dim)]/20">Actions</th>
              </tr>
            </thead>
            <tbody>
              {kenyaOfficeLocations.map((location) => {
                const stats = getLocationStats(location.id);
                const isEditing = editingId === location.id;
                
                return (
                  <tr key={location.id} className="border-b border-[var(--p-line)] hover:bg-[var(--p-dim)]/10 transition-colors">
                    <td className="py-4 px-4">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editForm.name || ''}
                          onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                          className="w-full bg-[var(--card)] border border-[var(--p-line)] text-white rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-[var(--p)]"
                        />
                      ) : (
                        <p className="text-white font-bold">{location.name}</p>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editForm.town || ''}
                          onChange={(e) => setEditForm({...editForm, town: e.target.value})}
                          className="w-full bg-[var(--card)] border border-[var(--p-line)] text-white rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-[var(--p)]"
                          placeholder="Town"
                        />
                      ) : (
                        <p className="text-[var(--t3)] font-medium">{location.town || location.location}</p>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editForm.county || ''}
                          onChange={(e) => setEditForm({...editForm, county: e.target.value})}
                          className="w-full bg-[var(--card)] border border-[var(--p-line)] text-white rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-[var(--p)]"
                          placeholder="County"
                        />
                      ) : (
                        <p className="text-[var(--t3)] font-medium">{location.county}</p>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      {isEditing ? (
                        <select
                          value={editForm.hiring_status || ''}
                          onChange={(e) => setEditForm({...editForm, hiring_status: e.target.value})}
                          className="w-full bg-[var(--card)] border border-[var(--p-line)] text-white rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-[var(--p)]"
                        >
                          <option value="active">Active</option>
                          <option value="actively-hiring">Actively Hiring</option>
                          <option value="selective-hiring">Selective Hiring</option>
                          <option value="not-hiring">Not Hiring</option>
                        </select>
                      ) : (
                        <StatusBadge status={location.hiring_status} />
                      )}
                    </td>
                    <td className="py-4 px-4 text-right font-bold text-white">
                      {stats.total}
                    </td>
                    <td className="py-4 px-4 text-right font-bold text-red-400">
                      {stats.critical}
                    </td>
                    <td className="py-4 px-4 text-right font-bold text-amber-400">
                      {stats.urgent}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex justify-center gap-1.5">
                        {isEditing ? (
                          <>
                            <button
                              onClick={saveEdit}
                              className="p-1.5 text-cyan-400 hover:bg-[var(--p-dim)] rounded-lg transition-all"
                              title="Save"
                            >
                              <Save className="w-4 h-4" />
                            </button>
                            <button
                              onClick={cancelEditing}
                              className="p-1.5 text-[var(--t3)] hover:bg-[var(--p-dim)] rounded-lg transition-all"
                              title="Cancel"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => startEditing(location)}
                              className="p-1.5 text-[var(--p)] hover:bg-[var(--p-dim)] rounded-lg transition-all"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          {kenyaOfficeLocations.length === 0 && (
            <div className="text-center py-8">
              <p className="text-[var(--t3)] text-xs">No office locations data available</p>
            </div>
          )}
        </div>
      </div>

      {/* Add New Office Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-[var(--card)] border border-[var(--p-line)] rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-[var(--p-line)] bg-gradient-to-r from-[var(--p)]/10 to-transparent">
              <h3 className="text-base font-bold text-white">Add New Office Location</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-[var(--t3)] uppercase tracking-wider mb-1.5">Office Name</label>
                <input
                  type="text"
                  value={newOffice.name || ''}
                  onChange={(e) => setNewOffice({...newOffice, name: e.target.value})}
                  className="w-full bg-[var(--p-dim)]/40 border border-[var(--p-line)] text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[var(--p)] transition-all"
                  placeholder="e.g., Nairobi Headquarters"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-[var(--t3)] uppercase tracking-wider mb-1.5">Town</label>
                <input
                  type="text"
                  value={newOffice.town || ''}
                  onChange={(e) => setNewOffice({...newOffice, town: e.target.value})}
                  className="w-full bg-[var(--p-dim)]/40 border border-[var(--p-line)] text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[var(--p)] transition-all"
                  placeholder="e.g., Nairobi"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-[var(--t3)] uppercase tracking-wider mb-1.5">County</label>
                <input
                  type="text"
                  value={newOffice.county || ''}
                  onChange={(e) => setNewOffice({...newOffice, county: e.target.value})}
                  className="w-full bg-[var(--p-dim)]/40 border border-[var(--p-line)] text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[var(--p)] transition-all"
                  placeholder="e.g., Nairobi County"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-[var(--t3)] uppercase tracking-wider mb-1.5">Hiring Status</label>
                <select
                  value={newOffice.hiring_status || ''}
                  onChange={(e) => setNewOffice({...newOffice, hiring_status: e.target.value})}
                  className="w-full bg-[var(--p-dim)]/40 border border-[var(--p-line)] text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[var(--p)] transition-all"
                >
                  <option value="active">Active</option>
                  <option value="actively-hiring">Actively Hiring</option>
                  <option value="selective-hiring">Selective Hiring</option>
                  <option value="not-hiring">Not Hiring</option>
                </select>
              </div>
            </div>
            <div className="p-6 border-t border-[var(--p-line)] flex justify-end gap-3">
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 border border-[var(--p-line)] rounded-lg text-xs font-bold text-[var(--t3)] hover:text-white hover:bg-[var(--p-dim)] transition-all"
              >
                Cancel
              </button>
              <button
                onClick={addNewOffice}
                className="px-4 py-2 text-xs font-bold bg-[var(--p)] text-black rounded-lg hover:shadow-[0_0_15px_rgba(0,229,255,0.4)] hover:bg-cyan-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!newOffice.name}
              >
                Add Office
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};