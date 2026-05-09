import { motion } from "motion/react";
import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { GripHorizontal } from "lucide-react";

interface DraggablePanelProps {
  children: ReactNode;
  className?: string;
  title: string;
  initialPos?: { x: number; y: number };
}

export function DraggablePanel({ children, className, title, initialPos = { x: 0, y: 0 } }: DraggablePanelProps) {
  return (
    <motion.div
      drag
      dragMomentum={true}
      initial={initialPos}
      className={cn(
        "glass-panel rounded-xl absolute flex flex-col overflow-hidden transition-colors hover:glass-panel-active group",
        className
      )}
      style={{ touchAction: "none" }}
    >
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-black/20 cursor-move">
        <h3 className="font-mono text-sm tracking-widest text-[#00f0ff] uppercase">{title}</h3>
        <GripHorizontal className="w-4 h-4 text-white/30 group-hover:text-white/60 transition-colors" />
      </div>
      <div className="p-4 flex-1 overflow-hidden flex flex-col">
        {children}
      </div>
    </motion.div>
  );
}
