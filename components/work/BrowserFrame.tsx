"use client";

/**
 * Browser frame for web product and marketing screens.
 *
 * Deliberately not a macOS window render. The chrome is the drawn version of a
 * browser: ink bar, hairline separator, a mono label where the address would
 * be, and the three window dots as outlined circles rather than filled candy.
 * Drawn, not built — same vocabulary as the rest of the site.
 *
 * Sized from the viewport so the whole window is visible without scrolling,
 * with the width following from the ratio.
 */

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import FrameSlot from "@/components/work/FrameSlot";
import { Dim } from "@/components/primitives/Marks";

export interface BrowserShot {
  src: string;
  alt: string;
  /** Shown where the address bar would be. A route, not a fake URL. */
  label?: string;
  /** Set when the file is not on disk; the slot renders instead. */
  missing?: boolean;
  /** Optional array of image sources for cycling slides. */
  slides?: string[];
  /** Slide rotation interval in milliseconds. */
  slideInterval?: number;
  /** Optional iframe URL to render a live website. */
  iframeUrl?: string;
  /** Browser viewport ratio. */
  ratio?: string;
}

function VerticalBarsSlideshow({
  slides,
  currentIndex,
  alt,
  sizes,
  onError,
  barCount = 6,
}: {
  slides: string[];
  currentIndex: number;
  alt: string;
  sizes?: string;
  onError?: () => void;
  barCount?: number;
}) {
  const [activeSrc, setActiveSrc] = useState(slides[currentIndex] ?? slides[0]);
  const [incomingSrc, setIncomingSrc] = useState<string | null>(null);
  const barsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const targetSrc = slides[currentIndex];
    if (targetSrc && targetSrc !== activeSrc) {
      setIncomingSrc(targetSrc);
    }
  }, [currentIndex, slides, activeSrc]);

  useEffect(() => {
    if (!incomingSrc) return;

    const bars = barsRef.current.filter(Boolean);
    if (!bars.length) return;

    gsap.killTweensOf(bars);
    gsap.set(bars, { clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)" });

    const anim = gsap.to(bars, {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      duration: 0.65,
      stagger: 0.06,
      ease: "power3.inOut",
      onComplete: () => {
        setActiveSrc(incomingSrc);
        setIncomingSrc(null);
      },
    });

    return () => {
      anim.kill();
    };
  }, [incomingSrc]);

  const bars = Array.from({ length: barCount });

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Current Active Base Image */}
      <Image
        key={activeSrc}
        src={activeSrc}
        alt={alt}
        fill
        sizes={sizes}
        onError={onError}
        className="object-cover object-top"
      />

      {/* Incoming Image revealed via Staggered Vertical Bars */}
      {incomingSrc && (
        <div className="absolute inset-0 z-10 flex w-full h-full pointer-events-none">
          {bars.map((_, i) => {
            const widthPercent = 100 / barCount;
            return (
              <div
                key={i}
                ref={(el) => {
                  barsRef.current[i] = el;
                }}
                className="relative h-full overflow-hidden"
                style={{
                  width: `${widthPercent}%`,
                  clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
                }}
              >
                <div
                  className="absolute top-0 bottom-0 h-full"
                  style={{
                    width: `${barCount * 100}%`,
                    left: `-${i * 100}%`,
                  }}
                >
                  <Image
                    src={incomingSrc}
                    alt={alt}
                    fill
                    sizes={sizes}
                    className="object-cover object-top"
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ScaledIframe({
  src,
  title,
  targetWidth = 1440,
  targetHeight = 800,
}: {
  src: string;
  title: string;
  targetWidth?: number;
  targetHeight?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        setScale(containerWidth / targetWidth);
      }
    };

    updateScale();
    const resizeObserver = new ResizeObserver(updateScale);
    if (containerRef.current) resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, [targetWidth]);

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden bg-black">
      <iframe
        src={src}
        title={title}
        style={{
          width: `${targetWidth}px`,
          height: `${targetHeight}px`,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          border: 0,
        }}
        className="block bg-white"
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      />
    </div>
  );
}

export default function BrowserFrame({
  shot,
  label,
  ratio = "16 / 10",
  height,
  className = "",
  sizes = "(max-width: 767px) 92vw, (max-width: 1279px) 58vw, 52vw",
  spec = "1440 × 900",
}: {
  shot?: BrowserShot;
  label?: string;
  /** Viewport ratio, excluding the chrome bar. */
  ratio?: string;
  /** Overrides --browser-h. */
  height?: string;
  className?: string;
  sizes?: string;
  spec?: string;
}) {
  const [failed, setFailed] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const slides = shot?.slides && shot.slides.length > 0 ? shot.slides : (shot?.src ? [shot.src] : []);
  const intervalTime = shot?.slideInterval ?? 1500;

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, intervalTime);
    return () => clearInterval(timer);
  }, [slides.length, intervalTime]);

  const visible = shot && !shot.missing && !failed && slides.length > 0;
  const chrome = shot?.label ?? label;
  const frameRatio = shot?.ratio ?? ratio;

  return (
    <div
      className={`browser ${className}`}
      data-capped={height ? "1" : undefined}
      style={height ? ({ ["--browser-h" as string]: height }) : undefined}
    >
      <div className="browser-body relative rounded-md">
        {/* Chrome */}
        <div className="browser-bar">
          <span aria-hidden className="browser-dots">
            <i />
            <i />
            <i />
          </span>
          {chrome ? (
            <span className="browser-label t-micro" aria-hidden>
              {chrome}
            </span>
          ) : null}
        </div>

        {/* Viewport */}
        <div className="browser-view relative overflow-hidden bg-black p-[2px]" style={{ aspectRatio: frameRatio }}>
          <div className="relative w-full h-full overflow-hidden rounded-[2px]">
            {shot?.iframeUrl ? (
              <ScaledIframe
                src={shot.iframeUrl}
                title={shot.alt || label || "Live website"}
                targetWidth={1440}
                targetHeight={800}
              />
            ) : visible ? (
              <VerticalBarsSlideshow
                slides={slides}
                currentIndex={currentIndex}
                alt={shot.alt}
                sizes={sizes}
                onError={() => setFailed(true)}
              />
            ) : (
              <FrameSlot label={label} spec={spec} />
            )}
          </div>
        </div>

        <Dim label={spec.toUpperCase()} style={{ top: "-1.7rem", left: 0, right: 0 }} />
      </div>
    </div>
  );
}
