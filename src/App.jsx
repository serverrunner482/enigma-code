/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Search, Gamepad2, X, Maximize2, Minimize2, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import gamesData from './games.json';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGame, setSelectedGame] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const filteredGames = useMemo(() => {
    return gamesData.filter(game =>
      game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-zinc-900 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-zinc-900 p-1.5 rounded-lg">
              <Gamepad2 className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight hidden sm:block">
              Unblocked<span className="text-zinc-500">Games</span>
            </h1>
          </div>

          <div className="flex-1 max-w-md mx-4">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-zinc-900 transition-colors" />
              <input
                type="text"
                placeholder="Search games..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-100 border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-zinc-900 transition-all outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider hidden md:block">
              {filteredGames.length} Games Available
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredGames.map((game) => (
              <motion.div
                key={game.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                whileHover={{ y: -4 }}
                className="group bg-white rounded-2xl overflow-hidden border border-zinc-200 shadow-sm hover:shadow-md transition-all cursor-pointer"
                onClick={() => setSelectedGame(game)}
              >
                <div className="aspect-video relative overflow-hidden">
                  <img
                    src={game.thumbnail}
                    alt={game.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="bg-white text-zinc-900 px-4 py-2 rounded-full text-sm font-semibold shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">
                      Play Now
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-1">{game.title}</h3>
                  <p className="text-zinc-500 text-sm line-clamp-2">{game.description}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredGames.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-zinc-100 mb-4">
              <Search className="w-8 h-8 text-zinc-300" />
            </div>
            <h3 className="text-lg font-medium text-zinc-900">No games found</h3>
            <p className="text-zinc-500">Try searching for something else.</p>
          </div>
        )}
      </main>

      {/* Game Player Modal */}
      <AnimatePresence>
        {selectedGame && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className={`bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col transition-all duration-300 ${
                isFullscreen ? 'fixed inset-0 rounded-none' : 'w-full max-w-5xl aspect-[16/10]'
              }`}
            >
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between bg-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl overflow-hidden border border-zinc-200">
                    <img src={selectedGame.thumbnail} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div>
                    <h2 className="font-bold text-lg leading-tight">{selectedGame.title}</h2>
                    <p className="text-xs text-zinc-400 uppercase tracking-wider font-medium">Playing Now</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleFullscreen}
                    className="p-2 hover:bg-zinc-100 rounded-xl transition-colors text-zinc-500 hover:text-zinc-900"
                    title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                  >
                    {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                  </button>
                  <a
                    href={selectedGame.iframeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 hover:bg-zinc-100 rounded-xl transition-colors text-zinc-500 hover:text-zinc-900"
                    title="Open in new tab"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </a>
                  <div className="w-px h-6 bg-zinc-200 mx-1" />
                  <button
                    onClick={() => {
                      setSelectedGame(null);
                      setIsFullscreen(false);
                    }}
                    className="p-2 hover:bg-zinc-100 rounded-xl transition-colors text-zinc-500 hover:text-zinc-900"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Iframe Container */}
              <div className="flex-1 bg-zinc-900 relative">
                <iframe
                  src={selectedGame.iframeUrl}
                  className="w-full h-full border-none"
                  title={selectedGame.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="bg-white border-t border-zinc-200 py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="bg-zinc-900 p-1.5 rounded-lg">
                <Gamepad2 className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold tracking-tight">UnblockedGames</span>
            </div>
            <p className="text-zinc-400 text-sm">
              &copy; {new Date().getFullYear()} Unblocked Games Hub. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm font-medium text-zinc-500">
              <a href="#" className="hover:text-zinc-900 transition-colors">Privacy</a>
              <a href="#" className="hover:text-zinc-900 transition-colors">Terms</a>
              <a href="#" className="hover:text-zinc-900 transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
