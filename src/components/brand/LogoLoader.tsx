import * as React from "react";

const LogoLoader = ({ text = "WRLDS" }: { text?: string }) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 select-none">
      <div className="relative w-16 h-16 mb-3">
        <div className="absolute inset-0 rounded-full enhanced-gradient-bg enhanced-shadow animate-spin" style={{ animationDuration: '1.2s' }} />
        <div className="absolute inset-2 rounded-full bg-white shadow-inner" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-6 h-6 rounded-full enhanced-gradient-bg" />
        </div>
      </div>
      <div className="text-sm font-semibold tracking-wide text-foreground/80">{text}</div>
    </div>
  );
};

export default LogoLoader;
