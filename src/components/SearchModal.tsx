import React, { useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Search, X, Clock, ArrowRight, User } from 'lucide-react';

export const SearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, clients, setSelectedClientId, searchQuery, setSearchQuery } = useApp();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isSearchOpen]);

  // Keyboard shortcut listener ⌘K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  if (!isSearchOpen) return null;

  const searchResults = clients.filter(c => 
    (c.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.phone || '').includes(searchQuery) ||
    (c.classTime || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.goal || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-900/60 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl border border-slate-100 overflow-hidden text-slate-900">
        
        {/* Search Input Header */}
        <div className="p-4 border-b border-slate-100 flex items-center gap-3">
          <Search className="w-5 h-5 text-purple-600 pl-1" />
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search clients by name, phone, class time (e.g. 07:00 AM)..."
            className="w-full text-sm font-semibold text-slate-900 focus:outline-none placeholder:text-slate-400 placeholder:font-medium"
          />
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-2">
          {searchResults.length === 0 ? (
            <p className="text-xs text-slate-400 font-medium py-8 text-center">
              No clients found matching "{searchQuery}"
            </p>
          ) : (
            searchResults.map(client => (
              <div
                key={client.id}
                onClick={() => {
                  setSelectedClientId(client.id);
                  setIsSearchOpen(false);
                }}
                className="p-3.5 rounded-2xl hover:bg-purple-50/80 cursor-pointer flex items-center justify-between transition-colors border border-transparent hover:border-purple-100 group"
              >
                <div className="flex items-center gap-3.5">
                  <img src={client.photoUrl} alt={client.name} className="w-10 h-10 rounded-xl object-cover" />
                  <div>
                    <h5 className="font-extrabold text-slate-900 text-xs group-hover:text-purple-700 transition-colors">
                      {client.name}
                    </h5>
                    <p className="text-[11px] text-slate-500 font-medium">
                      ⏰ {client.classTime} • {client.phone}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-2.5 py-1 rounded-lg">
                    {client.sessionType}
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Hint */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 text-[11px] font-semibold text-slate-400 flex justify-between px-5">
          <span>Search tip: Type time like "07:00" or goal "Back Pain"</span>
          <span>Press <kbd className="bg-white border rounded px-1 text-slate-600">ESC</kbd> to close</span>
        </div>

      </div>
    </div>
  );
};
