import React, { useState } from 'react';
import { X, Calendar, Clock, Video, CheckCircle2 } from 'lucide-react';
import { Language } from '../types';
import { content } from '../data/content';

interface BookCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const BookCallModal: React.FC<BookCallModalProps> = ({
  isOpen,
  onClose,
  lang,
}) => {
  if (!isOpen) return null;

  const t = content[lang].bookingModal;

  const dates = [
    { day: 'Завтра', date: '2 Жовтня', enDay: 'Tomorrow', enDate: 'Oct 2' },
    { day: 'П’ятниця', date: '3 Жовтня', enDay: 'Friday', enDate: 'Oct 3' },
    { day: 'Понеділок', date: '6 Жовтня', enDay: 'Monday', enDate: 'Oct 6' },
  ];

  const timeSlots = ['11:00', '13:30', '15:00', '16:30', '18:00'];

  const [selectedDate, setSelectedDate] = useState(0);
  const [selectedTime, setSelectedTime] = useState(timeSlots[1]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('');
  const [isBooked, setIsBooked] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsBooked(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-[#12141d] p-6 sm:p-8 shadow-2xl text-left"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        {isBooked ? (
          <div className="text-center py-6 space-y-4">
            <div className="h-14 w-14 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <h3 className="font-display text-xl font-bold text-white">
              {lang === 'ua' ? 'Зустріч заброньовано!' : 'Meeting Scheduled!'}
            </h3>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed max-w-sm mx-auto">
              {t.successMessage}
            </p>
            <div className="p-3 bg-black/40 rounded-lg text-xs font-mono text-amber-300 border border-white/5">
              {dates[selectedDate].date} @ {selectedTime} (EET) via Google Meet
            </div>
            <button
              onClick={onClose}
              className="mt-4 rounded-md bg-amber-400 px-6 py-2.5 text-xs font-bold text-black hover:bg-amber-300 cursor-pointer"
            >
              {t.close}
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1">
              <Video className="h-3.5 w-3.5" />
              <span>Google Meet Discovery</span>
            </div>
            <h3 className="font-display text-xl sm:text-2xl font-bold text-white mb-2">
              {t.title}
            </h3>
            <p className="text-xs text-neutral-400 mb-6">
              {t.subtitle}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Date selection */}
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-2">
                  {t.chooseDate}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {dates.map((d, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedDate(idx)}
                      className={`p-2.5 rounded-lg border text-left cursor-pointer transition-colors ${
                        selectedDate === idx
                          ? 'border-amber-400 bg-amber-400/10 text-white'
                          : 'border-white/10 bg-white/5 text-neutral-400 hover:text-white'
                      }`}
                    >
                      <div className="text-[10px] uppercase font-semibold">
                        {lang === 'ua' ? d.day : d.enDay}
                      </div>
                      <div className="text-xs font-bold text-white mt-0.5">
                        {lang === 'ua' ? d.date : d.enDate}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Time selection */}
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-2">
                  {t.chooseTime}
                </label>
                <div className="flex flex-wrap gap-2">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setSelectedTime(time)}
                      className={`px-3 py-1.5 rounded-md text-xs font-mono cursor-pointer transition-colors ${
                        selectedTime === time
                          ? 'bg-amber-400 text-black font-bold'
                          : 'border border-white/10 bg-white/5 text-neutral-300 hover:text-white'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              {/* Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-xs text-neutral-300 mb-1">{t.yourName}</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Дмитро"
                    className="w-full rounded-md border border-white/10 bg-black/40 px-3 py-2 text-xs text-white placeholder-neutral-500 focus:border-amber-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-neutral-300 mb-1">{t.yourEmail}</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="dmitro@gmail.com"
                    className="w-full rounded-md border border-white/10 bg-black/40 px-3 py-2 text-xs text-white placeholder-neutral-500 focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-neutral-300 mb-1">{t.yourTopic}</label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder={lang === 'ua' ? 'Наприклад: редизайн інтернет-магазину або новий SaaS' : 'e.g., SaaS MVP architecture'}
                  className="w-full rounded-md border border-white/10 bg-black/40 px-3 py-2 text-xs text-white placeholder-neutral-500 focus:border-amber-400 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-md bg-amber-400 py-3 text-xs font-bold text-black hover:bg-amber-300 transition-colors cursor-pointer mt-2"
              >
                {t.confirmBooking}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
