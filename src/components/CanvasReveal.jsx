import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import '../styles/CanvasReveal.css'

const vertexShader = `
void main() {
  gl_Position = vec4(position, 1.0);
}
`

const fragmentShader = `
precision highp float;

uniform float u_time;
uniform float u_drift;
uniform vec2  u_resolution;
uniform vec3  u_color;
uniform float u_base_opacity;
uniform vec2  u_mouse;            // normalized -0.5..0.5 (x right, y up)
uniform vec2  u_cursor;           // gl screen-space pixels (y-up, device px)
uniform vec2  u_repulse_center;   // spring position in device px (y-up)
uniform float u_repulse_radius;   // repulsion radius in device px
uniform float u_repulse_strength; // max displacement in device px
uniform vec2  u_ship_pos;         // spaceship position device px (y-up)
uniform float u_ship_angle;       // heading angle in radians
uniform float u_ship_alpha;       // visibility 0..1
uniform float u_ship_size;        // bounding size in device px
uniform vec2  u_trail_start;      // trail start device px
uniform vec2  u_trail_end;        // trail end device px
uniform float u_trail_alpha;      // trail opacity
uniform float u_trail_progress;   // trail draw progress 0..1
uniform float u_boost_active;
uniform float u_exhaust_alpha;

out vec4 fragColor;

// ── Hash helpers ──────────────────────────────────────────────
float h1(float n)  { return fract(sin(n) * 43758.5453123); }
float h1v(vec2 p)  { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
vec2  h2(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return fract(sin(p) * 43758.5453);
}

// ── Nebula blobs ──────────────────────────────────────────────
// Three slowly-drifting colored glow patches.
// Suppressed in light theme via u_base_opacity².
vec3 nebula(vec2 uv) {
  float t   = u_time * 0.012;
  vec2  asp = vec2(u_resolution.x / max(u_resolution.y, 1.0), 1.0);

  vec2 c1 = vec2(0.22 + sin(t * 0.7) * 0.04, 0.55 + cos(t * 0.5) * 0.03);
  vec2 c2 = vec2(0.76 + cos(t * 0.4) * 0.03, 0.40 + sin(t * 0.6) * 0.04);
  vec2 c3 = vec2(0.50 + sin(t * 0.3) * 0.05, 0.18 + cos(t * 0.8) * 0.02);

  float n1 = exp(-length((uv - c1) * asp) * 4.2);
  float n2 = exp(-length((uv - c2) * asp) * 5.0);
  float n3 = exp(-length((uv - c3) * asp) * 5.8);

  return (vec3(0.08, 0.03, 0.22) * n1   // deep purple
        + vec3(0.00, 0.07, 0.28) * n2   // deep blue
        + vec3(0.18, 0.00, 0.18) * n3)  // magenta
       * 0.20;
}

// ── Star layer with cursor brightening + repulsion ────────────
// cellPx:    tile size in device pixels - controls star density
// layerScale: depth multiplier - larger = faster drift = feels closer
float starLayer(vec2 px, float cellPx, float layerScale) {
  vec2 ctr = u_resolution * 0.5;
  vec2 off = px - ctr;
  float r  = length(off) / max(length(ctr), 1.0);

  vec2 drifted = px
               + normalize(off + vec2(0.0001))
               * u_drift * layerScale * (0.3 + r * 0.7);

  vec2 cell  = floor(drifted / cellPx);
  vec2 local = fract(drifted / cellPx);

  vec2  sp = h2(cell) * 0.72 + 0.14;
  float sz = 0.012 + h1v(cell + 5.3) * 0.022;
  float tw = 0.35 + 0.65 * sin(
    u_time * (0.6 + h1v(cell) * 1.6) + h1v(cell + 1.7) * 6.28318
  );

  // Stars near cursor glow up to 90% brighter
  float cursorBoost = smoothstep(160.0, 0.0, length(px - u_cursor)) * 0.9;

  // Cursor repulsion - push star visual center away from spring position
  vec2  starPos     = (cell + sp) * cellPx;
  vec2  toStar      = starPos - u_repulse_center;
  float dist        = length(toStar);
  float repulse     = smoothstep(u_repulse_radius, 0.0, dist) * u_repulse_strength;
  vec2  sp_repulsed = sp + normalize(toStar + vec2(0.0001)) * repulse / cellPx;

  float repulseFactor = smoothstep(u_repulse_radius, 0.0, dist);
  float boost         = cursorBoost + repulseFactor * 0.8;

  return smoothstep(sz, sz * 0.04, length(local - sp_repulsed)) * tw * (1.0 + boost);
}

void main() {
  vec2 px = gl_FragCoord.xy;
  vec2 uv = px / u_resolution;

  // Stars: three depth layers
  float layerA = starLayer(px, 48.0,  1.0);
  float layerB = starLayer(px, 90.0,  2.0);
  float layerC = starLayer(px, 150.0, 4.0);
  float stars  = layerA * 0.45 + layerB * 0.68 + layerC * 0.9;
  float starTotal = clamp(stars, 0.0, 1.0) * u_base_opacity;

  // Nebula: u_base_opacity² suppresses it in light mode (0.35² ≈ 0.12)
  vec3  nebCol   = nebula(uv) * (u_base_opacity * u_base_opacity);
  float nebAlpha = clamp(length(nebCol) * 3.0, 0.0, 0.12);

  // Cursor ambient glow
  float cglow = smoothstep(200.0, 0.0, length(px - u_cursor)) * 0.05 * u_base_opacity;

  // Blend nebula and star colors
  float starsWeight = starTotal / max(starTotal + nebAlpha + 0.001, 0.001);
  vec3  nebColor    = nebCol / max(nebAlpha + 0.001, 0.001);
  vec3  finalColor  = mix(nebColor, u_color, starsWeight);

  float totalAlpha = clamp(starTotal + nebAlpha + cglow, 0.0, 1.0);

  // ── Spaceship body ────────────────────────────────────────────
  vec2  toShip     = px - u_ship_pos;
  float ca         = cos(-u_ship_angle);
  float sa         = sin(-u_ship_angle);
  vec2  local      = vec2(
    toShip.x * ca - toShip.y * sa,
    toShip.x * sa + toShip.y * ca
  );
  float nose       = local.x / u_ship_size;
  float wing       = abs(local.y) / u_ship_size;
  float inTriangle = step(0.0, (0.5 - wing) * 2.0 - (nose + 0.5));
  float inBody     = step(-0.5, nose) * step(nose, 0.5) * inTriangle;
  float shipBody   = inBody * u_ship_alpha;
  float engineDist = length(local - vec2(-u_ship_size * 0.6, 0.0));
  // Normal engine glow
  float engineGlow = smoothstep(u_ship_size * 0.5, 0.0, engineDist) * 0.4 * u_ship_alpha;

  // Rocket exhaust when boosting
  float exhaustCone = 0.0;
  vec3 exhaustColor = vec3(1.0, 0.55, 0.2);
  if (u_boost_active > 0.0) {
    float exNose = -(local.x / (u_ship_size * 2.5));
    float exWing = abs(local.y) / (u_ship_size * 1.2);
    float inCone = step(0.0, exNose) *
      step(exNose, 1.0) *
      step(exWing, 1.0 - exNose);
    float coneGlow = smoothstep(u_ship_size * 2.5, 0.0,
      length(local + vec2(u_ship_size * 1.2, 0.0))) * 0.7;
    exhaustCone = (inCone * 0.8 + coneGlow) * u_exhaust_alpha * u_boost_active;
  }

  // Outer exhaust halo
  float exhaustHalo = smoothstep(u_ship_size * 3.0, 0.0,
    length(local + vec2(u_ship_size * 0.8, 0.0)))
    * 0.3 * u_exhaust_alpha * u_boost_active;

  finalColor += u_color * (shipBody * 0.9 + engineGlow);
  finalColor += exhaustColor * (exhaustCone + exhaustHalo);
  totalAlpha = max(totalAlpha, shipBody * u_ship_alpha);
  totalAlpha = max(totalAlpha, exhaustCone * u_exhaust_alpha * 0.6);

  // Trail - dotted line (normal) or solid when boosting
  vec2 trailDir = u_trail_end - u_trail_start;
  float trailLen = length(trailDir);
  vec2 trailNorm = trailDir / (trailLen + 0.001);
  vec2 toPxTrail = px - u_trail_start;
  float alongTrail = dot(toPxTrail, trailNorm);
  float perpTrail = abs(dot(toPxTrail, vec2(-trailNorm.y, trailNorm.x)));
  float inTrailLen = step(0.0, alongTrail) *
    step(alongTrail, trailLen * u_trail_progress);
  float trailPerp = smoothstep(2.0, 0.0, perpTrail);
  float trailDot = mix(
    step(0.6, fract(alongTrail * 0.04)),
    1.0,
    u_boost_active);
  float trailLine = inTrailLen * trailPerp *
    trailDot * u_trail_alpha *
    mix(0.3, 0.15, u_boost_active);
  finalColor += u_color * trailLine;
  totalAlpha = max(totalAlpha, trailLine * 0.35);

  fragColor = vec4(finalColor, totalAlpha);
}
`

