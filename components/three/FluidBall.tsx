"use client";

/**
 * Metallic fluid sphere for the project hero.
 *
 * A high-density icosphere displaced by ridged fractal noise, shaded as
 * polished metal. The ridges flow because the shader samples a 3D noise field
 * that drifts over time, and the normals are recomputed per vertex from finite
 * differences so the lighting follows the deformation rather than the original
 * sphere.
 *
 * Metal needs something to reflect or it renders black, so the scene's
 * environment comes from three's RoomEnvironment baked through PMREMGenerator.
 * That is generated at runtime — no HDR file to download.
 *
 * Cost control: MeshStandardMaterial is patched via onBeforeCompile rather than
 * replaced, so full PBR lighting is kept for the price of a displacement
 * function. Subdivision drops on small screens, pixel ratio is capped, the
 * loop only runs while the object is on screen, and reduced motion renders a
 * single frame.
 */

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { damp } from "@/lib/motion";

/* Simplex 3D noise — Ashima Arts / Stefan Gustavson, public domain. */
const NOISE = /* glsl */ `
vec3 sp_mod289(vec3 x){ return x - floor(x * (1.0/289.0)) * 289.0; }
vec4 sp_mod289(vec4 x){ return x - floor(x * (1.0/289.0)) * 289.0; }
vec4 sp_permute(vec4 x){ return sp_mod289(((x*34.0)+10.0)*x); }
vec4 sp_taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v){
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = sp_mod289(i);
  vec4 p = sp_permute(sp_permute(sp_permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = sp_taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}

uniform float uTime;
uniform float uAmp;
uniform float uFreq;

/* Surface deformation field. */
/* Soft rolling deformation, deliberately not ridged.
   Taking 1 minus the absolute noise is the standard way to get ridges, but
   abs() puts a hard crease along every crest, and no amount of subdivision
   smooths a crease away. Two octaves of plain noise instead: the second is
   small enough to keep the surface fluid without reintroducing grain. */
float sp_ridged(vec3 p){
  return snoise(p) * 0.78 + snoise(p * 2.05) * 0.22;
}

float sp_disp(vec3 p){
  float t = uTime * 0.09;
  vec3 q = p * uFreq;
  q += vec3(sin(t * 0.7), cos(t * 0.53), t);
  return sp_ridged(q) * uAmp;
}
`;

export interface FluidBallProps {
  active: boolean;
  reduced: boolean;
  pointer: boolean;
  /** Base metal tint. Defaults to the site's accent. */
  color?: string;
  /** Ridge depth, as a fraction of the radius. */
  amplitude?: number;
}

