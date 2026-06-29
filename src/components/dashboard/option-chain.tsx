"use client";

import { ScrollArea } from "@/components/ui/scroll-area";

const optionsData = [
  { strike: 24100, callLTP: 254.5, callOI: '1.2M', putLTP: 42.1, putOI: '4.5M' },
  { strike: 24150, callLTP: 215.0, callOI: '800K', putLTP: 55.3, putOI: '3.2M' },
  { strike: 24200, callLTP: 180.2, callOI: '2.1M', putLTP: 72.8, putOI: '2.8M' },
  { strike: 24250, callLTP: 145.6, callOI: '1.5M', putLTP: 95.4, putOI: '1.9M' },
  { strike: 24300, callLTP: 115.0, callOI: '4.5M', putLTP: 122.5, putOI: '1.5M', atm: true },
  { strike: 24350, callLTP: 88.5, callOI: '3.2M', putLTP: 154.2, putOI: '800K' },
  { strike: 24400, callLTP: 65.4, callOI: '2.8M', putLTP: 188.6, putOI: '500K' },
  { strike: 24450, callLTP: 45.2, callOI: '1.9M', putLTP: 225.4, putOI: '300K' },
  { strike: 24500, callLTP: 30.5, callOI: '4.1M', putLTP: 268.0, putOI: '150K' },
  { strike: 24550, callLTP: 18.4, callOI: '3.8M', putLTP: 315.5, putOI: '90K' },
  { strike: 24600, callLTP: 10.2, callOI: '5.2M', putLTP: 350.2, putOI: '45K' },
];

export function OptionChain({ symbol }: { symbol: string }) {
  return (
    <div className="flex flex-col h-full text-[11px]">
      <div className="grid grid-cols-5 text-center text-slate-400 py-2 border-b border-slate-800 bg-[#1a1e26] text-[10px] font-semibold sticky top-0 z-10 shadow-sm">
        <div>CALL OI</div>
        <div>CALL LTP</div>
        <div className="font-bold text-white px-1">STRIKE</div>
        <div>PUT LTP</div>
        <div>PUT OI</div>
      </div>
      <ScrollArea className="flex-1">
        <div className="flex flex-col">
          {optionsData.map((row, i) => (
            <div 
              key={i} 
              className={`grid grid-cols-5 text-center py-2.5 border-b border-slate-800/50 hover:bg-[#2a2e39] cursor-pointer transition-colors ${row.atm ? 'bg-indigo-900/20' : ''}`}
            >
              <div className="text-slate-300">{row.callOI}</div>
              <div className={row.atm ? 'text-emerald-500 font-medium' : (row.strike < 24300 ? 'text-emerald-500 bg-emerald-900/10' : 'text-emerald-500')}>{row.callLTP.toFixed(1)}</div>
              <div className={`font-semibold ${row.atm ? 'text-indigo-400' : 'text-slate-200'}`}>
                {row.strike}
              </div>
              <div className={row.atm ? 'text-rose-500 font-medium' : (row.strike > 24300 ? 'text-rose-500 bg-rose-900/10' : 'text-rose-500')}>{row.putLTP.toFixed(1)}</div>
              <div className="text-slate-300">{row.putOI}</div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
