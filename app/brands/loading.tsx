import React from "react";

export default function Loading() {
  return (
    <div className="min-h-[70vh] w-full flex flex-col items-center justify-center bg-white space-y-5 animate-in fade-in duration-500">
      
      <div className="relative flex items-center justify-center">
        {/* Outer spinning gold ring */}
        <div className="w-16 h-16 border-4 border-neutral-100 border-t-[#c9a84c] rounded-full animate-spin"></div>
        
        {/* Inner static luxury diamond */}
        <div className="absolute text-[#c9a84c] flex items-center justify-center mt-0.5">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
          </svg>
        </div>
      </div>

      <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-neutral-400">
        Curating Collection...
      </p>

    </div>
  );
}