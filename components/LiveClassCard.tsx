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
      className={`relative rounded-3xl border p-7 transition-all duration-300 flex flex-col justify-between ${
        isLive
          ? 'bg-blue-50/50 border-blue-500 shadow-xl shadow-blue-500/10 ring-2 ring-blue-500/20'
          : 'bg-white border-slate-200/80 hover:border-slate-300 shadow-md hover:shadow-lg'
      }`}
    >
      {/* Top Meta info */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                schedule.day === 'Saturday'
                  ? 'bg-amber-100 text-amber-800 border border-amber-200'
                  : 'bg-blue-100 text-blue-800 border border-blue-200'
              }`}
            >
              {schedule.day} Edition
            </span>
            <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-slate-400" />
              {schedule.date}
            </span>
          </div>

          {isLive ? (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300 animate-pulse">
              <span className="h-2 w-2 rounded-full bg-emerald-600" />
              LIVE NOW
            </span>
          ) : (
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
              Upcoming
            </span>
          )}
        </div>

        {/* Title & Topic */}
        <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 mb-2 leading-snug">
          {schedule.title}
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 mb-4 line-clamp-2 leading-relaxed">
          {schedule.topic}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-6">
          {schedule.tags.map((tag) => (
            <span
              key={tag}
              className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Footer Info & Dynamic Join Button */}
      <div className="space-y-4 pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-blue-600" />
            <span>{schedule.time} ({schedule.duration})</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
            <User className="h-3.5 w-3.5 text-blue-600" />
            <span>{schedule.instructor}</span>
          </div>
        </div>

        <a
          href={schedule.meetUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`btn-interactive w-full min-h-[48px] flex items-center justify-center gap-2.5 rounded-full font-extrabold text-sm transition-all ${
            isLive
              ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/30'
              : 'bg-slate-900 hover:bg-slate-800 text-white shadow-md'
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
