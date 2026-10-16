import { useEffect, useState, useRef } from 'react'

interface Particle {
  id: number
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  opacity: number
  color: string
}

function App() {
  const [particles, setParticles] = useState<Particle[]>([])
  const [isVisible, setIsVisible] = useState(false)
  const [glitchActive, setGlitchActive] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const animationRef = useRef<number>(0)
  const particlesRef = useRef<Particle[]>([])

  useEffect(() => {
    setIsVisible(true)

    // Initial particles
    const colors = ['#ff006e', '#8338ec', '#3a86ff', '#fb5607', '#ffbe0b']
    const initialParticles: Particle[] = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 6 + 2,
      speedX: (Math.random() - 0.5) * 2,
      speedY: (Math.random() - 0.5) * 2,
      opacity: Math.random() * 0.7 + 0.3,
      color: colors[Math.floor(Math.random() * colors.length)]
    }))
    particlesRef.current = initialParticles
    setParticles(initialParticles)

    // Animation loop
    const animate = () => {
      particlesRef.current = particlesRef.current.map(p => {
        let newX = p.x + p.speedX
        let newY = p.y + p.speedY

        if (newX < 0 || newX > window.innerWidth) p.speedX *= -1
        if (newY < 0 || newY > window.innerHeight) p.speedY *= -1

        // Mouse attraction
        const dx = mousePos.x - newX
        const dy = mousePos.y - newY
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 200 && dist > 0) {
          newX += (dx / dist) * 0.5
          newY += (dy / dist) * 0.5
        }

        return { ...p, x: newX, y: newY }
      })
      setParticles([...particlesRef.current])
      animationRef.current = requestAnimationFrame(animate)
    }
    animationRef.current = requestAnimationFrame(animate)

    // Glitch effect
    const glitchInterval = setInterval(() => {
      setGlitchActive(true)
      setTimeout(() => setGlitchActive(false), 200)
    }, 3000)

    return () => {
      cancelAnimationFrame(animationRef.current)
      clearInterval(glitchInterval)
    }
  }, [mousePos])

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY })
  }

  return (
    <div
      className="relative w-full min-h-screen overflow-hidden cursor-crosshair"
      onMouseMove={handleMouseMove}
      style={{
        background: 'linear-gradient(135deg, #0a0015 0%, #1a0030 25%, #0d001a 50%, #1a0040 75%, #0a0015 100%)',
      }}
    >
      {/* Animated background gradient orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20 animate-pulse"
          style={{ background: 'radial-gradient(circle, #ff006e 0%, transparent 70%)', animationDuration: '4s' }} />
        <div className="absolute top-1/2 right-1/4 w-80 h-80 rounded-full opacity-15 animate-pulse"
          style={{ background: 'radial-gradient(circle, #8338ec 0%, transparent 70%)', animationDuration: '6s' }} />
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 rounded-full opacity-20 animate-pulse"
          style={{ background: 'radial-gradient(circle, #3a86ff 0%, transparent 70%)', animationDuration: '5s' }} />
        <div className="absolute top-1/3 right-1/3 w-64 h-64 rounded-full opacity-15 animate-pulse"
          style={{ background: 'radial-gradient(circle, #fb5607 0%, transparent 70%)', animationDuration: '7s' }} />
      </div>

      {/* Particles */}
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            opacity: p.opacity,
            boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
            transition: 'left 0.05s linear, top 0.05s linear'
          }}
        />
      ))}

      {/* Grid lines */}
      <div className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        {/* Top decorative line */}
        <div className={`mb-8 transition-all duration-1000 ${isVisible ? 'opacity-100 w-64' : 'opacity-0 w-0'}`}>
          <div className="h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
        </div>

        {/* Main text */}
        <div className="relative">
          {/* Glitch layers */}
          <h1
            className={`text-6xl sm:text-8xl md:text-9xl font-black tracking-tighter transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            } ${glitchActive ? 'animate-glitch' : ''}`}
            style={{
              background: 'linear-gradient(135deg, #ff006e, #8338ec, #3a86ff, #fb5607, #ffbe0b)',
              backgroundSize: '200% 200%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              animation: 'gradientShift 3s ease infinite, float 6s ease-in-out infinite',
              textShadow: 'none',
              filter: glitchActive ? 'hue-rotate(90deg)' : 'none'
            }}
          >
            РОМА ЛОХ
          </h1>

          {/* Glitch shadow layers */}
          {glitchActive && (
            <>
              <h1
                className="absolute top-0 left-0 text-6xl sm:text-8xl md:text-9xl font-black tracking-tighter text-cyan-400 opacity-70"
                style={{ transform: 'translate(-3px, -2px)', clipPath: 'inset(20% 0 40% 0)' }}
              >
                РОМА ЛОХ
              </h1>
              <h1
                className="absolute top-0 left-0 text-6xl sm:text-8xl md:text-9xl font-black tracking-tighter text-red-500 opacity-70"
                style={{ transform: 'translate(3px, 2px)', clipPath: 'inset(60% 0 10% 0)' }}
              >
                РОМА ЛОХ
              </h1>
            </>
          )}

          {/* Glow effect */}
          <div
            className="absolute inset-0 blur-3xl opacity-30"
            style={{
              background: 'linear-gradient(135deg, #ff006e, #8338ec, #3a86ff)',
              animation: 'gradientShift 3s ease infinite'
            }}
          />
        </div>

        {/* Subtitle */}
        <p
          className={`mt-8 text-xl sm:text-2xl text-purple-300/80 font-light tracking-widest uppercase transition-all duration-1000 delay-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}
          style={{ animation: 'fadeInUp 1s ease 0.5s both' }}
        >
          ★ это навсегда ★
        </p>

        {/* Animated border box */}
        <div
          className={`mt-12 relative transition-all duration-1000 delay-700 ${
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
          }`}
        >
          <div className="absolute inset-0 rounded-2xl animate-spin-slow"
            style={{
              background: 'conic-gradient(from 0deg, #ff006e, #8338ec, #3a86ff, #fb5607, #ffbe0b, #ff006e)',
              padding: '2px',
              animation: 'spin 8s linear infinite'
            }}
          >
            <div className="w-full h-full rounded-2xl bg-black/80" />
          </div>
          <div className="relative px-8 py-4 rounded-2xl backdrop-blur-sm">
            <p className="text-white/90 text-lg font-mono">
              <span className="text-green-400">{'>'}</span> Подтверждено фактами
              <span className="animate-blink text-white">_</span>
            </p>
          </div>
        </div>

        {/* Floating emojis */}
        <div className="absolute top-20 left-10 text-4xl animate-bounce" style={{ animationDuration: '2s' }}>💀</div>
        <div className="absolute top-32 right-16 text-3xl animate-bounce" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }}>🤡</div>
        <div className="absolute bottom-32 left-20 text-3xl animate-bounce" style={{ animationDuration: '3s', animationDelay: '1s' }}>😂</div>
        <div className="absolute bottom-20 right-10 text-4xl animate-bounce" style={{ animationDuration: '2.2s', animationDelay: '0.3s' }}>🔥</div>
        <div className="absolute top-1/2 left-8 text-2xl animate-pulse">⚡</div>
        <div className="absolute top-1/3 right-8 text-2xl animate-pulse" style={{ animationDelay: '1s' }}>💫</div>

        {/* Bottom decorative elements */}
        <div className={`mt-16 flex gap-4 transition-all duration-1000 delay-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          {['👑', '🎯', '💎'].map((emoji, i) => (
            <div
              key={i}
              className="text-3xl animate-pulse"
              style={{ animationDelay: `${i * 0.3}s`, animationDuration: '2s' }}
            >
              {emoji}
            </div>
          ))}
        </div>

        {/* Scanline effect */}
        <div className="absolute inset-0 pointer-events-none opacity-5"
          style={{
            background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)'
          }}
        />
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        
        .animate-blink {
          animation: blink 1s step-end infinite;
        }
        
        .animate-glitch {
          animation: glitch 0.2s ease;
        }
        
        @keyframes glitch {
          0% { transform: translate(0); }
          20% { transform: translate(-5px, 3px); }
          40% { transform: translate(5px, -3px); }
          60% { transform: translate(-3px, -2px); }
          80% { transform: translate(3px, 2px); }
          100% { transform: translate(0); }
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export default App
