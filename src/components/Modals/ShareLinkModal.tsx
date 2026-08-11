import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Copy, Check, MessageCircle, Share2, QrCode, Sparkles, ExternalLink } from 'lucide-react';

interface ShareLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareLinkModal: React.FC<ShareLinkModalProps> = ({ isOpen, onClose }) => {
  const { showSuccessToast } = useApp();
  const [copied, setCopied] = useState(false);
  const [copiedMsg, setCopiedMsg] = useState(false);

  if (!isOpen) return null;

  const shareableUrl = `${window.location.origin}/?join=true`;
  const fullMessage = `Hi! 👋 Please click this link to complete your Yoga Registration details for Yoganjali Studio with Anjali Negi:\n\n${shareableUrl}\n\nLooking forward to starting your personalized yoga sessions! 🧘‍♀️🌿`;

  const copyToClipboard = (text: string): boolean => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text);
        return true;
      }
    } catch (e) {
      console.warn('Clipboard API failed, using textarea fallback:', e);
    }

    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      textArea.remove();
      return true;
    } catch (err) {
      console.error('Fallback copy failed:', err);
      return false;
    }
  };

  const handleCopyLink = () => {
    copyToClipboard(shareableUrl);
    setCopied(true);
    showSuccessToast('📋 Client Registration Link copied to clipboard!');
    setTimeout(() => setCopied(false), 3000);
  };

  const handleCopyFullMessage = () => {
    copyToClipboard(fullMessage);
    setCopiedMsg(true);
    showSuccessToast('💬 Full WhatsApp Message & Link copied to clipboard!');
    setTimeout(() => setCopiedMsg(false), 3000);
  };

  const handleWhatsAppShare = () => {
    copyToClipboard(fullMessage);
    
    // Modern universal wa.me link format
    const waUrl = `https://wa.me/?text=${encodeURIComponent(fullMessage)}`;
    window.open(waUrl, '_blank');
    showSuccessToast('💬 WhatsApp opened! Full Message also copied to clipboard.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-200 overflow-hidden text-slate-900">
        
        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-inner">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">Shareable Client Onboarding Link</h3>
              <p className="text-[11px] text-purple-200">Send this link to new clients to self-feed their data</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6 text-xs font-sans">
          
          <div className="p-4 rounded-2xl bg-purple-50 border border-purple-100 text-purple-900 space-y-2">
            <span className="font-extrabold text-xs flex items-center gap-1.5 text-purple-800">
              <Sparkles className="w-4 h-4 text-purple-600" /> How Client Data Feeding Works:
            </span>
            <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
              When clients open this link, they fill out their Name, Phone, Class Time, Fee Plan, Schedule & Health Goals. Submitting automatically syncs their full profile into your Trainer Dashboard!
            </p>
          </div>

          {/* Link Box & Copy Button */}
          <div className="space-y-1.5">
            <label className="block font-bold text-slate-700 text-xs">Direct Client Registration Link</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={shareableUrl}
                className="flex-1 px-3.5 py-3 rounded-2xl bg-slate-100 border border-slate-200 text-slate-800 font-mono text-xs select-all outline-none"
              />
              <button
                onClick={handleCopyLink}
                className={`px-4 py-3 rounded-2xl font-extrabold text-xs transition-all flex items-center gap-1.5 shrink-0 ${
                  copied 
                    ? 'bg-emerald-600 text-white shadow-md' 
                    : 'bg-purple-600 hover:bg-purple-700 text-white shadow-md hover:scale-105'
                }`}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={handleWhatsAppShare}
              className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" /> Send on WhatsApp
            </button>

            <a
              href={shareableUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-lg transition-all flex items-center justify-center gap-2 text-center"
            >
              <ExternalLink className="w-4 h-4" /> Open Link
            </a>
          </div>

        </div>

      </div>
    </div>
  );
};
