import { useEffect, useState } from 'react';
import { Clock, Globe } from 'lucide-react';

const CITIES = [
  { tz: 'Asia/Karachi', label: 'Karachi (PKT)' },
  { tz: 'Europe/London', label: 'London (UK)' },
  { tz: 'America/New_York', label: 'New York (EST/EDT)' },
  { tz: 'America/Toronto', label: 'Toronto (EST/EDT)' },
  { tz: 'America/Los_Angeles', label: 'Los Angeles (PST/PDT)' },
  { tz: 'Asia/Qatar', label: 'Doha (Qatar)' },
  { tz: 'Asia/Kuwait', label: 'Kuwait City' },
  { tz: 'Asia/Muscat', label: 'Muscat (Oman)' },
];

export const TimezoneClock = () => {
  const [selectedTz, setSelectedTz] = useState<string>(() => {
    // Sensible default detection or fallback to Karachi
    try {
      const userTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const match = CITIES.find(c => c.tz === userTz);
      return match ? match.tz : 'Asia/Karachi';
    } catch {
      return 'Asia/Karachi';
    }
  });

  const [timeString, setTimeString] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      try {
        const now = new Date();
        const formatted = new Intl.DateTimeFormat('en-US', {
          timeZone: selectedTz,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        }).format(now);
        setTimeString(formatted);
      } catch (e) {
        setTimeString('--:--:--');
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [selectedTz]);

  return (
    <div className="flex items-center gap-1.5 text-xs text-slate-700 bg-white/90 border border-slate-200/90 rounded-full px-2.5 py-1 shadow-sm">
      <Clock className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
      <span className="font-mono font-semibold text-emerald-950 min-w-[70px]">{timeString}</span>
      <div className="flex items-center gap-1 border-l border-slate-200 pl-1.5 ml-0.5">
        <Globe className="w-3 h-3 text-slate-400" />
        <select
          value={selectedTz}
          onChange={(e) => setSelectedTz(e.target.value)}
          className="bg-transparent border-none text-[11px] font-medium text-slate-700 focus:outline-none focus:ring-0 cursor-pointer py-0 pr-1"
          aria-label="Select International Academy Timezone"
        >
          {CITIES.map(c => (
            <option key={c.tz} value={c.tz}>
              {c.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
