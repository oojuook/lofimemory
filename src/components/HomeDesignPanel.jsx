import React from 'react';
import { Compass, Eye, EyeOff, FileText, HeartHandshake, ImagePlus, Leaf, Lock, Mail, Newspaper, Palette, PenLine, Quote, Scale, Shield, ShieldCheck, Sparkles, Sunrise } from 'lucide-react';
import lofiMemoryHeaderImage from '../assets/optimized/lofi-memory-header.webp';
import { SectionHeader, InfoCard } from './SmallComponents.jsx';

export default function HomeDesignPanel(props) {
  const {
    MASTER_ADMIN_EMAIL,
    activeHomeSection,
    activeQuoteFont,
    activeQuoteSize,
    adminViewMode,
    clearSeoStudioReport,
    copySeoStudioReport,
    navigateToTab,
    openHomeSection,
    quoteIndex,
    quoteLibrary,
    quoteStyle,
    resources,
    runSeoStudioReview,
    seoFaqs,
    seoGuideGroups,
    seoLandingBlocks,
    seoPopularSearches,
    seoStudioApiKey,
    seoStudioCopied,
    seoStudioError,
    seoStudioLastRun,
    seoStudioLoading,
    seoStudioModelUsed,
    seoStudioPrompt,
    seoStudioReport,
    setAdminViewMode,
    setCustomizerOpen,
    setQuoteIndex,
    setSeoStudioApiKey,
    setSeoStudioPrompt,
    setShowSeoStudioKey,
    showAdminTools,
    showMinimalHomeOverview,
    showSeoStudioKey,
    tips,
    user,
    wellnessArticles
  } = props;

  return (
          <>
          {activeHomeSection === 'overview' && !showMinimalHomeOverview && (
          <section className="mx-auto max-w-[1280px] px-5 sm:px-7 xl:px-10 py-4">
    <div className="quote-card quote-card-premium rounded-3xl border border-amber-200/50 p-8 shadow-soft">
      <Quote className="mb-8 opacity-80" size={34} />
      <p className="quote-main-text font-bold leading-tight" style={{ fontFamily: activeQuoteFont, fontSize: activeQuoteSize, color: quoteStyle.textColor, lineHeight: 1.45 }}>“{quoteLibrary[quoteIndex % quoteLibrary.length]}”</p>
      <button className="quote-button mt-8 rounded-full bg-white px-5 py-3 text-sm font-extrabold shadow-lift transition hover:-translate-y-1 hover:bg-sage-50" onClick={() => setQuoteIndex((quoteIndex + 1) % quoteLibrary.length)}>
        Another calming quote
      </button>
    </div>
          </section>
          )}
    
          {activeHomeSection === 'about' && (
          <section id="about" className="mx-auto max-w-[1280px] px-5 sm:px-7 xl:px-10 py-14">
    <SectionHeader
      eyebrow="About Lofi Memory"
      title="A private online diary designed to feel calm, personal, and easy to return to."
      text="Lofi Memory is a private online diary built to make journaling feel light, repeatable, and emotionally safe — a softer place to notice your thoughts, moods, and everyday life."
    />
    <div className="grid gap-5 md:grid-cols-3">
      <InfoCard icon={Lock} title="Private by design">
        Your entries are saved to your Google-linked account when you sign in, or only in your browser when you do not. Other visitors opening the site will see their own journal, not yours.
      </InfoCard>
      <InfoCard icon={Leaf} title="Calm, minimal rhythm">
        The interface uses soft colors, spacious cards, and tiny prompts so the experience feels more like exhaling than checking off a task.
      </InfoCard>
      <InfoCard icon={Compass} title="Built for daily understanding">
        Mood tracking and prompts help you notice patterns over time, without turning emotions into a scorecard.
      </InfoCard>
      <InfoCard icon={ImagePlus} title="Custom emotions">
        Create custom moods with your own words, emoji, or uploaded images so your check-ins feel personal and expressive.
      </InfoCard>
      <InfoCard icon={Palette} title="A look that fits you">
        Choose color themes, card styles, and quote-card colors. Each visitor can make the space feel like their own.
      </InfoCard>
      <InfoCard icon={HeartHandshake} title="Positive self-awareness">
        The site offers journaling guidance and reflection tools for everyday self-understanding, small wins, and clearer personal direction.
      </InfoCard>
    </div>
          </section>
          )}
    
          {activeHomeSection === 'guides' && (
          <section id="seo-landing" className="mx-auto max-w-[1280px] px-5 sm:px-7 xl:px-10 py-10">
    <SectionHeader
      eyebrow="Chill guides & calm routines"
      title="Find the kind of game, reset, or journaling support that fits what you need today."
      text="Some people want a private diary, some want an online journal, and some are simply looking for cozy browser games or easy ways to relax after a long day. These pages help readers find the calmest place to begin."
    />
    <div className="mb-6 rounded-[2.2rem] border border-[#e8dfd5] bg-white/82 p-5 shadow-lift backdrop-blur">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-sage-700">Popular calm reads</p>
          <h3 className="mt-2 text-2xl font-extrabold text-ink">Jump straight to the page that fits what you want to explore.</h3>
        </div>
        <p className="max-w-xl text-sm leading-7 text-sage-800">These quick links keep the reading area easy to scan and point visitors to the pages that stay live in the curated review surface.</p>
      </div>
      <div className="mt-4 flex flex-wrap gap-2.5">
        {seoPopularSearches.map((item) => (
          <a className="rounded-full border border-amber-200/50 bg-sage-50/70 px-4 py-2 text-sm font-bold text-sage-800 transition hover:-translate-y-0.5 hover:border-sage-300 hover:bg-white" href={item.href} key={item.href}>{item.label}</a>
        ))}
      </div>
    </div>
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {seoLandingBlocks.slice(0, 8).map((item) => (
        <article className="customizable-card rounded-3xl border border-amber-200/50 bg-white/80 p-6 shadow-lift backdrop-blur transition hover:-translate-y-1 hover:bg-white/95" key={item.title}>
          <div className="rounded-full bg-sage-100 px-3 py-1 text-xs font-extrabold uppercase tracking-widest text-sage-800">Reader guide</div>
          <h3 className="mt-4 text-2xl font-extrabold leading-tight text-ink">{item.title}</h3>
          <p className="mt-4 leading-8 text-sage-800">{item.text}</p>
          <a className="mt-5 inline-flex text-sm font-bold text-sage-900 underline decoration-sage-300 underline-offset-4" href={item.href}>Open guide</a>
        </article>
      ))}
    </div>
    <div className="mt-8 rounded-[3rem] border border-white/75 bg-white/80 p-6 shadow-lift backdrop-blur lg:p-8">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-extrabold uppercase tracking-[0.3em] text-sage-700">Keep exploring</p>
          <h3 className="mt-3 text-3xl font-extrabold text-ink">Read the page that matches the calmer routine you want right now.</h3>
          <p className="mt-3 max-w-3xl leading-8 text-sage-800">Whether you want better privacy, a simpler writing habit, a calmer evening routine, or a small puzzle break before journaling, these pages give visitors something useful to read before they begin.</p>
        </div>
        <a className="inline-flex items-center justify-center rounded-full bg-sage-900 px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-sage-800" href="/blog.html">
          Browse guides
        </a>
      </div>
      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        {seoGuideGroups.map((group) => (
          <article className="rounded-[2.2rem] border border-[#e8dfd5]/80 bg-sand-50/70 p-5 shadow-sm" key={group.title}>
            <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-sage-700">Guide collection</p>
            <h4 className="mt-3 text-2xl font-extrabold leading-tight text-ink">{group.title}</h4>
            <p className="mt-3 text-sm leading-7 text-sage-800">{group.description}</p>
            <div className="mt-5 grid gap-2">
              {group.links.map((page) => (
                <a className="group flex items-start justify-between gap-3 rounded-2xl border border-[#e8dfd5] bg-white/82 px-4 py-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-amber-200/50 hover:bg-white" href={page.href} key={page.href}>
                  <span>
                    <span className="block text-sm font-extrabold text-sage-950 group-hover:text-sage-800">{page.title}</span>
                    <span className="mt-1 block text-xs font-semibold leading-5 text-sage-600">{page.text}</span>
                  </span>
                  <span className="shrink-0 rounded-full bg-sage-100 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.16em] text-sage-700">Read</span>
                </a>
              ))}
            </div>
          </article>
        ))}
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)]">
        <div className="rounded-3xl border border-[#e8dfd5] bg-gradient-to-br from-white/95 to-sand-50/85 p-6 shadow-lift backdrop-blur">
          <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-sage-700">Quiet reader space</p>
          <h4 className="mt-3 text-2xl font-extrabold leading-tight text-ink">A stable place for future recommendations, without interrupting the journal.</h4>
          <p className="mt-3 max-w-2xl leading-8 text-sage-800">This area sits outside the main writing flow, so future recommendations can live here without covering prompts, shifting the editor, or making the journaling experience feel crowded on mobile or desktop.</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a className="inline-flex items-center justify-center rounded-full bg-sage-900 px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-sage-800" href="/article-benefits-of-private-online-diary.html">Open private diary guide</a>
            <a className="inline-flex items-center justify-center rounded-full border border-amber-200/50 bg-white px-5 py-3 text-sm font-bold text-sage-900 transition hover:-translate-y-0.5 hover:border-sage-300" href="/article-journaling-prompts-self-discovery.html">Browse prompts</a>
          </div>
        </div>
        <div className="rounded-3xl border border-[#e8dfd5]/80 bg-white/85 p-6 shadow-lift backdrop-blur">
          <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-sage-700">Why this reader area stays separate</p>
          <ul className="mt-4 space-y-3 text-sm leading-7 text-sage-800">
            <li>• Future recommendations can live here without interrupting the writing screen.</li>
            <li>• Your diary, memories, and prompts stay stable instead of shifting around.</li>
            <li>• Mobile visitors get a clean block to explore, rather than overlays or crowded panels.</li>
          </ul>
        </div>
      </div>
    </div>
          </section>
          )}
    
          {activeHomeSection === 'resources' && (
          <section id="resources" className="mx-auto max-w-[1280px] px-5 sm:px-7 xl:px-10 py-14">
    <SectionHeader
      eyebrow="Positive reflection tools"
      title="Small practices that make journaling easier."
      text="Use these when you want a softer entry, a little gratitude, or a calmer way to close the day."
    />
    <div className="mb-6 grid gap-5 md:grid-cols-2">
      <InfoCard icon={ShieldCheck} title="A clear mind moment">
        Pause before you write: take one slow breath, notice your current state, and choose one word that describes what you want more of today.
      </InfoCard>
      <InfoCard icon={Mail} title="Share the good when you want">
        If a journal entry helps you understand yourself, you can choose to share a positive insight with someone you trust — only if it feels right.
      </InfoCard>
    </div>
    <div className="grid gap-5 lg:grid-cols-3">
      {resources.map((resource) => (
        <InfoCard icon={HeartHandshake} title={resource.title} key={resource.title}>
          {resource.text}
        </InfoCard>
      ))}
    </div>
          </section>
          )}
    
          {activeHomeSection === 'articles' && (
          <section id="articles" className="mx-auto max-w-[1280px] px-5 sm:px-7 xl:px-10 py-14">
    <SectionHeader
      eyebrow="Original Articles"
      title="Articles for a gentler journaling practice."
      text="These guides and short reflections help visitors begin private journaling with more clarity and curiosity."
    />
    <div className="grid gap-5 md:grid-cols-2">
      {wellnessArticles.map((article, index) => (
        article.href ? (
          <a href={article.href} className="customizable-card rounded-3xl border border-amber-200/50 bg-white/80 p-6 shadow-lift backdrop-blur transition hover:-translate-y-1 hover:bg-white/95 text-left block" key={article.title}>
            <div className="mb-4 flex items-center justify-between gap-4">
              <span className="rounded-full bg-sage-900 px-3 py-1 text-xs font-extrabold uppercase tracking-widest text-white">{article.read.split('•')[0]}</span>
              <span className="text-sm font-bold text-sage-600">{article.read.split('•')[1] || ''}</span>
            </div>
            <h3 className="text-2xl font-extrabold leading-tight text-ink">{article.title}</h3>
            <p className="mt-4 leading-8 text-sage-800">{article.body}</p>
            <div className="mt-6 flex items-center gap-2 text-sm font-bold text-sage-900">
              Read full article &rarr;
            </div>
          </a>
        ) : (
          <article className="customizable-card rounded-3xl border border-amber-200/50 bg-white/80 p-6 shadow-lift backdrop-blur transition hover:-translate-y-1 hover:bg-white/95" key={article.title}>
            <div className="mb-4 flex items-center justify-between gap-4">
              <span className="rounded-full bg-sage-100 px-3 py-1 text-xs font-extrabold uppercase tracking-widest text-sage-800">Note</span>
              <span className="text-sm font-bold text-sage-600">{article.read}</span>
            </div>
            <h3 className="text-2xl font-extrabold leading-tight text-ink">{article.title}</h3>
            <p className="mt-4 leading-8 text-sage-800">{article.body}</p>
          </article>
        )
      ))}
    </div>
    <div className="mt-10 text-center">
      <a href="/blog.html" className="inline-flex items-center gap-2 rounded-full border border-amber-200/50 bg-white/70 px-6 py-3 text-sm font-extrabold text-sage-900 shadow-sm transition hover:-translate-y-0.5 hover:border-sage-300 hover:bg-white backdrop-blur">
        Visit the full Blog & Wellness Library &rarr;
      </a>
    </div>
          </section>
          )}
    
          {activeHomeSection === 'faq' && (
          <section id="faq" className="mx-auto max-w-[1280px] px-5 sm:px-7 xl:px-10 py-14">
    <SectionHeader
      eyebrow="Journal FAQ"
      title="Common questions about using a private online diary and mood journal."
      text="This FAQ answers the things people usually want to know before they begin journaling here."
    />
    <div className="grid gap-4 lg:grid-cols-2">
      {seoFaqs.map((item) => (
        <article className="rounded-3xl border border-[#e8dfd5] bg-white/80 p-6 shadow-lift backdrop-blur" key={item.question}>
          <h3 className="text-xl font-extrabold text-ink">{item.question}</h3>
          <p className="mt-3 leading-7 text-sage-800">{item.answer}</p>
        </article>
      ))}
    </div>
          </section>
          )}
    
          {activeHomeSection === 'tips' && (
          <section id="tips" className="mx-auto grid max-w-[1280px] gap-8 px-5 py-14 sm:px-7 xl:px-10 lg:grid-cols-12">
    <div className="rounded-3xl border border-amber-200/50 bg-gradient-to-br from-sand-100 to-sage-100 p-8 shadow-soft lg:col-span-5 lg:p-10">
      <Newspaper className="mb-7 text-sage-700" size={36} />
      <p className="text-sm font-bold uppercase tracking-widest text-sage-700">Journaling tips</p>
      <h2 className="mt-3 font-display text-5xl font-bold leading-tight text-sage-950">A softer way to start writing.</h2>
      <p className="mt-5 leading-8 text-sage-800">Think of journaling as a conversation with yourself. The goal is not to be profound; it is to be present.</p>
    </div>
    <div className="grid gap-4 lg:col-span-7">
      {tips.map((tip, index) => (
        <div className="flex items-start gap-4 rounded-3xl border border-amber-200/50 bg-white/75 p-5 shadow-lift backdrop-blur" key={tip}>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-sage-700 font-bold text-white">{index + 1}</div>
          <p className="pt-2 text-lg font-semibold leading-7 text-sage-900">{tip}</p>
        </div>
      ))}
    </div>
          </section>
          )}
    
          {activeHomeSection === 'privacy' && (
          <section id="privacy" className="mx-auto max-w-[1280px] px-5 sm:px-7 xl:px-10 py-14">
    <SectionHeader
      eyebrow="Privacy Policy"
      title="Your reflections belong to you."
    />
    <div className="grid gap-5 md:grid-cols-2">
      <InfoCard icon={Shield} title="What is stored">
        Journal entries are saved to your Google-linked cloud account when you sign in. If you use the site without signing in, entries, mood choices, custom emotion labels/images, and your optional PIN stay in this browser using local storage.
      </InfoCard>
      <InfoCard icon={Lock} title="What visitors can see">
        Other people who open the website do not see your entries. Their browser creates a separate journal space, and signed-in entries are separated by Google account.
      </InfoCard>
      <InfoCard icon={ShieldCheck} title="Google sign-in">
        Google sign-in is used so your journal can follow you across devices. Your email is used to identify your account and sync your entries.
      </InfoCard>
      <InfoCard icon={FileText} title="Advertising and Google AdSense">
        This site may use Google AdSense to show ads. Google and its partners may use cookies or similar technologies to serve and measure ads based on visits to this and other websites. Visitors can manage ad personalization through Google Ads Settings.
      </InfoCard>
      <InfoCard icon={Mail} title="Contact for privacy questions">
        For privacy questions, feedback, or requests, contact the site owner at tze.ng@bytedance.com.
      </InfoCard>
    </div>
          </section>
          )}
    
          {activeHomeSection === 'terms' && (
          <section id="terms" className="mx-auto grid max-w-[1280px] gap-8 px-5 py-14 sm:px-7 xl:px-10 lg:grid-cols-12">
    <div className="lg:col-span-5">
      <div className="sticky top-28 rounded-3xl border border-amber-200/50 bg-white/75 p-8 shadow-soft backdrop-blur">
        <Scale className="mb-7 text-sage-700" size={36} />
        <p className="text-sm font-bold uppercase tracking-widest text-sage-600">Helpful notes</p>
        <h2 className="mt-3 font-display text-5xl font-bold leading-tight text-sage-950">A simple space for personal writing.</h2>
      </div>
    </div>
    <div className="space-y-5 lg:col-span-7">
      <InfoCard icon={HeartHandshake} title="For personal reflection">
        Lofi Memory is made for private journaling, positivity, and everyday self-understanding. Use it as a space to notice your thoughts and what matters to you.
      </InfoCard>
      <InfoCard icon={Sunrise} title="Choose your own pace">
        There is no perfect streak and no pressure to write a lot. A tiny note, a good thing, or one honest sentence is enough.
      </InfoCard>
      <InfoCard icon={PenLine} title="Write what feels useful">
        You can use prompts, skip prompts, write a long entry, or keep it short. The journal is here to help you understand your current state and what you want next.
      </InfoCard>
      <InfoCard icon={Shield} title="Content ownership">
        Your writing remains yours. Signed-in entries are stored under your Google-linked account, while signed-out entries stay in your browser storage.
      </InfoCard>
      <InfoCard icon={FileText} title="Advertising disclosure">
        The site may show third-party ads to support free access. Ad providers may set cookies or use similar technologies according to their own policies.
      </InfoCard>
      <InfoCard icon={Mail} title="Questions about these terms">
        Contact tze.ng@bytedance.com if you have questions about the site, privacy, or these terms.
      </InfoCard>
    </div>
          </section>
          )}
    
          {activeHomeSection === 'contact' && (
          <>
          <section id="contact" className="mx-auto max-w-[1280px] px-5 sm:px-7 xl:px-10 py-14">
    <div className="overflow-hidden rounded-3xl border border-amber-200/50 bg-sage-900 text-white shadow-soft">
      <div className="grid lg:grid-cols-2">
        <div className="p-8 lg:p-10">
          <Mail className="mb-7 text-sage-100" size={36} />
          <p className="text-sm font-bold uppercase tracking-widest text-sage-200">Contact</p>
          <h2 className="mt-3 font-display text-5xl font-bold leading-tight">Questions, feedback, or partnership ideas?</h2>
          <p className="mt-5 leading-8 text-sage-100">Send questions, feedback, collaboration ideas, or privacy requests to the site owner. This helps visitors, advertisers, and review teams understand who runs the site.</p>
        </div>
        <div className="bg-white/10 p-8 lg:p-10">
          <div className="grid gap-4">
            <div className="rounded-3xl bg-white/95 p-6 text-ink shadow-lift">
              <p className="text-sm font-bold uppercase tracking-widest text-sage-600">Site owner email</p>
              <a className="mt-3 block break-words text-2xl font-extrabold text-sage-900 underline decoration-sage-300 underline-offset-4" href="mailto:tze.ng@bytedance.com">
                tze.ng@bytedance.com
              </a>
            </div>
            <div className="rounded-3xl border border-white/15 bg-white/8 p-6 text-white shadow-inner backdrop-blur">
              <p className="text-sm font-bold uppercase tracking-widest text-sage-100">A gentle place to begin</p>
              <h3 className="mt-3 text-2xl font-extrabold leading-tight text-white">Made for people who want somewhere calm to start a diary.</h3>
              <p className="mt-3 leading-7 text-sage-50/90">Lofi Memory is for people who want a softer first step into diary writing — whether you are starting for the first time, starting again, or simply trying to understand your days more clearly.</p>
              <div className="mt-4 grid gap-3 text-sm leading-7 text-sage-50/90">
                <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3">Diary writing can support wellbeing by helping you process emotions instead of carrying everything in your head.</div>
                <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3">It can improve mental clarity, help you notice patterns in your moods, and create a steadier routine during stressful periods.</div>
                <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3">Over time, even short entries can strengthen self-awareness, gratitude, and a calmer relationship with your inner life.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
          </section>
    
          <section className="mx-auto max-w-[1280px] px-5 sm:px-7 xl:px-10 py-8">
    <div className="lofi-picture-border lofi-border-memory relative overflow-hidden rounded-[2.2rem] border border-[#8b5e3c]/25 p-8 text-center shadow-soft backdrop-blur">
      <img src={lofiMemoryHeaderImage} alt="" className="absolute inset-0 h-full w-full object-cover opacity-90" aria-hidden="true" />
      <div className="absolute inset-0 bg-gradient-to-br from-black/65 via-black/35 to-black/15" />
      <div className="relative z-10">
        <p className="text-sm font-black uppercase tracking-widest text-white/95 lofi-sharp-text-soft">Support this project</p>
        <h2 className="mt-3 text-2xl font-extrabold text-white lofi-sharp-text">Help keep Lofi Memory free and peaceful</h2>
        <p className="mx-auto mt-3 max-w-2xl leading-7 text-white/95 lofi-sharp-text-soft">This space may be supported by gentle, non-intrusive advertising after approval. Ads will stay outside the private writing area so journaling remains calm.</p>
      </div>
    </div>
          </section>
          </>
          )}
    
          {activeHomeSection === 'seo-studio' && showAdminTools && (
          <section id="seo-studio" className="mx-auto max-w-[1280px] px-5 sm:px-7 xl:px-10 py-14">
    <SectionHeader
      eyebrow="Admin-only AI SEO Studio"
      title="Review and draft SEO improvements without changing the public experience."
      text="This panel is only visible when the master email is signed in. It lets you run an AI SEO review from inside the website, keep the API key in your own browser, and work on ideas without exposing admin tools to normal visitors."
    />
    <div className="grid gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      <div className="lofi-picture-border lofi-border-memory relative overflow-hidden rounded-[3rem] border border-[#8b5e3c]/25 p-6 shadow-soft backdrop-blur-xl">
        <img src={lofiMemoryHeaderImage} alt="" className="absolute inset-0 h-full w-full object-cover opacity-90" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-br from-black/65 via-black/35 to-black/15" />
        <div className="relative z-10 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-black uppercase tracking-widest text-white/95 lofi-sharp-text-soft">Master access</p>
            <h3 className="mt-2 text-2xl font-extrabold text-white lofi-sharp-text">Signed in as {user?.email}</h3>
            <p className="mt-3 leading-7 text-white/95 lofi-sharp-text-soft">Normal visitors never see this section. The public journaling flow stays exactly the same unless you later choose to apply changes manually.</p>
          </div>
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/20 text-white shadow-sm backdrop-blur-md">
            <ShieldCheck size={20} />
          </div>
        </div>
         <div className="relative z-10 mt-6 rounded-[1.5rem] border border-white/20 bg-black/20 p-4 shadow-sm backdrop-blur-md">
          <p className="text-sm font-black uppercase tracking-[0.22em] text-white/95 lofi-sharp-text-soft">Preview mode</p>
          <div className="mt-3 flex overflow-hidden rounded-full border border-white/30 bg-white/10 p-1">
            <button
              className={`flex-1 rounded-full px-4 py-2.5 text-sm font-black transition backdrop-blur-md lofi-sharp-chip ${adminViewMode === 'master' ? 'bg-white/30 text-white shadow-sm' : 'text-white/90 hover:bg-white/10'}`}
              onClick={() => setAdminViewMode('master')}
              type="button"
            >
              Master view
            </button>
            <button
              className={`flex-1 rounded-full px-4 py-2.5 text-sm font-black transition backdrop-blur-md lofi-sharp-chip ${adminViewMode === 'user' ? 'bg-white/30 text-white shadow-sm' : 'text-white/90 hover:bg-white/10'}`}
              onClick={() => setAdminViewMode('user')}
              type="button"
            >
              User view
            </button>
          </div>
          <p className="mt-3 text-sm leading-7 text-white/95 lofi-sharp-text-soft">Switch to user view any time to hide admin tools and preview the calmer public experience while staying signed in.</p>
        </div>
         <div className="relative z-10 mt-6 grid gap-3 text-sm leading-7 text-white/95 lofi-sharp-text-soft">
          <div className="rounded-2xl border border-white/20 bg-black/20 p-4 backdrop-blur-md shadow-sm">
            <p className="font-extrabold text-white lofi-sharp-text">What this first version can do</p>
            <p className="mt-2">Run an AI SEO review of the current diary site, suggest safer homepage and guide-page improvements, and draft ideas you can later implement without disrupting users.</p>
          </div>
          <div className="rounded-2xl border border-white/20 bg-black/20 p-4 backdrop-blur-md shadow-sm">
            <p className="font-extrabold text-white lofi-sharp-text">What it does not auto-publish yet</p>
            <p className="mt-2">This version does not silently rewrite the live site on its own. It gives you admin-only guidance and drafts first, which is safer for SEO and much better for preserving tone.</p>
          </div>
        </div>
         <div className="relative z-10 mt-6 rounded-[2.2rem] border border-white/20 bg-white/20 p-5 text-white shadow-sm backdrop-blur-md">
          <p className="text-[11px] font-black uppercase tracking-[0.24em] text-white/95 lofi-sharp-text-soft">Suggested routine</p>
          <div className="mt-4 grid gap-3 text-sm leading-7 text-white/95 lofi-sharp-text-soft">
            <div>1. Run a fresh AI review when you want new SEO ideas.</div>
            <div>2. Pick only a few high-impact suggestions at a time.</div>
            <div>3. Keep the writing experience calm and avoid constant churn.</div>
          </div>
          <p className="mt-4 text-xs font-black uppercase tracking-[0.18em] text-white/95 lofi-sharp-text-soft">Master email: {MASTER_ADMIN_EMAIL}</p>
        </div>
      </div>
       <div className="lofi-picture-border lofi-border-memory relative overflow-hidden rounded-[3rem] border border-[#8b5e3c]/25 p-6 shadow-soft backdrop-blur-xl">
        <img src={lofiMemoryHeaderImage} alt="" className="absolute inset-0 h-full w-full object-cover opacity-90" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-br from-black/65 via-black/35 to-black/15" />
        <div className="relative z-10 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-black uppercase tracking-widest text-white/95 lofi-sharp-text-soft">Run AI review</p>
            <h3 className="mt-2 text-2xl font-extrabold text-white lofi-sharp-text">SEO drafts that stay inside your admin view</h3>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-2">
            {seoStudioModelUsed && <span className="rounded-full border border-white/20 bg-black/20 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-white shadow-sm backdrop-blur-md">Model · {seoStudioModelUsed}</span>}
            {seoStudioLastRun && <span className="rounded-full border border-white/20 bg-white/20 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-white shadow-sm backdrop-blur-md">Last run · {seoStudioLastRun}</span>}
          </div>
        </div>
         <div className="relative z-10 mt-6 grid gap-4">
          <label className="grid gap-2 text-sm font-bold text-white lofi-sharp-text">
            Gemini API key
            <div className="flex gap-2">
              <input
                className="w-full rounded-2xl border border-white/20 bg-black/20 px-4 py-3 text-sm font-semibold text-white outline-none backdrop-blur-md transition placeholder:text-white/50 focus:border-white/40 focus:ring-4 focus:ring-white/10"
                onChange={(event) => setSeoStudioApiKey(event.target.value)}
                placeholder="Paste your Gemini API key"
                type={showSeoStudioKey ? 'text' : 'password'}
                value={seoStudioApiKey}
              />
              <button className="rounded-2xl border border-white/20 bg-black/20 px-4 text-white shadow-sm backdrop-blur-md transition hover:bg-black/40" onClick={() => setShowSeoStudioKey(!showSeoStudioKey)} type="button">
                {showSeoStudioKey ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <span className="text-xs font-semibold text-white/95 lofi-sharp-text-soft">Stored only in this browser for the master email view. Use a browser-restricted key if possible.</span>
          </label>
           <label className="grid gap-2 text-sm font-bold text-white lofi-sharp-text">
            What should the AI focus on?
            <textarea
              className="min-h-[128px] rounded-2xl border border-white/20 bg-black/20 px-4 py-3 text-sm leading-7 text-white outline-none backdrop-blur-md transition placeholder:text-white/50 focus:border-white/40 focus:ring-4 focus:ring-white/10"
              onChange={(event) => setSeoStudioPrompt(event.target.value)}
              placeholder="Ask for homepage suggestions, new guide ideas, schema improvements, or calmer SEO fixes."
              value={seoStudioPrompt}
            />
          </label>
           <div className="flex flex-wrap gap-3">
            <button className="inline-flex items-center gap-2 rounded-full bg-white/20 px-5 py-3 text-sm font-extrabold text-white shadow-sm backdrop-blur-md transition hover:-translate-y-1 hover:bg-white/30 disabled:cursor-not-allowed disabled:opacity-60" disabled={seoStudioLoading} onClick={runSeoStudioReview} type="button">
              <Sparkles size={16} /> {seoStudioLoading ? 'Running review...' : 'Run AI SEO review'}
            </button>
            <button className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-black/20 px-5 py-3 text-sm font-extrabold text-white shadow-sm backdrop-blur-md transition hover:-translate-y-1 hover:border-white/50 hover:bg-black/40 disabled:cursor-not-allowed disabled:opacity-50" disabled={!seoStudioReport.trim()} onClick={copySeoStudioReport} type="button">
              <FileText size={16} /> {seoStudioCopied ? 'Copied' : 'Copy report'}
            </button>
            <button className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-black/20 px-5 py-3 text-sm font-extrabold text-white shadow-sm backdrop-blur-md transition hover:-translate-y-1 hover:border-white/50 hover:bg-black/40" onClick={clearSeoStudioReport} type="button">
              Clear
            </button>
          </div>
           {seoStudioError && (
            <div className="rounded-2xl border border-red-300/50 bg-red-900/40 px-4 py-3 text-sm font-semibold leading-7 text-red-100 backdrop-blur-md shadow-sm">
              {seoStudioError}
            </div>
          )}
           <div className="rounded-[2.2rem] border border-white/20 bg-black/20 p-4 shadow-sm backdrop-blur-md">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-black uppercase tracking-[0.22em] text-white/95 lofi-sharp-text-soft">AI report</p>
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-white/90 lofi-sharp-text-soft">Admin draft only</span>
            </div>
            <div className="mt-4 max-h-[28rem] overflow-auto rounded-[1.4rem] bg-black/30 border border-white/20 p-4 shadow-inner lofi-scrollbar">
              {seoStudioReport ? (
                <pre className="whitespace-pre-wrap text-sm leading-7 text-white/95 lofi-sharp-text-soft">{seoStudioReport}</pre>
              ) : (
                <p className="text-sm leading-7 text-white/90 lofi-sharp-text-soft">Run the AI SEO review to generate a fresh draft. It will use the current Lofi Memory positioning, homepage framing, guide-page cluster, and privacy-first diary context.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
          </section>
          )}
    
          <footer className="mx-auto max-w-[1280px] px-5 sm:px-7 xl:px-10 pb-10 pt-6">
    <div className="lofi-picture-border lofi-border-memory relative overflow-hidden rounded-[3rem] border border-white/20 p-8 text-center text-sm leading-7 shadow-soft">
      <img src={lofiMemoryHeaderImage} alt="" className="absolute inset-0 h-full w-full object-cover" aria-hidden="true" />
      <div className="absolute inset-0 bg-gradient-to-br from-black/65 via-black/25 to-black/5" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.15),transparent_25rem)]" />
      <div className="relative z-10">
        <div className="mb-4 flex flex-wrap justify-center gap-x-8 gap-y-3 font-black uppercase tracking-[0.15em] text-white/95 lofi-sharp-chip">
          <a className="transition hover:text-white" href="#home" onClick={() => openHomeSection('home')}>Home</a>
          <button className="transition hover:text-white" onClick={() => setCustomizerOpen(true)} type="button">Design</button>
          <a className="transition hover:text-white" href="#about" onClick={() => openHomeSection('about')}>About</a>
          <a className="transition hover:text-white" href="/blog.html">Blog</a>
          <a className="transition hover:text-white" href="/contact.html">Contact</a>
          <a className="transition hover:text-white" href="/privacy.html">Privacy</a>
          <a className="transition hover:text-white" href="/terms.html">Terms</a>
          <a className="transition hover:text-white" href="#diary" onClick={() => navigateToTab('write')}>Diary & Journal</a>
          <a className="transition hover:text-white" href="/private-journaling-hub.html">Journaling Hub</a>
        </div>
        <div className="mb-5 flex flex-wrap justify-center gap-x-6 gap-y-2 text-[11px] font-black uppercase tracking-[0.18em] text-white/85 lofi-sharp-text-soft">
          <a className="transition hover:text-white" href="/">Home</a>
          <a className="transition hover:text-white" href="/blog.html">Blog</a>
          <a className="transition hover:text-white" href="/about.html">About</a>
          <a className="transition hover:text-white" href="/contact.html">Contact</a>
          <a className="transition hover:text-white" href="/privacy.html">Privacy</a>
          <a className="transition hover:text-white" href="/terms.html">Terms</a>
          <a className="transition hover:text-white" href="/editorial-policy.html">Editorial policy</a>
          <a className="transition hover:text-white" href="/advertising-policy.html">Advertising policy</a>
          <a className="transition hover:text-white" href="/content-quality-policy.html">Content quality</a>
          <a className="transition hover:text-white" href="/disclaimer.html">Disclaimer</a>
          <a className="transition hover:text-white" href="/cookie-policy.html">Cookie policy</a>
          <a className="transition hover:text-white" href="/sitemap.html">Sitemap</a>
        </div>
        <p className="font-bold text-white lofi-sharp-text-soft">Lofi Memory is a calm browser space for students and gentle routines: lofi music, relaxing games, private journaling, notes, reminders, and family-friendly study breaks in one tab.</p>
        <p className="mt-3 text-xs font-semibold leading-6 text-white/85 lofi-sharp-text-soft">Original product pages and core support pages stay indexable. Lower-value or overlapping utility pages are reduced for search and advertising review quality.</p>
      </div>
    </div>
          </footer>
          </>
  );
}
// split build
