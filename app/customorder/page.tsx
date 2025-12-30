'use client';

import { useState, useRef, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { gsap } from 'gsap';

export default function CustomOrderPage() {
  const [file, setFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    // Reveal animation
    const tl = gsap.timeline();

    tl.fromTo(titleRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }
    )
      .fromTo('.form-element',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power2.out' },
        '-=0.5'
      );
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    gsap.to('.drop-zone', { borderColor: '#ffffff', scale: 1.02, duration: 0.2 });
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    gsap.to('.drop-zone', { borderColor: 'rgba(255,255,255,0.1)', scale: 1, duration: 0.2 });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    gsap.to('.drop-zone', { borderColor: 'rgba(255,255,255,0.1)', scale: 1, duration: 0.2 });

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Save to localStorage for Dashboard demo
    const newOrder = {
      id: `REQ-${Math.floor(1000 + Math.random() * 9000)}`,
      customer: formData.name,
      product: file ? `Custom: ${file.name}` : 'Custom Request (Detailed)',
      amount: 'Quote Pending',
      status: 'Pending Review',
      date: new Date().toISOString().split('T')[0],
      type: 'custom',
      email: formData.email,
      phone: formData.phone,
      description: formData.description
    };

    const existingOrders = JSON.parse(localStorage.getItem('mock_custom_orders') || '[]');
    localStorage.setItem('mock_custom_orders', JSON.stringify([newOrder, ...existingOrders]));

    setIsSubmitting(false);
    setIsSuccess(true);

    // Reset after showing success
    setTimeout(() => {
      // Optional: clear form or redirect
    }, 3000);
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-black pt-32 pb-20 px-4 sm:px-8 flex items-center justify-center">
        <div className="max-w-xl w-full">

          {/* Header */}
          <div className="text-center mb-12">
            <h1 ref={titleRef} className="text-4xl md:text-5xl font-thin tracking-wider text-white mb-4">
              CUSTOM ORDER
            </h1>
            <p className="text-white/40 font-light tracking-widest text-xs uppercase form-element">
              Bring your ideas to life. Upload your STL file.
            </p>
          </div>

          {!isSuccess ? (
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">

              {/* Name Input */}
              <div className="form-element group relative">
                <input
                  type="text"
                  required
                  placeholder=" "
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-transparent border-b border-white/20 py-4 text-white placeholder-transparent focus:outline-none focus:border-white transition-colors duration-300 peer"
                />
                <label className="absolute left-0 top-4 text-white/40 text-sm transition-all duration-300 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-white peer-[&:not(:placeholder-shown)]:-top-2 peer-[&:not(:placeholder-shown)]:text-xs peer-[&:not(:placeholder-shown)]:text-white pointer-events-none">
                  Your Name
                </label>
              </div>

              {/* Email Input */}
              <div className="form-element group relative">
                <input
                  type="email"
                  required
                  placeholder=" "
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-transparent border-b border-white/20 py-4 text-white placeholder-transparent focus:outline-none focus:border-white transition-colors duration-300 peer"
                />
                <label className="absolute left-0 top-4 text-white/40 text-sm transition-all duration-300 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-white peer-[&:not(:placeholder-shown)]:-top-2 peer-[&:not(:placeholder-shown)]:text-xs peer-[&:not(:placeholder-shown)]:text-white pointer-events-none">
                  Email Address
                </label>
              </div>

              {/* Phone Input */}
              <div className="form-element group relative">
                <input
                  type="tel"
                  required
                  placeholder=" "
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-transparent border-b border-white/20 py-4 text-white placeholder-transparent focus:outline-none focus:border-white transition-colors duration-300 peer"
                />
                <label className="absolute left-0 top-4 text-white/40 text-sm transition-all duration-300 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-white peer-[&:not(:placeholder-shown)]:-top-2 peer-[&:not(:placeholder-shown)]:text-xs peer-[&:not(:placeholder-shown)]:text-white pointer-events-none">
                  Phone Number
                </label>
              </div>

              {/* Message Input */}
              <div className="form-element group relative">
                <textarea
                  required // Assuming message is mandatory, or remove 'required' if optional
                  rows={4}
                  placeholder=" "
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-transparent border-b border-white/20 py-4 text-white placeholder-transparent focus:outline-none focus:border-white transition-colors duration-300 peer resize-none"
                />
                <label className="absolute left-0 top-4 text-white/40 text-sm transition-all duration-300 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-white peer-[&:not(:placeholder-shown)]:-top-2 peer-[&:not(:placeholder-shown)]:text-xs peer-[&:not(:placeholder-shown)]:text-white pointer-events-none">
                  Message / Description
                </label>
              </div>

              {/* File Upload - Drag & Drop */}
              <div
                className="form-element drop-zone relative border border-dashed border-white/10 rounded-lg p-8 text-center transition-all duration-300 hover:border-white/30 hover:bg-white/5 cursor-pointer group"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                <input
                  id="file-upload"
                  type="file"
                  accept=".stl,.obj,.3mf,.png,.jpg,.jpeg,.webp"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <div className="flex flex-col items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white/60 group-hover:text-white transition-colors">
                      <path d="M12 16V8M12 8L9 11M12 8L15 11M3 21H21C21.5523 21 22 20.5523 22 20V4C22 3.44772 21.5523 3 21 3H3C2.44772 3 2 3.44772 2 4V20C2 20.5523 2.44772 21 3 21Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>

                  <div className="space-y-1">
                    <p className="text-white font-medium text-sm">
                      {file ? file.name : 'Upload File (STL or Image)'}
                    </p>
                    <p className="text-white/30 text-xs font-light">
                      {file ? `${(file.size / (1024 * 1024)).toFixed(2)} MB` : 'Drag & drop or click to browse'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="form-element w-full bg-white text-black font-medium tracking-widest text-sm py-4 rounded-sm hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-8 relative overflow-hidden"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    PROCESSING...
                  </span>
                ) : (
                  'REQUEST QUOTE'
                )}
              </button>

            </form>
          ) : (
            <div className="text-center py-20 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-green-500">
                  <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h2 className="text-2xl text-white font-light tracking-wide mb-2">Request Received</h2>
              <p className="text-white/40 font-thin text-sm">We will contact you shortly at {formData.phone}</p>

              <button
                onClick={() => {
                  setIsSuccess(false);
                  setFile(null);
                  setFormData({ name: '', email: '', phone: '', description: '' });
                }}
                className="mt-8 text-white/60 hover:text-white text-xs tracking-widest border-b border-transparent hover:border-white/60 transition-all pb-1"
              >
                SUBMIT ANOTHER
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />

      <style jsx>{`
        .drop-zone {
            background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='8' ry='8' stroke='rgba(255,255,255,0.1)' stroke-width='1' stroke-dasharray='8%2c 8' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e");
            border: none;
        }
        .group:hover .drop-zone {
             background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='8' ry='8' stroke='rgba(255,255,255,0.3)' stroke-width='1' stroke-dasharray='8%2c 8' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e");
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
            animation: fadeIn 0.8s ease-out forwards;
        }
      `}</style>
    </>
  );
}
