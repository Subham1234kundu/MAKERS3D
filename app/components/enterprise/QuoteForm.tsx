'use client';

import { useState } from 'react';

const SERVICES = [
  'Scale miniature of a machine',
  'Functional / display model',
  'Product design & prototyping',
  'Reverse engineering & 3D scanning',
  'Bulk production run',
  'Something else',
];

const FIELD =
  'w-full border border-black/[0.12] bg-black/[0.02] px-4 py-3.5 text-[14px] font-light text-black outline-none transition-colors duration-500 placeholder:text-black/25 focus:border-black/45 focus:bg-black/[0.04]';

const LABEL = 'm3-eyebrow mb-3 block';

export default function QuoteForm() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [error, setError] = useState('');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('sending');
    setError('');

    const data = Object.fromEntries(new FormData(e.currentTarget));

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || 'Could not send your request.');
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
        <span className="m3-eyebrow">Request received</span>
        <h3 className="m3-display mt-6 text-[clamp(1.5rem,3vw,2.25rem)] text-black">
          We will be in touch
          <br />
          within one working day.
        </h3>
        <p className="m3-lede mt-5 max-w-[420px] text-[14px]">
          You will get back a clear plan — how we would build it, at what scale, in
          what material and what it costs.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="m3-glass p-5 sm:p-8 lg:p-12">
      <div className="grid gap-7 sm:grid-cols-2">
        <div>
          <label className={LABEL} htmlFor="q-name">Your name *</label>
          <input id="q-name" name="name" required className={FIELD} placeholder="Full name" />
        </div>

        <div>
          <label className={LABEL} htmlFor="q-company">Company</label>
          <input id="q-company" name="company" className={FIELD} placeholder="Company name" />
        </div>

        <div>
          <label className={LABEL} htmlFor="q-email">Email *</label>
          <input
            id="q-email"
            name="email"
            type="email"
            required
            className={FIELD}
            placeholder="you@company.com"
          />
        </div>

        <div>
          <label className={LABEL} htmlFor="q-phone">Phone</label>
          <input id="q-phone" name="phone" type="tel" className={FIELD} placeholder="+91" />
        </div>

        <div>
          <label className={LABEL} htmlFor="q-service">What do you need?</label>
          <select id="q-service" name="service" className={`${FIELD} appearance-none`} defaultValue={SERVICES[0]}>
            {SERVICES.map((s) => (
              <option key={s} value={s} className="bg-white">
                {s}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={LABEL} htmlFor="q-quantity">Quantity</label>
          <input id="q-quantity" name="quantity" className={FIELD} placeholder="1, 50, 10,000…" />
        </div>
      </div>

      <div className="mt-7">
        <label className={LABEL} htmlFor="q-message">Tell us about the project *</label>
        <textarea
          id="q-message"
          name="message"
          required
          rows={5}
          className={`${FIELD} resize-none`}
          placeholder="What machine or product is it? What scale? Any deadline? A photo link helps."
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
          {status === 'sending' ? 'Sending…' : 'Send Request'}
        </button>

        <span className="text-[12px] font-light text-black/30">
          No obligation. Reply within one working day.
        </span>
      </div>
    </form>
  );
}
