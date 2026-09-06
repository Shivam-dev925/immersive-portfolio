import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, MeshTransmissionMaterial, RoundedBox, Sparkles } from '@react-three/drei'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowDown, ArrowUpRight, Github, Linkedin, Mail, MousePointer2 } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'

gsap.registerPlugin(ScrollTrigger)

function SceneWarmup({ onReady }) {
  const { gl, scene, camera } = useThree()

  useEffect(() => {
    let cancelled = false
    let frame = 0

    const warmup = () => {
      try {
        gl.compile(scene, camera)
      } catch {
        // A normal rendered frame is still a safe fallback on older GPUs.
      }

      frame = requestAnimationFrame(() => {
        frame = requestAnimationFrame(() => {
          if (!cancelled) onReady()
        })
      })
    }

    warmup()
    return () => {
      cancelled = true
      cancelAnimationFrame(frame)
    }
  }, [camera, gl, onReady, scene])

  return null
}

const projects = [
  {
    number: '01',
    title: 'Trackk — Trading, Reframed',
    description: 'A complete mobile UI/UX revamp for a live stocks, F&O, and options platform used by 100K+ traders and rated 4.6 stars.',
    meta: 'TradeBook · Jan—Feb 2025',
    tags: ['Flutter', 'Fintech', 'Product design'],
    accent: '#a7f3d0',
    platforms: [
      { label: 'Android', detail: 'Google Play', href: 'https://play.google.com/store/apps/details?id=com.we3.tradebook.app' },
      { label: 'iOS', detail: 'App Store', href: 'https://apps.apple.com/in/app/trackk-stocks-options-trading/id1659276893' },
    ],
  },
  {
    number: '02',
    title: 'Water Taxi Miami',
    description: 'An end-to-end ticket booking experience spanning one-way and round-trip journeys, seat selection, and payment confirmation.',
    meta: 'Contract · Feb 2024—Feb 2025',
    tags: ['React', 'Booking UX', 'Frontend'],
    accent: '#bfdbfe',
    platforms: [
      { label: 'iOS', detail: 'App Store', href: 'https://apps.apple.com/in/app/water-taxi-miami/id1545116369' },
    ],
  },
  {
    number: '03',
    title: 'ADTC Management System',
    description: 'An offline-first school operations platform that helps administrators manage student and faculty records, fees, admissions, and daily institutional workflows without an internet connection.',
    meta: 'School operations · Fully offline',
    tags: ['.NET', 'SQL', 'Docker'],
    accent: '#ddd6fe',
    platforms: [],
  },
]

const raxaPlatforms = [
  { label: 'Web', detail: 'Live platform', href: 'https://app.raxa.io' },
  { label: 'iOS', detail: 'App Store', href: 'https://apps.apple.com/us/app/raxa/id719432782' },
  { label: 'Android', detail: 'Google Play', href: 'https://play.google.com/store/apps/details?id=com.raxa.EMR' },
]

function PlatformLinks({ platforms, label }) {
  return (
    <div className="platform-links" aria-label={`${label} platform links`} style={{ '--platform-count': platforms.length }}>
      {platforms.map((platform) => (
        <a key={platform.label} href={platform.href} target="_blank" rel="noreferrer" onClick={(event) => event.stopPropagation()}>
          <span><strong>{platform.label}</strong><small>{platform.detail}</small></span>
          <ArrowUpRight size={15} />
        </a>
      ))}
    </div>
  )
}

function MagneticContactLink() {
  const link = useRef()

  const pullTowardPointer = (event) => {
    if (!window.matchMedia('(pointer: fine)').matches) return
    const bounds = link.current.getBoundingClientRect()
    const x = (event.clientX - bounds.left - bounds.width / 2) * 0.12
    const y = (event.clientY - bounds.top - bounds.height / 2) * 0.18
    link.current.style.setProperty('--magnet-x', `${x}px`)
    link.current.style.setProperty('--magnet-y', `${y}px`)
  }

  const release = () => {
    link.current.style.setProperty('--magnet-x', '0px')
    link.current.style.setProperty('--magnet-y', '0px')
  }

  return (
    <a ref={link} className="magnetic-contact" href="mailto:chshivam815@gmail.com" onPointerMove={pullTowardPointer} onPointerLeave={release}>
      <span>Let’s work together.</span><ArrowUpRight />
    </a>
  )
}

