import { useRef, useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import collegeLogo from '../assets/images/college-logo.png'
import crestLogo from '../assets/images/crest-logo.png'
import eventHallImg from '../assets/images/event-hall.png'
import studentArrivalImg from '../assets/images/student-arrival.png'
import recruiterConvImg from '../assets/images/recruiter-conversation.png'

/* ═══════════════════════════════════════════════════════════
   SITE HEADER
═══════════════════════════════════════════════════════════ */
const SiteHeader = ({ activeSection }) => {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const progressRef = useRef(null)

  useEffect(() => {
    let framePending = false
    const onScroll = () => {
      if (framePending) return
      framePending = true
      requestAnimationFrame(() => {
        const scrollY = window.scrollY
        const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
        setScrolled(scrollY > 40)
        if (progressRef.current) {
          progressRef.current.style.transform = `scaleX(${Math.min(1, scrollY / maxScroll)})`
        }
        framePending = false
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const toggleMenu = useCallback((forceClose = false) => {
    setMenuOpen(prev => forceClose ? false : !prev)
  }, [])

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape' && menuOpen) toggleMenu(true) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [menuOpen, toggleMenu])

  const navLinks = [
    { href: '#experience', label: 'Experience' },
    { href: '#programme', label: 'Programme' },
    { href: '#audience', label: "Who it's for" },
  ]

  return (
    <header
      id="site-header"
      className={`fixed inset-x-0 top-0 z-50 text-[#f5f1ed] transition-all duration-500${scrolled ? ' lp2-nav-scrolled' : ''}`}
    >
      {/* Scroll progress bar */}
      <div
        id="lp2-scroll-progress"
        ref={progressRef}
        className="absolute inset-x-0 bottom-0 h-px bg-[#d0b070]"
        aria-hidden="true"
      />

      <div className="mx-auto flex h-20 max-w-[1600px] items-center justify-between px-5 sm:px-8 lg:h-24 lg:px-12">
        {/* Logo */}
        <a href="#top" className="relative z-50 flex items-center gap-3" aria-label="IZEE Job Fair home">
          <img src={collegeLogo} alt="IZEE Business School" className="h-10 w-auto object-contain sm:h-12" />
          <span className="hidden border-l border-[#d0b070]/35 pl-3 text-[10px] font-semibold uppercase leading-[1.45] tracking-[.2em] text-[#d0b070] sm:block">
            Job Fair<br />2027
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 text-[11px] font-semibold uppercase tracking-[.17em] lg:flex" aria-label="Primary navigation">
          {navLinks.map(({ href, label }) => (
            <a
              key={href}
              className={`lp2-nav-link${activeSection === href.slice(1) ? ' lp2-is-active' : ''}`}
              href={href}
            >
              {label}
            </a>
          ))}
          <a
            className="lp2-cta-link flex items-center gap-3 border border-[#d0b070]/50 px-5 py-3 text-[#d0b070]"
            href="#register"
          >
            Event access <span className="lp2-magnetic-arrow text-base">↗</span>
          </a>
        </nav>

        {/* Hamburger */}
        <button
          id="lp2-menu-button"
          onClick={() => toggleMenu()}
          className={`relative z-50 flex h-11 w-11 flex-col items-center justify-center gap-2 border border-[#d0b070]/40 transition-colors hover:bg-[#d0b070]/10 active:scale-95 lg:hidden${menuOpen ? ' lp2-menu-open' : ''}`}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          <span className={`lp2-menu-line lp2-line-one h-px w-5 bg-[#d0b070]${menuOpen ? ' translate-y-[5px] rotate-45' : ''}`} />
          <span className={`lp2-menu-line lp2-line-two h-px w-5 bg-[#d0b070]${menuOpen ? ' translate-y-[-5px] -rotate-45' : ''}`} />
        </button>
      </div>

      {/* Mobile menu overlay */}
      <div
        id="lp2-mobile-menu"
        className={`absolute inset-x-0 top-0 min-h-screen bg-[#15120f] px-6 pb-10 pt-28 transition-all duration-500 lg:hidden${menuOpen ? ' translate-y-0 opacity-100 pointer-events-auto' : ' -translate-y-full opacity-0 pointer-events-none'}`}
      >
        <div className="flex h-[calc(100vh-8rem)] flex-col justify-between">
          <nav className={`flex flex-col${menuOpen ? ' lp2-menu-open' : ''}`} aria-label="Mobile navigation">
            {navLinks.map(({ href, label }) => (
              <a
                key={href}
                className="lp2-mobile-link lp2-display border-b border-[#d0b070]/15 py-5 text-4xl text-[#f5f1ed]"
                href={href}
                onClick={() => toggleMenu(true)}
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
              >
                {label}
              </a>
            ))}
            <a
              className="lp2-mobile-link lp2-display border-b border-[#d0b070]/15 py-5 text-4xl text-[#d0b070]"
              href="#register"
              onClick={() => toggleMenu(true)}
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            >
              Event access
            </a>
          </nav>
          <p className="text-xs uppercase leading-relaxed tracking-[.18em] text-[#8d7f76]">
            A landmark gathering by<br />IZEE Business School
          </p>
        </div>
      </div>
    </header>
  )
}

/* ═══════════════════════════════════════════════════════════
   HERO SECTION
═══════════════════════════════════════════════════════════ */
const HeroSection = () => {
  const heroPhotoRef = useRef(null)

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) return
    let framePending = false
    const onScroll = () => {
      if (framePending) return
      framePending = true
      requestAnimationFrame(() => {
        const scrollY = window.scrollY
        if (heroPhotoRef.current && scrollY < window.innerHeight * 1.25) {
          heroPhotoRef.current.style.transform = `translate3d(0, ${scrollY * 0.075}px, 0) scale(1.02)`
        }
        framePending = false
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section
      id="top"
      className="lp2-grain relative min-h-[860px] overflow-hidden bg-[#15120f] text-[#f5f1ed] md:min-h-screen"
    >
      {/* Decorative circles */}
      <div className="absolute -left-16 top-44 hidden h-72 w-72 rounded-full border border-[#d0b070]/10 lg:block" />
      <div className="absolute -left-6 top-52 hidden h-52 w-52 rounded-full border border-[#d0b070]/10 lg:block" />

      <div className="mx-auto grid min-h-[860px] max-w-[1600px] grid-cols-1 px-5 pb-16 pt-28 sm:px-8 md:min-h-screen md:grid-cols-12 md:px-10 md:pb-10 md:pt-32 lg:px-12">
        {/* Left text column */}
        <div className="relative z-10 flex flex-col justify-between md:col-span-7 md:pb-10 md:pr-6 lg:col-span-6">
          <div className="flex items-center gap-4 text-[10px] font-semibold uppercase tracking-[.25em] text-[#d0b070]">
            <span className="h-px w-12 bg-[#d0b070]" />
            IZEE Business School presents
          </div>

          <div className="relative mt-12 md:mt-4">
            <span className="absolute -left-1 -top-5 text-[10px] uppercase tracking-[.25em] text-[#8d7f76] md:-left-7 md:top-4">
              01 / 04
            </span>
            <h1
              className="lp2-hero-h1 font-medium uppercase leading-[.63] tracking-[-.065em]"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: 'clamp(7rem, 28vw, 14.4rem)',
              }}
            >
              Job<br />
              <span className="ml-[.28em] italic text-[#d0b070]">Fair</span>
            </h1>
            <div
              className="lp2-year-badge absolute bottom-1 right-0 flex h-24 w-24 items-center justify-center rounded-full border border-[#a11f26] bg-[#a11f26] text-white sm:bottom-3 sm:right-8 sm:h-28 sm:w-28 md:-right-8 lg:h-32 lg:w-32"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: 'clamp(2.25rem, 5vw, 3.75rem)',
              }}
            >
              '27
            </div>
          </div>

          <div className="mt-12 grid grid-cols-2 border-t border-[#d0b070]/25 pt-5 text-[10px] uppercase tracking-[.18em] text-[#c9bfb5] md:mt-6 md:max-w-lg">
            <p>2027<br /><span className="mt-1 block text-[#f5f1ed]">Date announcement ahead</span></p>
            <p className="border-l border-[#d0b070]/20 pl-5">IZEE Campus<br /><span className="mt-1 block text-[#f5f1ed]">Bengaluru</span></p>
          </div>
        </div>

        {/* Right image column */}
        <div className="relative mt-12 min-h-[420px] md:col-span-5 md:mt-0 md:min-h-0 lg:col-span-6">
          <div className="lp2-hero-image lp2-media-frame absolute inset-0 overflow-hidden bg-[#2f2922]">
            <img
              ref={heroPhotoRef}
              src={eventHallImg}
              alt="IZEE students in burgundy uniforms meeting recruiters at an elegant career fair"
              className="h-[112%] w-full object-cover object-center opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#15120f]/65 via-transparent to-[#15120f]/10" />
          </div>
          <div className="absolute -bottom-2 left-5 right-5 flex items-end justify-between text-white md:bottom-8 md:left-10 md:right-4">
            <p
              className="max-w-[12rem] italic leading-tight sm:text-3xl"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(1.25rem, 3vw, 1.875rem)' }}
            >
              Where ambition enters the room.
            </p>
            <span className="lp2-vertical-type text-[9px] uppercase tracking-[.28em] text-[#d0b070]">
              Excellence in business education
            </span>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 items-center gap-3 text-[9px] uppercase tracking-[.24em] text-[#8d7f76] md:flex">
        <span className="lp2-scroll-cue-line h-8 w-px bg-[#8d7f76]/50" />
        Scroll to enter
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
   MARQUEE BAND
═══════════════════════════════════════════════════════════ */
const MarqueeBand = () => {
  const items = ['Ambition', 'Access', 'Opportunity', 'Industry', 'Possibility']
  const renderItems = () => items.map((item, i) => (
    <span key={i} className="flex items-center gap-8">
      <span>{item}</span>
      <span className="text-[#d0b070]">✦</span>
    </span>
  ))

  return (
    <section
      className="lp2-marquee-band overflow-hidden border-b border-[rgba(141,90,66,0.2)] bg-[#a11f26] py-4 text-[#f5f1ed]"
      aria-label="Event themes"
    >
      <div
        className="lp2-marquee-track flex items-center gap-8 pr-8"
        style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(1.75rem, 5vw, 2.25rem)', fontStyle: 'italic' }}
      >
        <div className="flex items-center gap-8 pr-8">{renderItems()}</div>
        <div className="flex items-center gap-8 pr-8" aria-hidden="true">{renderItems()}</div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
   EXPERIENCE SECTION
═══════════════════════════════════════════════════════════ */
const ExperienceSection = () => (
  <section id="experience" className="lp2-editorial-section bg-[#faf8f5] px-5 py-24 sm:px-8 md:py-36 lg:px-12 lg:py-44">
    <div className="mx-auto max-w-[1500px]">
      <div className="grid grid-cols-1 gap-14 md:grid-cols-12 md:gap-6">
        <div className="lp2-reveal md:col-span-3">
          <p className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[.22em] text-[#a11f26]">
            <span className="h-px w-8 bg-[#a11f26]" />The premise
          </p>
        </div>
        <div className="lp2-reveal lp2-reveal-delay md:col-span-8 md:col-start-5">
          <h2
            className="lp2-text-balance font-medium leading-[.95] tracking-[-.035em] text-[#1a1815]"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(2.75rem, 8vw, 6.5rem)' }}
          >
            Not a room of booths.<br />
            <span className="italic text-[#a11f26]">A room of futures.</span>
          </h2>
          <div className="mt-10 grid gap-8 border-t border-[rgba(141,90,66,0.2)] pt-8 sm:grid-cols-2 lg:mt-16">
            <p className="max-w-md text-lg leading-8 text-[#5a4f48]">
              The IZEE Job Fair is designed as a live exchange between exceptional talent and the people shaping tomorrow's businesses.
            </p>
            <p className="max-w-md text-sm leading-7 text-[#8d7f76]">
              Every conversation has intent. Every introduction carries possibility. From first impressions to defining career decisions, this is where preparation becomes momentum.
            </p>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="mt-24 grid grid-cols-3 gap-3 border-y border-[rgba(141,90,66,0.2)] py-7 text-center md:mt-36 md:gap-0">
        {[
          { label: 'Talent', sub: 'Prepared to lead' },
          { label: 'Industry', sub: 'Ready to listen' },
          { label: 'Intent', sub: 'Built into every detail' },
        ].map((s, i) => (
          <div key={s.label} className={`lp2-stat-item lp2-reveal${i > 0 ? ' lp2-reveal-delay' : ''}${i < 2 ? ' md:border-r border-[rgba(141,90,66,0.2)]' : ''}`}>
            <strong
              className="block font-medium text-[#1a1815]"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(1.5rem, 4vw, 3rem)' }}
            >
              {s.label}
            </strong>
            <span className="mt-2 block text-[9px] uppercase tracking-[.2em] text-[#8d7f76]">{s.sub}</span>
          </div>
        ))}
      </div>
    </div>
  </section>
)

/* ═══════════════════════════════════════════════════════════
   JOURNEY SECTION
═══════════════════════════════════════════════════════════ */
const JourneySection = () => (
  <section id="journey" className="lp2-editorial-section lp2-triangle-warm relative bg-[#ede5dc] px-5 py-24 sm:px-8 md:py-32 lg:px-12 lg:py-40">
    <div className="mx-auto grid max-w-[1500px] grid-cols-1 gap-16 md:grid-cols-12 md:gap-8">
      {/* Sticky left image */}
      <div className="md:sticky md:top-28 md:col-span-6 md:h-[72vh]">
        <div className="lp2-portrait-cut lp2-media-frame relative h-[560px] overflow-hidden bg-[#2f2922] md:h-full">
          <img
            src={studentArrivalImg}
            alt="An IZEE student in the official burgundy and beige uniform arriving at the career fair"
            className="lp2-scroll-image h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#15120f]/55 via-transparent to-transparent" />
          <p
            className="absolute bottom-8 left-8 max-w-xs italic leading-tight text-white"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(1.5rem, 3vw, 2.25rem)' }}
          >
            "The right room changes what you believe is possible."
          </p>
        </div>
        <div
          className="absolute -bottom-8 -right-8 hidden h-28 w-28 items-center justify-center rounded-full bg-[#d0b070] text-center text-[9px] font-semibold uppercase leading-relaxed tracking-[.16em] text-[#1a1815] lg:flex"
        >
          Arrive<br />prepared
        </div>
      </div>

      {/* Right scrollable chapters */}
      <div className="md:col-span-5 md:col-start-8 md:pt-20">
        <p className="lp2-reveal flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[.22em] text-[#a11f26]">
          <span className="h-px w-8 bg-[#a11f26]" />Your experience
        </p>
        <h2
          className="lp2-reveal lp2-reveal-delay mt-8 leading-[.95] text-[#1a1815]"
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}
        >
          One day.<br /><span className="italic">Three shifts.</span>
        </h2>

        <div className="mt-16 border-l border-[rgba(141,90,66,0.2)] pl-8 sm:pl-12">
          {[
            {
              num: '01 — Be seen',
              title: 'Make presence your first credential.',
              body: 'Move beyond the résumé. Meet decision-makers face to face and communicate the clarity, character, and curiosity you bring to work.',
            },
            {
              num: '02 — Be challenged',
              title: 'Discover what the market asks of you.',
              body: 'Listen to industry perspectives, test your thinking, and leave with a sharper understanding of the capabilities that matter now.',
            },
            {
              num: '03 — Be remembered',
              title: 'Turn a conversation into a beginning.',
              body: 'Build genuine professional relationships with recruiters, founders, leaders, and peers who can shape where your ambition goes next.',
            },
          ].map((ch, i) => (
            <article
              key={ch.num}
              className={`lp2-chapter-dot lp2-reveal relative${i < 2 ? ' border-b border-[rgba(141,90,66,0.2)] pb-16' : ' pt-16'}`}
              style={{ paddingTop: i > 0 ? '4rem' : 0 }}
            >
              <span className="text-[10px] font-semibold uppercase tracking-[.2em] text-[#a11f26]">{ch.num}</span>
              <h3
                className="mt-4 text-[#1a1815]"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(1.5rem, 3vw, 2rem)' }}
              >
                {ch.title}
              </h3>
              <p className="mt-5 text-sm leading-7 text-[#5a4f48]">{ch.body}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  </section>
)

/* ═══════════════════════════════════════════════════════════
   PROGRAMME SECTION
═══════════════════════════════════════════════════════════ */
const ProgrammeSection = () => (
  <section id="programme" className="lp2-editorial-section lp2-grain lp2-triangle-dark relative overflow-hidden bg-[#15120f] px-5 py-24 text-[#f5f1ed] sm:px-8 md:py-36 lg:px-12 lg:py-44">
    {/* Background outline watermark */}
    <div
      className="lp2-outline-type pointer-events-none absolute -right-8 top-8 font-semibold leading-none opacity-30"
      style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(8rem, 20vw, 24rem)' }}
      aria-hidden="true"
    >
      27
    </div>

    <div className="relative mx-auto max-w-[1500px]">
      <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
        {/* Left heading */}
        <div className="lp2-reveal md:col-span-4">
          <p className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[.22em] text-[#d0b070]">
            <span className="h-px w-8 bg-[#d0b070]" />The programme
          </p>
          <h2
            className="mt-8 leading-[.92]"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(2.75rem, 7vw, 6rem)' }}
          >
            A day with<br /><span className="italic text-[#d0b070]">direction.</span>
          </h2>
          <p className="mt-8 max-w-sm text-sm leading-7 text-[#c9bfb5]">
            Structured for discovery, real dialogue, and decisions. The final programme and participating organisations will be announced closer to the event.
          </p>
        </div>

        {/* Right schedule */}
        <div className="lp2-reveal lp2-reveal-delay md:col-span-7 md:col-start-6 md:pt-24">
          <div className="border-t border-[#d0b070]/25">
            {[
              { act: 'ACT I', title: 'Arrival & orientation', sub: 'Enter with context. Move with confidence.' },
              { act: 'ACT II', title: 'Industry exchange', sub: 'Perspectives from leaders at the edge of change.' },
              { act: 'ACT III', title: 'Recruiter conversations', sub: 'Focused encounters. Meaningful first impressions.' },
              { act: 'ACT IV', title: 'Opportunity studios', sub: 'Interviews, role discovery, and next steps.' },
            ].map(({ act, title, sub }) => (
              <div
                key={act}
                className="lp2-schedule-row grid grid-cols-[4rem_1fr] gap-4 border-b border-[#d0b070]/20 py-7 sm:grid-cols-[7rem_1fr_auto] sm:items-center"
              >
                <span className="text-xs tracking-[.16em] text-[#d0b070]">{act}</span>
                <div>
                  <h3
                    style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                    className="text-2xl sm:text-3xl"
                  >
                    {title}
                  </h3>
                  <p className="mt-1 text-xs text-[#8d7f76]">{sub}</p>
                </div>
                <span className="lp2-row-arrow hidden text-2xl text-[#d0b070] sm:block">↗</span>
              </div>
            ))}
          </div>
          <p className="mt-5 text-[9px] uppercase tracking-[.18em] text-[#8d7f76]">
            Programme sequence is indicative and subject to refinement.
          </p>
        </div>
      </div>
    </div>
  </section>
)

/* ═══════════════════════════════════════════════════════════
   AUDIENCE SECTION
═══════════════════════════════════════════════════════════ */
const AudienceSection = () => (
  <section id="audience" className="lp2-editorial-section lp2-triangle-red bg-[#faf8f5] px-5 py-24 sm:px-8 md:py-36 lg:px-12 lg:py-44">
    <div className="mx-auto max-w-[1500px]">
      <div className="lp2-reveal flex flex-col justify-between gap-8 border-b border-[rgba(141,90,66,0.2)] pb-12 md:flex-row md:items-end">
        <div>
          <p className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[.22em] text-[#a11f26]">
            <span className="h-px w-8 bg-[#a11f26]" />Who enters the room
          </p>
          <h2
            className="mt-7 leading-[.95] text-[#1a1815]"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(2.75rem, 9vw, 6rem)' }}
          >
            Different paths.<br /><span className="italic text-[#a11f26]">Shared momentum.</span>
          </h2>
        </div>
        <p className="max-w-xs text-sm leading-7 text-[#5a4f48]">
          An intentionally composed gathering for people who take growth seriously.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12">
        {/* Panel 01 — Students */}
        <div className="lp2-audience-panel lp2-reveal py-12 md:col-span-7 md:py-20 md:pr-16">
          <div className="flex items-start justify-between">
            <span
              className="text-[#d0b070]"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '4.5rem', lineHeight: 1 }}
            >
              01
            </span>
            <span className="mt-4 h-3 w-3 rotate-45 bg-[#a11f26]" />
          </div>
          <h3
            className="mt-14 text-[#1a1815]"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(2rem, 5vw, 3rem)' }}
          >
            For students
          </h3>
          <p className="mt-6 max-w-md text-base leading-8 text-[#5a4f48]">
            For those ready to translate education into impact—whether the next step is a first role, a bolder role, or a completely new direction.
          </p>
          <ul className="mt-10 space-y-4 text-xs uppercase tracking-[.14em] text-[#8d7f76]">
            {['Direct industry access', 'Career-defining conversations', 'Professional visibility'].map(item => (
              <li key={item} className="flex items-center gap-4">
                <span className="lp2-bullet h-px w-7 bg-[#a11f26]" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </section>
)

/* ═══════════════════════════════════════════════════════════
   EXCHANGE SECTION
═══════════════════════════════════════════════════════════ */
const ExchangeSection = () => (
  <section className="lp2-editorial-section bg-[#a11f26] text-white">
    <div className="grid min-h-[680px] grid-cols-1 lg:grid-cols-2">
      {/* Image */}
      <div className="lp2-recruiter-cut lp2-media-frame relative min-h-[460px] overflow-hidden bg-[#15120f] lg:min-h-full">
        <img
          src={recruiterConvImg}
          alt="An IZEE student in official uniform speaking with a recruiter"
          className="lp2-scroll-image h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-[#15120f]/15" />
      </div>

      {/* Quote */}
      <div className="flex items-center px-5 py-20 sm:px-10 lg:px-20 lg:py-28 xl:px-28">
        <div className="lp2-reveal max-w-xl">
          <span className="text-[10px] font-semibold uppercase tracking-[.23em] text-[#d0b070]">The exchange</span>
          <blockquote
            className="mt-8 leading-[.95]"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(2.5rem, 7vw, 4.5rem)' }}
          >
            "Potential does not announce itself. It is{' '}
            <span className="italic text-[#d0b070]">recognised.</span>"
          </blockquote>
          <div className="mt-12 flex items-center gap-5 border-t border-white/25 pt-7">
            <img src={crestLogo} alt="IZEE crest" className="h-16 w-16 object-cover" />
            <p className="text-xs uppercase leading-relaxed tracking-[.16em] text-white/75">
              A culture of preparation.<br />A standard of excellence.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
)

/* ═══════════════════════════════════════════════════════════
   REGISTER SECTION
═══════════════════════════════════════════════════════════ */
const RegisterSection = () => (
  <section id="register" className="lp2-editorial-section lp2-triangle-linen relative overflow-hidden bg-[#f3ede6] px-5 py-24 sm:px-8 md:py-36 lg:px-12 lg:py-44">
    {/* Background watermark */}
    <div
      className="pointer-events-none absolute -bottom-20 -left-12 font-semibold leading-none text-[#a11f26]/[.035]"
      style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(8rem, 20vw, 26rem)' }}
      aria-hidden="true"
    >
      J27
    </div>

    <div className="relative mx-auto max-w-[1500px]">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
        {/* Left heading */}
        <div className="lp2-reveal lg:col-span-7">
          <p className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[.22em] text-[#a11f26]">
            <span className="h-px w-8 bg-[#a11f26]" />Event access
          </p>
          <h2
            className="mt-8 leading-[.88] text-[#1a1815]"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(3.5rem, 10vw, 8.5rem)' }}
          >
            Save your<br />
            <span className="ml-[.45em] italic text-[#a11f26]">place.</span>
          </h2>
        </div>

        {/* Right access rows */}
        <div className="lp2-reveal lp2-reveal-delay flex flex-col justify-end lg:col-span-4 lg:col-start-9">
          <p className="text-lg leading-8 text-[#5a4f48]">
            Student registration details will be released with the official 2027 event announcement.
          </p>
          <div className="mt-10 border-y border-[rgba(141,90,66,0.2)]">
            <div className="lp2-access-row flex items-center justify-between py-6">
              <div>
                <span className="block text-[10px] uppercase tracking-[.2em] text-[#8d7f76]">Student access</span>
                <strong
                  className="mt-1 block font-medium text-[#1a1815]"
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1.5rem' }}
                >
                  Opening soon
                </strong>
              </div>
              <span className="lp2-access-diamond h-3 w-3 rotate-45 border border-[#a11f26]" />
            </div>
          </div>
          <a
            href="#faq"
            className="mt-9 inline-flex items-center justify-between border-b border-[#1a1815] pb-3 text-xs font-semibold uppercase tracking-[.16em] text-[#1a1815]"
          >
            Read the event brief{' '}
            <span className="lp2-magnetic-arrow text-xl text-[#a11f26]">↗</span>
          </a>
        </div>
      </div>
    </div>
  </section>
)

/* ═══════════════════════════════════════════════════════════
   FAQ SECTION
═══════════════════════════════════════════════════════════ */
const FaqSection = () => {
  const faqs = [
    {
      q: 'Who can attend?',
      a: "The event is open to IZEE students and graduates. Final eligibility and registration details will accompany the official announcement.",
      open: true,
    },
    {
      q: 'When will the date be announced?',
      a: "The confirmed 2027 date, timings, and venue access information will be shared through IZEE Business School's official channels.",
    },
    {
      q: 'What should students prepare?',
      a: "Bring a current résumé, a clear sense of your interests, thoughtful questions, and the confidence to speak about what you can contribute—not only what you hope to receive.",
    },
  ]

  const faqRefs = useRef([])

  const handleToggle = (idx) => {
    faqRefs.current.forEach((el, i) => {
      if (el && i !== idx) el.open = false
    })
  }

  return (
    <section id="faq" className="lp2-editorial-section bg-[#faf8f5] px-5 py-24 sm:px-8 md:py-32 lg:px-12">
      <div className="mx-auto grid max-w-[1300px] gap-14 md:grid-cols-12">
        <div className="lp2-reveal md:col-span-4">
          <p className="text-[10px] font-semibold uppercase tracking-[.22em] text-[#a11f26]">Event brief / 2027</p>
          <h2
            className="mt-7 text-[#1a1815]"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(2.5rem, 6vw, 3.75rem)' }}
          >
            Before you<br /><span className="italic">arrive.</span>
          </h2>
        </div>

        <div className="lp2-reveal lp2-reveal-delay md:col-span-7 md:col-start-6">
          {faqs.map((faq, i) => (
            <details
              key={faq.q}
              ref={el => faqRefs.current[i] = el}
              className={`lp2-faq-item border-t border-[rgba(141,90,66,0.2)]${i === faqs.length - 1 ? ' border-b' : ''}`}
              open={faq.open || undefined}
              onToggle={() => handleToggle(i)}
            >
              <summary className="flex cursor-pointer items-center justify-between gap-6 py-7 text-left">
                <span
                  className="text-[#1a1815]"
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '1.5rem' }}
                >
                  {faq.q}
                </span>
                <span className="lp2-faq-plus text-2xl text-[#a11f26]">+</span>
              </summary>
              <p className="max-w-xl pb-8 text-sm leading-7 text-[#5a4f48]">{faq.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
   SITE FOOTER
═══════════════════════════════════════════════════════════ */
const SiteFooter = () => (
  <footer className="lp2-grain bg-[#15120f] px-5 pb-10 pt-20 text-[#f5f1ed] sm:px-8 lg:px-12 lg:pt-28">
    <div className="mx-auto max-w-[1500px]">
      <div className="grid gap-14 md:grid-cols-12">
        <div className="md:col-span-5">
          <img src={collegeLogo} alt="IZEE Business School" className="h-16 w-auto object-contain sm:h-20" />
          <p
            className="mt-8 max-w-md italic leading-tight text-[#d0b070]"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 'clamp(1.5rem, 4vw, 2.25rem)' }}
          >
            Excellence in business education.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-8 md:col-span-5 md:col-start-8">
          <div>
            <span className="text-[9px] uppercase tracking-[.2em] text-[#8d7f76]">Navigate</span>
            <div className="mt-5 flex flex-col gap-3 text-sm text-[#c9bfb5]">
              <a className="lp2-footer-link" href="#experience">Experience</a>
              <a className="lp2-footer-link" href="#programme">Programme</a>
              <a className="lp2-footer-link" href="#audience">Who it's for</a>
            </div>
          </div>
          <div>
            <span className="text-[9px] uppercase tracking-[.2em] text-[#8d7f76]">Event</span>
            <div className="mt-5 flex flex-col gap-3 text-sm text-[#c9bfb5]">
              <a className="lp2-footer-link" href="#register">Event access</a>
              <a className="lp2-footer-link" href="#faq">Event brief</a>
              <a className="lp2-footer-link" href="#top">Back to top</a>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-20 flex flex-col justify-between gap-4 border-t border-[#d0b070]/20 pt-7 text-[9px] uppercase tracking-[.16em] text-[#8d7f76] sm:flex-row">
        <p>© 2027 IZEE Business School</p>
        <p>Ambition • Access • Opportunity</p>
      </div>
    </div>
  </footer>
)

/* ═══════════════════════════════════════════════════════════
   ACTIVE SECTION TRACKER HOOK
═══════════════════════════════════════════════════════════ */
const useActiveSection = () => {
  const [active, setActive] = useState('')

  useEffect(() => {
    const sectionIds = ['experience', 'programme', 'audience', 'register', 'faq']
    const sections = sectionIds.map(id => document.getElementById(id)).filter(Boolean)

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      { rootMargin: '-34% 0px -58% 0px', threshold: 0 }
    )
    sections.forEach(s => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  return active
}

/* ═══════════════════════════════════════════════════════════
   MAIN PAGE COMPONENT
═══════════════════════════════════════════════════════════ */
const LandingPage = () => {
  const activeSection = useActiveSection()

  return (
    <div
      className="lp2-root"
      style={{
        position: 'relative',
        zIndex: 10,
        minHeight: '100vh',
        scrollBehavior: 'smooth',
      }}
    >
      <SiteHeader activeSection={activeSection} />
      <main>
        <HeroSection />
        <MarqueeBand />
        <ExperienceSection />
        <JourneySection />
        <ProgrammeSection />
        <AudienceSection />
        <ExchangeSection />
        <RegisterSection />
        <FaqSection />
      </main>
      <SiteFooter />
    </div>
  )
}

export default LandingPage