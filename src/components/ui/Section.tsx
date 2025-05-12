
import React from "react";
import { cn } from "@/lib/utils";

interface SectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const Section = ({ title, children, className }: SectionProps) => {
  return (
    <div className={cn("space-y-3", className)}>
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="border rounded-md p-4 bg-background">{children}</div>
    </div>
  );
};

export default Section;