const raxaJourney = [
  {
    year: '2022',
    title: 'Building the foundation',
    description: 'Joined Raxa to build patient and doctor experiences across React and Flutter, while migrating legacy onboarding from Ext.js.',
    tags: ['React', 'Flutter', 'Architecture'],
  },
  {
    year: '2023',
    title: 'Connecting national health rails',
    description: 'Integrated ABDM, NHA, HPR, and HFR workflows for secure health data, digital lockers, and certified doctor experiences.',
    tags: ['ABDM', 'Health records', 'QCI'],
  },
  {
    year: '2024',
    title: 'Making delivery a system',
    description: 'Architected CI/CD across remote iOS simulators, Android emulators, and stores—cutting manual testing effort by 70%.',
    tags: ['CI/CD', 'AWS Device Farm', 'Testing'],
  },
  {
    year: '2025',
    title: 'From product to platform',
    description: 'Led frontend architecture, reviews, and mentoring while shipping Raxa Assistant with real-time chat, subscriptions, and voice.',
    tags: ['Leadership', 'Whisper AI', 'Subscriptions'],
  },
  {
    year: 'Now',
    title: 'An AI-native design practice',
    description: 'Introduced MCP-powered design-to-code workflows and helped ship a complete web, iOS, and Android redesign in two months.',
    tags: ['Figma MCP', 'Prompt → Design', '3 platforms'],
  },
]

function GlassArtifact({ scrollRef, pointerRef }) {
  const group = useRef()
  const orb = useRef()

  useFrame((state, delta) => {
    if (!group.current) return
    const progress = scrollRef.current
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, pointerRef.current.y * 0.26 + progress * 1.2, 4, delta)
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, pointerRef.current.x * 0.26 + progress * 2.4, 4, delta)
    group.current.position.z = THREE.MathUtils.damp(group.current.position.z, progress > 0.68 ? -6 : progress * 2.2, 3, delta)
    const s = progress < 0.3 ? 1 + progress * 2.2 : Math.max(0.44, 1.66 - progress * 1.45)
    group.current.scale.setScalar(THREE.MathUtils.damp(group.current.scale.x, s, 3, delta))
    if (orb.current) orb.current.rotation.z += delta * 0.16
  })

  return (
    <group ref={group}>
      <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.28}>
        <mesh>
          <icosahedronGeometry args={[1.45, 3]} />
          <MeshTransmissionMaterial
            resolution={256}
            samples={4}
            thickness={0.45}
            chromaticAberration={0.08}
            anisotropy={0.25}
            distortion={0.18}
            distortionScale={0.35}
            temporalDistortion={0.06}
            roughness={0.2}
            transmission={0.96}
            color="#b9d8ff"
          />
        </mesh>
        <mesh ref={orb} rotation={[Math.PI / 2.4, 0, 0]}>
          <torusGeometry args={[2.05, 0.012, 8, 180]} />
          <meshBasicMaterial color="#92ffc8" transparent opacity={0.7} />
        </mesh>
      </Float>
    </group>
  )
}

function ProjectObjects({ activeProject, scrollRef, compact }) {
  const group = useRef()
  const refs = useRef([])

  useFrame((_, delta) => {
    if (!group.current) return
    const show = scrollRef.current > 0.36 && scrollRef.current < 0.82
    group.current.position.z = THREE.MathUtils.damp(group.current.position.z, show ? 0 : -10, 4, delta)
    group.current.rotation.y += delta * 0.035
    refs.current.forEach((mesh, index) => {
      if (!mesh) return
      const target = index === activeProject ? 1.16 : 0.9
      mesh.scale.setScalar(THREE.MathUtils.damp(mesh.scale.x, target, 6, delta))
    })
  })

  return (
    <group ref={group} position={compact ? [0.5, 0, -10] : [1.8, 0, -10]} scale={compact ? 0.62 : 1}>
      {projects.map((project, index) => {
        const angle = (index - (projects.length - 1) / 2) * 0.9
        return (
          <RoundedBox
            key={project.title}
            ref={(mesh) => { refs.current[index] = mesh }}
            args={[2.15, 2.8, 0.12]}
            radius={0.1}
            smoothness={4}
            position={[Math.sin(angle) * 3.3, (index - 1) * -0.25, Math.cos(angle) * -1.15]}
            rotation={[0, -angle * 0.5, angle * 0.12]}
          >
            <meshStandardMaterial color={project.accent} roughness={0.34} metalness={0.08} />
          </RoundedBox>
        )
      })}
    </group>
  )
}

function Scene({ activeProject, scrollRef, pointerRef, reducedMotion, compact, onReady }) {
  return (
    <Canvas camera={{ position: [0, 0, 8], fov: 42 }} dpr={compact ? [1, 1.15] : [1, 1.5]} gl={{ antialias: true, powerPreference: 'high-performance' }}>
      <color attach="background" args={['#090b10']} />
      <fog attach="fog" args={['#090b10', 7, 18]} />
      <ambientLight intensity={1.6} />
      <directionalLight position={[5, 6, 4]} intensity={3.4} color="#c8ddff" />
      <pointLight position={[-4, -2, 3]} intensity={8} color="#8dffc3" />
      <GlassArtifact scrollRef={scrollRef} pointerRef={pointerRef} reducedMotion={reducedMotion} />
      <ProjectObjects activeProject={activeProject} scrollRef={scrollRef} compact={compact} />
      <Sparkles count={reducedMotion ? 12 : 36} scale={12} size={1.4} speed={reducedMotion ? 0 : 0.18} opacity={0.3} />
      <SceneWarmup onReady={onReady} />
    </Canvas>
  )
}

