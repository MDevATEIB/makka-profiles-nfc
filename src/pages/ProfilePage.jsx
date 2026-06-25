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
  ShieldCheck
} from 'lucide-react';

export default function ProfilePage() {
  const { profileId } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLocked, setShowLocked] = useState(false);
  const [showQR, setShowQR] = useState(false);

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
    } catch (error) {
      console.error('Erreur lors du chargement du profil:', error);
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
    const vCardContent = `BEGIN:VCARD
VERSION:3.0
N:${profile.last_name};${profile.first_name};;;
FN:${profile.first_name} ${profile.last_name}
${profile.title ? `TITLE:${profile.title}` : ''}
${profile.company ? `ORG:${profile.company}` : ''}
${profile.email ? `EMAIL:${profile.email}` : ''}
${profile.phone ? `TEL;TYPE=CELL:${profile.phone}` : ''}
${profile.website ? `URL:${profile.website}` : ''}
END:VCARD`;

    const blob = new Blob([vCardContent], { type: 'text/vcard' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${profile.first_name}_${profile.last_name}.vcf`;
    a.click();
    URL.revokeObjectURL(url);
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
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <div className="relative">
        {/* Gradient Background */}
        <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-br from-[#00d4ff]/30 via-[#0099cc]/20 to-[#0a0a0a]" />
        
        {/* Back Button */}
        <Link 
          to="/" className="absolute top-6 left-4 sm:left-8 z-10">
          <div className="w-12 h-12 rounded-2xl bg-[rgba(10,10,10,0.8)] backdrop-blur-xl border border-[rgba(0,212,255,0.15)] flex items-center justify-center hover:border-[#00d4ff] transition-all duration-300">
            <ChevronLeft className="w-6 h-6 text-white" />
          </div>
        </Link>
      </div>

      <div className="relative px-4 sm:px-6 lg:px-8 pb-20 pt-4">
        <div className="max-w-2xl mx-auto">
          {/* Profile Card (Glassmorphism) */}
          <div className="bg-[rgba(20,20,20,0.7)] backdrop-blur-2xl rounded-[32px] border-2 border-[rgba(0,212,255,0.2)] overflow-hidden shadow-[0_20_60px_rgba(0,0,0,0.5)]">
            {/* Profile Photo Section */}
            <div className="relative pt-16 pb-10 px-8 sm:px-12">
              <div className="relative mx-auto w-40 h-40">
                {profile.photo_url ? (
                  <img
                    src={profile.photo_url}
                    alt={`${profile.first_name} ${profile.last_name}`}
                    className="w-full h-full rounded-full border-4 border-[#00d4ff] object-cover shadow-[0_0_40px_rgba(0,212,255,0.3)]"
                  />
                ) : (
                  <div className="w-full h-full rounded-full border-4 border-[#00d4ff] bg-gradient-to-br from-[#00d4ff]/30 to-[#0099cc]/30 flex items-center justify-center shadow-[0_0_40px_rgba(0,212,255,0.3)]">
                    <User className="w-20 h-20 text-white" />
                  </div>
                )}
                
                {/* Verified Badge */}
                <div className="absolute bottom-3 right-3 w-12 h-12 rounded-full bg-[#00d4ff] flex items-center justify-center border-4 border-[rgba(20,20,20,0.7)] shadow-[0_0_20px_rgba(0,212,255,0.5)]">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
              </div>
              
              {/* Name and Title */}
              <div className="text-center mt-6">
                <h1 className="text-4xl font-bold text-white mb-2">
                  {profile.first_name} {profile.last_name}
                </h1>
                
                {profile.title && (
                  <p className="text-[#00d4ff] text-xl font-semibold mb-2 flex items-center justify-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    {profile.title}
                  </p>
                )}
                
                {profile.company && (
                  <p className="text-gray-300 text-lg flex items-center justify-center gap-2">
                    <User className="w-5 h-5 text-gray-500" />
                    {profile.company}
                  </p>
                )}
              </div>
            </div>

            {/* Quick Actions (Circular Buttons) */}
            <div className="px-8 sm:px-12 pb-8">
              <div className="flex items-center justify-center gap-6 flex-wrap">
                {profile.phone && (
                  <a
                    href={`tel:${profile.phone}`}
                    className="group"
                  >
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:shadow-[0_0_30px_rgba(34,197,94,0.6)] transition-all duration-300 hover:scale-110">
                      <Phone className="w-7 h-7 text-white" />
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
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#25D366] to-[#128C7E] flex items-center justify-center shadow-[0_0_20px_rgba(37,211,102,0.4)] hover:shadow-[0_0_30px_rgba(37,211,102,0.6)] transition-all duration-300 hover:scale-110">
                      <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.298-.018-.46.13-.608.136-.136.302-.356.451-.534.149-.178.199-.297.298-.496.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.599-.485-.514-.67-.524-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.371-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.485.712.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.412.248-.694.248-1.289.173-1.412-.074-.124-.272-.198-.57-.347m-5.421 7.503h-.002C8.281 19.931a4.907 4.907 0 0 1-2.366-.63l-.144-.086L0 24l1.406-1.796c-.096-.157.108-.099.108-.099.462-.309.845-.673 1.144-1.083a4.87 4.87 0 0 1-.704-2.528 4.866 4.866 0 0 1 4.867-4.867 4.866 4.866 0 0 1 4.864 4.864c0 2.64-2.149 4.79-4.794 4.867l-.133.001Z"/>
                      </svg>
                    </div>
                  </a>
                )}
                
                {profile.email && (
                  <a
                    href={`mailto:${profile.email}`}
                    className="group"
                  >
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.4)] hover:shadow-[0_0_30px_rgba(239,68,68,0.6)] transition-all duration-300 hover:scale-110">
                      <Mail className="w-7 h-7 text-white" />
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
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] transition-all duration-300 hover:scale-110">
                      <Globe className="w-7 h-7 text-white" />
                    </div>
                  </a>
                )}
              </div>
            </div>

            {/* Bio Section */}
            {profile.bio && (
              <div className="px-8 sm:px-12 pb-8">
                <div className="bg-[rgba(10,10,10,0.5)] rounded-3xl p-6 border border-[rgba(0,212,255,0.15)]">
                  <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <User className="w-5 h-5 text-[#00d4ff]" />
                    À propos
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {profile.bio}
                  </p>
                </div>
              </div>
            )}

            {/* Location Section */}
            {profile.location && (
              <div className="px-8 sm:px-12 pb-8">
                <div className="flex items-center gap-3 text-gray-400">
                  <MapPin className="w-5 h-5 text-[#00d4ff]" />
                  <span>{profile.location}</span>
                </div>
              </div>
            )}

            {/* Social Links */}
            {profile.socials && (
              <div className="px-8 sm:px-12 pb-8">
                <h3 className="text-white font-semibold mb-4">Réseaux sociaux</h3>
                <div className="grid grid-cols-2 gap-3">
                  {profile.socials.linkedin && (
                    <a
                      href={profile.socials.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-5 py-4 bg-[rgba(10,10,10,0.5)] rounded-2xl border border-[rgba(0,212,255,0.15)] hover:border-[#00d4ff] transition-all duration-300 hover:bg-[rgba(0,212,255,0.05)]"
                    >
                      <svg className="w-6 h-6 text-[#0077b5]" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                      <span className="text-white font-medium">LinkedIn</span>
                    </a>
                  )}
                  {profile.socials.github && (
                    <a
                      href={profile.socials.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-5 py-4 bg-[rgba(10,10,10,0.5)] rounded-2xl border border-[rgba(0,212,255,0.15)] hover:border-[#00d4ff] transition-all duration-300 hover:bg-[rgba(0,212,255,0.05)]"
                    >
                      <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.304.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                      <span className="text-white font-medium">GitHub</span>
                    </a>
                  )}
                  {profile.socials.twitter && (
                    <a
                      href={profile.socials.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-5 py-4 bg-[rgba(10,10,10,0.5)] rounded-2xl border border-[rgba(0,212,255,0.15)] hover:border-[#00d4ff] transition-all duration-300 hover:bg-[rgba(0,212,255,0.05)]"
                    >
                      <svg className="w-6 h-6 text-[#1DA1F2]" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.23-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                      </svg>
                      <span className="text-white font-medium">Twitter</span>
                    </a>
                  )}
                  {profile.socials.instagram && (
                    <a
                      href={profile.socials.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-5 py-4 bg-[rgba(10,10,10,0.5)] rounded-2xl border border-[rgba(0,212,255,0.15)] hover:border-[#00d4ff] transition-all duration-300 hover:bg-[rgba(0,212,255,0.05)]"
                    >
                      <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.584.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.667.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.667-.014 4.947-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.618-6.782-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM12 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                      <span className="text-white font-medium">Instagram</span>
                    </a>
                  )}
                  {profile.socials.facebook && (
                    <a
                      href={profile.socials.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-5 py-4 bg-[rgba(10,10,10,0.5)] rounded-2xl border border-[rgba(0,212,255,0.15)] hover:border-[#00d4ff] transition-all duration-300 hover:bg-[rgba(0,212,255,0.05)]"
                    >
                      <svg className="w-6 h-6 text-[#1877F2]" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.991 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.064 24 12.073z"/>
                      </svg>
                      <span className="text-white font-medium">Facebook</span>
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* QR Code Section */}
            <div className="px-8 sm:px-12 pb-8">
              <button
                onClick={() => setShowQR(!showQR)}
                className="w-full py-4 bg-[rgba(10,10,10,0.5)] text-white font-semibold rounded-2xl border border-[rgba(0,212,255,0.15)] hover:border-[#00d4ff] transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Share2 className="w-5 h-5" />
                {showQR ? "Masquer le QR Code" : "Afficher le QR Code"}
              </button>
              {showQR && (
                <div className="mt-6 p-8 bg-[rgba(10,10,10,0.5)] rounded-2xl border border-[rgba(0,212,255,0.15)] flex items-center justify-center">
                  <QRCodeSVG
                    value={`${window.location.origin}/p/${profile.profile_id}`}
                    size={200}
                    fgColor="#00d4ff"
                    bgColor="#0a0a0a"
                    level="H"
                    includeMargin={true}
                  />
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="px-8 sm:px-12 pb-10 space-y-4">
              <button
                onClick={downloadVCard}
                className="w-full py-5 bg-gradient-to-r from-[#00d4ff] to-[#0099cc] text-white font-bold rounded-3xl transition-all duration-300 hover:shadow-[0_0_40px_rgba(0,212,255,0.4)] flex items-center justify-center gap-3 text-lg"
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
