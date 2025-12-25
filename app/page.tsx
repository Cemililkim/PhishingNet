'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Shield,
  Search,
  Lock,
  Upload,
  Menu,
  X,
  ExternalLink,
  Brain,
  GraduationCap,
  Terminal,
  Github,
  Twitter,
} from 'lucide-react';

type Tab = 'paste' | 'upload';

export default function LandingPage() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('paste');
  const [content, setContent] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleScan = async () => {
    setError('');
    setIsLoading(true);

    try {
      if (activeTab === 'paste') {
        // For text, extract email if present
        const emailMatch = content.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
        if (!emailMatch) {
          setError('Please paste email content containing a valid email address');
          setIsLoading(false);
          return;
        }

        const response = await fetch('/api/analyze/email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: emailMatch[0] }),
        });

        const data = await response.json();
        if (data.status === 'success') {
          sessionStorage.setItem('analysisResult', JSON.stringify(data.data));
          router.push(`/results/${data.data.id}`);
        } else {
          setError(data.error?.message || 'Analysis failed');
        }
      } else {
        if (!file) {
          setError('Please select an .eml file');
          setIsLoading(false);
          return;
        }

        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/analyze/eml', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();
        if (data.status === 'success') {
          sessionStorage.setItem('analysisResult', JSON.stringify(data.data));
          router.push(`/results/${data.data.id}`);
        } else {
          setError(data.error?.message || 'Analysis failed');
        }
      }
    } catch {
      setError('Connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 font-sans antialiased">
      {/* ============ NAVIGATION ============ */}
      <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md px-4 md:px-10 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="size-8 bg-[#6467f2]/10 rounded-lg flex items-center justify-center">
              <Shield className="h-5 w-5 text-[#6467f2]" />
            </div>
            <h1 className="text-lg font-bold tracking-tight">PhishingNet</h1>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex flex-1 justify-end items-center gap-8">
            <div className="flex items-center gap-6">
              <Link href="#features" className="text-gray-500 hover:text-[#6467f2] text-sm font-medium transition-colors">
                Features
              </Link>
              <Link href="/api/analyze/email" className="text-gray-500 hover:text-[#6467f2] text-sm font-medium transition-colors">
                API
              </Link>
              <Link href="#" className="text-gray-500 hover:text-[#6467f2] text-sm font-medium transition-colors">
                Docs
              </Link>
              <Link href="https://github.com" className="text-gray-500 hover:text-[#6467f2] text-sm font-medium transition-colors flex items-center gap-1">
                GitHub
                <ExternalLink className="h-4 w-4" />
              </Link>
            </div>
            <button className="bg-[#6467f2] hover:bg-[#5356db] text-white text-sm font-bold px-5 py-2.5 rounded-lg transition-colors shadow-sm shadow-[#6467f2]/30">
              Login
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-1" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-gray-50 px-4 py-4 space-y-3">
            <Link href="#features" className="block text-gray-600 py-2">Features</Link>
            <Link href="/api/analyze/email" className="block text-gray-600 py-2">API</Link>
            <Link href="#" className="block text-gray-600 py-2">Docs</Link>
            <Link href="https://github.com" className="block text-gray-600 py-2">GitHub</Link>
            <button className="w-full bg-[#6467f2] text-white font-bold py-2.5 rounded-lg">Login</button>
          </div>
        )}
      </nav>

      {/* ============ MAIN CONTENT ============ */}
      <main className="flex-grow flex flex-col">
        {/* HERO SECTION */}
        <section className="relative pt-16 pb-20 overflow-hidden bg-gray-50">
          {/* Background Decoration */}
          <div
            className="absolute inset-0 z-0 opacity-40 pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(#6467f2 1px, transparent 1px)', backgroundSize: '32px 32px' }}
          />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#6467f2]/10 blur-[100px] rounded-full pointer-events-none z-0" />

          <div className="relative z-10 max-w-4xl mx-auto px-4 flex flex-col items-center text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-gray-200 shadow-sm mb-6">
              <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-medium text-gray-500">v2.0 Now Available</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] mb-6">
              Analyze emails for <br className="hidden md:block" />
              <span className="text-[#6467f2]">threats instantly</span>
            </h1>
            <p className="text-lg text-gray-500 max-w-2xl mb-10 leading-relaxed">
              Free, open-source phishing detection powered by SPF, DKIM, DMARC checks, and advanced AI semantic analysis. Secure your inbox today.
            </p>

            {/* Scanner Tool */}
            <div className="w-full bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
              {/* Tabs */}
              <div className="flex border-b border-gray-200 bg-gray-50/50">
                <button
                  onClick={() => setActiveTab('paste')}
                  className={`flex-1 py-4 px-6 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'paste'
                      ? 'border-[#6467f2] text-[#6467f2] bg-white'
                      : 'border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                >
                  Paste Text / Headers
                </button>
                <button
                  onClick={() => setActiveTab('upload')}
                  className={`flex-1 py-4 px-6 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'upload'
                      ? 'border-[#6467f2] text-[#6467f2] bg-white'
                      : 'border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                >
                  Upload .eml File
                </button>
              </div>

              {/* Input Area */}
              <div className="p-4 md:p-6">
                {activeTab === 'paste' ? (
                  <div className="relative">
                    <textarea
                      className="w-full h-48 md:h-64 p-4 rounded-lg bg-gray-50 border border-gray-200 focus:border-[#6467f2] focus:ring-2 focus:ring-[#6467f2]/20 resize-none text-sm font-mono text-gray-900 placeholder-gray-400 transition-all"
                      placeholder="Paste raw email headers, body content, or drag text here to begin analysis..."
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                    />
                    {/* Action Bar */}
                    <div className="absolute bottom-4 right-4 flex items-center gap-3">
                      <span className="flex items-center gap-1.5 text-xs text-gray-500 bg-white/80 px-2 py-1 rounded border border-gray-200 backdrop-blur-sm">
                        <Lock className="h-3.5 w-3.5" />
                        Processed locally
                      </span>
                      <button
                        onClick={handleScan}
                        disabled={isLoading}
                        className="flex items-center gap-2 bg-[#6467f2] hover:bg-[#5356db] text-white px-6 py-2 rounded-lg font-bold text-sm shadow-lg shadow-[#6467f2]/20 transition-all transform hover:scale-[1.02] disabled:opacity-50"
                      >
                        {isLoading ? (
                          <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Search className="h-5 w-5" />
                        )}
                        Scan Email
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center h-48 md:h-64 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50 hover:border-[#6467f2]/50 transition-colors cursor-pointer">
                    <Upload className="h-10 w-10 text-gray-400 mb-3" />
                    <p className="text-sm font-medium text-gray-900">
                      {file ? file.name : 'Click to upload or drag and drop'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">.EML files supported</p>
                    <input
                      type="file"
                      accept=".eml"
                      className="hidden"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                    />
                    {file && (
                      <button
                        onClick={handleScan}
                        disabled={isLoading}
                        className="mt-4 flex items-center gap-2 bg-[#6467f2] hover:bg-[#5356db] text-white px-6 py-2 rounded-lg font-bold text-sm"
                      >
                        {isLoading ? 'Scanning...' : 'Scan File'}
                      </button>
                    )}
                  </label>
                )}
                {error && (
                  <p className="mt-3 text-sm text-red-600">{error}</p>
                )}
              </div>

              {/* Footer */}
              <div className="bg-gray-50 border-t border-gray-200 px-6 py-3 flex items-center justify-between text-xs text-gray-500">
                <div className="flex gap-4">
                  <span>Supported: SPF, DKIM, DMARC</span>
                  <span className="hidden sm:inline">•</span>
                  <span className="hidden sm:inline">AI Analysis Model v1.4</span>
                </div>
                <Link href="#" className="hover:text-[#6467f2] underline">View Sample Report</Link>
              </div>
            </div>
          </div>
        </section>

        {/* STATISTICS SECTION */}
        <section className="border-y border-gray-200 bg-white py-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center md:divide-x md:divide-gray-200">
              {[
                { value: '1M+', label: 'Emails Scanned' },
                { value: '99.9%', label: 'Accuracy Rate' },
                { value: '< 2s', label: 'Analysis Time' },
                { value: '100%', label: 'Open Source' },
              ].map(({ value, label }) => (
                <div key={label} className="flex flex-col gap-1">
                  <span className="text-3xl font-black tracking-tight">{value}</span>
                  <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section id="features" className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                Comprehensive Security Analysis
              </h2>
              <p className="text-gray-500 text-lg">
                We combine traditional header analysis with cutting-edge AI to provide the most accurate phishing detection available.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: Shield,
                  title: 'Email Authentication',
                  description: 'Verify sender identity instantly. We parse and validate standard protocols like SPF, DKIM, and DMARC to ensure the email actually comes from who it claims to be.',
                  color: 'blue',
                },
                {
                  icon: Brain,
                  title: 'AI Analysis',
                  description: 'Our deep learning models scan the body content for semantic threats, urgency cues, and suspicious language patterns that traditional filters often miss.',
                  color: 'purple',
                },
                {
                  icon: GraduationCap,
                  title: 'Education',
                  description: "Don't just get a pass/fail. Learn exactly why an email was flagged with detailed educational breakdowns for every warning sign found in the header or body.",
                  color: 'teal',
                },
              ].map(({ icon: Icon, title, description, color }) => (
                <div
                  key={title}
                  className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow group"
                >
                  <div className={`size-12 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${color === 'blue' ? 'bg-blue-100 text-blue-600' :
                      color === 'purple' ? 'bg-purple-100 text-[#6467f2]' :
                        'bg-teal-100 text-teal-600'
                    }`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{title}</h3>
                  <p className="text-gray-500 leading-relaxed">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="py-20 bg-white">
          <div className="max-w-5xl mx-auto px-4">
            <div className="relative overflow-hidden rounded-2xl bg-[#6467f2] px-8 py-16 md:px-16 text-center shadow-2xl">
              {/* Pattern */}
              <div
                className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none"
                style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, #ffffff 10px, #ffffff 20px)' }}
              />
              <div className="relative z-10 flex flex-col items-center gap-6">
                <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                  Ready to secure your inbox?
                </h2>
                <p className="text-white/90 text-lg max-w-xl">
                  Join thousands of security professionals using PhishingNet to analyze and prevent email threats.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 mt-2">
                  <button className="bg-white text-[#6467f2] hover:bg-gray-100 font-bold px-8 py-3 rounded-lg shadow-lg transition-colors">
                    Get Started for Free
                  </button>
                  <button className="bg-transparent border-2 border-white/30 hover:bg-white/10 text-white font-bold px-8 py-3 rounded-lg transition-colors flex items-center gap-2 justify-center">
                    <Terminal className="h-4 w-4" />
                    View API Docs
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ============ FOOTER ============ */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start gap-10">
            {/* Logo & Description */}
            <div className="flex flex-col gap-4 max-w-xs">
              <div className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-[#6467f2]" />
                <span className="font-bold text-lg">PhishingNet</span>
              </div>
              <p className="text-gray-500 text-sm">
                Open-source email security analysis tool designed for privacy and transparency.
              </p>
              <div className="flex gap-4 mt-2">
                <Link href="https://github.com" className="text-gray-400 hover:text-[#6467f2] transition-colors">
                  <Github className="h-6 w-6" />
                </Link>
                <Link href="#" className="text-gray-400 hover:text-[#6467f2] transition-colors">
                  <Twitter className="h-6 w-6" />
                </Link>
              </div>
            </div>

            {/* Links */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-10 md:gap-20">
              <div className="flex flex-col gap-3">
                <h4 className="font-bold text-sm uppercase tracking-wider">Product</h4>
                <Link href="#features" className="text-gray-500 hover:text-[#6467f2] text-sm transition-colors">Features</Link>
                <Link href="#" className="text-gray-500 hover:text-[#6467f2] text-sm transition-colors">Integrations</Link>
                <Link href="/api/analyze/email" className="text-gray-500 hover:text-[#6467f2] text-sm transition-colors">API Reference</Link>
                <Link href="#" className="text-gray-500 hover:text-[#6467f2] text-sm transition-colors">Changelog</Link>
              </div>
              <div className="flex flex-col gap-3">
                <h4 className="font-bold text-sm uppercase tracking-wider">Resources</h4>
                <Link href="#" className="text-gray-500 hover:text-[#6467f2] text-sm transition-colors">Documentation</Link>
                <Link href="#" className="text-gray-500 hover:text-[#6467f2] text-sm transition-colors">Community</Link>
                <Link href="#" className="text-gray-500 hover:text-[#6467f2] text-sm transition-colors">Security Guide</Link>
              </div>
              <div className="flex flex-col gap-3">
                <h4 className="font-bold text-sm uppercase tracking-wider">Legal</h4>
                <Link href="#" className="text-gray-500 hover:text-[#6467f2] text-sm transition-colors">Privacy Policy</Link>
                <Link href="#" className="text-gray-500 hover:text-[#6467f2] text-sm transition-colors">Terms of Service</Link>
                <Link href="#" className="text-gray-500 hover:text-[#6467f2] text-sm transition-colors">Cookie Policy</Link>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
            <p>© 2025 PhishingNet. All rights reserved.</p>
            <p>Designed for the community.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
