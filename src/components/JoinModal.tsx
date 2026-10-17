import React, { useState } from 'react';
import { X, CheckCircle2, ArrowRight, Shield, Sparkles } from 'lucide-react';
import { ApplicationFormState } from '../types';

interface JoinModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const JoinModal: React.FC<JoinModalProps> = ({ isOpen, onClose }) => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState<ApplicationFormState>({
    name: '',
    email: '',
    field: 'Branding & Identity',
    yearOfStudy: '2nd Year',
    portfolioUrl: '',
    statement: '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div data-lenis-prevent className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-2 sm:p-6 bg-black/90 backdrop-blur-xl animate-fade-in-up overflow-y-auto overscroll-contain">
      <div data-lenis-prevent className="bg-black border border-white/20 max-w-xl w-full relative my-2 sm:my-8 max-h-[calc(100dvh-1rem)] overflow-y-auto overscroll-contain shadow-2xl">
        {/* Corner Brackets */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-white z-20" />
        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-white z-20" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-white z-20" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-white z-20" />

        {/* Modal Top Bar */}
        <div className="flex items-center justify-between gap-3 p-4 sm:p-6 border-b border-white/10 bg-black">
          <div className="flex items-center gap-2 min-w-0">
            <Shield className="w-4 h-4 text-white" />
            <span className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.12em] sm:tracking-widest text-neutral-300 font-semibold">
              Adope Club // Membership Portal
            </span>
          </div>

          <button
            onClick={onClose}
            className="min-h-11 min-w-11 flex items-center justify-center font-mono text-xs uppercase tracking-widest text-neutral-400 hover:text-white border border-white/20 px-3 py-1 shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {submitted ? (
          /* Confirmation View */
          <div className="p-8 sm:p-12 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-white/10 border border-white/20 flex items-center justify-center mb-6">
              <CheckCircle2 className="w-8 h-8 text-white" />
            </div>

            <span className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-2">
              Application Vector Logged
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold uppercase text-white tracking-[-0.06em] mb-4">
              Welcome to the Matrix, {formData.name}
            </h3>

            <p className="text-sm text-neutral-300 leading-relaxed max-w-md mb-6 font-sans">
              Your membership application for Adope Club (MGIT) has been successfully recorded under reference ID{' '}
              <span className="font-mono text-white bg-white/10 px-2 py-0.5 border border-white/20">
                ADC-2024-{(Math.random() * 9000 + 1000).toFixed(0)}
              </span>.
            </p>

            <div className="bg-black border border-white/10 p-4 text-left w-full mb-8 font-mono text-xs text-neutral-300 space-y-2">
              <div className="flex justify-between">
                <span className="text-neutral-500">APPLICANT:</span>
                <span className="text-white">{formData.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">EMAIL:</span>
                <span className="text-white">{formData.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">FOCUS FIELD:</span>
                <span className="text-white">{formData.field}</span>
              </div>
            </div>

            <button
              onClick={handleReset}
              className="bg-white text-black font-mono text-xs px-8 py-3.5 uppercase tracking-widest font-semibold hover:bg-neutral-200"
            >
              Return to Showcase
            </button>
          </div>
        ) : (
          /* Form View */
          <form onSubmit={handleSubmit} className="p-4 sm:p-8 space-y-4 sm:space-y-5">
            <div>
              <label className="font-mono text-xs uppercase tracking-widest text-neutral-400 block mb-2 font-medium">
                01 // Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Alex Rivera"
                className="w-full bg-black border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-white transition-colors"
              />
            </div>

            <div>
              <label className="font-mono text-xs uppercase tracking-widest text-neutral-400 block mb-2 font-medium">
                02 // MGIT Email Address *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="student@mgit.ac.in"
                className="w-full bg-black border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-white transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-mono text-xs uppercase tracking-widest text-neutral-400 block mb-2 font-medium">
                  03 // Focus Discipline
                </label>
                <select
                  value={formData.field}
                  onChange={(e) => setFormData({ ...formData, field: e.target.value })}
                  className="w-full bg-black border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-white transition-colors"
                >
                  <option value="Branding & Identity">Branding &amp; Identity</option>
                  <option value="Posters & Editorial">Posters &amp; Editorial</option>
                  <option value="UI/UX & Digital Art">UI/UX &amp; Digital Art</option>
                  <option value="Events & Campaigns">Events &amp; Campaigns</option>
                  <option value="Merchandise & Print">Merchandise &amp; Print</option>
                </select>
              </div>

              <div>
                <label className="font-mono text-xs uppercase tracking-widest text-neutral-400 block mb-2 font-medium">
                  04 // Year of Study
                </label>
                <select
                  value={formData.yearOfStudy}
                  onChange={(e) => setFormData({ ...formData, yearOfStudy: e.target.value })}
                  className="w-full bg-black border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-white transition-colors"
                >
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                  <option value="Postgraduate">Postgraduate</option>
                </select>
              </div>
            </div>

            <div>
              <label className="font-mono text-xs uppercase tracking-widest text-neutral-400 block mb-2 font-medium">
                05 // Portfolio / GitHub / ArtStation URL
              </label>
              <input
                type="url"
                value={formData.portfolioUrl}
                onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                placeholder="https://behance.net/yourprofile"
                className="w-full bg-black border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-white transition-colors"
              />
            </div>

            <div>
              <label className="font-mono text-xs uppercase tracking-widest text-neutral-400 block mb-2 font-medium">
                06 // Statement of Intent / Creative Ambition
              </label>
              <textarea
                rows={3}
                value={formData.statement}
                onChange={(e) => setFormData({ ...formData, statement: e.target.value })}
                placeholder="Why do you want to join Adope Club at MGIT?"
                className="w-full bg-black border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-white transition-colors resize-none"
              />
            </div>

            <div className="pt-4 border-t border-white/10 flex justify-end">
              <button
                type="submit"
                className="w-full bg-white text-black font-mono text-xs py-3.5 uppercase tracking-widest font-semibold hover:bg-neutral-200 transition-colors flex justify-center items-center gap-2"
              >
                Submit Membership Vector <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
