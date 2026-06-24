import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import LoadingSpinner from '../components/LoadingSpinner';
import { Search, Users, Briefcase, MapPin, Eye } from 'lucide-react';

export default function HomePage() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProfiles();
  }, []);

  async function fetchProfiles() {
    try {
      console.log('📡 Récupération des profils depuis la DB...');
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      console.log('📊 Données brutes reçues:', data?.map(p => ({
        profile_id: p.profile_id,
        abonnement_actif: p.abonnement_actif
      })));
      
      // Filtrer les profils avec abonnement actif
      const activeProfiles = (data || []).filter(profile => {
        console.log(`Vérification profil ${profile.profile_id}: abonnement_actif =`, profile.abonnement_actif);
        return profile.abonnement_actif;
      });
      
      console.log(`📋 Profils actifs: ${activeProfiles.length} / ${data?.length}`);
      
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Makka NFC Profiles</h1>
              <p className="text-gray-600 mt-1">Cartes de visite numériques professionnelles</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-xl">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher un profil par nom, entreprise..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100">
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 text-blue-600" />
            <span className="text-gray-600">
              {filteredProfiles.length} profil{filteredProfiles.length > 1 ? 's' : ''} trouvé{filteredProfiles.length > 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Profiles Grid */}
        {filteredProfiles.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Aucun profil trouvé
            </h3>
            <p className="text-gray-600">
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
                className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:scale-105"
              >
                {/* Photo */}
                <div className="h-48 bg-gradient-to-br from-blue-500 to-blue-600 relative overflow-hidden">
                  {profile.photo_url ? (
                    <img
                      src={profile.photo_url}
                      alt={`${profile.first_name} ${profile.last_name}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Users className="w-24 h-24 text-white opacity-50" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {profile.first_name} {profile.last_name}
                  </h3>

                  {profile.title && (
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <Briefcase className="w-4 h-4" />
                      <span className="text-sm">{profile.title}</span>
                    </div>
                  )}

                  {profile.company && (
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <Users className="w-4 h-4" />
                      <span className="text-sm font-medium">{profile.company}</span>
                    </div>
                  )}

                  {profile.location && (
                    <div className="flex items-center gap-2 text-gray-600 mb-4">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{profile.location}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-gray-500 text-sm pt-4 border-t border-gray-100">
                    <Eye className="w-4 h-4" />
                    <span>{profile.views_count || 0} vues</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p className="font-medium text-gray-900 mb-2">Makka NFC Profiles</p>
            <p className="text-sm">
              Développé par <span className="font-semibold text-blue-600">MakkaDev</span>
            </p>
            <p className="text-sm mt-1">© 2024 - Tous droits réservés</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
