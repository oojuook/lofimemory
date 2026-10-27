import React from 'react';
import { ImagePlus, Palette, Quote, Sparkles, Trash2 } from 'lucide-react';
import fireWallpaperImage from '../assets/optimized/fire-wallpaper.webp';
import hogwartsMusicRoomImage from '../assets/optimized/hogwarts-music-room.webp';
import lofiMemoryHeaderImage from '../assets/optimized/lofi-memory-header.webp';
import lofiRoomWallpaperImage from '../assets/optimized/lofi-room-wallpaper.webp';
import radioVinylIcon from '../assets/optimized/lofi-radio-vinyl.webp';
import rainWallpaperImage from '../assets/optimized/rain-wallpaper.webp';

const colorThemes = [
  { id: 'sage', name: 'Lofi Vinyl', accent: '#4f6b45', soft: '#edf4e8', glow: '#b8d4aa', image: radioVinylIcon, imageTone: 'from-[#172217]/55 via-transparent to-[#4f6b45]/50' },
  { id: 'lavender', name: 'Midnight Jazz', accent: '#6651a6', soft: '#f0ecfb', glow: '#c6b7ec', image: hogwartsMusicRoomImage, imageTone: 'from-[#151223]/62 via-[#392f68]/12 to-[#6651a6]/58' },
  { id: 'ocean', name: 'Cassette Blue', accent: '#336f8b', soft: '#e7f3f8', glow: '#a6d4e2', image: rainWallpaperImage, imageTone: 'from-[#0f2d3a]/58 via-transparent to-[#336f8b]/58' },
  { id: 'sunrise', name: 'Sunset Radio', accent: '#b46c3d', soft: '#fff0df', glow: '#edbd8c', image: fireWallpaperImage, imageTone: 'from-[#3a2112]/58 via-transparent to-[#b46c3d]/62' },
  { id: 'rose', name: 'Rose Piano', accent: '#9f6278', soft: '#fbebf0', glow: '#e6b5c6', image: lofiRoomWallpaperImage, imageTone: 'from-[#311924]/58 via-transparent to-[#9f6278]/58' }
];

const designStyles = [
  { id: 'soft', name: 'Soft Cards', description: 'Rounded, airy, and gentle.', radius: '1.5rem', texture: 'none' },
  { id: 'editorial', name: 'Editorial', description: 'More magazine-like and refined.', radius: '0.85rem', texture: 'linear-gradient(135deg, rgba(255,255,255,0.52), rgba(255,255,255,0))' },
  { id: 'playful', name: 'Playful Calm', description: 'Bubbly shapes with a lighter mood.', radius: '2.25rem', texture: 'radial-gradient(circle at 15% 20%, rgba(255,255,255,0.55), transparent 28%)' }
];

const quoteCardColors = [
  { name: 'Forest', value: '#45643b' },
  { name: 'Lavender', value: '#6f5c99' },
  { name: 'Ocean', value: '#2f7585' },
  { name: 'Clay', value: '#9a6847' },
  { name: 'Rose', value: '#9b5f6b' },
  { name: 'Charcoal', value: '#2f3a37' }
];

const journalAtmospherePresets = [
  {
    id: 'quiet-morning',
    name: 'Quiet Morning',
    note: 'Warm light, elegant words, and a steady pace.',
    themeId: 'sunrise',
    designId: 'soft',
    quoteBg: '#9a6847',
    journalFontId: 'serif',
    quoteFontId: 'serif',
    companionAnimation: 'float'
  },
  {
    id: 'rainy-window',
    name: 'Rainy Window',
    note: 'Cool tones for slower thoughts and softer check-ins.',
    themeId: 'ocean',
    designId: 'editorial',
    quoteBg: '#2f7585',
    journalFontId: 'serif',
    quoteFontId: 'sans',
    companionAnimation: 'wave'
  },
  {
    id: 'soft-night',
    name: 'Soft Night',
    note: 'A gentle evening mood for deeper reflection.',
    themeId: 'lavender',
    designId: 'editorial',
    quoteBg: '#6f5c99',
    journalFontId: 'sans',
    quoteFontId: 'serif',
    companionAnimation: 'breathe'
  },
  {
    id: 'golden-dusk',
    name: 'Golden Dusk',
    note: 'Cozy warmth when you want the page to feel personal.',
    themeId: 'rose',
    designId: 'playful',
    quoteBg: '#9b5f6b',
    journalFontId: 'hand',
    quoteFontId: 'hand',
    companionAnimation: 'bounce'
  }
];

