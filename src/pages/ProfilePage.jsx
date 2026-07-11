import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import LoadingSpinner from '../components/LoadingSpinner';
import { QRCodeSVG } from 'qrcode.react';
import {
  Phone,
  Mail,
  Globe,
  MapPin,
  Briefcase,
  User,
  ChevronLeft,
  Share2,
  Download,
  CheckCircle,
  ShieldCheck,
  QrCode
} from 'lucide-react';
import {
  FaFacebook,
  FaLinkedin,
  FaTwitter,
  FaInstagram,
  FaGithub,
  FaTiktok,
  FaSnapchat,
  FaWhatsapp
} from 'react-icons/fa';

export default function ProfilePage() {
  const { profileId } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLocked, setShowLocked] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  // Détecter les changements de connexion
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const fetchProfile = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('profile_id', profileId)
        .single();

      if (error) throw error;
      
      if (!data.abonnement_actif) {
        setShowLocked(true);
      } else {
        // Incrémenter le compteur de vues
        await supabase.rpc('increment_profile_views', {
          p_profile_id: profileId });
      }
      
      setProfile(data);

      // Mettre en cache le profil pour accès offline
      try {
        localStorage.setItem(`profile_cache_${profileId}`, JSON.stringify(data));
        console.log('✅ Profile cached for offline access');
      } catch (cacheError) {
        console.warn('⚠️ Failed to cache profile:', cacheError);
      }
    } catch (error) {
      console.error('Erreur lors du chargement du profil:', error);
      
      // Si erreur de connexion, essayer de charger depuis le cache
      if (!navigator.onLine) {
        try {
          const cachedProfile = localStorage.getItem(`profile_cache_${profileId}`);
          if (cachedProfile) {
            setProfile(JSON.parse(cachedProfile));
            console.log('📴 Profile loaded from offline cache');
            return;
          }
        } catch (cacheError) {
          console.error('Failed to load from cache:', cacheError);
        }
      }
    } finally {
      setLoading(false);
    }
  }, [profileId]);

  useEffect(() => {
    if (profileId) {
      fetchProfile();
    }
  }, [profileId, fetchProfile]);

  function downloadVCard() {
    if (!profile) return;
    
    const vCardContent = `BEGIN:VCARD
VERSION:3.0
N:${profile.last_name};${profile.first_name};;;
FN:${profile.first_name} ${profile.last_name}
${profile.title ? `TITLE:${profile.title}` : ''}
${profile.company ? `ORG:${profile.company}` : ''}
${profile.email ? `EMAIL:${profile.email}` : ''}
${profile.phone ? `TEL;TYPE=CELL:${profile.phone}` : ''}
${profile.website ? `URL:${profile.website}` : ''}
${profile.location ? `ADR;TYPE=WORK:;;${profile.location};;;;` : ''}
${profile.photo_url ? `PHOTO;VALUE=uri:${profile.photo_url}` : ''}
${profile.socials?.linkedin ? `X-SOCIALPROFILE;TYPE=linkedin:${profile.socials.linkedin}` : ''}
${profile.socials?.twitter ? `X-SOCIALPROFILE;TYPE=twitter:${profile.socials.twitter}` : ''}
${profile.socials?.facebook ? `X-SOCIALPROFILE;TYPE=facebook:${profile.socials.facebook}` : ''}
${profile.socials?.instagram ? `X-SOCIALPROFILE;TYPE=instagram:${profile.socials.instagram}` : ''}
${profile.socials?.github ? `X-SOCIALPROFILE;TYPE=github:${profile.socials.github}` : ''}
END:VCARD`;

    const blob = new Blob([vCardContent], { type: 'text/vcard;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${profile.first_name}_${profile.last_name}.vcf`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function shareProfile() {
    const shareData = {
      title: `${profile.first_name} ${profile.last_name}`,
      text: `Découvrez le profil de ${profile.first_name} ${profile.last_name}${profile.title ? ` - ${profile.title}` : ''}`,
      url: `https://mdevateib.github.io/makka-profiles-nfc/p/${profile.profile_id}`
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.error('Erreur lors du partage:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(shareData.url).then(() => {
        alert('Lien copié dans le presse-papiers !');
      }).catch(() => {
        alert('Partage non supporté sur ce navigateur');
      });
    }
  }

  if (loading) return <LoadingSpinner />;

  if (!profile) return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      <div className="text-center">
        <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-[rgba(20,20,20,0.7)] backdrop-blur-xl flex items-center justify-center border border-[rgba(0,212,255,0.15)]">
          <User className="w-12 h-12 text-gray-600" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-3">Profil non trouvé</h2>
        <Link 
          to="/" className="text-[#00d4ff] font-medium hover:underline">
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );

  if (showLocked) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="w-32 h-32 mx-auto mb-8 rounded-full bg-gradient-to-br from-[#00d4ff] to-[#0099cc] flex items-center justify-center animate-pulse-glow">
            <ShieldCheck className="w-16 h-16 text-white" />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-[#00d4ff] bg-clip-text text-transparent mb-4">
            Profil Inactif
          </h2>
          <p className="text-gray-400 text-lg mb-8 max-w-sm mx-auto">
            Ce profil n'a pas d'abonnement actif.
          </p>
          <Link 
            to="/" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#00d4ff] to-[#0099cc] text-white font-semibold rounded-3xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,212,255,0.4)]">
            <ChevronLeft className="w-5 h-5" />
            Retour à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Offline Banner */}
      {isOffline && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-4 text-center font-semibold shadow-lg">
          <div className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414" />
            </svg>
            <span>📴 Mode Hors Ligne - Affichage depuis le cache</span>
          </div>
        </div>
      )}
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <div className="relative">
        {/* Back Button */}
        <Link 
          to="/" className="absolute top-6 left-4 sm:left-8 z-10">
          <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all duration-300 hover:scale-110">
            <ChevronLeft className="w-6 h-6 text-white" />
          </div>
        </Link>
      </div>

      <div className="relative px-4 sm:px-6 lg:px-8 pb-20 pt-4">
        <div className="max-w-4xl mx-auto">
          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Profile Card - Large */}
            <div className="md:col-span-2 bg-white/10 backdrop-blur-2xl rounded-[32px] border border-white/20 overflow-hidden shadow-2xl">
              {/* Profile Photo Section */}
              <div className="relative pt-16 pb-10 px-8 sm:px-12 bg-gradient-to-br from-white/5 to-transparent">
                <div className="relative mx-auto w-40 h-40">
                  {profile.photo_url ? (
                    <img
                      src={profile.photo_url}
                      alt={`${profile.first_name} ${profile.last_name}`}
                      className="w-full h-full rounded-full border-4 border-white/30 object-cover shadow-2xl"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full border-4 border-white/30 bg-gradient-to-br from-blue-500/30 to-purple-500/30 flex items-center justify-center shadow-2xl">
                      <User className="w-20 h-20 text-white/70" />
                    </div>
                  )}
                  
                  {/* Verified Badge */}
                  <div className="absolute bottom-3 right-3 w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center border-4 border-slate-900 shadow-xl">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                </div>
                
                {/* Name and Title */}
                <div className="text-center mt-6">
                  <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
                    {profile.first_name} {profile.last_name}
                  </h1>
                  
                  {profile.title && (
                    <p className="text-blue-400 text-xl font-semibold mb-2 flex items-center justify-center gap-2">
                      <Briefcase className="w-5 h-5" />
                      {profile.title}
                    </p>
                  )}
                  
                  {profile.company && (
                    <p className="text-white/70 text-lg flex items-center justify-center gap-2">
                      <User className="w-5 h-5 text-white/50" />
                      {profile.company}
                    </p>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="px-8 sm:px-12 pb-8">
                <div className="flex items-center justify-center gap-4 flex-wrap">
                  {profile.phone && (
                    <a
                      href={`tel:${profile.phone}`}
                      className="group"
                    >
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg hover:shadow-green-500/50 transition-all duration-300 hover:scale-110">
                        <Phone className="w-6 h-6 text-white" />
                      </div>
                    </a>
                  )}
                  
                  {profile.socials?.whatsapp && (
                    <a
                      href={profile.socials.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group"
                    >
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#25D366] to-[#128C7E] flex items-center justify-center shadow-lg hover:shadow-green-500/50 transition-all duration-300 hover:scale-110">
                        <FaWhatsapp className="w-7 h-7 text-white" />
                      </div>
                    </a>
                  )}
                  
                  {profile.email && (
                    <a
                      href={`mailto:${profile.email}`}
                      className="group"
                    >
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg hover:shadow-red-500/50 transition-all duration-300 hover:scale-110">
                        <Mail className="w-6 h-6 text-white" />
                      </div>
                    </a>
                  )}
                  
                  {profile.website && (
                    <a
                      href={profile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group"
                    >
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg hover:shadow-blue-500/50 transition-all duration-300 hover:scale-110">
                        <Globe className="w-6 h-6 text-white" />
                      </div>
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Stats Card */}
            <div className="bg-white/10 backdrop-blur-2xl rounded-[32px] border border-white/20 p-6 shadow-2xl">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <ShieldCheck className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-white font-semibold mb-2">Vues</h3>
                <p className="text-4xl font-bold text-white">{profile.views_count || 0}</p>
                <p className="text-white/50 text-sm mt-1">Total vues</p>
              </div>
            </div>

            {/* Bio Card */}
            {profile.bio && (
              <div className="md:col-span-2 bg-white/10 backdrop-blur-2xl rounded-[32px] border border-white/20 p-8 shadow-2xl">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-400" />
                  À propos
                </h3>
                <p className="text-white/80 leading-relaxed text-lg">
                  {profile.bio}
                </p>
              </div>
            )}

            {/* Location Card */}
            {profile.location && (
              <div className="bg-white/10 backdrop-blur-2xl rounded-[32px] border border-white/20 p-6 shadow-2xl">
                <div className="flex items-center gap-3 text-white">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-white/50 text-sm">Localisation</p>
                    <p className="text-white font-medium">{profile.location}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Social Links Card */}
            {profile.socials && (
              <div className="md:col-span-3 bg-white/10 backdrop-blur-2xl rounded-[32px] border border-white/20 p-8 shadow-2xl">
                <h3 className="text-white font-semibold mb-6 text-xl">Réseaux sociaux</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {profile.socials.linkedin && (
                    <a
                      href={profile.socials.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group"
                    >
                      <div className="p-4 bg-white/5 rounded-2xl border border-white/10 hover:border-blue-500/50 hover:bg-blue-500/10 transition-all duration-300 hover:scale-105">
                        <FaLinkedin className="w-8 h-8 text-[#0077b5] mb-2" />
                        <span className="text-white font-medium text-sm">LinkedIn</span>
                      </div>
                    </a>
                  )}
                  {profile.socials.github && (
                    <a
                      href={profile.socials.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group"
                    >
                      <div className="p-4 bg-white/5 rounded-2xl border border-white/10 hover:border-gray-500/50 hover:bg-gray-500/10 transition-all duration-300 hover:scale-105">
                        <FaGithub className="w-8 h-8 text-white mb-2" />
                        <span className="text-white font-medium text-sm">GitHub</span>
                      </div>
                    </a>
                  )}
                  {profile.socials.twitter && (
                    <a
                      href={profile.socials.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group"
                    >
                      <div className="p-4 bg-white/5 rounded-2xl border border-white/10 hover:border-[#1DA1F2]/50 hover:bg-[#1DA1F2]/10 transition-all duration-300 hover:scale-105">
                        <FaTwitter className="w-8 h-8 text-[#1DA1F2] mb-2" />
                        <span className="text-white font-medium text-sm">Twitter</span>
                      </div>
                    </a>
                  )}
                  {profile.socials.instagram && (
                    <a
                      href={profile.socials.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group"
                    >
                      <div className="p-4 bg-white/5 rounded-2xl border border-white/10 hover:border-pink-500/50 hover:bg-pink-500/10 transition-all duration-300 hover:scale-105">
                        <FaInstagram className="w-8 h-8 text-white mb-2" />
                        <span className="text-white font-medium text-sm">Instagram</span>
                      </div>
                    </a>
                  )}
                  {profile.socials.facebook && (
                    <a
                      href={profile.socials.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group"
                    >
                      <div className="p-4 bg-white/5 rounded-2xl border border-white/10 hover:border-[#1877F2]/50 hover:bg-[#1877F2]/10 transition-all duration-300 hover:scale-105">
                        <FaFacebook className="w-8 h-8 text-[#1877F2] mb-2" />
                        <span className="text-white font-medium text-sm">Facebook</span>
                      </div>
                    </a>
                  )}
                  {profile.socials.tiktok && (
                    <a
                      href={profile.socials.tiktok}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group"
                    >
                      <div className="p-4 bg-white/5 rounded-2xl border border-white/10 hover:border-white/50 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                        <FaTiktok className="w-8 h-8 text-white mb-2" />
                        <span className="text-white font-medium text-sm">TikTok</span>
                      </div>
                    </a>
                  )}
                  {profile.socials.snapchat && (
                    <a
                      href={profile.socials.snapchat}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group"
                    >
                      <div className="p-4 bg-white/5 rounded-2xl border border-white/10 hover:border-[#FFFC00]/50 hover:bg-[#FFFC00]/10 transition-all duration-300 hover:scale-105">
                        <FaSnapchat className="w-8 h-8 text-[#FFFC00] mb-2" />
                        <span className="text-white font-medium text-sm">Snapchat</span>
                      </div>
                    </a>
                  )}
                  {profile.socials.whatsapp && (
                    <a
                      href={profile.socials.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group"
                    >
                      <div className="p-4 bg-white/5 rounded-2xl border border-white/10 hover:border-[#25D366]/50 hover:bg-[#25D366]/10 transition-all duration-300 hover:scale-105">
                        <FaWhatsapp className="w-8 h-8 text-[#25D366] mb-2" />
                        <span className="text-white font-medium text-sm">WhatsApp</span>
                      </div>
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* QR Code Card */}
            <div className="md:col-span-3 bg-white/10 backdrop-blur-2xl rounded-[32px] border border-white/20 p-8 shadow-2xl">
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setShowQR(!showQR)}
                  className="w-full py-4 bg-white/5 text-white font-semibold rounded-2xl border border-white/10 hover:border-blue-500/50 transition-all duration-300 flex items-center justify-center gap-2 hover:bg-blue-500/10"
                >
                  <QrCode className="w-5 h-5" />
                  {showQR ? "Masquer le QR Code" : "Afficher le QR Code"}
                </button>
                <button
                  onClick={shareProfile}
                  className="w-full py-4 bg-white/5 text-white font-semibold rounded-2xl border border-white/10 hover:border-blue-500/50 transition-all duration-300 flex items-center justify-center gap-2 hover:bg-blue-500/10"
                >
                  <Share2 className="w-5 h-5" />
                  Partager
                </button>
              </div>
              {showQR && (
                <div className="mt-6 p-8 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center">
                  <QRCodeSVG
                    value={`https://mdevateib.github.io/makka-profiles-nfc/p/${profile.profile_id}`}
                    size={200}
                    fgColor="#3b82f6"
                    bgColor="rgba(255,255,255,0.05)"
                    level="H"
                    includeMargin={true}
                  />
                </div>
              )}
            </div>

            {/* Action Button */}
            <div className="md:col-span-3">
              <button
                onClick={downloadVCard}
                className="w-full py-5 bg-gradient-to-r from-blue-500 via-cyan-500 to-purple-500 text-white font-bold rounded-3xl transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/50 flex items-center justify-center gap-3 text-lg hover:scale-[1.02]"
              >
                <Download className="w-6 h-6" />
                Enregistrer dans les contacts
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