function SpacePlane({ color, baseOpacity, speedRef, tintRef, active, containerRef }) {
  const { size, gl } = useThree()
  const meshRef       = useRef()
  const driftRef      = useRef(0)
  const timeRef       = useRef(0)
  const springPosRef  = useRef({ x: -9999, y: -9999 })
  const springVelRef  = useRef({ x: 0, y: 0 })
  const targetPosRef  = useRef({ x: -9999, y: -9999 })
  const shipRef       = useRef({
    x: -9999, y: -9999,
    vx: 0, vy: 0,
    angle: 0,
    targetAngle: 0,
    alpha: 0,
    phase: 'idle',
    wanderTimer: 0,
    wanderInterval: 2.0,
    btnX: 0, btnY: 0,
  })
  const threatRef     = useRef({ x: -9999, y: -9999 })
  const trailRef      = useRef({
    sx: -9999, sy: -9999,
    ex: -9999, ey: -9999,
    alpha: 0,
    spawnTimer: 0,
    lastX: -9999, lastY: -9999,
  })
  const boostRef        = useRef(0)
  const exhaustAlphaRef = useRef(0)

  // Change 1: edge drift-return state
  const isReturningFromEdgeRef = useRef(false)
  const returnTargetAngleRef   = useRef(0)

  // Change 2: mobile random-interval boost
  const isMobile             = typeof window !== 'undefined' &&
    ('ontouchstart' in window || navigator.maxTouchPoints > 0)
  const mobileBoostFiringRef = useRef(false)
  const mobileBoostTimerRef  = useRef(null)

  // Change 3: sparkle particles
  const sparklesRef        = useRef([])
  const sparkleCanvasRef   = useRef(null)
  const sparkleCtxRef      = useRef(null)
  const prevBoostActiveRef = useRef(false)

  const material = useMemo(() => new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    transparent: true,
    blending: THREE.NormalBlending,
    depthTest: false,
    glslVersion: THREE.GLSL3,
    uniforms: {
      u_time:             { value: 0 },
      u_drift:            { value: 0 },
      u_resolution:       { value: new THREE.Vector2(gl.domElement.width, gl.domElement.height) },
      u_color:            { value: new THREE.Vector3(color[0] / 255, color[1] / 255, color[2] / 255) },
      u_base_opacity:     { value: baseOpacity },
      u_mouse:            { value: new THREE.Vector2(0, 0) },
      u_cursor:           { value: new THREE.Vector2(-9999, -9999) },
      u_repulse_center:   { value: new THREE.Vector2(-9999, -9999) },
      u_repulse_radius:   { value: 120.0 },
      u_repulse_strength: { value: 40.0 },
      u_ship_pos:         { value: new THREE.Vector2(-9999, -9999) },
      u_ship_angle:       { value: 0.0 },
      u_ship_alpha:       { value: 0.0 },
      u_ship_size:        { value: 10.0 },
      u_trail_start:      { value: new THREE.Vector2(-9999, -9999) },
      u_trail_end:        { value: new THREE.Vector2(-9999, -9999) },
      u_trail_alpha:      { value: 0.0 },
      u_trail_progress:   { value: 1.0 },
      u_boost_active:     { value: 0.0 },
      u_exhaust_alpha:    { value: 0.0 },
    },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [])

  useEffect(() => {
    if (!meshRef.current) return
    meshRef.current.material.uniforms.u_resolution.value.set(
      gl.domElement.width, gl.domElement.height
    )
  }, [size, gl])

  useEffect(() => {
    if (!meshRef.current) return
    meshRef.current.material.uniforms.u_base_opacity.value = baseOpacity
  }, [baseOpacity])

  // Cursor glow + repulsion + threat tracking.
  // On mobile: skip touch-as-threat (random interval boost handles it instead).
  useEffect(() => {
    const dpr = window.devicePixelRatio || 1
    const onMove = (e) => {
      if (!meshRef.current?.material?.uniforms) return
      const u = meshRef.current.material.uniforms
      u.u_mouse.value.set(
        e.clientX / window.innerWidth - 0.5,
        0.5 - e.clientY / window.innerHeight
      )
      u.u_cursor.value.set(
        e.clientX * dpr,
        (window.innerHeight - e.clientY) * dpr
      )
      targetPosRef.current.x = e.clientX * dpr
      targetPosRef.current.y = (window.innerHeight - e.clientY) * dpr
      threatRef.current.x    = e.clientX * dpr
      threatRef.current.y    = (window.innerHeight - e.clientY) * dpr
    }
    const onLeave = () => {
      if (!meshRef.current?.material?.uniforms) return
      meshRef.current.material.uniforms.u_cursor.value.set(-9999, -9999)
      targetPosRef.current.x = -9999
      targetPosRef.current.y = -9999
      threatRef.current.x    = -9999
      threatRef.current.y    = -9999
    }
    window.addEventListener('mousemove',  onMove,  { passive: true })
    window.addEventListener('mouseleave', onLeave)

    let onTouch    = null
    let onTouchEnd = null
    if (!isMobile) {
      onTouch = (e) => {
        const t = e.touches[0]
        threatRef.current.x = t.clientX * dpr
        threatRef.current.y = (window.innerHeight - t.clientY) * dpr
      }
      onTouchEnd = () => {
        threatRef.current.x = -9999
        threatRef.current.y = -9999
      }
      window.addEventListener('touchmove', onTouch,    { passive: true })
      window.addEventListener('touchend',  onTouchEnd)
    }

    return () => {
      window.removeEventListener('mousemove',  onMove)
      window.removeEventListener('mouseleave', onLeave)
      if (onTouch)    window.removeEventListener('touchmove', onTouch)
      if (onTouchEnd) window.removeEventListener('touchend',  onTouchEnd)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Activation / deactivation + mobile random-interval boost scheduler
  useEffect(() => {
    const ship = shipRef.current
    const dpr  = window.devicePixelRatio || 1
    if (active) {
      const btn = document.querySelector('.nav__spaceship-btn')
      setTimeout(() => {
        if (btn) {
          const rect = btn.getBoundingClientRect()
          ship.btnX = rect.left + rect.width  / 2
          ship.btnY = rect.top  + rect.height / 2
          ship.x    = ship.btnX * dpr
          ship.y    = (window.innerHeight - ship.btnY) * dpr
        }
        ship.vx    = (Math.random() - 0.5) * 200
        ship.vy    = (Math.random() - 0.5) * 200
        ship.phase = 'emerging'
      }, 800)

      if (isMobile) {
        const scheduleBoost = () => {
          const interval = 2000 + Math.random() * 3000
          mobileBoostTimerRef.current = setTimeout(() => {
            if (shipRef.current.phase === 'idle') return
            mobileBoostFiringRef.current = true
            const duration = 600 + Math.random() * 600
            mobileBoostTimerRef.current = setTimeout(() => {
              mobileBoostFiringRef.current = false
              scheduleBoost()
            }, duration)
          }, interval)
        }
        scheduleBoost()
      }
    } else {
      if (ship.phase !== 'idle') ship.phase = 'returning'
      if (isMobile) {
        clearTimeout(mobileBoostTimerRef.current)
        mobileBoostFiringRef.current = false
      }
    }
  }, [active]) // eslint-disable-line react-hooks/exhaustive-deps

  // Sparkle 2D overlay canvas — sits on top of the WebGL canvas
  useEffect(() => {
    const container = containerRef?.current
    if (!container) return
    const sc = document.createElement('canvas')
    sc.style.cssText = `
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 1;
    `
    container.appendChild(sc)
    sparkleCanvasRef.current = sc
    sparkleCtxRef.current    = sc.getContext('2d')
    return () => { sc.remove() }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => () => {
    material.dispose()
    clearTimeout(mobileBoostTimerRef.current)
  }, [material])

  useFrame((_, delta) => {
    if (!meshRef.current) return
    const mat = meshRef.current.material
    if (!mat.uniforms) return

    timeRef.current += delta
    mat.uniforms.u_time.value = timeRef.current

    if (speedRef?.current !== undefined) {
      speedRef.current = 3 + (speedRef.current - 3) * 0.90
    }

    const scrollBoost = speedRef?.current ?? 3
    const driftRate   = Math.max(scrollBoost * 0.28, 0.15)
    driftRef.current += delta * driftRate
    mat.uniforms.u_drift.value = driftRef.current

    // Spring physics for star repulsion center
    const stiffness = 0.12
    const damping   = 0.75
    const dx = targetPosRef.current.x - springPosRef.current.x
    const dy = targetPosRef.current.y - springPosRef.current.y
    springVelRef.current.x = springVelRef.current.x * damping + dx * stiffness
    springVelRef.current.y = springVelRef.current.y * damping + dy * stiffness
    springPosRef.current.x += springVelRef.current.x
    springPosRef.current.y += springVelRef.current.y
    mat.uniforms.u_repulse_center.value.set(springPosRef.current.x, springPosRef.current.y)

    const ship  = shipRef.current
    const trail = trailRef.current
    const dpr   = window.devicePixelRatio || 1

    if (ship.phase === 'emerging') {
      ship.alpha  = Math.min(1.0, ship.alpha + delta * 2)
      ship.x     += ship.vx * delta
      ship.y     += ship.vy * delta
      if (ship.alpha >= 1.0) ship.phase = 'flying'
    }

    if (ship.phase === 'flying') {
      const w = gl.domElement.width
      const h = gl.domElement.height

      // Wander: random direction every 1.5–3.5 s
      ship.wanderTimer += delta
      if (ship.wanderTimer >= ship.wanderInterval) {
        ship.wanderTimer    = 0
        ship.wanderInterval = 1.5 + Math.random() * 2.0
        ship.targetAngle    = Math.random() * Math.PI * 2
      }

      // Threat avoidance (desktop cursor / non-mobile touch)
      const tx          = threatRef.current.x
      const ty          = threatRef.current.y
      const tdx         = ship.x - tx
      const tdy         = ship.y - ty
      const threatDist  = Math.sqrt(tdx * tdx + tdy * tdy)
      const threatRadius = 200 * dpr
      let baseSpeed = 120
      let isBoosting = false
      if (threatDist < threatRadius) {
        ship.targetAngle = Math.atan2(tdy, tdx)
        const proximity  = 1.0 - (threatDist / threatRadius)
        baseSpeed        = 120 + proximity * 380
        isBoosting       = proximity > 0.3
      }

      // Boost logic: mobile uses random-interval scheduler; desktop uses cursor proximity
      if (isMobile) {
        if (mobileBoostFiringRef.current) {
          boostRef.current        = Math.min(0.7, boostRef.current + delta / 0.3)
          exhaustAlphaRef.current = Math.min(0.8, exhaustAlphaRef.current + delta / 0.3)
          baseSpeed               = 120 * 1.8
        } else {
          boostRef.current        = Math.max(0.0, boostRef.current - delta / 0.4)
          exhaustAlphaRef.current = Math.max(0.0, exhaustAlphaRef.current - delta / 0.4)
        }
      } else {
        if (isBoosting) {
          boostRef.current        = Math.min(1.0, boostRef.current + delta * 6)
          exhaustAlphaRef.current = Math.min(1.0, exhaustAlphaRef.current + delta * 8)
        } else {
          boostRef.current        = Math.max(0.0, boostRef.current - delta * 4)
          exhaustAlphaRef.current = Math.max(0.0, exhaustAlphaRef.current - delta * 3)
        }
      }

      // Extended boundary: allow up to 5% past each edge, then curve back purposefully
      const outsideViewport = ship.x < 0 || ship.x > w || ship.y < 0 || ship.y > h
      if (outsideViewport && !isReturningFromEdgeRef.current) {
        isReturningFromEdgeRef.current = true
        // Aim toward viewport center with a slight lateral offset so the arc differs each time
        returnTargetAngleRef.current =
          Math.atan2(h * 0.5 - ship.y, w * 0.5 - ship.x) +
          (Math.random() - 0.5) * 0.8
      } else if (!outsideViewport && isReturningFromEdgeRef.current) {
        isReturningFromEdgeRef.current = false
      }

      if (isReturningFromEdgeRef.current) {
        // Purposeful curve back: 2.5 rad/s fixed rate
        let daEdge = returnTargetAngleRef.current - ship.angle
        while (daEdge >  Math.PI) daEdge -= Math.PI * 2
        while (daEdge < -Math.PI) daEdge += Math.PI * 2
        ship.angle += Math.sign(daEdge) * Math.min(Math.abs(daEdge), 2.5 * delta)
      } else {
        let da = ship.targetAngle - ship.angle
        while (da >  Math.PI) da -= Math.PI * 2
        while (da < -Math.PI) da += Math.PI * 2
        ship.angle += da * Math.min(1.0, delta * 4)
      }

      const spd = baseSpeed * (isReturningFromEdgeRef.current ? 1.4 : 1.0) * dpr
      ship.vx   = Math.cos(ship.angle) * spd
      ship.vy   = Math.sin(ship.angle) * spd
      ship.x   += ship.vx * delta
      ship.y   += ship.vy * delta

      // Hard clamp at ±5% extended boundary — rocket barely clips the edge
      ship.x = Math.max(-w * 0.05, Math.min(w * 1.05, ship.x))
      ship.y = Math.max(-h * 0.05, Math.min(h * 1.05, ship.y))

      // Trail spawning
      trail.spawnTimer += delta
      if (trail.spawnTimer >= 0.8) {
        trail.spawnTimer = 0
        trail.sx    = trail.lastX === -9999 ? ship.x : trail.lastX
        trail.sy    = trail.lastY === -9999 ? ship.y : trail.lastY
        trail.ex    = ship.x
        trail.ey    = ship.y
        trail.alpha = ship.alpha * 0.4
        trail.lastX = ship.x
        trail.lastY = ship.y
      }
      trail.alpha = Math.max(0, trail.alpha - delta * 0.6)
    }

    if (ship.phase === 'returning') {
      const rbx   = ship.btnX * dpr
      const rby   = (window.innerHeight - ship.btnY) * dpr
      const rdx   = rbx - ship.x
      const rdy   = rby - ship.y
      const rdist = Math.sqrt(rdx * rdx + rdy * rdy)
      ship.targetAngle = Math.atan2(rdy, rdx)
      let da2 = ship.targetAngle - ship.angle
      while (da2 >  Math.PI) da2 -= Math.PI * 2
      while (da2 < -Math.PI) da2 += Math.PI * 2
      ship.angle += da2 * Math.min(1.0, delta * 6)
      const retSpd = 180 * dpr
      ship.x += Math.cos(ship.angle) * retSpd * delta
      ship.y += Math.sin(ship.angle) * retSpd * delta
      if (rdist < 60 * dpr) {
        ship.alpha -= delta * 3
        if (ship.alpha <= 0) {
          ship.alpha  = 0
          ship.phase  = 'idle'
          ship.x      = -9999
          ship.y      = -9999
          trail.alpha = 0
          trail.lastX = -9999
          trail.lastY = -9999
        }
      }
    }

    if (ship.phase === 'idle') {
      ship.alpha              = 0
      ship.x                  = -9999
      ship.y                  = -9999
      sparklesRef.current     = []
    }

    mat.uniforms.u_ship_pos.value.set(ship.x, ship.y)
    mat.uniforms.u_ship_angle.value       = ship.angle
    mat.uniforms.u_ship_alpha.value       = ship.alpha
    mat.uniforms.u_ship_size.value        = (window.innerWidth <= 767 ? 6.0 : 10.0) * dpr
    mat.uniforms.u_trail_start.value.set(trail.sx, trail.sy)
    mat.uniforms.u_trail_end.value.set(trail.ex, trail.ey)
    mat.uniforms.u_trail_alpha.value    = trail.alpha
    mat.uniforms.u_trail_progress.value = 1.0
    mat.uniforms.u_boost_active.value   = boostRef.current
    mat.uniforms.u_exhaust_alpha.value  = exhaustAlphaRef.current

    // Smooth exponential lerp toward section tint target (~1 s transition)
    if (tintRef?.current) {
      const target = tintRef.current
      const c = mat.uniforms.u_color.value
      const k = 1 - Math.pow(0.1, delta)
      c.x += (target[0] / 255 - c.x) * k
      c.y += (target[1] / 255 - c.y) * k
      c.z += (target[2] / 255 - c.z) * k
    }

    // ── Sparkle system ────────────────────────────────────────────
    const isBoostActive = boostRef.current > 0.3
    if (ship.phase === 'flying') {
      const exhaustAngle = ship.angle + Math.PI
      // 8 sparkles on the rising edge of boost > 0.3
      if (isBoostActive && !prevBoostActiveRef.current) {
        const toSpawn = Math.min(8, 40 - sparklesRef.current.length)
        for (let i = 0; i < toSpawn; i++) {
          const spread  = (Math.random() - 0.5) * (70 * Math.PI / 180) // ±35 deg
          const spAngle = exhaustAngle + spread
          const spSpeed = (20 + Math.random() * 40) * dpr
          sparklesRef.current.push({
            x:    ship.x,
            y:    ship.y,
            vx:   Math.cos(spAngle) * spSpeed,
            vy:   Math.sin(spAngle) * spSpeed,
            life: 1.0,
            size: (1.5 + Math.random() * 1.5) * dpr,
          })
        }
      }
      // 2 additional sparkles every frame while boost is active
      if (isBoostActive && sparklesRef.current.length < 40) {
        const toSpawn = Math.min(2, 40 - sparklesRef.current.length)
        for (let i = 0; i < toSpawn; i++) {
          const spread  = (Math.random() - 0.5) * (70 * Math.PI / 180) // ±35 deg
          const spAngle = exhaustAngle + spread
          const spSpeed = (20 + Math.random() * 40) * dpr
          sparklesRef.current.push({
            x:    ship.x,
            y:    ship.y,
            vx:   Math.cos(spAngle) * spSpeed,
            vy:   Math.sin(spAngle) * spSpeed,
            life: 1.0,
            size: (1.5 + Math.random() * 1.5) * dpr,
          })
        }
      }
    }
    prevBoostActiveRef.current = isBoostActive

    // Update positions and decay; full fade ~2.8 s (0.35/s)
    sparklesRef.current = sparklesRef.current
      .filter(p => p.life > 0)
      .map(p => ({
        ...p,
        x:    p.x + p.vx * delta,
        y:    p.y + p.vy * delta,
        life: p.life - 0.35 * delta,
      }))

    // Render sparkles on 2D overlay (y-axis flipped: shader is y-up, canvas is y-down)
    if (sparkleCanvasRef.current && sparkleCtxRef.current) {
      const sc  = sparkleCanvasRef.current
      const ctx = sparkleCtxRef.current
      const cw  = gl.domElement.width
      const ch  = gl.domElement.height
      if (sc.width !== cw || sc.height !== ch) {
        sc.width  = cw
        sc.height = ch
      }
      ctx.clearRect(0, 0, cw, ch)
      for (const p of sparklesRef.current) {
        const a      = Math.max(0, p.life)
        const lifeT  = Math.min(1, p.life)
        const g      = Math.round(140 + (240 - 140) * lifeT)
        const b      = Math.round(40  + (200 - 40)  * lifeT)
        const radius = p.size * (p.life < 0.3 ? p.life / 0.3 : 1)
        if (radius <= 0) continue
        ctx.beginPath()
        ctx.arc(p.x, ch - p.y, radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,${g},${b},${a})`
        ctx.fill()
      }
    }
  })

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2]} />
      <primitive object={material} attach="material" />
    </mesh>
  )
}

export default function CanvasReveal({
  starColor    = [255, 255, 255],
  baseOpacity  = 1.0,
  showGradient = true,
  speedRef,
  tintRef,
  active       = false,
}) {
  const containerRef = useRef(null)

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (prefersReducedMotion) return null

  return (
    <div className="canvas-reveal-wrapper" ref={containerRef} style={{ position: 'relative' }}>
      <Canvas
        gl={{ alpha: true, antialias: false }}
        style={{ width: '100%', height: '100%', display: 'block' }}
      >
        <SpacePlane
          color={starColor}
          baseOpacity={baseOpacity}
          speedRef={speedRef}
          tintRef={tintRef}
          active={active}
          containerRef={containerRef}
        />
      </Canvas>
      {showGradient && <div className="canvas-reveal-gradient" />}
    </div>
  )
}
