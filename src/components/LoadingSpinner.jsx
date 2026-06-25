import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="text-center">
        <div className="relative">
          {/* Background glow effect */}
          <div className="absolute inset-0 bg-[#00d4ff]/20 rounded-full blur-3xl animate-pulse-glow"></div>
          {/* Spinner */}
          <Loader2 className="w-16 h-16 text-[#00d4ff] animate-spin mx-auto mb-4 relative z-10" />
        </div>
        <p className="text-white text-xl font-semibold">Chargement...</p>
      </div>
    </div>
  );
}