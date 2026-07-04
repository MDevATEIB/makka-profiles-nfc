import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import LoadingSpinner from '../components/LoadingSpinner';
import { Search, Users, Briefcase, MapPin, Eye, CheckCircle, ShieldCheck } from 'lucide-react';

export default function HomePage() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProfiles();
  }, []);

  async function fetchProfiles() {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Filtrer les profils avec abonnement actif
      const activeProfiles = (data || []).filter(profile => profile.abonnement_actif);
      setProfiles(activeProfiles);
    } catch (error) {
      console.error('Erreur lors du chargement des profils:', error);
    } finally {
      setLoading(false);
    }
  }

  const filteredProfiles = profiles.filter(profile => {
    const searchLower = searchTerm.toLowerCase();
    return (
      profile.first_name?.toLowerCase().includes(searchLower) ||
      profile.last_name?.toLowerCase().includes(searchLower) ||
      profile.company?.toLowerCase().includes(searchLower) ||
      profile.title?.toLowerCase().includes(searchLower)
    );
  });

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative border-b border-white/10 bg-white/5 backdrop-blur-2xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
                <Users className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent">
                  Makka NFC
                </h1>
                <p className="text-white/50 text-sm">Réseautage digital premium</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full border border-white/20 backdrop-blur-xl">
              <ShieldCheck className="w-5 h-5 text-blue-400" />
              <span className="text-blue-400 text-sm font-medium">Profil vérifié</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search Bar */}
        <div className="mb-12">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-white/50 w-6 h-6" />
            <input
              type="text"
              placeholder="Rechercher un profil par nom, entreprise..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-16 pr-6 py-5 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 text-white text-lg placeholder-white/30 transition-all duration-300"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="mb-12 flex items-center justify-center gap-4">
          <div className="px-8 py-4 bg-white/10 backdrop-blur-2xl rounded-2xl border border-white/20 shadow-xl">
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6 text-blue-400" />
              <span className="text-2xl font-bold text-white">{filteredProfiles.length}</span>
              <span className="text-white/50">profils</span>
            </div>
          </div>
        </div>

        {/* Profiles Grid */}
        {filteredProfiles.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-32 h-32 mx-auto mb-8 rounded-full bg-white/10 backdrop-blur-2xl flex items-center justify-center border border-white/20 shadow-xl">
              <Users className="w-16 h-16 text-white/30" />
            </div>
            <h3 className="text-2xl font-semibold text-white mb-3">
              Aucun profil trouvé
            </h3>
            <p className="text-white/50 text-lg">
              {searchTerm
                ? "Essayez avec d'autres termes de recherche"
                : "Aucun profil n'est encore disponible"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProfiles.map((profile) => (
              <Link
                key={profile.id}
                to={`/p/${profile.profile_id}`}
                className="group"
              >
                {/* Premium Profile Card */}
                <div className="relative overflow-hidden bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 transition-all duration-500 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/20 hover:-translate-y-2">
                  {/* Accent Border */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-purple-500" />
                  
                  {/* Profile Photo */}
                  <div className="h-56 bg-gradient-to-br from-blue-500/20 to-purple-500/20 relative overflow-hidden">
                    {profile.photo_url ? (
                      <img
                        src={profile.photo_url}
                        alt={`${profile.first_name} ${profile.last_name}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-28 h-28 rounded-full bg-white/10 flex items-center justify-center">
                          <Users className="w-14 h-14 text-white/30" />
                        </div>
                      </div>
                    )}
                    
                    {/* Verified Badge */}
                    <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-blue-500/90 backdrop-blur-sm px-3 py-1.5 rounded-full border border-blue-400/30">
                      <CheckCircle className="w-4 h-4 text-white" />
                      <span className="text-xs font-bold text-white">VÉRIFIÉ</span>
                    </div>
                  </div>

                  {/* Profile Info */}
                  <div className="p-7">
                    <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">
                      {profile.first_name} {profile.last_name}
                    </h3>

                    {profile.title && (
                      <p className="text-blue-400 text-sm font-medium mb-3 flex items-center gap-2">
                        <Briefcase className="w-4 h-4" />
                        {profile.title}
                      </p>
                    )}

                    {profile.company && (
                      <div className="flex items-center gap-2 text-white/70 mb-5">
                        <Users className="w-4 h-4 text-white/30" />
                        <span className="font-medium">{profile.company}</span>
                      </div>
                    )}

                    {profile.location && (
                      <div className="flex items-center gap-2 text-white/50 text-sm mb-5">
                        <MapPin className="w-4 h-4" />
                        <span>{profile.location}</span>
                      </div>
                    )}

                    {/* View Count */}
                    <div className="flex items-center justify-between pt-5 border-t border-white/10">
                      <div className="flex items-center gap-2 text-white/50 text-sm">
                        <Eye className="w-4 h-4" />
                        <span>{profile.views_count || 0} vues</span>
                      </div>
                      <div className="text-blue-400 font-medium text-sm flex items-center gap-1">
                        Voir profil
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative border-t border-white/10 mt-20 bg-white/5 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="text-center">
            <p className="font-semibold text-white mb-2">Makka NFC Profiles</p>
            <p className="text-white/50 text-sm">
              Développé par <span className="text-blue-400">MakkaDev</span>
            </p>
            <p className="text-white/30 text-xs mt-1">© 2026 - Tous droits réservés</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
