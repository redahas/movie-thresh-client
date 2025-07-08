"use client";
import React, { ReactElement, useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

// Register plugins first
gsap.registerPlugin(SplitText, ScrollTrigger);

interface SlideInCopyProps {
  children: ReactElement | ReactElement[];
  animateOnScroll?: boolean;
  delay?: number;
  type?: "chars" | "words" | "lines";
  horizontal?: boolean;
  duration?: number;
  stagger?: number;
}

export function SlideInCopy({
  children,
  animateOnScroll = true,
  delay = 0,
  type = "chars",
  horizontal = false,
  duration = 1,
  stagger = 0.1,
}: SlideInCopyProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const elementRef = useRef<HTMLDivElement[]>([]);
  const splitRef = useRef<SplitText[]>([]);
  const linesRef = useRef<HTMLDivElement[]>([]);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      elementRef.current = [];
      splitRef.current = [];
      linesRef.current = [];

      let elements = [];
      if (containerRef.current.hasAttribute("data-copy-wrapper")) {
        elements = Array.from(
          containerRef.current.children,
        ) as HTMLDivElement[];
      } else {
        elements = [containerRef.current];
      }

      for (const element of elements) {
        elementRef.current.push(element);
        const split = new SplitText(element, {
          type,
          linesClass: "line++",
          linesWrapper: "lines++",
        });

        splitRef.current.push(split);

        const computedStyle = window.getComputedStyle(element);
        const textIndent = computedStyle.getPropertyValue("text-indent");

        if (textIndent && textIndent !== "0px") {
          if (split?.[type]?.length > 0) {
            (split?.[type]?.[0] as HTMLDivElement).style.paddingLeft =
              textIndent;
          }
          element.style.textIndent = "0";
        }
        linesRef.current.push(...(split?.[type] as HTMLDivElement[]));
      }

      // Set initial state
      gsap.set(linesRef.current, {
        y: horizontal ? "0%" : "100%",
        x: horizontal ? "100%" : "0%",
        opacity: 0,
      });

      const animationProps = {
        y: "0%",
        x: "0%",
        opacity: 1,
        duration: duration,
        stagger: stagger,
        ease: "power4.out",
        delay: delay,
      };

      if (animateOnScroll) {
        gsap.to(linesRef.current, {
          ...animationProps,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
            once: true,
          },
        });
      } else {
        gsap.to(linesRef.current, animationProps);
      }

      return () => {
        splitRef.current.forEach((split) => {
          if (split) {
            split.revert();
          }
        });
      };
    },
    {
      scope: containerRef,
      dependencies: [animateOnScroll, delay],
    },
  );

  if (React.Children.count(children) === 1) {
    const child = children as ReactElement;
    return React.cloneElement(child, {
      ref: containerRef,
    } as { ref: React.RefObject<HTMLDivElement> });
  }

  return (
    <div ref={containerRef} data-copy-wrapper="true">
      {children}
    </div>
  );
}

export default SlideInCopy;
