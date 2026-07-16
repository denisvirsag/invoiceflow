"use client";

import { useRouter } from "next/navigation";
import React from "react";

export default function TableRow({
  href,
  children,
  ...props
}: React.HTMLAttributes<HTMLTableRowElement> & { href: string }) {
  const router = useRouter();

  const handleNavigate = (e: React.MouseEvent | React.KeyboardEvent) => {
    // Prevent triggering navigation if clicking interactive elements inside row
    const target = e.target as HTMLElement;
    if (target.closest("button") || target.closest("a") || target.getAttribute("role") === "button") {
      return;
    }
    if (href && href !== "#") {
      router.push(href);
    }
  };

  return (
    <tr
      {...props}
      onClick={handleNavigate}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          handleNavigate(e);
        }
      }}
      style={{ cursor: href && href !== "#" ? "pointer" : "default", ...props.style }}
      role={href && href !== "#" ? "button" : undefined}
      tabIndex={href && href !== "#" ? 0 : undefined}
    >
      {children}
    </tr>
  );
}
