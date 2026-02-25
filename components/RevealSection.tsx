"use client";
import { useScrollReveal } from "@/hooks/useScrollReveal";

interface Props {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "stagger" | "left" | "right";
  delay?: number;
}

export default function RevealSection({
  children,
  className = "",
  variant = "default",
  delay = 0,
}: Props) {
  const ref = useScrollReveal<HTMLDivElement>();

  const baseClass =
    variant === "stagger"
      ? "reveal reveal-stagger"
      : variant === "left"
      ? "reveal reveal-left"
      : variant === "right"
      ? "reveal reveal-right"
      : "reveal";

  return (
    <div
      ref={ref}
      className={`${baseClass} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
