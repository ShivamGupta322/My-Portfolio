"use client";

import { useEffect, useRef } from "react";
import { Mesh, Program, Renderer, Triangle } from "ogl";

const vertex = /* glsl */ `
attribute vec2 uv;
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

/**
 * Three soft colour fields (violet, cyan, mint) drifting on fbm noise, with a
 * gentle pull toward the pointer. Output is premultiplied alpha over the page
 * background; a little dither hides banding.
 */
const fragment = /* glsl */ `
precision highp float;
uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform float uStrength;
uniform vec3 uViolet;
uniform vec3 uCyan;
uniform vec3 uMint;
varying vec2 vUv;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.02; a *= 0.5; }
  return v;
}
float field(vec2 uv, vec2 center, float radius, float warp) {
  return smoothstep(radius, 0.0, distance(uv, center) + warp);
}

void main() {
  float aspect = uResolution.x / uResolution.y;
  vec2 uv = vUv;
  vec2 p = vec2(uv.x * aspect, uv.y);
  float t = uTime * 0.06;
  vec2 m = (uMouse - 0.5) * 0.12;

  float n1 = fbm(p * 1.4 + vec2(t, -t * 0.6));
  float n2 = fbm(p * 1.9 - vec2(t * 0.8, t * 1.1) + 4.0);

  vec2 c1 = vec2(0.22 + 0.08 * sin(t * 2.1), 0.68 + 0.06 * cos(t * 1.7)) + m;
  vec2 c2 = vec2(0.80 + 0.07 * cos(t * 1.5), 0.78 + 0.06 * sin(t * 2.3)) - m * 0.6;
  vec2 c3 = vec2(0.58 + 0.10 * sin(t * 1.2), 0.16 + 0.05 * cos(t * 1.9)) + m * 0.4;

  float f1 = field(uv, c1, 0.62, (n1 - 0.5) * 0.35);
  float f2 = field(uv, c2, 0.55, (n2 - 0.5) * 0.35);
  float f3 = field(uv, c3, 0.45, (n1 - 0.5) * 0.30) * 0.45;

  vec3 col = uViolet * f1 * 0.55 + uCyan * f2 * 0.42 + uMint * f3 * 0.35;
  float a = clamp(f1 * 0.55 + f2 * 0.42 + f3 * 0.35, 0.0, 1.0) * uStrength;
  col *= uStrength;
  col += (hash(gl_FragCoord.xy + uTime) - 0.5) / 255.0;
  gl_FragColor = vec4(col, a);
}
`;

const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);

/** Lazy-loaded hero aurora (OGL). Mounted only by <Aurora /> when the device can afford it. */
export default function AuroraCanvas({ onReady }: { onReady?: () => void }) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const renderer = new Renderer({
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
      dpr: Math.min(window.devicePixelRatio || 1, 1) * (coarse ? 0.5 : 0.7),
    });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    gl.canvas.style.width = "100%";
    gl.canvas.style.height = "100%";
    gl.canvas.setAttribute("aria-hidden", "true");
    host.appendChild(gl.canvas);

    const readStrength = () =>
      parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue("--aurora-strength"),
      ) || 1;

    const program = new Program(gl, {
      vertex,
      fragment,
      transparent: true,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: [1, 1] },
        uMouse: { value: [0.5, 0.5] },
        uStrength: { value: readStrength() },
        uViolet: { value: hex("#8b5cf6") },
        uCyan: { value: hex("#22d3ee") },
        uMint: { value: hex("#34d399") },
      },
    });
    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = host;
      renderer.setSize(w, h);
      program.uniforms.uResolution.value = [w, h];
    };
    const ro = new ResizeObserver(resize);
    ro.observe(host);
    resize();

    // Theme switch changes --aurora-strength.
    const mo = new MutationObserver(() => (program.uniforms.uStrength.value = readStrength()));
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    const mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };
    const onPointer = (e: PointerEvent) => {
      mouse.tx = e.clientX / window.innerWidth;
      mouse.ty = 1 - e.clientY / window.innerHeight;
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    let visible = true;
    const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
    io.observe(host);

    let raf = 0;
    let first = true;
    const start = performance.now();
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (!visible || document.hidden) return;
      mouse.x += (mouse.tx - mouse.x) * 0.04;
      mouse.y += (mouse.ty - mouse.y) * 0.04;
      program.uniforms.uMouse.value = [mouse.x, mouse.y];
      program.uniforms.uTime.value = (now - start) / 1000;
      renderer.render({ scene: mesh });
      if (first) {
        first = false;
        onReady?.();
      }
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointer);
      ro.disconnect();
      mo.disconnect();
      io.disconnect();
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      gl.canvas.remove();
    };
  }, [onReady]);

  return <div ref={hostRef} className="absolute inset-0" />;
}
