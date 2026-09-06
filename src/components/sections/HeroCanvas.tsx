"use client";

/*
 * O loop de render do react-three-fiber é imperativo: cada frame muta
 * objetos Three.js fora do modelo de dados do React. Para manter as regras
 * do compilador válidas, tudo que muda por frame vive em `useRef` — nunca
 * em valor retornado por outro hook.
 */

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

/** PRNG determinístico: mesma geometria em todo render e entre servidor/cliente. */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* =========================================================================
   Campo de partículas — uma malha tecnológica que respira.
   Toda a animação acontece no vertex shader: a CPU não toca em nenhum
   ponto por frame, o que mantém o custo praticamente constante.
   ========================================================================= */

const vertex = /* glsl */ `
  uniform float uTime;
  uniform float uAmp;
  attribute float aScale;
  varying float vGlow;

  void main() {
    vec3 p = position;

    float d = length(p.xy);
    float wave =
      sin(p.x * 0.42 + uTime * 0.45) * 0.55 +
      sin(p.y * 0.55 - uTime * 0.32) * 0.45 +
      sin(d * 0.7 - uTime * 0.7) * 0.5;

    p.z += wave * uAmp;

    // pontos mais altos brilham mais
    vGlow = smoothstep(-0.9, 1.5, wave) * (1.0 - smoothstep(7.0, 15.5, d));

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aScale * (13.0 / -mv.z);
  }
`;

const fragment = /* glsl */ `
  precision mediump float;
  uniform vec3 uCoolColor;
  uniform vec3 uHotColor;
  varying float vGlow;

  void main() {
    // ponto redondo com borda suave
    vec2 uv = gl_PointCoord - 0.5;
    float dist = length(uv);
    float alpha = smoothstep(0.5, 0.06, dist);
    if (alpha < 0.01) discard;

    vec3 color = mix(uCoolColor, uHotColor, vGlow);
    gl_FragColor = vec4(color, alpha * (0.22 + vGlow * 0.95));
  }
`;

function ParticleField({ density }: { density: number }) {
  const ref = useRef<THREE.Points>(null);

  // Uniforms vivem em ref: são mutados a cada frame, fora do ciclo do React.
  const uniforms = useRef({
    uTime: { value: 0 },
    uAmp: { value: 1.35 },
    uCoolColor: { value: new THREE.Color("#3d2a63") },
    uHotColor: { value: new THREE.Color("#c9baff") },
  }).current;

  const geometry = useMemo(() => {
    const cols = Math.round(112 * density);
    const rows = Math.round(74 * density);
    const spanX = 34;
    const spanY = 22;

    const positions = new Float32Array(cols * rows * 3);
    const scales = new Float32Array(cols * rows);
    const rand = mulberry32(20260729);

    let i = 0;
    for (let x = 0; x < cols; x++) {
      for (let y = 0; y < rows; y++) {
        // leve desalinhamento orgânico para não parecer papel milimetrado
        const jitterX = (rand() - 0.5) * 0.22;
        const jitterY = (rand() - 0.5) * 0.22;
        positions[i * 3] = (x / (cols - 1) - 0.5) * spanX + jitterX;
        positions[i * 3 + 1] = (y / (rows - 1) - 0.5) * spanY + jitterY;
        positions[i * 3 + 2] = 0;
        scales[i] = 0.55 + rand() * 0.9;
        i++;
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));

    return geo;
  }, [density]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame((_, delta) => {
    uniforms.uTime.value += Math.min(delta, 0.05);
    if (ref.current) ref.current.rotation.z += delta * 0.008;
  });

  return (
    <points ref={ref} geometry={geometry} rotation={[-1.06, 0, 0.18]} position={[0, -2.6, 0]}>
      <shaderMaterial
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* =========================================================================
   Sólidos flutuantes — geometria discreta, sem virar "site com bolinha 3D".
   ========================================================================= */

function FloatingSolid({
  position,
  scale,
  speed,
  detail = 0,
  kind = "ico",
  seed = 0,
}: {
  position: [number, number, number];
  scale: number;
  speed: number;
  detail?: number;
  kind?: "ico" | "octa" | "torus";
  /** Defasagem da flutuação, para os sólidos não subirem em uníssono. */
  seed?: number;
}) {
  const ref = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.x += delta * speed * 0.5;
    ref.current.rotation.y += delta * speed;
    ref.current.position.y =
      position[1] + Math.sin(state.clock.elapsedTime * 0.34 + seed) * 0.32;
  });

  return (
    <group ref={ref} position={position} scale={scale}>
      <mesh>
        {kind === "ico" && <icosahedronGeometry args={[1, detail]} />}
        {kind === "octa" && <octahedronGeometry args={[1, detail]} />}
        {kind === "torus" && <torusGeometry args={[1, 0.28, 12, 40]} />}
        <meshBasicMaterial
          color="#a887f5"
          wireframe
          transparent
          opacity={0.16}
        />
      </mesh>
    </group>
  );
}

/* =========================================================================
   Paralaxe de câmera guiada pelo ponteiro (amortecida, nunca brusca)
   ========================================================================= */

function CameraRig() {
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      target.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      target.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((state, delta) => {
    const cam = state.camera;
    const k = 1 - Math.pow(0.001, delta); // amortecimento independente de FPS
    cam.position.x += (target.current.x * 1.05 - cam.position.x) * k;
    cam.position.y += (-target.current.y * 0.6 + 0.4 - cam.position.y) * k;
    cam.lookAt(0, 0, 0);
  });

  return null;
}

/* =========================================================================
   Cena
   ========================================================================= */

export default function HeroCanvas() {
  const [density, setDensity] = useState(1);
  const [active, setActive] = useState(true);
  const hostRef = useRef<HTMLDivElement>(null);

  // Menos pontos em telas pequenas: mesma leitura visual, metade do custo
  useEffect(() => {
    const compute = () => setDensity(window.innerWidth < 768 ? 0.62 : 1);
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

  // Congela o loop quando o hero sai da tela — nada de GPU girando à toa
  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={hostRef} className="absolute inset-0">
      <Canvas
        frameloop={active ? "always" : "never"}
        dpr={[1, 1.6]}
        gl={{
          antialias: false,
          powerPreference: "high-performance",
          alpha: true,
        }}
        camera={{ position: [0, 0.4, 11], fov: 46 }}
        style={{ pointerEvents: "none" }}
      >
        <ParticleField density={density} />
        <FloatingSolid
          position={[-5.1, 2.5, -1.2]}
          scale={1.05}
          speed={0.14}
          kind="ico"
          detail={1}
          seed={0}
        />
        <FloatingSolid
          position={[5.2, 2.1, -0.6]}
          scale={0.64}
          speed={0.22}
          kind="octa"
          seed={2.1}
        />
        <FloatingSolid
          position={[4.3, -1.9, 1.4]}
          scale={0.3}
          speed={0.28}
          kind="torus"
          seed={4.3}
        />
        <CameraRig />
      </Canvas>
    </div>
  );
}
