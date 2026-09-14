"use client";

import { animate, useMotionValue, useTransform } from "motion/react";
import { useEffect, useRef } from "react";

export function AnimatedCounter({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  const motionValue = useMotionValue(value);
  const rounded = useTransform(motionValue, (v) => Math.round(v).toString());
  const spanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const controls = animate(motionValue, value, {
      duration: 0.6,
      ease: "easeOut",
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  useEffect(() => {
    if (spanRef.current) spanRef.current.textContent = rounded.get();
    return rounded.on("change", (v) => {
      if (spanRef.current) spanRef.current.textContent = v;
    });
  }, [rounded]);

  return (
    <span ref={spanRef} className={className}>
      {Math.round(value)}
    </span>
  );
}
