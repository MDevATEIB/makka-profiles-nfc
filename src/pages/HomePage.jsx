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
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <header className="border-b border-[rgba(0,212,255,0.15)] bg-[rgba(10,10,10,0.8)] backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#00d4ff] to-[#0099cc] flex items-center justify-center animate-pulse-glow">
                <Users className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-[#00d4ff] bg-clip-text text-transparent">
                  Makka NFC
                </h1>
                <p className="text-gray-400 text-sm">Réseautage digital premium</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-[rgba(0,212,255,0.1)] rounded-full border border-[rgba(0,212,255,0.2)]">
              <ShieldCheck className="w-5 h-5 text-[#00d4ff]" />
              <span className="text-[#00d4ff] text-sm font-medium">Profil vérifié</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search Bar */}
        <div className="mb-12">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
            <input
              type="text"
              placeholder="Rechercher un profil par nom, entreprise..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-16 pr-6 py-5 bg-[rgba(20,20,20,0.7)] backdrop-blur-xl border-2 border-[rgba(0,212,255,0.2)] rounded-3xl focus:outline-none focus:border-[#00d4ff] focus:ring-4 focus:ring-[rgba(0,212,255,0.1)] text-white text-lg placeholder-gray-500 transition-all duration-300"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="mb-12 flex items-center justify-center gap-4">
          <div className="px-8 py-4 bg-[rgba(20,20,20,0.7)] backdrop-blur-xl rounded-2xl border border-[rgba(0,212,255,0.15)]">
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6 text-[#00d4ff]" />
              <span className="text-2xl font-bold text-white">{filteredProfiles.length}</span>
              <span className="text-gray-400">profils</span>
            </div>
          </div>
        </div>

        {/* Profiles Grid */}
        {filteredProfiles.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-32 h-32 mx-auto mb-8 rounded-full bg-[rgba(20,20,20,0.7)] backdrop-blur-xl flex items-center justify-center border border-[rgba(0,212,255,0.15)]">
              <Users className="w-16 h-16 text-gray-600" />
            </div>
            <h3 className="text-2xl font-semibold text-white mb-3">
              Aucun profil trouvé
            </h3>
            <p className="text-gray-500 text-lg">
              {searchTerm
                ? "Essayez avec d'autres termes de recherche"
                : "Aucun profil n'est encore disponible"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProfiles.map((profile) => (
              <Link
                key={profile.id}
                to={`/p/${profile.profile_id}`}
                className="group"
              >
                {/* Premium Profile Card */}
                <div className="relative overflow-hidden bg-[rgba(20,20,20,0.7)] backdrop-blur-xl rounded-3xl border-2 border-[rgba(0,212,255,0.15)] transition-all duration-500 hover:border-[#00d4ff] hover:shadow-[0_0_50px_rgba(0,212,255,0.2)] hover:-translate-y-2">
                  {/* Accent Border */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00d4ff] via-[#0099cc] to-[#00d4ff]" />
                  
                  {/* Profile Photo */}
                  <div className="h-56 bg-gradient-to-br from-[#00d4ff]/20 to-[#0099cc]/20 relative overflow-hidden">
                    {profile.photo_url ? (
                      <img
                        src={profile.photo_url}
                        alt={`${profile.first_name} ${profile.last_name}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-28 h-28 rounded-full bg-[rgba(0,212,255,0.2)] flex items-center justify-center">
                          <Users className="w-14 h-14 text-[#00d4ff]" />
                        </div>
                      </div>
                    )}
                    
                    {/* Verified Badge */}
                    <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-[rgba(0,212,255,0.9)] backdrop-blur-sm px-3 py-1.5 rounded-full">
                      <CheckCircle className="w-4 h-4 text-white" />
                      <span className="text-xs font-bold text-white">VÉRIFIÉ</span>
                    </div>
                  </div>

                  {/* Profile Info */}
                  <div className="p-7">
                    <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-[#00d4ff] transition-colors">
                      {profile.first_name} {profile.last_name}
                    </h3>

                    {profile.title && (
                      <p className="text-[#00d4ff] text-sm font-medium mb-3 flex items-center gap-2">
                        <Briefcase className="w-4 h-4" />
                        {profile.title}
                      </p>
                    )}

                    {profile.company && (
                      <div className="flex items-center gap-2 text-gray-300 mb-5">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">{profile.company}</span>
                      </div>
                    )}

                    {profile.location && (
                      <div className="flex items-center gap-2 text-gray-400 text-sm mb-5">
                        <MapPin className="w-4 h-4" />
                        <span>{profile.location}</span>
                      </div>
                    )}

                    {/* View Count */}
                    <div className="flex items-center justify-between pt-5 border-t border-[rgba(0,212,255,0.1)]">
                      <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <Eye className="w-4 h-4" />
                        <span>{profile.views_count || 0} vues</span>
                      </div>
                      <div className="text-[#00d4ff] font-medium text-sm flex items-center gap-1">
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
      <footer className="border-t border-[rgba(0,212,255,0.15)] mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="text-center">
            <p className="font-semibold text-white mb-2">Makka NFC Profiles</p>
            <p className="text-gray-500 text-sm">
              Développé par <span className="text-[#00d4ff]">MakkaDev</span>
            </p>
            <p className="text-gray-600 text-xs mt-1">© 2026 - Tous droits réservés</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
