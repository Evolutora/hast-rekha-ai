'use client';

import { useState, useEffect } from 'react';

const testimonials = [
  { name: "Priya Sharma", location: "Lucknow, UP", text: "शादी के बारे में जो prediction था, वो बिल्कुल सही निकला। बहुत clarity मिली।", rating: 5 },
  { name: "Suman Devi", location: "Delhi", text: "Career को लेकर बहुत संशय था, लेकिन इस रिपोर्ट ने मुझे सही दिशा दिखाई।", rating: 5 },
  { name: "Anjali Verma", location: "Patna, Bihar", text: "Detailed report बहुत personal लगा। Gemstone सलाह ने सच में काम किया।", rating: 5 },
];

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [utr, setUtr] = useState('');
  const [selectedTier, setSelectedTier] = useState<'free' | 'standard' | 'premium' | 'subscription'>('standard');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const tiers = {
    free: { price: 0, name: "Free Overview", benefit: "बेसिक लाइन्स का सारांश" },
    standard: { price: 21, name: "Detailed Report", benefit: "4 मुख्य रेखाओं का विश्लेषण" },
    premium: { price: 51, name: "Premium Report", benefit: "शादी + Gemstone सलाह" },
    subscription: { price: 121, name: "Monthly", benefit: "हर महीने 5 रिपोर्ट्स" }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile || !email || !whatsapp) {
      alert('कृपया अपनी हथेली की फोटो और सभी डिटेल्स भरें');
      return;
    }

    if (tiers[selectedTier].price > 0 && !utr) {
      alert('कृपया पेमेंट के बाद 12-digit UTR नंबर भरें।');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          whatsapp,
          utr,
          tier: selectedTier,
          price: tiers[selectedTier].price,
          imageData: preview 
        }),
      });

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        alert('सबमिशन फेल हो गया। कृपया दोबारा कोशिश करें।');
      }
    } catch (error) {
      alert('नेटवर्क एरर। कृपया इंटरनेट चेक करें।');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-rose-50 flex items-center justify-center p-6 text-center">
        <div className="bg-white p-10 rounded-3xl shadow-2xl max-w-md border border-rose-100">
          <div className="text-6xl mb-6">✅</div>
          <h2 className="text-3xl font-bold mb-4">सबमिट हो गया!</h2>
          <p className="text-gray-600 mb-6">
            धन्यवाद! आपका डेटा और UTR नंबर <b>{utr}</b> हमें मिल गया है। <br /><br />
            वेरिफिकेशन के बाद आपकी रिपोर्ट WhatsApp पर भेज दी जाएगी।
          </p>
          <button onClick={() => setIsSubmitted(false)} className="bg-rose-600 text-white px-8 py-3 rounded-xl font-bold">वापस जाएं</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50 text-gray-900">
      <header className="bg-white/80 backdrop-blur-md border-b border-rose-100 sticky top-0 z-50 py-4">
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-rose-600">✋ HastRekha Expert</h1>
          <div className="text-xs bg-rose-50 text-rose-600 px-3 py-1 rounded-full font-bold">Verified Expert Analysis</div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-extrabold mb-2">आपका भविष्य, आपकी हथेली में</h2>
          <p className="text-gray-500 italic">"{testimonials[currentTestimonial].text}"</p>
        </div>

        {/* Tier Selection */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {Object.entries(tiers).map(([key, tier]) => (
            <button 
              key={key}
              onClick={() => setSelectedTier(key as any)}
              className={`p-4 rounded-2xl border-2 text-left transition-all ${selectedTier === key ? 'border-rose-500 bg-white shadow-lg' : 'border-transparent bg-white/40'}`}
            >
              <h3 className="font-bold text-sm">{tier.name}</h3>
              <p className="text-2xl font-black text-rose-600">₹{tier.price}</p>
              <p className="text-[10px] text-gray-500">{tier.benefit}</p>
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Section 1: Upload */}
          <div className="bg-white p-8 rounded-3xl shadow-xl">
            <h3 className="text-lg font-bold mb-6">1. डिटेल्स भरें</h3>
            <label className="block border-2 border-dashed border-rose-200 rounded-2xl p-6 text-center cursor-pointer mb-4 bg-rose-50/20">
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              {preview ? <img src={preview} alt="Preview" className="h-32 mx-auto rounded-xl" /> : <p className="text-gray-400">दाहिने हाथ की फोटो अपलोड करें</p>}
            </label>
            <input type="email" placeholder="ईमेल एड्रेस" value={email} onChange={(e)=>setEmail(e.target.value)} className="w-full p-4 mb-4 border rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-rose-400" />
            <input type="tel" placeholder="WhatsApp नंबर" value={whatsapp} onChange={(e)=>setWhatsapp(e.target.value)} className="w-full p-4 border rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-rose-400" />
          </div>

          {/* Section 2: Payment */}
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-green-50">
            <h3 className="text-lg font-bold mb-6 text-green-700">2. पेमेंट (UPI)</h3>
            <div className="text-center">
              <img src="/qr.jpg" alt="UPI QR" className="w-44 h-44 mx-auto mb-4 border p-2 rounded-xl" />
              <p className="text-xs text-gray-400 uppercase font-bold tracking-widest">UPI ID</p>
              <p className="font-mono font-bold text-green-800 mb-6">abhisheks529@icici</p>
              <input type="text" placeholder="UTR / Transaction ID (12 अंक)" value={utr} onChange={(e)=>setUtr(e.target.value)} className="w-full p-4 border rounded-xl mb-4 text-center font-mono" />
              <button onClick={handleSubmit} disabled={isLoading} className="w-full py-4 bg-rose-600 text-white rounded-xl font-bold shadow-lg active:scale-95 disabled:opacity-50">
                {isLoading ? "प्रोसेसिंग..." : "एनालिसिस के लिए भेजें"}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}