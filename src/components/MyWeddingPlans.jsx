import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Users, 
  Heart, 
  Plus, 
  Edit3, 
  Trash2,
  Star,
  Clock,
  DollarSign,
  Camera,
  Music,
  Utensils,
  Flower
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const MyWeddingPlans = ({ onBack }) => {
  const { user } = useAuth();
  const [weddingPlans, setWeddingPlans] = useState([]);
  const [showNewPlanModal, setShowNewPlanModal] = useState(false);
  const [newPlan, setNewPlan] = useState({
    title: '',
    date: '',
    venue: '',
    guestCount: '',
    budget: '',
    style: 'traditional'
  });

  useEffect(() => {
    loadWeddingPlans();
  }, [user]);

  const loadWeddingPlans = () => {
    const saved = localStorage.getItem(`weddingkityaari_plans_${user?.id}`);
    if (saved) {
      setWeddingPlans(JSON.parse(saved));
    }
  };

  const savePlans = (plans) => {
    localStorage.setItem(`weddingkityaari_plans_${user?.id}`, JSON.stringify(plans));
    setWeddingPlans(plans);
  };

  const handleCreatePlan = () => {
    if (!newPlan.title.trim()) return;

    const plan = {
      id: Date.now(),
      ...newPlan,
      createdAt: new Date().toISOString(),
      status: 'planning',
      progress: 10,
      tasks: [
        { id: 1, title: 'Book venue', completed: false, category: 'venue' },
        { id: 2, title: 'Choose catering', completed: false, category: 'catering' },
        { id: 3, title: 'Select decorations', completed: false, category: 'decor' },
        { id: 4, title: 'Send invitations', completed: false, category: 'invitations' },
        { id: 5, title: 'Finalize guest list', completed: false, category: 'guests' }
      ]
    };

    const updatedPlans = [...weddingPlans, plan];
    savePlans(updatedPlans);
    setNewPlan({ title: '', date: '', venue: '', guestCount: '', budget: '', style: 'traditional' });
    setShowNewPlanModal(false);
  };

  const deletePlan = (planId) => {
    const updatedPlans = weddingPlans.filter(plan => plan.id !== planId);
    savePlans(updatedPlans);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'planning': return 'bg-blue-100 text-blue-700';
      case 'in-progress': return 'bg-orange-100 text-orange-700';
      case 'completed': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStyleIcon = (style) => {
    switch (style) {
      case 'traditional': return <Heart className="text-red-500" size={20} />;
      case 'modern': return <Star className="text-blue-500" size={20} />;
      case 'rustic': return <Flower className="text-green-500" size={20} />;
      default: return <Heart className="text-red-500" size={20} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-8"
          >
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="p-2 hover:bg-white/50 rounded-full transition-colors"
              >
                <ArrowLeft size={24} className="text-gray-600" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">My Wedding Plans</h1>
                <p className="text-gray-600">Manage all your wedding planning projects</p>
              </div>
            </div>
            
            <button
              onClick={() => setShowNewPlanModal(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-pink-700 transition-all transform hover:scale-[1.02]"
            >
              <Plus size={20} />
              New Wedding Plan
            </button>
          </motion.div>

          {/* Wedding Plans Grid */}
          {weddingPlans.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div className="bg-white/60 rounded-full w-32 h-32 flex items-center justify-center mx-auto mb-6">
                <Heart size={48} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Wedding Plans Yet</h3>
              <p className="text-gray-500 mb-6">Start planning your dream wedding by creating your first plan</p>
              <button
                onClick={() => setShowNewPlanModal(true)}
                className="bg-gradient-to-r from-orange-500 to-pink-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-pink-700 transition-all"
              >
                Create Your First Plan
              </button>
            </motion.div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {weddingPlans.map((plan, index) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all overflow-hidden"
                >
                  {/* Plan Header */}
                  <div className="bg-gradient-to-r from-orange-500 to-pink-600 p-6 text-white">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-2">
                        {getStyleIcon(plan.style)}
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(plan.status)}`}>
                          {plan.status}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button className="p-1 hover:bg-white/20 rounded">
                          <Edit3 size={16} />
                        </button>
                        <button 
                          onClick={() => deletePlan(plan.id)}
                          className="p-1 hover:bg-white/20 rounded"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold">{plan.title}</h3>
                    <div className="mt-4 space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} />
                        <span>{plan.date || 'Date not set'}</span>
                      </div>
                      {plan.venue && (
                        <div className="flex items-center gap-2">
                          <MapPin size={16} />
                          <span>{plan.venue}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Plan Details */}
                  <div className="p-6">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users size={16} />
                        <span>{plan.guestCount || 'TBD'} guests</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <DollarSign size={16} />
                        <span>${plan.budget || 'TBD'}</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">Progress</span>
                        <span className="text-sm text-gray-600">{plan.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-orange-500 to-pink-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${plan.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Tasks Preview */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Recent Tasks</h4>
                      <div className="space-y-2">
                        {plan.tasks.slice(0, 3).map(task => (
                          <div key={task.id} className="flex items-center gap-2 text-sm">
                            <div className={`w-4 h-4 rounded border-2 ${
                              task.completed ? 'bg-green-500 border-green-500' : 'border-gray-300'
                            }`}>
                              {task.completed && <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>}
                            </div>
                            <span className={task.completed ? 'line-through text-gray-500' : 'text-gray-700'}>
                              {task.title}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* View Details Button */}
                    <button className="w-full mt-4 py-2 text-orange-600 border border-orange-200 rounded-lg hover:bg-orange-50 transition-colors font-medium">
                      View Details
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* New Plan Modal */}
      {showNewPlanModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl w-full max-w-md p-6"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-6">Create New Wedding Plan</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Wedding Title</label>
                <input
                  type="text"
                  value={newPlan.title}
                  onChange={(e) => setNewPlan(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Sarah & John's Wedding"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Wedding Date</label>
                <input
                  type="date"
                  value={newPlan.date}
                  onChange={(e) => setNewPlan(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Venue (Optional)</label>
                <input
                  type="text"
                  value={newPlan.venue}
                  onChange={(e) => setNewPlan(prev => ({ ...prev, venue: e.target.value }))}
                  placeholder="e.g., Grand Ballroom Hotel"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Guest Count</label>
                  <input
                    type="number"
                    value={newPlan.guestCount}
                    onChange={(e) => setNewPlan(prev => ({ ...prev, guestCount: e.target.value }))}
                    placeholder="200"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Budget</label>
                  <input
                    type="number"
                    value={newPlan.budget}
                    onChange={(e) => setNewPlan(prev => ({ ...prev, budget: e.target.value }))}
                    placeholder="50000"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Wedding Style</label>
                <select
                  value={newPlan.style}
                  onChange={(e) => setNewPlan(prev => ({ ...prev, style: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
                >
                  <option value="traditional">Traditional</option>
                  <option value="modern">Modern</option>
                  <option value="rustic">Rustic</option>
                  <option value="bohemian">Bohemian</option>
                  <option value="vintage">Vintage</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowNewPlanModal(false)}
                className="flex-1 py-3 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreatePlan}
                disabled={!newPlan.title.trim()}
                className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-pink-600 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-pink-700 transition-all disabled:opacity-50"
              >
                Create Plan
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default MyWeddingPlans;