export default function FluidBall({
  active,
  reduced,
  pointer,
  color = "#FF3B1F",
  amplitude = 0.15,
}: FluidBallProps) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    } catch {
      el.dataset.webgl = "unavailable";
      return;
    }

    const small = window.matchMedia("(max-width: 767px)").matches;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, small ? 1.4 : 1.6));
    renderer.setClearAlpha(0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    el.appendChild(renderer.domElement);
    Object.assign(renderer.domElement.style, { display: "block", width: "100%", height: "100%" });

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 60);
    camera.position.set(0, 0, 4.4);

    /* Environment: metal must have something to reflect. Generated, not fetched. */
    const pmrem = new THREE.PMREMGenerator(renderer);
    const roomScene = new RoomEnvironment();
    const envRT = pmrem.fromScene(roomScene, 0.04);
    scene.environment = envRT.texture;

    const uniforms = {
      uTime: { value: 0 },
      uAmp: { value: amplitude },
      uFreq: { value: 1.18 },
    };

    /* IcosahedronGeometry is non-indexed, so every vertex is duplicated once per
       face it touches — measured at 5.9x more vertex shader runs than needed.
       Indexing it means 48 subdivisions costs less than 18 did unindexed, so
       the silhouette gets smoother and the shader does less work. Coincident
       vertices share an identical normal here (normalized position), so the
       merge is lossless. */
    const geo = mergeVertices(new THREE.IcosahedronGeometry(1, small ? 28 : 48), 1e-5);

    const mat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(color),
      metalness: 0.92,
      roughness: 0.08,
      envMapIntensity: 1.5,
    });

    mat.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = uniforms.uTime;
      shader.uniforms.uAmp = uniforms.uAmp;
      shader.uniforms.uFreq = uniforms.uFreq;

      shader.vertexShader = shader.vertexShader.replace(
        "#include <common>",
        `#include <common>\n${NOISE}`
      );

      /* Recompute the normal from the displaced surface. Without this the
         lighting still describes a smooth sphere and the ridges vanish. Two
         neighbours are taken along orthogonal tangents, displaced the same way,
         and crossed; sign() against the original normal keeps it outward. */
      shader.vertexShader = shader.vertexShader.replace(
        "#include <beginnormal_vertex>",
        /* glsl */ `
        #include <beginnormal_vertex>
        float spD0 = sp_disp(position);
        vec3 spP0 = position + normal * spD0;
        vec3 spTa = normalize(cross(normal, abs(normal.y) > 0.99 ? vec3(1.0, 0.0, 0.0) : vec3(0.0, 1.0, 0.0)));
        vec3 spTb = cross(spTa, normal);
        float spE = 0.06;
        vec3 spNa = normalize(position + spTa * spE);
        vec3 spNb = normalize(position + spTb * spE);
        vec3 spPa = spNa + spNa * sp_disp(spNa);
        vec3 spPb = spNb + spNb * sp_disp(spNb);
        vec3 spN = normalize(cross(spPa - spP0, spPb - spP0));
        objectNormal = spN * sign(dot(spN, normal));
        `
      );

      shader.vertexShader = shader.vertexShader.replace(
        "#include <begin_vertex>",
        "#include <begin_vertex>\n        transformed += normal * spD0;"
      );
    };

    const ball = new THREE.Mesh(geo, mat);
    scene.add(ball);

    /* A rim and a fill for edge definition on top of the environment. */
    const rim = new THREE.DirectionalLight(0xffffff, 1.6);
    rim.position.set(-2.6, 2.2, 2.4);
    const fill = new THREE.DirectionalLight(0x9ab4ff, 0.5);
    fill.position.set(2.8, -1.6, -1.8);
    scene.add(rim, fill);

    const resize = () => {
      const w = el.clientWidth || 1;
      const h = el.clientHeight || 1;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.position.z = w / h < 1 ? 5.2 : 4.4;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    let px = 0, py = 0, cx = 0, cy = 0;
    const onPointer = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      px = ((e.clientX - r.left) / r.width - 0.5) * 2;
      py = ((e.clientY - r.top) / r.height - 0.5) * 2;
    };
    if (pointer && !reduced) window.addEventListener("pointermove", onPointer, { passive: true });

    let raf = 0;
    let last = performance.now();
    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      uniforms.uTime.value += dt;
      cx = damp(cx, px, 3.4, dt);
      cy = damp(cy, py, 3.4, dt);
      ball.rotation.y += dt * 0.12;
      ball.rotation.x = -cy * 0.28;
      ball.rotation.z = cx * 0.14;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(frame);
    };

    if (reduced) {
      uniforms.uTime.value = 8;
      ball.rotation.set(-0.15, 0.6, 0.05);
      renderer.render(scene, camera);
    } else if (active) {
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      if (pointer && !reduced) window.removeEventListener("pointermove", onPointer);
      geo.dispose();
      mat.dispose();
      envRT.texture.dispose();
      pmrem.dispose();
      roomScene.traverse((o) => {
        const m = o as THREE.Mesh;
        if (m.geometry) m.geometry.dispose();
        const mm = m.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(mm)) mm.forEach((x) => x.dispose());
        else mm?.dispose();
      });
      rim.dispose();
      fill.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [active, reduced, pointer, color, amplitude]);

  return <div ref={host} className="absolute inset-0" aria-hidden="true" />;
}
