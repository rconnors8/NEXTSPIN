'use client'

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { Playfair_Display, Inter } from 'next/font/google'
import Image from "next/image"

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500'],
  style: ['normal'],
})

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

export default function Page() {
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '50px'
    });

    document.querySelectorAll('.scroll-animation').forEach((element) => {
      observerRef.current?.observe(element);
    });

    return () => observerRef.current?.disconnect();
  }, []);

  useEffect(() => {
    const loadTally = () => {
      const existingScript = document.querySelector('script[src="https://tally.so/widgets/embed.js"]');
      if (!existingScript) {
        const script = document.createElement('script');
        script.src = "https://tally.so/widgets/embed.js";
        script.async = true;
        script.onload = () => {
          // @ts-ignore
          if (window.Tally) {
            // @ts-ignore
            window.Tally.loadEmbeds();
          }
        };
        document.body.appendChild(script);
      }
    };

    loadTally();
  }, []);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    eventType: '',
    eventDate: '',
    details: '',
    package: 'classic' // Add default package selection
  });

  const [formStatus, setFormStatus] = useState<{
    isSubmitting: boolean;
    isSubmitted: boolean;
    error: string | null;
  }>({
    isSubmitting: false,
    isSubmitted: false,
    error: null,
  });

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus({ isSubmitting: true, isSubmitted: false, error: null });

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      // Clear form and show success message
      setFormData({
        name: '',
        email: '',
        eventType: '',
        eventDate: '',
        details: '',
        package: 'classic'
      });
      setFormStatus({
        isSubmitting: false,
        isSubmitted: true,
        error: null
      });
    } catch (error) {
      setFormStatus({
        isSubmitting: false,
        isSubmitted: false,
        error: error instanceof Error ? error.message : 'Something went wrong. Please try again.'
      });
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <header className="py-6 px-6 border-b border-neutral-800/50 sticky top-0 bg-neutral-950/80 backdrop-blur-xl z-50">
        <nav className="max-w-[1200px] mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-medium">
            NextSpin
          </Link>
          <Button 
            variant="ghost" 
            onClick={() => {
              document.getElementById('early-access-form')?.scrollIntoView({ 
                behavior: 'smooth',
                block: 'center'
              });
            }}
          >
            Book Now
          </Button>
        </nav>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-20 px-6 relative">
          <div className="hero-glow" />
          <div className="max-w-[1200px] mx-auto text-center relative z-10">
            {/* Logo */}
            <div className="mb-8 relative w-48 h-48 mx-auto">
              <Image 
                src="/images/logo.svg"
                alt="NextSpin Logo"
                fill
                priority
                className="object-contain"
                sizes="(max-width: 768px) 192px, 192px"
              />
            </div>
            <div className="inline-flex items-center px-6 py-2 text-base font-medium text-purple-400 mb-8 glimmer-pill fade-in bg-purple-500/10 border border-purple-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]">
              <span className={playfair.className}>360° Photo Booth Rentals</span>
            </div>
            <h1 className={`text-4xl md:text-5xl font-medium mb-6 tracking-tight fade-in delay-1 ${playfair.className}`}>
              Everything you need to<br />create unforgettable memories.
            </h1>
            <p className="text-lg text-neutral-400 mb-8 fade-in delay-2">
              Join thousands of happy customers using NextSpin 360 Photo Booth for their special events. Perfect for weddings, corporate events, and parties!
            </p>
            <div className="fade-in delay-3">
              <Button 
                size="lg" 
                className="rounded-full"
                onClick={() => {
                  document.getElementById('early-access-form')?.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'center'
                  });
                }}
              >
                Book Your Event
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-6 border-t border-neutral-800">
          <div className="max-w-[1200px] mx-auto">
            <div className="text-center mb-16 scroll-animation">
              <h2 className={`text-3xl md:text-4xl font-medium mb-3 ${playfair.className}`}>Create Memories in Minutes</h2>
              <p className="text-neutral-400 text-lg">Transform your event into an unforgettable experience with our state-of-the-art photo booth.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 relative">
              <div className="bg-neutral-900 p-8 rounded-xl border border-neutral-800/80 hover:border-green-500/20 transition-colors scroll-animation scroll-delay-1 group">
                <div className="w-12 h-12 rounded-xl bg-green-500/10 text-green-400 flex items-center justify-center mb-6 group-hover:bg-green-500/20 transition-colors">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                    <circle cx="12" cy="13" r="4"/>
                  </svg>
                </div>
                <h3 className={`text-xl font-medium mb-3 group-hover:text-green-400 transition-colors ${playfair.className}`}>360° Technology</h3>
                <p className="text-neutral-400 leading-relaxed">
                  Capture stunning 360-degree videos that showcase your guests from every angle, creating shareable social media moments.
                </p>
              </div>

              <div className="bg-neutral-900 p-8 rounded-xl border border-neutral-800/80 hover:border-green-500/20 transition-colors scroll-animation scroll-delay-2 group">
                <div className="w-12 h-12 rounded-xl bg-green-500/10 text-green-400 flex items-center justify-center mb-6 group-hover:bg-green-500/20 transition-colors">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                  </svg>
                </div>
                <h3 className={`text-xl font-medium mb-3 group-hover:text-green-400 transition-colors ${playfair.className}`}>Professional Setup</h3>
                <p className="text-neutral-400 leading-relaxed">
                  Our team handles everything from delivery to setup and operation. Just book and we'll take care of the rest.
                </p>
              </div>

              <div className="bg-neutral-900 p-8 rounded-xl border border-neutral-800/80 hover:border-green-500/20 transition-colors scroll-animation scroll-delay-3 group">
                <div className="w-12 h-12 rounded-xl bg-green-500/10 text-green-400 flex items-center justify-center mb-6 group-hover:bg-green-500/20 transition-colors">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </div>
                <h3 className={`text-xl font-medium mb-3 group-hover:text-green-400 transition-colors ${playfair.className}`}>Instant Sharing</h3>
                <p className="text-neutral-400 leading-relaxed">
                  Get your photos and videos instantly via email or text. Share your memories on social media right from the booth.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 px-6 border-t border-neutral-800 bg-neutral-900/80">
          <div className="max-w-[1200px] mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-400 mb-2">4.9/5</div>
                <p className="text-neutral-400">Average Rating</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-400 mb-2">50+</div>
                <p className="text-neutral-400">Events Completed</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-400 mb-2">5K+</div>
                <p className="text-neutral-400">Happy Guests</p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Packages Section */}
        <section className="py-20 px-6 border-t border-neutral-800">
          <div className="max-w-[1200px] mx-auto">
            <div className="text-center mb-16 scroll-animation">
              <h2 className={`text-3xl md:text-4xl font-medium mb-3 ${playfair.className}`}>Choose Your Package</h2>
              <p className="text-neutral-400 text-lg">Select the perfect package for your special event</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Classic Spin Package */}
              <div className="bg-neutral-900 rounded-[2rem] overflow-hidden border border-neutral-800 hover:border-purple-500/20 transition-all scroll-animation scroll-delay-1">
                <div className="aspect-square relative bg-gradient-to-br from-[#C0C0C0] via-[#E8E8E8] to-[#A8A8A8]">
                  <div className="absolute inset-0 bg-gradient-to-b from-neutral-900/0 to-neutral-900/100 z-10" />
                </div>
                <div className="p-6">
                  <h3 className={`text-xl font-medium mb-2 ${playfair.className}`}>Classic Spin Package</h3>
                  <div className="text-2xl font-bold text-purple-400 mb-4">$600</div>
                  <ul className="text-neutral-400 space-y-2 mb-6">
                    <li>2 Hours of Service</li>
                    <li>Basic Props</li>
                    <li>Digital Downloads</li>
                    <li>Social Media Sharing</li>
                    <li>Basic Setup</li>
                    <li>Standard Backdrop</li>
                  </ul>
                  <Button 
                    className="w-full"
                    variant="outline"
                    onClick={() => {
                      document.getElementById('early-access-form')?.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'center'
                      });
                    }}
                  >
                    Book Now
                  </Button>
                </div>
              </div>

              {/* Red Carpet Experience */}
              <div className="bg-neutral-900 rounded-[2rem] overflow-hidden border border-neutral-800 hover:border-purple-500/20 transition-all scroll-animation scroll-delay-2">
                <div className="aspect-square relative bg-gradient-to-br from-[#ff0000] via-[#cc0000] to-[#990000]">
                  <div className="absolute inset-0 bg-gradient-to-b from-neutral-900/0 to-neutral-900/100 z-10" />
                </div>
                <div className="p-6">
                  <h3 className={`text-xl font-medium mb-2 ${playfair.className}`}>Red Carpet Experience</h3>
                  <div className="text-2xl font-bold text-purple-400 mb-4">$750</div>
                  <ul className="text-neutral-400 space-y-2 mb-6">
                    <li>3 Hours of Service</li>
                    <li>Premium Props</li>
                    <li>Unlimited Digital Downloads</li>
                    <li>Custom Backdrop</li>
                    <li>Social Media Integration</li>
                    <li>Professional Setup</li>
                    <li>Basic Guest Book</li>
                  </ul>
                  <Button 
                    className="w-full"
                    variant="outline"
                    onClick={() => {
                      document.getElementById('early-access-form')?.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'center'
                      });
                    }}
                  >
                    Book Now
                  </Button>
                </div>
              </div>

              {/* Grand Celebration Package */}
              <div className="bg-neutral-900 rounded-[2rem] overflow-hidden border border-neutral-800 hover:border-purple-500/20 transition-all scroll-animation scroll-delay-3">
                <div className="aspect-square relative bg-gradient-to-br from-[#FFD700] via-[#FCC200] to-[#B8860B]">
                  <div className="absolute inset-0 bg-gradient-to-b from-neutral-900/0 to-neutral-900/100 z-10" />
                </div>
                <div className="p-6">
                  <h3 className={`text-xl font-medium mb-2 ${playfair.className}`}>Grand Celebration Package</h3>
                  <div className="text-2xl font-bold text-purple-400 mb-4">$900</div>
                  <ul className="text-neutral-400 space-y-2 mb-6">
                    <li>4 Hours of Service</li>
                    <li>Luxury Props Collection</li>
                    <li>Unlimited Digital Downloads</li>
                    <li>Custom Branded Overlay</li>
                    <li>Premium Backdrop</li>
                    <li>Social Media Integration</li>
                    <li>VIP Setup & Attendant</li>
                    <li>Premium Guest Book</li>
                    <li>Video Messages Feature</li>
                  </ul>
                  <Button 
                    className="w-full"
                    variant="outline"
                    onClick={() => {
                      document.getElementById('early-access-form')?.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'center'
                      });
                    }}
                  >
                    Book Now
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Booking Form Section */}
        <section id="early-access-form" className="py-20 px-6 border-t border-neutral-800 bg-neutral-900/80">
          <div className="max-w-[1200px] mx-auto text-center">
            <div className="scroll-animation">
              <h2 className={`text-3xl md:text-4xl font-medium mb-4 ${playfair.className}`}>Book Your Event</h2>
              <p className="text-neutral-400 mb-12">Reserve your NextSpin 360 Photo Booth today and make your event unforgettable.</p>
            </div>
            <div className="max-w-[500px] mx-auto scroll-animation">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative">
                    <input 
                      type="text" 
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Your Name"
                      className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/30"
                      required
                    />
                  </div>
                  <div className="relative">
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Email Address"
                      className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/30"
                      required
                    />
                  </div>
                </div>
                <div className="relative">
                  <select
                    name="package"
                    value={formData.package}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/30 appearance-none cursor-pointer"
                    required
                  >
                    <option value="classic">Classic Spin Package - $600</option>
                    <option value="redcarpet">Red Carpet Experience - $750</option>
                    <option value="grand">Grand Celebration Package - $900</option>
                  </select>
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-neutral-400">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 6l4 4 4-4" />
                    </svg>
                  </div>
                </div>
                <div className="relative">
                  <input 
                    type="text" 
                    name="eventType"
                    value={formData.eventType}
                    onChange={handleInputChange}
                    placeholder="Event Type (Wedding, Corporate Event, Party, etc.)"
                    className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/30"
                    required
                  />
                </div>
                <div className="relative">
                  <input 
                    type="date" 
                    name="eventDate"
                    value={formData.eventDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/30"
                    required
                  />
                </div>
                <div className="relative">
                  <textarea 
                    name="details"
                    value={formData.details}
                    onChange={handleInputChange}
                    placeholder="Additional Details"
                    rows={4}
                    className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/30"
                  ></textarea>
                </div>
                {formStatus.error && (
                  <div className="text-red-500 text-sm">{formStatus.error}</div>
                )}
                {formStatus.isSubmitted && (
                  <div className="text-green-500 text-sm">Thank you! We'll be in touch soon.</div>
                )}
                <Button 
                  type="submit"
                  size="lg"
                  className="w-full rounded-lg"
                  disabled={formStatus.isSubmitting}
                >
                  {formStatus.isSubmitting ? 'Submitting...' : 'Submit Booking Request'}
                </Button>
              </form>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}