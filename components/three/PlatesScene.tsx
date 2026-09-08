"use client";

/**
 * CrushWithMe — the immersive composition.
 *
 * Two extruded frames on the same stage: one built (solid, lit) and one drawn
 * (vermilion wireframe). They rest slightly out of register and pull apart with
 * the pointer, so the hero's printing-plate idea carries into three dimensions
 * rather than the scene being an unrelated 3D object.
 *
 * Cost control, all of it deliberate:
 *  - loaded only via next/dynamic, so three.js is not in the initial bundle
 *  - the render loop only runs while `active` is true (IntersectionObserver)
 *  - pixel ratio capped at 1.75
 *  - low curve/bevel segment counts; two meshes, one draw pass each
 *  - reduced motion renders exactly one frame and stops
 *  - every geometry, material and the context itself is disposed on unmount
 */

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { damp } from "@/lib/motion";

interface Props {
  active: boolean;
  reduced: boolean;
  pointer: boolean;
}

/** A rounded-rectangle frame: a UI artboard, as a solid. */
function roundedRect(path: THREE.Shape | THREE.Path, w: number, h: number, r: number) {
  const x = -w / 2;
  const y = -h / 2;
  path.moveTo(x + r, y);
  path.lineTo(x + w - r, y);
  path.quadraticCurveTo(x + w, y, x + w, y + r);
  path.lineTo(x + w, y + h - r);
  path.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  path.lineTo(x + r, y + h);
  path.quadraticCurveTo(x, y + h, x, y + h - r);
  path.lineTo(x, y + r);
  path.quadraticCurveTo(x, y, x + r, y);
  return path;
}

function frameGeometry(w: number, h: number, t: number, depth: number) {
  const shape = roundedRect(new THREE.Shape(), w, h, 0.26) as THREE.Shape;
  const hole = roundedRect(new THREE.Path(), w - t * 2, h - t * 2, 0.1) as THREE.Path;
  shape.holes.push(hole);
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelSize: 0.014,
    bevelThickness: 0.014,
    bevelSegments: 1,
    curveSegments: 6,
  });
  geo.center();
  return geo;
}

export default function PlatesScene({ active, reduced, pointer }: Props) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch {
      el.dataset.webgl = "unavailable";
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.setClearAlpha(0);
    el.appendChild(renderer.domElement);
    Object.assign(renderer.domElement.style, { display: "block", width: "100%", height: "100%" });

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 60);
    camera.position.set(0, 0, 7.4);

    const group = new THREE.Group();
    scene.add(group);

    const geo = frameGeometry(3.3, 2.05, 0.3, 0.32);

    // The built plate.
    const solidMat = new THREE.MeshStandardMaterial({
      color: 0xe6e1d9,
      roughness: 0.58,
      metalness: 0.04,
    });
    const solid = new THREE.Mesh(geo, solidMat);
    group.add(solid);

    // The drawn plate.
    // A higher threshold keeps only the structural edges — a technical
    // wireframe rather than a mesh of corner facets.
    const edges = new THREE.EdgesGeometry(geo, 26);
    const lineMat = new THREE.LineBasicMaterial({ color: 0xff3b1f, transparent: true, opacity: 0.92 });
    const drawn = new THREE.LineSegments(edges, lineMat);
    group.add(drawn);

    const ambient = new THREE.AmbientLight(0xf4f1ec, 0.85);
    const key = new THREE.DirectionalLight(0xfff6ec, 2.1);
    key.position.set(-3.2, 3.4, 4.2);
    const rim = new THREE.DirectionalLight(0x9fb4ff, 0.55);
    rim.position.set(3.6, -1.8, -2.4);
    scene.add(ambient, key, rim);

    /* ---- sizing ---- */
    const resize = () => {
      const w = el.clientWidth || 1;
      const h = el.clientHeight || 1;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      // Pull back on narrow viewports so the composition still reads.
      camera.position.z = w / h < 0.9 ? 8.8 : 7.4;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    /* ---- input ---- */
    let px = 0, py = 0;          // pointer target, -1 … 1
    let cx = 0, cy = 0;          // damped
    let scrollT = 0;             // 0 … 1 across the section
    const REST = 0.15;

    const onPointer = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      px = ((e.clientX - r.left) / r.width - 0.5) * 2;
      py = ((e.clientY - r.top) / r.height - 0.5) * 2;
    };
    const onScroll = () => {
      const r = el.getBoundingClientRect();
      scrollT = 1 - (r.top + r.height) / (window.innerHeight + r.height);
    };
    if (pointer) window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    /* ---- loop ---- */
    let raf = 0;
    let last = performance.now();
    let spin = 0;

    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      cx = damp(cx, px, 4.5, dt);
      cy = damp(cy, py, 4.5, dt);
      spin += dt * 0.075;

      group.rotation.y = spin + cx * 0.42 + (scrollT - 0.5) * 0.5;
      group.rotation.x = -cy * 0.26 + (scrollT - 0.5) * 0.22;
      group.rotation.z = Math.sin(spin * 0.6) * 0.045;

      // Misregistration: the drawn plate pulls off the built one.
      const spread = REST + Math.hypot(cx, cy) * 0.16;
      drawn.position.set(spread, spread * -0.55, spread * 0.9);
      drawn.rotation.z = spread * 0.09;

      renderer.render(scene, camera);
      raf = requestAnimationFrame(frame);
    };

    if (reduced) {
      group.rotation.set(-0.1, 0.5, 0.02);
      drawn.position.set(REST, -REST * 0.55, REST * 0.9);
      renderer.render(scene, camera);
    } else if (active) {
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      if (pointer) window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("scroll", onScroll);
      geo.dispose();
      edges.dispose();
      solidMat.dispose();
      lineMat.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [active, reduced, pointer]);

  return <div ref={host} className="absolute inset-0" aria-hidden="true" />;
}
