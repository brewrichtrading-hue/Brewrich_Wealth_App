import React from 'react';
import { LiveClassSchedule } from '@/lib/types';
import { Calendar, Clock, Video, User, Sparkles, ExternalLink } from 'lucide-react';

interface LiveClassCardProps {
  schedule: LiveClassSchedule;
}

export default function LiveClassCard({ schedule }: LiveClassCardProps) {
  const isLive = schedule.status === 'live';

  return (
    <div
      className={`relative rounded-2xl border p-6 transition-all duration-300 flex flex-col justify-between ${
        isLive
          ? 'bg-gradient-to-b from-emerald-950/40 to-slate-900/90 border-emerald-500/50 shadow-xl shadow-emerald-950/50 ring-1 ring-emerald-500/30'
          : 'bg-slate-900/70 border-slate-800/90 hover:border-slate-700 hover:bg-slate-900/90'
      }`}
    >
      {/* Top Meta info */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                schedule.day === 'Saturday'
                  ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                  : 'bg-teal-500/15 text-teal-300 border border-teal-500/30'
              }`}
            >
              {schedule.day} Edition
            </span>
            <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-slate-500" />
              {schedule.date}
            </span>
          </div>

          {isLive ? (
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/40 animate-pulse">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              LIVE NOW
            </span>
          ) : (
            <span className="text-xs text-slate-400 bg-slate-800/60 px-2.5 py-1 rounded-full border border-slate-700/50">
              Upcoming
            </span>
          )}
        </div>

        {/* Title & Topic */}
        <h3 className="text-lg sm:text-xl font-bold text-white mb-2 leading-snug">
          {schedule.title}
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 mb-4 line-clamp-2">
          {schedule.topic}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-6">
          {schedule.tags.map((tag) => (
            <span
              key={tag}
              className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-300 border border-slate-700/60"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Footer Info & Dynamic Join Button */}
      <div className="space-y-4 pt-4 border-t border-slate-800/80">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-emerald-400" />
            <span>{schedule.time} ({schedule.duration})</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-300">
            <User className="h-3.5 w-3.5 text-amber-400" />
            <span>{schedule.instructor}</span>
          </div>
        </div>

        <a
          href={schedule.meetUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`btn-interactive w-full min-h-[48px] flex items-center justify-center gap-2.5 rounded-xl font-bold text-sm transition-all ${
            isLive
              ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-lg shadow-emerald-950/60 animate-bounce'
              : 'bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 hover:border-emerald-500/70'
          }`}
        >
          <Video className="h-4 w-4" />
          <span>Join Live Class (Google Meet)</span>
          <ExternalLink className="h-3.5 w-3.5 opacity-70" />
        </a>
      </div>
    </div>
  );
}
