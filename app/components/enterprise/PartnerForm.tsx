'use client';

import { useState } from 'react';

const TYPES = [
  'Reseller / Distributor',
  'Design studio or consultancy',
  'Architecture practice',
  'OEM / Equipment manufacturer',
  'White-label production',
  'Other',
];

const FIELD =
  'w-full border border-black/[0.12] bg-black/[0.02] px-4 py-3.5 text-[14px] font-light text-black outline-none transition-colors duration-500 placeholder:text-black/25 focus:border-black/45 focus:bg-black/[0.04]';

const LABEL = 'm3-eyebrow mb-3 block';

/** Posts to the existing /api/partner endpoint. */
export default function PartnerForm() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [error, setError] = useState('');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('sending');
    setError('');

    const data = Object.fromEntries(new FormData(e.currentTarget));

    try {
      const res = await fetch('/api/partner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || 'Could not send your enquiry.');
      }

      setStatus('sent');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
      setStatus('error');
    }
  }

  if (status === 'sent') {
    return (
      <div className="m3-glass p-6 sm:p-10 lg:p-14">
        <span className="m3-eyebrow">Enquiry received</span>
        <h3 className="m3-display mt-6 text-[clamp(1.5rem,3vw,2.25rem)] text-black">
          We will be in touch shortly.
        </h3>
        <p className="m3-lede mt-5 max-w-[420px] text-[14px]">
          Our team reviews every partnership enquiry personally and responds within one
          working day.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="m3-glass p-5 sm:p-8 lg:p-12">
      <div className="grid gap-7 sm:grid-cols-2">
        <div>
          <label className={LABEL} htmlFor="p-name">Your name *</label>
          <input id="p-name" name="name" required className={FIELD} placeholder="Full name" />
        </div>

        <div>
          <label className={LABEL} htmlFor="p-company">Company</label>
          <input id="p-company" name="company" className={FIELD} placeholder="Company name" />
        </div>

        <div>
          <label className={LABEL} htmlFor="p-email">Email *</label>
          <input
            id="p-email"
            name="email"
            type="email"
            required
            className={FIELD}
            placeholder="you@company.com"
          />
        </div>

        <div>
          <label className={LABEL} htmlFor="p-type">Partnership type</label>
          <select
            id="p-type"
            name="partnershipType"
            className={`${FIELD} appearance-none`}
            defaultValue={TYPES[0]}
          >
            {TYPES.map((t) => (
              <option key={t} value={t} className="bg-white">
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-7">
        <label className={LABEL} htmlFor="p-message">How would you like to work together? *</label>
        <textarea
          id="p-message"
          name="message"
          required
          rows={5}
          className={`${FIELD} resize-none`}
          placeholder="Tell us about your business, your clients and the volume you expect."
        />
      </div>

      {status === 'error' && (
        <p className="mt-6 border border-black/20 bg-black/[0.04] px-4 py-3 text-[13px] font-light text-black/70">
          {error}
        </p>
      )}

      <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-5">
        <button
          type="submit"
          disabled={status === 'sending'}
          className="m3-sheen m3-morph inline-flex items-center justify-center gap-4 border border-black bg-black px-9 py-4 text-[11px] font-medium uppercase tracking-[0.22em] text-white hover:bg-transparent hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
        >
          {status === 'sending' ? 'Sending…' : 'Become a Partner'}
        </button>

        <span className="text-[12px] font-light text-black/30">
          Reviewed personally. Reply within one working day.
        </span>
      </div>
    </form>
  );
}