export default function ThemeStudio({
  selectedTheme,
  selectedDesign,
  customColor,
  quoteBg,
  journalStyle,
  quoteStyle,
  customWeatherName,
  customWeatherEmoji,
  customWeatherImage,
  customCdImage,
  customWeathers,
  wallpaperImage,
  isOpen,
  onClose,
  onThemeChange,
  onDesignChange,
  onCustomColorChange,
  onQuoteBgChange,
  onAtmosphereApply,
  onCustomWeatherNameChange,
  onCustomWeatherEmojiChange,
  onCustomWeatherImageUpload,
  onCustomCdImageUpload,
  onCustomCdImageRemove,
  onWallpaperImageUpload,
  onWallpaperRemove,
  onAddCustomWeather,
  onDeleteCustomWeather
}) {
  const activeThemePreview = colorThemes.find((theme) => theme.id === selectedTheme) || colorThemes[0];
  const currentCdArt = customCdImage || activeThemePreview.image || radioVinylIcon;

  return (
    <div className={`customizer-shell fixed inset-y-0 right-0 z-30 flex transition ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
      <div className={`fixed inset-0 bg-ink/20 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`} onClick={onClose} />
      <aside id="design" className={`relative h-full w-screen max-w-5xl overflow-y-auto bg-[#2b231d] shadow-[0_0_60px_rgba(0,0,0,0.6)] backdrop-blur-3xl transition duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="grid min-h-full lg:grid-cols-12">
          <div className="theme-panel relative flex flex-col p-7 text-white lg:col-span-4 lg:p-10">
            <div className="absolute inset-0 z-0 h-full w-full overflow-hidden">
              <img src={lofiMemoryHeaderImage} alt="" className="absolute inset-0 h-full w-full object-cover object-center" aria-hidden="true" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/80" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(255,255,255,0.08),transparent_35rem)]" />
            </div>
            <div className="relative z-10 flex items-start justify-between gap-4">
              <Palette className="text-white lofi-sharp-text" size={34} />
              <button className="rounded-full border border-white/30 bg-white/20 px-4 py-2 text-sm font-bold text-white lofi-sharp-chip shadow-sm backdrop-blur-md transition hover:bg-white/30 lg:hidden" onClick={onClose} type="button">Done</button>
            </div>
            <div className="relative z-10 mt-auto pt-32 lg:pt-0">
              <p className="text-sm font-black uppercase tracking-widest text-white/95 lofi-sharp-text-soft">Customize your space</p>
              <h2 className="mt-3 font-display text-4xl font-bold leading-tight text-white lofi-sharp-text">Choose the design that fits today.</h2>
              <p className="mt-4 font-bold leading-7 text-white lofi-sharp-text-soft">Visitors can personalize the room with design cards, CD art, colors, and style. Their choice is saved only in their own browser.</p>
            </div>
          </div>
          <div className="space-y-7 bg-[#2b231d] p-7 lg:col-span-8 lg:p-10">
            <div className="hidden lg:flex lg:justify-end">
              <button className="rounded-full border border-white/25 bg-white/10 px-6 py-2.5 text-sm font-extrabold text-white lofi-sharp-chip shadow-sm backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-white/20" onClick={onClose} type="button">Done</button>
            </div>
            <div>
              <div className="mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-widest text-white/95 lofi-sharp-text-soft"><Palette size={16} /> Design</div>
              <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
                {colorThemes.map((theme) => (
                  <button
                    className={`custom-option group rounded-3xl border p-4 text-left shadow-sm backdrop-blur-md transition hover:-translate-y-1 ${selectedTheme === theme.id ? 'is-selected border-white/60 bg-white/30 shadow-[0_0_24px_rgba(255,255,255,0.25)]' : 'border-white/20 bg-white/10 hover:bg-white/20'}`}
                    key={theme.id}
                    onClick={() => {
                      onThemeChange(theme.id);
                    }}
                    type="button"
                  >
                    <span className="relative mb-3 block h-24 w-full overflow-hidden rounded-2xl border border-white/20 shadow-inner" style={{ background: `linear-gradient(135deg, ${theme.soft}, ${theme.accent})` }}>
                      <span className="absolute inset-0 opacity-35" style={{ backgroundImage: `radial-gradient(circle at 20% 20%, rgba(255,255,255,0.9), transparent 1.6rem), linear-gradient(135deg, transparent, ${theme.accent})` }} />
                      <span className="absolute left-1/2 top-1/2 h-[4.5rem] w-[4.5rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/55 shadow-[0_10px_22px_rgba(0,0,0,0.22)]" style={{ background: `conic-gradient(from 30deg, rgba(255,255,255,0.88), ${theme.glow}, rgba(255,255,255,0.72), ${theme.accent}, rgba(255,255,255,0.88))` }}>
                        <img src={customCdImage || theme.image} alt="" className="absolute inset-[0.7rem] h-[calc(100%-1.4rem)] w-[calc(100%-1.4rem)] rounded-full object-cover" aria-hidden="true" />
                        <span className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/70 bg-[#2b231d]/80 shadow-inner" />
                        <span className="absolute inset-0 rounded-full border border-white/30" />
                      </span>
                      <span className="absolute bottom-2 left-2 h-2.5 w-2.5 rounded-full border border-white/70 shadow-sm" style={{ background: theme.accent }} />
                    </span>
                    <span className="block text-sm font-extrabold text-white lofi-sharp-text">{theme.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-white/20 bg-white/10 p-5 shadow-sm backdrop-blur-md">
              <div className="mb-3 flex items-center gap-2 text-sm font-black uppercase tracking-widest text-white/95 lofi-sharp-text-soft"><ImagePlus size={16} /> Custom CD design</div>
              <p className="text-sm font-bold leading-6 text-white/95 lofi-sharp-text-soft">Upload your own picture to place it on the CD label. It stays local in this browser and updates the design cards and player disc.</p>
              <div className="mt-4 grid gap-4 md:grid-cols-[minmax(0,1fr)_10rem] md:items-center">
                <label className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed border-white/30 bg-white/10 px-4 py-4 text-sm font-bold text-white transition hover:bg-white/20">
                  <ImagePlus size={18} /> Upload CD art
                  <input accept="image/*" className="hidden" onChange={onCustomCdImageUpload} type="file" />
                </label>
                <button className="rounded-2xl border border-white/20 bg-white/10 px-4 py-4 text-sm font-extrabold text-white transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-45" disabled={!customCdImage} onClick={onCustomCdImageRemove} type="button">
                  <Trash2 size={15} className="mr-1 inline" /> Reset CD
                </button>
              </div>
              <div className="mt-4 flex items-center gap-4 rounded-3xl border border-white/15 bg-black/10 p-4">
                <span className="relative block h-20 w-20 shrink-0 rounded-full border border-white/50 shadow-[0_12px_28px_rgba(0,0,0,0.24)]" style={{ background: 'conic-gradient(from 25deg, rgba(255,255,255,0.9), rgba(184,212,170,0.9), rgba(255,255,255,0.74), rgba(79,107,69,0.88), rgba(255,255,255,0.9))' }}>
                  <img src={currentCdArt} alt="" className="absolute inset-[0.85rem] h-[calc(100%-1.7rem)] w-[calc(100%-1.7rem)] rounded-full object-cover" aria-hidden="true" />
                  <span className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/70 bg-[#2b231d]/80 shadow-inner" />
                </span>
                <p className="text-sm font-bold leading-6 text-white/90 lofi-sharp-text-soft">{customCdImage ? 'Custom CD art is active across the design cards and player disc.' : `${activeThemePreview.name} is active on the design cards and player disc.`}</p>
              </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-3">
              <label className="custom-option rounded-3xl border border-white/20 bg-white/10 p-5 shadow-sm backdrop-blur-md lg:col-span-1 block">
                <span className="mb-3 block text-sm font-black uppercase tracking-widest text-white/95 lofi-sharp-text-soft">Custom color</span>
                <input
                  aria-label="Choose a custom accent color"
                  className="h-12 w-full cursor-pointer rounded-2xl border border-white/30 bg-black/20 p-1 backdrop-blur"
                  onChange={(event) => {
                    onCustomColorChange(event.target.value);
                    onThemeChange('custom');
                  }}
                  type="color"
                  value={customColor}
                />
                <span className="mt-3 block text-sm font-bold text-white/95 lofi-sharp-text-soft">Pick any accent color.</span>
              </label>
              <div className="grid gap-3 lg:col-span-2">
                {designStyles.map((style) => (
                  <button
                    className={`custom-option flex items-center justify-between rounded-3xl border p-4 text-left shadow-sm backdrop-blur-md transition hover:-translate-y-1 ${selectedDesign === style.id ? 'is-selected border-white/60 bg-white/30 shadow-[0_0_24px_rgba(255,255,255,0.25)]' : 'border-white/20 bg-white/10 hover:bg-white/20'}`}
                    key={style.id}
                    onClick={() => {
                      onDesignChange(style.id);
                    }}
                    type="button"
                  >
                    <span>
                      <span className="block font-extrabold text-white lofi-sharp-text">{style.name}</span>
                      <span className="text-sm font-bold text-white/95 lofi-sharp-text-soft">{style.description}</span>
                    </span>
                    <span className="theme-dot h-8 w-8 rounded-full border border-white/30 shadow-inner" />
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-white/20 bg-white/10 p-5 shadow-sm backdrop-blur-md">
              <div className="mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-widest text-white/95 lofi-sharp-text-soft"><ImagePlus size={16} /> Wallpaper</div>
              <p className="text-sm leading-6 text-sage-700">Import your own calm wallpaper. It stays soft behind the app with a blur overlay so the page still feels minimal and easy to read.</p>
              <div className="mt-4 grid gap-4 md:grid-cols-[minmax(0,1fr)_14rem] md:items-center">
                <label className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed border-sage-300 bg-sage-50/80 px-4 py-4 text-sm font-bold text-sage-800 transition hover:bg-sage-100">
                  <ImagePlus size={18} /> Import wallpaper
                  <input accept="image/*" className="hidden" onChange={onWallpaperImageUpload} type="file" />
                </label>
                <button className="rounded-2xl border border-amber-200/50 bg-white px-4 py-4 text-sm font-extrabold text-sage-700 transition hover:bg-sage-50 disabled:cursor-not-allowed disabled:opacity-50" disabled={!wallpaperImage} onClick={onWallpaperRemove} type="button">
                  Remove wallpaper
                </button>
              </div>
              {wallpaperImage && (
                <div className="mt-4 overflow-hidden rounded-3xl border border-[#e8dfd5] bg-sage-50 p-3">
                  <div className="h-36 rounded-2xl bg-cover bg-center shadow-inner" style={{ backgroundImage: `url(${wallpaperImage})` }} />
                  <p className="mt-3 text-sm font-semibold leading-6 text-sage-700">Wallpaper applied. The app automatically keeps it muted so it does not clutter the interface.</p>
                </div>
              )}
            </div>

            <div className="rounded-3xl border border-white/20 bg-white/10 p-5 shadow-sm backdrop-blur-md">
              <div className="mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-widest text-white/95 lofi-sharp-text-soft"><Sparkles size={16} /> Atmosphere presets</div>
              <p className="text-sm font-bold leading-6 text-white/95 lofi-sharp-text-soft">Pick a ready-made mood and let the design drawer handle the look for you instead of crowding the writing area.</p>
              <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                {journalAtmospherePresets.map((preset) => {
                  const isPresetActive = selectedTheme === preset.themeId && selectedDesign === preset.designId && journalStyle.fontId === preset.journalFontId && quoteStyle.fontId === preset.quoteFontId;
                  return (
                    <button
                      className={`flex flex-col rounded-[1.4rem] border p-4 text-left shadow-sm backdrop-blur-md transition hover:-translate-y-1 hover:shadow-md ${isPresetActive ? 'border-white/60 bg-white/30 shadow-[0_0_24px_rgba(255,255,255,0.25)]' : 'border-white/20 bg-white/10 hover:bg-white/20'}`}
                      key={preset.id}
                      onClick={() => onAtmosphereApply(preset)}
                      type="button"
                    >
                      <span className="text-sm font-extrabold text-white lofi-sharp-text">{preset.name}</span>
                      <span className="mt-2 text-sm font-bold leading-6 text-white/95 lofi-sharp-text-soft">{preset.note}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-3xl border border-white/20 bg-white/10 p-5 shadow-sm backdrop-blur-md">
              <div className="mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-widest text-white/95 lofi-sharp-text-soft"><Quote size={16} /> Quote card color</div>
              <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
                {quoteCardColors.map((color) => (
                  <button
                    className={`custom-option rounded-2xl border p-3 text-left shadow-sm backdrop-blur-sm transition hover:-translate-y-1 ${quoteBg.toLowerCase() === color.value.toLowerCase() ? 'is-selected border-white/60 bg-white/30 shadow-[0_0_24px_rgba(255,255,255,0.25)]' : 'border-white/20 bg-white/10 hover:bg-white/20'}`}
                    key={color.value}
                    onClick={() => {
                      onQuoteBgChange(color.value);
                    }}
                    type="button"
                  >
                    <span className="mb-2 block h-10 rounded-xl shadow-inner" style={{ background: color.value }} />
                    <span className="text-sm font-extrabold text-white lofi-sharp-text">{color.name}</span>
                  </button>
                ))}
              </div>
              <label className="mt-4 block rounded-2xl border border-white/20 bg-black/20 p-4 backdrop-blur-md">
                <span className="mb-3 block text-sm font-bold text-white/95 lofi-sharp-text-soft">Or pick any quote card color</span>
                <input className="h-11 w-full cursor-pointer rounded-xl border border-white/30 bg-white/10 p-1" onChange={(event) => onQuoteBgChange(event.target.value)} type="color" value={quoteBg} />
              </label>
            </div>

            <div className="rounded-3xl border border-white/20 bg-white/10 p-5 shadow-sm backdrop-blur-md">
              <div className="mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-widest text-white/95 lofi-sharp-text-soft"><ImagePlus size={16} /> Custom emotion</div>
              <p className="text-sm font-bold leading-6 text-white/95 lofi-sharp-text-soft">Keep personal moods in the design drawer instead of the writing page. They still appear in your mood picker after you save them.</p>
              <div className="mt-5 grid gap-3 md:grid-cols-5">
                <input
                  className="rounded-2xl border border-white/30 bg-black/20 px-4 py-3 font-semibold text-white outline-none backdrop-blur-sm transition focus:border-white/60 focus:bg-black/30 placeholder-white/50"
                  onChange={(event) => onCustomWeatherNameChange(event.target.value)}
                  placeholder="Name"
                  value={customWeatherName}
                />
                <input
                  className="rounded-2xl border border-white/30 bg-black/20 px-4 py-3 font-semibold text-white outline-none backdrop-blur-sm transition focus:border-white/60 focus:bg-black/30 placeholder-white/50"
                  maxLength={4}
                  onChange={(event) => onCustomWeatherEmojiChange(event.target.value)}
                  placeholder="Emoji"
                  value={customWeatherEmoji}
                />
                <label className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed border-white/30 bg-white/5 px-4 py-3 text-sm font-bold text-white shadow-sm backdrop-blur-sm transition hover:bg-white/10 md:col-span-2">
                  <ImagePlus size={18} /> Upload image
                  <input accept="image/*" className="hidden" onChange={onCustomWeatherImageUpload} type="file" />
                </label>
                <button className="rounded-2xl border border-white/20 bg-white/20 px-4 py-3 font-bold text-white shadow-sm backdrop-blur-md transition hover:-translate-y-1 hover:bg-white/30" onClick={onAddCustomWeather} type="button">
                  Add emotion
                </button>
              </div>
              {customWeatherImage && (
                <div className="mt-4 flex items-center gap-3 rounded-2xl border border-white/20 bg-black/20 p-3 text-sm font-semibold text-white/95 backdrop-blur-md lofi-sharp-text-soft">
                  <img alt="Custom weather preview" className="h-12 w-12 rounded-2xl object-cover" src={customWeatherImage} />
                  Image ready — add a name, then save it as a custom emotion.
                </div>
              )}
              {customWeathers.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs font-black uppercase tracking-[0.24em] text-white/95 lofi-sharp-text-soft">Saved custom moods</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {customWeathers.map((weather) => (
                      <div key={weather.id} className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-2 text-sm font-semibold text-white shadow-sm backdrop-blur-md">
                        {weather.image ? <img alt={weather.label} className="h-6 w-6 rounded-full object-cover" src={weather.image} /> : <span>{weather.emoji}</span>}
                        <span>{weather.label}</span>
                        <button className="text-white/50 transition hover:text-white" onClick={() => onDeleteCustomWeather(weather.label)} type="button">×</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
