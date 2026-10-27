import React from 'react';
import { ArrowUp, Gamepad2, Leaf, Moon, Sparkles } from 'lucide-react';
import gamesSectionPreviewImage from '../assets/optimized/games-section-preview.webp';
import lofiRoomWallpaperImage from '../assets/optimized/lofi-room-wallpaper.webp';

export default function UnwindTab(props) {
  const {
    difficultyOptions,
    gameVisualTheme,
    isFullscreen,
    returnToGameLibrary,
    selectedDifficultyConfig,
    selectedGameDifficulty,
    selectedGameInterfaceRef,
    selectedUnwindGame,
    selectedUnwindGameConfig,
    setGameVisualTheme,
    setSelectedGameDifficulty,
    toggleFullscreen,
    unwindGames,
    unwindViewMode
  } = props;

  return (
      <div id="game-library" className="mx-auto max-w-[1280px] px-2 py-5 sm:px-4 sm:py-8 lg:px-6 lg:py-14 fade-in">
        {unwindViewMode === 'detail' && (
          <div className={`game-detail-reveal ${isFullscreen ? 'mb-0 scroll-mt-0' : 'mb-16 scroll-mt-24'}`}>
            {!isFullscreen && (
              <button className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-200/50 bg-white/88 px-4 py-2 text-sm font-extrabold text-sage-800 shadow-sm transition hover:-translate-x-0.5 hover:bg-white" onClick={returnToGameLibrary} type="button">
                <span aria-hidden="true">←</span> Back to games
              </button>
            )}
            <div ref={selectedGameInterfaceRef} className={`lofi-glass lofi-picture-border lofi-border-memory relative overflow-hidden backdrop-blur ${isFullscreen ? 'is-fullscreen fixed inset-0 z-[120] flex h-[100dvh] w-screen flex-col overflow-auto rounded-none border-0 bg-[#fff7ec] p-0 shadow-none sm:overflow-hidden' : 'rounded-[3rem] border p-3 shadow-soft sm:p-4 lg:p-5'} ${!isFullscreen && gameVisualTheme === 'lofi' ? 'border-[#e8dfd5] bg-[#fffaf2]/85' : ''}`}>
              {!isFullscreen && gameVisualTheme === 'lofi' && (
                <>
                  <img src={lofiRoomWallpaperImage} alt="" className="pointer-events-none absolute inset-0 h-full w-full scale-105 object-cover opacity-[0.07] blur-[1px]" aria-hidden="true" />
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.82),transparent_38%),linear-gradient(135deg,rgba(255,250,242,0.92),rgba(250,237,205,0.7),rgba(255,200,221,0.38))]" />
                </>
              )}
              {!isFullscreen && (
              <div className={`relative z-10 rounded-[1.7rem] border p-4 shadow-sm ${gameVisualTheme === 'lofi' ? 'border-amber-200/40 bg-white/60' : 'border-[#e8dfd5] bg-sage-50/55'}`}>
                <div className={`flex flex-col gap-4 ${isFullscreen ? 'lg:flex-row lg:items-start lg:justify-between' : 'xl:flex-row xl:items-center xl:justify-between'}`}>
                  <div className="min-w-0">
                    <p className={`text-[11px] font-extrabold uppercase tracking-[0.22em] ${gameVisualTheme === 'lofi' ? 'text-amber-800/80' : 'text-sage-600'}`}>Now playing</p>
                    <h1 className={`mt-2 font-display font-bold tracking-tight ${isFullscreen ? 'text-3xl sm:text-4xl' : 'text-4xl'} ${gameVisualTheme === 'lofi' ? 'text-[#3d3025]' : 'text-sage-950'}`}>{selectedUnwindGameConfig.title}</h1>
                    <p className={`mt-2 max-w-2xl text-sm leading-7 ${isFullscreen ? 'hidden sm:block' : ''} ${gameVisualTheme === 'lofi' ? 'text-[#6e5a4a]' : 'text-sage-700'}`}>{selectedUnwindGameConfig.description}</p>
                  </div>
                  <div className={`flex w-full flex-col gap-2 ${isFullscreen ? 'lg:max-w-[36rem] lg:items-end' : 'xl:max-w-[32rem] xl:items-end'}`}>
                    <div className={`flex flex-wrap gap-2 ${isFullscreen ? 'lg:justify-end' : 'xl:justify-end'}`}>
                      <div className={`flex h-11 items-center gap-1 rounded-2xl border bg-white p-1 shadow-sm ${gameVisualTheme === 'lofi' ? 'border-amber-200' : 'border-amber-200/50'}`}>
                        {[
                          { id: 'original', label: 'Original', icon: Sparkles },
                          { id: 'lofi', label: 'Lofi', icon: Moon }
                        ].map((t) => (
                          <button
                            key={t.id}
                            onClick={() => setGameVisualTheme(t.id)}
                            className={`flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-black uppercase tracking-widest transition ${gameVisualTheme === t.id ? (t.id === 'lofi' ? 'bg-[#4a3a2d] text-white shadow-sm' : 'bg-sage-900 text-white shadow-sm') : 'text-sage-500 hover:bg-sage-50'}`}
                            type="button"
                          >
                            <t.icon size={13} /> {t.label}
                          </button>
                        ))}
                      </div>
                      <button onClick={toggleFullscreen} className={`flex h-11 items-center gap-2 rounded-2xl border bg-white px-5 text-sm font-bold shadow-sm transition hover:-translate-y-0.5 hover:bg-sage-50 ${gameVisualTheme === 'lofi' ? 'border-amber-200 text-[#4a3a2d]' : 'border-amber-200/50 text-sage-700'}`} type="button">
                        {isFullscreen ? <ArrowUp size={16} className="rotate-180" /> : <ArrowUp size={16} />}
                        {isFullscreen ? 'Exit full' : 'Full screen'}
                      </button>
                      <button onClick={returnToGameLibrary} className={`flex h-11 items-center gap-2 rounded-2xl border bg-white px-5 text-sm font-bold shadow-sm transition hover:-translate-y-0.5 hover:bg-sage-50 ${gameVisualTheme === 'lofi' ? 'border-amber-200 text-[#4a3a2d]' : 'border-amber-200/50 text-sage-700'}`} type="button">
                        <Gamepad2 size={16} />
                        Back to games
                      </button>
                    </div>
                    <p className={`text-[11px] font-extrabold uppercase tracking-[0.2em] ${gameVisualTheme === 'lofi' ? 'text-amber-800/80' : 'text-sage-600'}`}>Difficulty in-game</p>
                    <div className={`flex flex-wrap gap-2 ${isFullscreen ? 'lg:justify-end' : 'xl:justify-end'}`}>
                      {difficultyOptions.map((difficulty) => (
                        <button
                          key={difficulty.id}
                          className={`rounded-full px-4 py-2 text-sm font-extrabold transition ${selectedGameDifficulty === difficulty.id ? (gameVisualTheme === 'lofi' ? 'bg-[#4a3a2d] text-white shadow-sm' : 'bg-sage-900 text-white shadow-sm') : `border bg-white hover:bg-sage-50 ${gameVisualTheme === 'lofi' ? 'border-amber-200 text-[#4a3a2d]' : 'border-amber-200/50 text-sage-800'}`}`}
                          onClick={() => setSelectedGameDifficulty(difficulty.id)}
                          type="button"
                        >
                          {difficulty.label}
                          <span className={`ml-2 text-[10px] uppercase tracking-[0.18em] ${selectedGameDifficulty === difficulty.id ? 'text-white/90' : (gameVisualTheme === 'lofi' ? 'text-amber-800/70' : 'text-sage-500')}`}>{difficulty.detail}</span>
                        </button>
                      ))}
                    </div>
                    <p className={`text-xs font-semibold ${gameVisualTheme === 'lofi' ? 'text-[#6e5a4a]' : 'text-sage-600'}`}>Current setting: {selectedDifficultyConfig.label} — {selectedDifficultyConfig.detail}</p>
                  </div>
                </div>
              </div>
              )}
              <div className={`relative z-10 mx-auto w-full ${isFullscreen ? 'flex min-h-0 flex-1 max-w-none overflow-auto' : `mt-5 ${selectedUnwindGameConfig.playingSpace || 'max-w-[980px]'}`}`}>
                <React.Suspense fallback={
                  <div className="flex min-h-[320px] items-center justify-center rounded-[2rem] border border-[#c4b8a7]/40 bg-white/80 text-[#6f5948] backdrop-blur">
                    <div className="text-center">
                      <Leaf className="mx-auto mb-3 h-7 w-7 animate-pulse text-[#8e7159]" />
                      <p className="text-sm font-bold">Loading calm game...</p>
                    </div>
                  </div>
                }>
                  {selectedUnwindGameConfig.component}
                </React.Suspense>
              </div>
            </div>
          </div>
        )}
         <div className={unwindViewMode === 'detail' ? 'mt-24 opacity-80 pt-16 border-t border-[#e8dfd5] site-ui-fade-in' : 'game-library-enter'}>
          {unwindViewMode === 'detail' && (
            <div className="mb-10 text-center">
              <h2 className="font-display text-3xl font-bold tracking-tight text-sage-950">Discover more games</h2>
              <p className="mt-2 text-sage-600">Pick another one whenever you are ready.</p>
            </div>
          )}
          <div className="mb-14">
            {unwindViewMode === 'grid' && (
              <div className="lofi-picture-border lofi-border-memory relative overflow-hidden rounded-[3.2rem] border border-[#8b5e3c]/25 p-8 shadow-[0_32px_90px_rgba(83,62,44,0.18)] lg:p-10 xl:p-12">
                <img src={gamesSectionPreviewImage} alt="" className="absolute inset-0 h-full w-full object-cover" aria-hidden="true" />
                <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/25 to-black/5" />
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(255,255,255,0.15),transparent_25rem)]" />
                <div className="relative z-10">
                  <h1 className="font-display text-5xl font-bold tracking-tight text-white lofi-sharp-text md:text-7xl">Games</h1>
                  <p className="mt-3 text-xs font-black uppercase tracking-[0.34em] text-white/95 lofi-sharp-text-soft">Chill games</p>
                  <p className="mt-6 max-w-2xl text-base font-bold leading-7 text-white lofi-sharp-text-soft">Start with cozy Solitaire or Mind Sweeper, then explore more relaxing browser games while the lofi music keeps the page calm.</p>
                </div>
              </div>
            )}
          </div>
          <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {unwindGames.map((game) => {
              const isSelected = selectedUnwindGame === game.id;
              return (
                <button
                  key={game.id}
                  className={`group relative flex flex-col overflow-hidden rounded-[2.7rem] border p-1 text-left transition-all duration-500 hover:-translate-y-1.5 ${
                    isSelected ? 'border-amber-200 bg-white ring-4 ring-amber-100 ring-offset-4 ring-offset-[#fff7ec]' : 'border-white/70 bg-white/44 hover:bg-white/66'
                  }`}
                  onClick={() => selectUnwindGame(game.id)}
                  type="button"
                >
                  <div className="relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-[2.45rem] bg-gradient-to-br shadow-inner">
                    <img src={game.preview} alt={`${game.title} preview`} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/44 via-black/8 to-white/8" />
                    {isSelected ? (
                      <span className="absolute bottom-4 right-4 rounded-full bg-white/88 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-[#6e543c] shadow-sm backdrop-blur-sm">Active</span>
                    ) : null}
                  </div>
                  <div className="w-full rounded-[2.15rem] bg-[#fff8f1]/96 p-5 shadow-[0_-16px_36px_rgba(255,255,255,0.24)]">
                    <h2 className="font-display text-xl font-bold text-[#3f3126]">{game.title}</h2>
                    <p className="mt-1 text-[10px] font-black uppercase tracking-[0.22em] text-[#7b5d44]/85">{game.detail}</p>
                  </div>
                </button>
              );
            })}
          </div>
                      </div>
      </div>
  );
}
