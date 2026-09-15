"use client";

import Link from "next/link";
import { useCallback, useLayoutEffect, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import type { ProductCategory } from "@/data/categories";
import styles from "./SpeciesStackInteractor.module.css";

type SpeciesItem = ProductCategory & {
  clipId: string;
};

type SpeciesStackInteractorProps = {
  items: SpeciesItem[];
};

export default function SpeciesStackInteractor({ items }: SpeciesStackInteractorProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<SVGImageElement>(null);
  const mainGroupRef = useRef<SVGGElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  const createLoop = useCallback(
    (index: number) => {
      const item = items[index];
      const paths = containerRef.current?.querySelectorAll(
        `#${item.clipId} .${styles.path}`,
      );

      if (!item || !paths?.length) return;

      timelineRef.current?.kill();
      imageRef.current?.setAttribute("href", item.image);
      mainGroupRef.current?.setAttribute("clip-path", `url(#${item.clipId})`);

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(paths, { scale: 1 });
        return;
      }

      gsap.set(paths, { scale: 0, transformOrigin: "50% 50%" });
      timelineRef.current = gsap
        .timeline({ repeat: -1, repeatDelay: 1 })
        .to(paths, {
          scale: 1,
          duration: 0.8,
          stagger: { amount: 0.4, from: "random" },
          ease: "expo.out",
        })
        .to(paths, {
          scale: 1.04,
          duration: 1.5,
          yoyo: true,
          repeat: 1,
          stagger: { amount: 0.2, from: "center" },
          ease: "sine.inOut",
        })
        .to(paths, {
          scale: 0,
          duration: 0.6,
          stagger: { amount: 0.3, from: "edges" },
          ease: "expo.in",
        });
    },
    [items],
  );

  useLayoutEffect(() => {
    const context = gsap.context(() => createLoop(0), containerRef);
    return () => {
      timelineRef.current?.kill();
      context.revert();
    };
  }, [createLoop]);

  const activateItem = useCallback(
    (index: number) => {
      if (index === activeIndexRef.current) return;
      activeIndexRef.current = index;
      setActiveIndex(index);
      createLoop(index);
    },
    [createLoop],
  );

  useEffect(() => {
    const mobileQuery = window.matchMedia("(max-width: 900px)");

    let interval: ReturnType<typeof setInterval> | null = null;

    const start = () => {
      if (interval) return;
      interval = setInterval(() => {
        const next = (activeIndexRef.current + 1) % items.length;
        activeIndexRef.current = next;
        setActiveIndex(next);
        createLoop(next);
      }, 5000);
    };

    const stop = () => {
      if (interval) {
        clearInterval(interval);
        interval = null;
      }
    };

    const onChange = (event: MediaQueryListEvent) => {
      if (event.matches) start();
      else stop();
    };

    if (mobileQuery.matches) start();
    mobileQuery.addEventListener("change", onChange);

    return () => {
      stop();
      mobileQuery.removeEventListener("change", onChange);
    };
  }, [items.length, createLoop]);

  return (
    <div className={styles.interactor} ref={containerRef}>
      <nav className={styles.menu} aria-label="Categorii de animale">
        <ul>
          {items.map((item, index) => (
            <li key={item.title}>
              <Link
                href={item.href}
                className={`${styles.menuItem} ${activeIndex === index ? styles.active : ""}`}
                onMouseEnter={() => activateItem(index)}
                onFocus={() => activateItem(index)}
                aria-current={activeIndex === index ? "true" : undefined}
              >
                <span className={styles.number}>{String(index + 1).padStart(2, "0")}</span>
                <span className={styles.itemCopy}>
                  <strong>{item.title}</strong>
                  <small>{item.description}</small>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className={styles.visual} aria-live="polite">
        <div className={styles.glow} aria-hidden="true" />
        <svg viewBox="0 0 500 500" role="img" aria-label={items[activeIndex].title}>
          <defs>
            <clipPath id="species-strips">
              {[45, 135, 225, 315, 405].map((y) => (
                <rect key={y} className={styles.path} x="18" y={y} width="464" height="62" rx="8" />
              ))}
            </clipPath>
            <clipPath id="species-mosaic">
              <rect className={styles.path} x="20" y="20" width="205" height="280" rx="12" />
              <rect className={styles.path} x="20" y="320" width="205" height="160" rx="12" />
              <rect className={styles.path} x="245" y="20" width="235" height="140" rx="12" />
              <rect className={styles.path} x="245" y="180" width="105" height="160" rx="12" />
              <rect className={styles.path} x="370" y="180" width="110" height="160" rx="12" />
              <rect className={styles.path} x="245" y="360" width="235" height="120" rx="12" />
            </clipPath>
            <clipPath id="species-pixels">
              {Array.from({ length: 9 }).map((_, index) => (
                <rect
                  key={index}
                  className={styles.path}
                  x={(index % 3) * 160 + 20}
                  y={Math.floor(index / 3) * 160 + 20}
                  width="140"
                  height="140"
                  rx="6"
                />
              ))}
            </clipPath>
            <clipPath id="species-columns">
              {[20, 116, 212, 308, 404].map((x, index) => (
                <rect
                  key={x}
                  className={styles.path}
                  x={x}
                  y={index % 2 === 0 ? 20 : 70}
                  width="76"
                  height={index % 2 === 0 ? 460 : 360}
                  rx="10"
                />
              ))}
            </clipPath>
            <clipPath id="species-focus">
              <rect className={styles.path} x="30" y="30" width="210" height="210" rx="10" />
              <rect className={styles.path} x="260" y="30" width="210" height="210" rx="10" />
              <rect className={styles.path} x="30" y="260" width="135" height="210" rx="10" />
              <rect className={styles.path} x="185" y="260" width="285" height="210" rx="10" />
            </clipPath>
          </defs>
          <g ref={mainGroupRef} clipPath={`url(#${items[0].clipId})`}>
            <image
              ref={imageRef}
              href={items[0].image}
              width="500"
              height="500"
              preserveAspectRatio="xMidYMid slice"
            />
          </g>
        </svg>
      </div>
    </div>
  );
}