function Header() {
  const [open, setOpen] = useState(false)
  return (
    <header className="site-header">
      <a className="brand" href="#top" aria-label="Shivam Choudhary, home">Shivam Choudhary</a>
      <button className="menu-toggle" aria-expanded={open} aria-controls="site-nav" onClick={() => setOpen((value) => !value)}>
        {open ? 'Close' : 'Menu'}
      </button>
      <nav id="site-nav" className={open ? 'nav open' : 'nav'} aria-label="Main navigation">
        <a href="#about" onClick={() => setOpen(false)}>About</a>
        <a href="#journey" onClick={() => setOpen(false)}>Journey</a>
        <a href="#work" onClick={() => setOpen(false)}>Projects</a>
        <a href="#contact" onClick={() => setOpen(false)}>Contact</a>
      </nav>
    </header>
  )
}

function App() {
  const root = useRef()
  const scrollRef = useRef(0)
  const pointerRef = useRef({ x: 0, y: 0 })
  const [activeProject, setActiveProject] = useState(0)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [compact, setCompact] = useState(false)
  const [sceneReady, setSceneReady] = useState(false)
  const [openPlatforms, setOpenPlatforms] = useState(null)
  const year = useMemo(() => new Date().getFullYear(), [])
  const markSceneReady = useMemo(() => () => setSceneReady(true), [])

  useEffect(() => {
    const fallback = window.setTimeout(markSceneReady, 2500)
    return () => window.clearTimeout(fallback)
  }, [markSceneReady])

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReducedMotion(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    const query = window.matchMedia('(max-width: 780px)')
    const update = () => setCompact(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    const onPointerMove = (event) => {
      pointerRef.current = {
        x: (event.clientX / window.innerWidth - 0.5) * 2,
        y: -(event.clientY / window.innerHeight - 0.5) * 2,
      }
    }
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    return () => window.removeEventListener('pointermove', onPointerMove)
  }, [])

  useEffect(() => {
    if (!sceneReady) return undefined

    const context = gsap.context(() => {
      ScrollTrigger.create({
        trigger: root.current,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => { scrollRef.current = self.progress },
      })
      if (!reducedMotion) {
        gsap.utils.toArray('[data-reveal]').forEach((node) => {
          gsap.fromTo(node, { autoAlpha: 0, y: 42 }, {
            autoAlpha: 1,
            y: 0,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: { trigger: node, start: 'top 86%', once: true },
            onComplete: () => {
              if (node.classList.contains('journey-card')) gsap.set(node, { clearProps: 'transform' })
            },
          })
        })
      }
    }, root)
    return () => context.revert()
  }, [reducedMotion, sceneReady])

  return (
    <div ref={root} id="top" className={sceneReady ? 'app-shell is-ready' : 'app-shell'}>
      <a className="skip-link" href="#main">Skip to content</a>
      <div className="scene-layer" aria-hidden="true">
        <Scene activeProject={activeProject} scrollRef={scrollRef} pointerRef={pointerRef} reducedMotion={reducedMotion} compact={compact} onReady={markSceneReady} />
        <div className="scene-vignette" />
      </div>
      <Header />
      <main id="main" className="content-layer">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-kicker"><span className="pulse" /> Available for ambitious products</div>
          <div className="hero-copy">
            <p className="eyebrow">Frontend engineer · Product-minded builder</p>
            <h1 id="hero-title">Interfaces with<br /><em>depth &amp; direction.</em></h1>
            <p className="hero-summary">I’m Shivam. I build expressive, reliable web experiences that make complex systems feel remarkably clear.</p>
          </div>
          <a className="scroll-cue" href="#about"><ArrowDown size={16} /> Explore</a>
          <p className="cursor-note"><MousePointer2 size={14} /> Move your cursor</p>
        </section>

        <section id="about" className="about section-grid">
          <p className="section-index">01 / About</p>
          <div data-reveal className="about-copy">
            <h2>I work where interaction, engineering, and product strategy meet.</h2>
            <div className="about-columns">
              <p>My focus is frontend architecture and interaction design for products where clarity matters: healthcare, AI, and data-rich workflows.</p>
              <p>I turn complex requirements into coherent systems—fast enough to feel effortless, accessible enough to work for everyone.</p>
            </div>
          </div>
        </section>

        <section id="journey" className="journey">
          <div className="journey-atmosphere" aria-hidden="true"><span /><span /><span /></div>
          <div className="journey-heading" data-reveal>
            <p className="section-index">02 / Raxa journey</p>
            <h2>Four years of turning healthcare complexity into product momentum.</h2>
            <p>Raxa Health · Lead Frontend Engineer · May 2022—Present</p>
          </div>
          <div className="journey-track">
            {raxaJourney.map((chapter, index) => (
              <article
                className={openPlatforms === `journey-${index}` ? 'journey-card platforms-open' : 'journey-card'}
                data-reveal
                key={chapter.year}
                style={{ '--card-index': index }}
                tabIndex="0"
                role="button"
                aria-expanded={openPlatforms === `journey-${index}`}
                aria-label={`${chapter.title}. Show Raxa platform links`}
                onClick={() => setOpenPlatforms((value) => value === `journey-${index}` ? null : `journey-${index}`)}
                onPointerMove={(event) => {
                  if (!window.matchMedia('(pointer: fine)').matches) return
                  const bounds = event.currentTarget.getBoundingClientRect()
                  event.currentTarget.style.setProperty('--tilt-x', `${((event.clientY - bounds.top) / bounds.height - 0.5) * -5}deg`)
                  event.currentTarget.style.setProperty('--tilt-y', `${((event.clientX - bounds.left) / bounds.width - 0.5) * 5}deg`)
                }}
                onPointerLeave={(event) => {
                  event.currentTarget.style.setProperty('--tilt-x', '0deg')
                  event.currentTarget.style.setProperty('--tilt-y', '0deg')
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    setOpenPlatforms((value) => value === `journey-${index}` ? null : `journey-${index}`)
                  }
                }}
              >
                <div className="journey-card-top"><span className="journey-year">{chapter.year}</span><span>0{index + 1}</span></div>
                <div>
                  <h3>{chapter.title}</h3>
                  <p>{chapter.description}</p>
                </div>
                <ul>{chapter.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>
                <PlatformLinks platforms={raxaPlatforms} label={`Raxa ${chapter.year}`} />
              </article>
            ))}
          </div>
          <div className="journey-metrics" data-reveal>
            <p><strong>70%</strong><span>less manual testing</span></p>
            <p><strong>2 mo</strong><span>three-platform redesign</span></p>
            <p><strong>4+</strong><span>years building at Raxa</span></p>
          </div>
        </section>

        <section id="work" className="work section-grid">
          <div className="work-heading">
            <p className="section-index">03 / Freelance projects</p>
            <p className="work-instruction">{compact ? 'Tap a project to bring its object forward.' : 'Hover or focus a project to bring its object forward.'}</p>
          </div>
          <div className="project-list">
            {projects.map((project, index) => (
              <article
                data-reveal
                className={`${activeProject === index ? 'project active' : 'project'}${openPlatforms === `project-${index}` ? ' platforms-open' : ''}`}
                key={project.title}
                onMouseEnter={() => setActiveProject(index)}
                onFocusCapture={() => setActiveProject(index)}
                onClick={() => {
                  if (project.platforms.length > 0) setOpenPlatforms((value) => value === `project-${index}` ? null : `project-${index}`)
                }}
                onKeyDown={(event) => {
                  if (project.platforms.length > 0 && (event.key === 'Enter' || event.key === ' ') && event.target === event.currentTarget) {
                    event.preventDefault()
                    setOpenPlatforms((value) => value === `project-${index}` ? null : `project-${index}`)
                  }
                }}
                tabIndex="0"
                aria-expanded={project.platforms.length > 0 ? openPlatforms === `project-${index}` : undefined}
              >
                <p className="project-number">{project.number}</p>
                <div className="project-copy">
                  <p className="project-meta">{project.meta}</p>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <ul>{project.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>
                </div>
                {project.platforms.length > 0 ? (
                  <>
                    <button className="platform-trigger" type="button" aria-label={`Show ${project.title} platform links`}><ArrowUpRight /></button>
                    <PlatformLinks platforms={project.platforms} label={project.title} />
                  </>
                ) : <span className="offline-badge">Offline</span>}
              </article>
            ))}
          </div>
        </section>

        <section id="contact" className="contact section-grid">
          <p className="section-index">04 / Contact</p>
          <div data-reveal className="contact-copy">
            <p>Have a difficult interface or ambitious product?</p>
            <MagneticContactLink />
          </div>
          <footer>
            <p>© {year} Shivam Choudhary</p>
            <div><a href="https://github.com/Shivam-dev925" target="_blank" rel="noreferrer"><Github size={17} /> GitHub</a><a href="https://www.linkedin.com/in/shivam-choudhary-058061218/" target="_blank" rel="noreferrer"><Linkedin size={17} /> LinkedIn</a><a href="mailto:chshivam815@gmail.com"><Mail size={17} /> Email</a></div>
          </footer>
        </section>
      </main>
    </div>
  )
}

export default App
