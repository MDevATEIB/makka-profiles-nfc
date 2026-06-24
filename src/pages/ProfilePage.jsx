import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import LoadingSpinner from '../components/LoadingSpinner';
import { QRCodeSVG } from 'qrcode.react';
import {
  ArrowLeft,
  Mail,
  Phone,
  Globe,
  MapPin,
  Briefcase,
  Building2,
  Eye,
  Download,
  Share2,
  QrCode,
} from 'lucide-react';

export default function ProfilePage() {
  const { profileId } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('profile_id', profileId)
          .single();

        if (error) throw error;
        setProfile(data);
      } catch (error) {
        console.error('Erreur lors du chargement du profil:', error);
        setProfile(null);
      } finally {
        setLoading(false);
      }
      
      // Incrémenter les vues
      try {
        await supabase.rpc('increment_profile_views', {
          p_profile_id: profileId,
        });
      } catch (error) {
        console.error('Erreur lors de l\'incrémentation des vues:', error);
      }
    }
    loadProfile();
  }, [profileId]);

  function generateVCard() {
    if (!profile) return '';

    const vcard = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `FN:${profile.first_name} ${profile.last_name}`,
      `N:${profile.last_name};${profile.first_name};;;`,
      profile.title ? `TITLE:${profile.title}` : '',
      profile.company ? `ORG:${profile.company}` : '',
      profile.email ? `EMAIL:${profile.email}` : '',
      profile.phone ? `TEL:${profile.phone}` : '',
      profile.website ? `URL:${profile.website}` : '',
      profile.location ? `ADR:;;${profile.location};;;;` : '',
      profile.bio ? `NOTE:${profile.bio}` : '',
      'END:VCARD',
    ]
      .filter(Boolean)
      .join('\n');

    return vcard;
  }

  function downloadVCard() {
    const vcard = generateVCard();
    const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${profile.first_name}_${profile.last_name}.vcf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  async function shareProfile() {
    const url = window.location.href;
    const text = `Découvrez le profil de ${profile.first_name} ${profile.last_name}`;

    if (navigator.share) {
      try {
        await navigator.share({ title: text, url });
      } catch (error) {
        console.log('Erreur lors du partage:', error);
      }
    } else {
      // Fallback: copier l'URL
      navigator.clipboard.writeText(url);
      alert('Lien copié dans le presse-papier !');
    }
  }

  const getSocialIcon = (platform) => {
    const iconClass = "w-5 h-5";
    const platformLower = platform.toLowerCase();
    
    // Utiliser des icônes SVG personnalisées pour les réseaux sociaux
    switch (platformLower) {
      case 'facebook':
        return (
          <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        );
      case 'twitter':
      case 'x':
        return (
          <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        );
      case 'linkedin':
        return (
          <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
        );
      case 'instagram':
        return (
          <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
          </svg>
        );
      case 'github':
        return (
          <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
          </svg>
        );
      default:
        return <Globe className={iconClass} />;
    }
  };

  if (loading) return <LoadingSpinner />;

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Profil introuvable</h2>
          <p className="text-gray-600 mb-6">Ce profil n'existe pas ou a été supprimé.</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  // Vérifier si l'abonnement est actif
  if (!profile.abonnement_actif) {
    console.log(`❌ Profil ${profileId} a un abonnement inactif`);
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Abonnement expiré</h2>
          <p className="text-gray-600 mb-6">Ce profil n'est plus accessible. Contactez le propriétaire pour plus d'informations.</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  const profileUrl = window.location.href;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Header avec bouton retour */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Retour aux profils</span>
          </Link>
        </div>
      </header>

      {/* Profile Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          {/* Photo de profil */}
          <div className="h-64 bg-gradient-to-br from-blue-500 to-blue-600 relative">
            {profile.photo_url ? (
              <img
                src={profile.photo_url}
                alt={`${profile.first_name} ${profile.last_name}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Building2 className="w-32 h-32 text-white opacity-50" />
              </div>
            )}
            
            {/* Badge de vues */}
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2">
              <Eye className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-gray-900">{profile.views_count || 0}</span>
            </div>
          </div>

          {/* Informations principales */}
          <div className="p-8">
            {/* Nom et titre */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {profile.first_name} {profile.last_name}
              </h1>
              
              {profile.title && (
                <div className="flex items-center gap-2 text-xl text-gray-600 mb-3">
                  <Briefcase className="w-6 h-6 text-blue-600" />
                  <span>{profile.title}</span>
                </div>
              )}

              {profile.company && (
                <div className="flex items-center gap-2 text-lg text-gray-700">
                  <Building2 className="w-5 h-5 text-blue-600" />
                  <span className="font-medium">{profile.company}</span>
                </div>
              )}
            </div>

            {/* Bio */}
            {profile.bio && (
              <div className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{profile.bio}</p>
              </div>
            )}

            {/* Informations de contact */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {profile.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors border border-blue-200"
                >
                  <Mail className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-900 break-all">{profile.email}</span>
                </a>
              )}

              {profile.phone && (
                <a
                  href={`tel:${profile.phone}`}
                  className="flex items-center gap-3 p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors border border-green-200"
                >
                  <Phone className="w-5 h-5 text-green-600" />
                  <span className="text-gray-900">{profile.phone}</span>
                </a>
              )}

              {profile.website && (
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors border border-purple-200"
                >
                  <Globe className="w-5 h-5 text-purple-600" />
                  <span className="text-gray-900 break-all">{profile.website}</span>
                </a>
              )}

              {profile.location && (
                <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-xl border border-orange-200">
                  <MapPin className="w-5 h-5 text-orange-600" />
                  <span className="text-gray-900">{profile.location}</span>
                </div>
              )}
            </div>

            {/* Réseaux sociaux */}
            {profile.socials && Object.keys(profile.socials).length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-blue-600" />
                  Réseaux sociaux
                </h3>
                <div className="flex flex-wrap gap-3">
                  {Object.entries(profile.socials).map(([platform, url]) => (
                    <a
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors border border-gray-300"
                    >
                      {getSocialIcon(platform)}
                      <span className="font-medium text-gray-900 capitalize">{platform}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-4 pt-6 border-t border-gray-200">
              <button
                onClick={downloadVCard}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-sm"
              >
                <Download className="w-5 h-5" />
                Télécharger vCard
              </button>

              <button
                onClick={shareProfile}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors shadow-sm"
              >
                <Share2 className="w-5 h-5" />
                Partager
              </button>

              <button
                onClick={() => setShowQR(!showQR)}
                className="flex items-center gap-2 px-6 py-3 bg-gray-700 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors shadow-sm"
              >
                <QrCode className="w-5 h-5" />
                {showQR ? 'Masquer QR Code' : 'Afficher QR Code'}
              </button>
            </div>

            {/* QR Code */}
            {showQR && (
              <div className="mt-8 p-6 bg-gray-50 rounded-xl border border-gray-200 text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  QR Code du profil
                </h3>
                <div className="inline-block p-4 bg-white rounded-xl shadow-sm">
                  <QRCodeSVG value={profileUrl} size={200} level="H" />
                </div>
                <p className="text-sm text-gray-600 mt-4">
                  Scannez ce code pour partager le profil
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-8 text-center text-gray-600">
          <p className="text-sm">
            Propulsé par <span className="font-semibold text-blue-600">Makka NFC Profiles</span>
          </p>
        </div>
      </main>
    </div>
  );
}
