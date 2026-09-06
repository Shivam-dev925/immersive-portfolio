import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, MeshTransmissionMaterial, RoundedBox, Sparkles } from '@react-three/drei'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowDown, ArrowUpRight, Github, Mail, MousePointer2 } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'

gsap.registerPlugin(ScrollTrigger)

function SceneWarmup({ onReady }) {
  const { gl, scene, camera } = useThree()

  useEffect(() => {
    let cancelled = false
    let frame = 0

    const warmup = async () => {
      try {
        if (typeof gl.compileAsync === 'function') {
          await gl.compileAsync(scene, camera)
        } else {
          gl.compile(scene, camera)
        }
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
    title: 'Raxa Health Platform',
    description: 'A unified care platform connecting patient journeys, clinical workflows, and operational intelligence.',
    tags: ['React', 'Design systems', 'Healthcare'],
    accent: '#a7f3d0',
  },
  {
    number: '02',
    title: 'Clinical Command Center',
    description: 'A dense, real-time workspace redesigned around clarity, prioritization, and safe clinical decisions.',
    tags: ['Data visualization', 'UX architecture', 'Performance'],
    accent: '#bfdbfe',
  },
  {
    number: '03',
    title: 'AI Care Companion',
    description: 'A conversational health experience that balances useful automation with trust and human oversight.',
    tags: ['Generative UI', 'AI safety', 'Mobile'],
    accent: '#ddd6fe',
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
        const angle = (index - 1) * 0.72
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
      <a className="brand" href="#top" aria-label="Shivam Choudhary, home">SC<span>®</span></a>
      <button className="menu-toggle" aria-expanded={open} aria-controls="site-nav" onClick={() => setOpen((value) => !value)}>
        {open ? 'Close' : 'Menu'}
      </button>
      <nav id="site-nav" className={open ? 'nav open' : 'nav'} aria-label="Main navigation">
        <a href="#about" onClick={() => setOpen(false)}>About</a>
        <a href="#work" onClick={() => setOpen(false)}>Work</a>
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
  const year = useMemo(() => new Date().getFullYear(), [])
  const markSceneReady = useMemo(() => () => setSceneReady(true), [])

  useEffect(() => {
    const fallback = window.setTimeout(markSceneReady, 4500)
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
          })
        })
      }
    }, root)
    return () => context.revert()
  }, [reducedMotion, sceneReady])

  return (
    <div ref={root} id="top" className={sceneReady ? 'app-shell is-ready' : 'app-shell'}>
      <a className="skip-link" href="#main">Skip to content</a>
      <div className="startup" role="status" aria-live="polite" aria-label={sceneReady ? 'Portfolio ready' : 'Loading portfolio'}>
        <span className="startup-mark">SC<span>®</span></span>
        <span className="startup-track"><span /></span>
      </div>
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

        <section id="work" className="work section-grid">
          <div className="work-heading">
            <p className="section-index">02 / Selected work</p>
            <p className="work-instruction">{compact ? 'Tap a project to bring its object forward.' : 'Hover or focus a project to bring its object forward.'}</p>
          </div>
          <div className="project-list">
            {projects.map((project, index) => (
              <article
                data-reveal
                className={activeProject === index ? 'project active' : 'project'}
                key={project.title}
                onMouseEnter={() => setActiveProject(index)}
                onFocusCapture={() => setActiveProject(index)}
              >
                <p className="project-number">{project.number}</p>
                <div className="project-copy">
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <ul>{project.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>
                </div>
                <a href="#case-study" aria-label={`View ${project.title} case study`}><ArrowUpRight /></a>
              </article>
            ))}
          </div>
        </section>

        <section id="case-study" className="case-study">
          <div className="case-study-inner" data-reveal>
            <p className="section-index">03 / Case study</p>
            <h2>Designing a calmer<br />clinical operating system.</h2>
            <div className="case-meta">
              <p><span>Role</span>Lead frontend engineering</p>
              <p><span>Focus</span>Architecture, design systems, data UX</p>
              <p><span>Outcome</span>Faster workflows with less cognitive load</p>
            </div>
            <div className="case-visual" role="img" aria-label="Abstract interface architecture showing connected clinical modules">
              <div className="module module-a">Patient journey</div>
              <div className="module module-b">Clinical workspace</div>
              <div className="module module-c">Operational insight</div>
              <svg viewBox="0 0 1000 520" preserveAspectRatio="none" aria-hidden="true">
                <path d="M190 150 C350 150 330 260 500 260 S650 370 810 370" />
                <path d="M190 150 C360 150 380 100 500 100 S690 100 810 370" />
              </svg>
            </div>
          </div>
        </section>

        <section id="contact" className="contact section-grid">
          <p className="section-index">04 / Contact</p>
          <div data-reveal className="contact-copy">
            <p>Have a difficult interface or ambitious product?</p>
            <a href="mailto:chshivam815@gmail.com">Let’s make it clear.<ArrowUpRight /></a>
          </div>
          <footer>
            <p>© {year} Shivam Choudhary</p>
            <div><a href="https://github.com/Shivam-dev925" target="_blank" rel="noreferrer"><Github size={17} /> GitHub</a><a href="mailto:chshivam815@gmail.com"><Mail size={17} /> Email</a></div>
          </footer>
        </section>
      </main>
    </div>
  )
}

export default App
