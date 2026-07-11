import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { WifiOff, Download, User, Mail, Phone, Globe, Linkedin, Facebook, Twitter, Instagram, Github } from 'lucide-react';

export default function OfflinePage() {
  const { id } = useParams();
  const [vCardData, setVCardData] = useState(null);
  const [hasCache, setHasCache] = useState(false);

  useEffect(() => {
    // Essayer de charger depuis le cache localStorage
    loadFromCache();
  }, [id]);

  function loadFromCache() {
    try {
      const cached = localStorage.getItem(`profile_cache_${id}`);
      if (cached) {
        const profile = JSON.parse(cached);
        setVCardData(profile);
        setHasCache(true);
      } else {
        setHasCache(false);
      }
    } catch (error) {
      console.error('Error loading cache:', error);
      setHasCache(false);
    }
  }

  function generateVCard(data) {
    const lines = [];
    lines.push('BEGIN:VCARD');
    lines.push('VERSION:3.0');
    lines.push(`N:${data.last_name};${data.first_name};;;`);
    lines.push(`FN:${data.first_name} ${data.last_name}`);
    
    if (data.title) lines.push(`TITLE:${data.title}`);
    if (data.company) lines.push(`ORG:${data.company}`);
    if (data.email) lines.push(`EMAIL;TYPE=INTERNET:${data.email}`);
    if (data.phone) lines.push(`TEL;TYPE=CELL:${data.phone}`);
    if (data.website) lines.push(`URL:${data.website}`);
    if (data.location) lines.push(`ADR;TYPE=WORK:;;${data.location};;;;`);
    if (data.photo_url) lines.push(`PHOTO;VALUE=uri:${data.photo_url}`);
    
    // Réseaux sociaux dans les notes
    if (data.socials) {
      const socialLines = [];
      if (data.socials.linkedin) socialLines.push(`LinkedIn: ${data.socials.linkedin}`);
      if (data.socials.twitter) socialLines.push(`Twitter: ${data.socials.twitter}`);
      if (data.socials.facebook) socialLines.push(`Facebook: ${data.socials.facebook}`);
      if (data.socials.instagram) socialLines.push(`Instagram: ${data.socials.instagram}`);
      if (data.socials.github) socialLines.push(`GitHub: ${data.socials.github}`);
      
      if (socialLines.length > 0) {
        lines.push(`NOTE:${socialLines.join(' | ')}`);
      }
    }
    
    lines.push('END:VCARD');
    return lines.join('\r\n');
  }

  function downloadVCard() {
    if (!vCardData) return;
    
    const vCardText = generateVCard(vCardData);
    const blob = new Blob([vCardText], { type: 'text/vcard;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${vCardData.first_name}_${vCardData.last_name}.vcf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  function retryConnection() {
    window.location.reload();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header Offline */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-500/20 mb-4">
            <WifiOff className="w-10 h-10 text-red-400" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Aucune connexion Internet</h1>
          <p className="text-slate-400">
            Vous êtes actuellement hors ligne
          </p>
        </div>

        {hasCache && vCardData ? (
          // Afficher la vCard en cache
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 shadow-2xl">
            {/* Info du profil */}
            <div className="text-center mb-6">
              <div className="w-20 h-20 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-4">
                <User className="w-10 h-10 text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold mb-1">
                {vCardData.first_name} {vCardData.last_name}
              </h2>
              {vCardData.title && (
                <p className="text-slate-300">{vCardData.title}</p>
              )}
              {vCardData.company && (
                <p className="text-slate-400 text-sm">{vCardData.company}</p>
              )}
            </div>

            {/* Informations de contact */}
            <div className="space-y-3 mb-6">
              {vCardData.email && (
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  <span className="text-slate-300 truncate">{vCardData.email}</span>
                </div>
              )}
              
              {vCardData.phone && (
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  <span className="text-slate-300">{vCardData.phone}</span>
                </div>
              )}
              
              {vCardData.website && (
                <div className="flex items-center gap-3 text-sm">
                  <Globe className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  <span className="text-slate-300 truncate">{vCardData.website}</span>
                </div>
              )}

              {/* Réseaux sociaux */}
              {vCardData.socials && (
                <div className="flex items-center gap-2 pt-2">
                  {vCardData.socials.linkedin && (
                    <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center">
                      <Linkedin className="w-4 h-4 text-blue-400" />
                    </div>
                  )}
                  {vCardData.socials.facebook && (
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <Facebook className="w-4 h-4 text-blue-400" />
                    </div>
                  )}
                  {vCardData.socials.twitter && (
                    <div className="w-8 h-8 rounded-full bg-sky-500/20 flex items-center justify-center">
                      <Twitter className="w-4 h-4 text-sky-400" />
                    </div>
                  )}
                  {vCardData.socials.instagram && (
                    <div className="w-8 h-8 rounded-full bg-pink-500/20 flex items-center justify-center">
                      <Instagram className="w-4 h-4 text-pink-400" />
                    </div>
                  )}
                  {vCardData.socials.github && (
                    <div className="w-8 h-8 rounded-full bg-slate-700/20 flex items-center justify-center">
                      <Github className="w-4 h-4 text-slate-300" />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Bouton télécharger vCard */}
            <button
              onClick={downloadVCard}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg"
            >
              <Download className="w-5 h-5" />
              Télécharger le contact
            </button>

            <p className="text-center text-xs text-slate-400 mt-4">
              💾 Informations disponibles en mode hors ligne
            </p>
          </div>
        ) : (
          // Pas de cache disponible
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 shadow-2xl text-center">
            <div className="w-16 h-16 rounded-full bg-slate-700/50 flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-slate-300 mb-6">
              Aucune donnée en cache pour ce profil.
              <br />
              Connectez-vous à internet pour voir ce profil.
            </p>
          </div>
        )}

        {/* Bouton réessayer */}
        <button
          onClick={retryConnection}
          className="w-full mt-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200"
        >
          Réessayer la connexion
        </button>

        {/* Info supplémentaire */}
        <div className="mt-6 text-center">
          <p className="text-sm text-slate-400">
            <strong>Astuce :</strong> Installez l'application MakkaNFC pour accéder aux profils même hors ligne.
          </p>
        </div>
      </div>
    </div>
  );
}
