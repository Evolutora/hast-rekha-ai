'use client';

import { useState, useEffect } from 'react';

const testimonials = [
  { name: "Priya Sharma", location: "Lucknow, UP", text: "शादी के बारे में जो prediction था, वो बिल्कुल सही निकला। बहुत clarity मिली।", rating: 5 },
  { name: "Neha Gupta", location: "Kanpur, UP", text: "₹51 वाला package लेने के बाद gemstone suggestion ने सच में फर्क डाला।", rating: 5 },
  { name: "Anjali Verma", location: "Patna, Bihar", text: "Detailed report बहुत personal लगा। Career और love दोनों के बारे में सही बताया।", rating: 5 },
];

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [utr, setUtr] = useState(''); // New functionality: Transaction ID
  const [selectedTier, setSelectedTier] = useState<'free' | 'standard' | 'premium' | 'subscription'>('standard');
  const [isLoading, setIsLoading] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const tiers = {
    free: { price: 0, name: "Free Overview", hindi: "मुफ्त ओवरव्यू", benefit: "बेसिक लाइन्स का सारांश" },
    standard: { price: 21, name: "Detailed Report", hindi: "विस्तृत रिपोर्ट", benefit: "4 मुख्य रेखाओं का पूरा विश्लेषण" },
    premium: { price: 51, name: "Premium Report", hindi: "प्रीमियम रिपोर्ट", benefit: "Gemstone सलाह + शादी की भविष्यवाणी" },
    subscription: { price: 121, name: "Monthly Membership", hindi: "मासिक सदस्यता", benefit: "हर महीने 5 रिपोर्ट्स" }
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
    
    // Logic for paid tiers
    if (tiers[selectedTier].price > 0 && !utr) {
      alert('कृपया पेमेंट के बाद UTR (Transaction ID) भरें ताकि हम आपकी पेमेंट verify कर सकें।');
      return;
    }

    setIsLoading(true);
    // Here you would call your /api/analyze-palm route
    setTimeout(() => {
      setIsLoading(false);
      alert('धन्यवाद! आपकी डिटेल्स मिल गई हैं। हम जल्द ही WhatsApp पर आपकी हस्त रेखा रिपोर्ट भेजेंगे।');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50 font-sans text-gray-900">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-rose-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-rose-600 to-pink-600 rounded-xl flex items-center justify-center text-white text-2xl">✋</div>
            <h1 className="text-2xl font-bold tracking-tight">HastRekha Expert</h1>
          </div>
          <div className="hidden md:block text-sm font-medium text-rose-600 bg-rose-50 px-4 py-2 rounded-full">
            ✨ 12,000+ संतुष्ट महिलाएं
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4">
            हथेली में छिपे <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-pink-600">भविष्य के राज</span> जानें
          </h2>
          <p className="text-lg text-gray-600">Love • शादी • Career • सेहत का सटीक विश्लेषण</p>
        </div>

        {/* Dynamic Testimonial Banner */}
        <div className="bg-white border border-rose-100 rounded-2xl p-6 mb-16 shadow-sm max-w-3xl mx-auto">
          <div className="flex items-center gap-4 transition-opacity duration-500">
            <div className="bg-rose-100 text-rose-600 w-12 h-12 rounded-full flex items-center justify-center font-bold">
              {testimonials[currentTestimonial].name[0]}
            </div>
            <div>
              <p className="italic text-gray-700">"{testimonials[currentTestimonial].text}"</p>
              <p className="text-xs font-bold text-gray-500 mt-1">— {testimonials[currentTestimonial].name}, {testimonials[currentTestimonial].location}</p>
            </div>
          </div>
        </div>

        {/* Tiers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-16">
          {Object.entries(tiers).map(([key, tier]) => (
            <div 
              key={key}
              onClick={() => setSelectedTier(key as any)}
              className={`relative bg-white rounded-3xl p-6 cursor-pointer transition-all border-2 ${selectedTier === key ? 'border-rose-500 shadow-xl scale-105 z-10' : 'border-transparent hover:border-rose-200'}`}
            >
              <h3 className="font-bold text-lg mb-1">{tier.name}</h3>
              <p className="text-3xl font-black text-rose-600 mb-4">₹{tier.price}</p>
              <ul className="text-xs space-y-2 text-gray-600">
                <li className="flex items-center gap-2">✅ {tier.hindi}</li>
                <li className="flex items-center gap-2">✅ {tier.benefit}</li>
              </ul>
            </div>
          ))}
        </div>

        {/* Main Action Card */}
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 items-start">
          
          {/* Form Side */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
            <h3 className="text-2xl font-bold mb-6">1. फोटो और डिटेल्स भरें</h3>
            
            {preview ? (
              <div className="mb-6 rounded-2xl overflow-hidden border-4 border-rose-100">
                <img src={preview} alt="Palm Preview" className="w-full h-48 object-cover" />
                <button onClick={() => setPreview(null)} className="w-full py-2 bg-gray-100 text-xs text-gray-500">फोटो बदलें</button>
              </div>
            ) : (
              <label className="block mb-6 group">
                <div className="border-2 border-dashed border-rose-200 group-hover:border-rose-400 rounded-2xl p-8 text-center cursor-pointer transition-colors bg-rose-50/30">
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                  <span className="text-4xl mb-2 block">✋</span>
                  <p className="text-sm font-medium">दाहिने हाथ की फोटो अपलोड करें</p>
                </div>
              </label>
            )}

            <div className="space-y-4 mb-6">
              <input 
                type="email" placeholder="Email Address" value={email} 
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-rose-500 outline-none"
              />
              <input 
                type="tel" placeholder="WhatsApp Number" value={whatsapp} 
                onChange={(e) => setWhatsapp(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-rose-500 outline-none"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-rose-200 transition-all active:scale-95 disabled:opacity-50"
            >
              {isLoading ? 'Wait...' : 'एनालिसिस शुरू करें'}
            </button>
          </div>

          {/* Payment Side */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 border border-green-100 bg-green-50/20">
            <h3 className="text-2xl font-bold mb-6 text-green-800">2. पेमेंट (UPI)</h3>
            <p className="text-sm text-gray-600 mb-6">नीचे दिए QR को स्कैन करें और ₹{tiers[selectedTier].price} भेजें।</p>
            
            <div className="bg-white p-4 rounded-2xl shadow-inner mb-6 mx-auto w-56 h-56 flex items-center justify-center border-2 border-green-100">
              <img 
                src="/photo_6312291453748581112_x (1).jpg" 
                alt="UPI QR Code" 
                className="w-full h-full object-contain"
              />
            </div>

            <div className="space-y-4">
              <div className="text-center">
                <p className="text-xs uppercase tracking-widest text-gray-400 font-bold">UPI ID</p>
                <p className="font-mono text-green-700 font-bold">abhisheks529@icici</p>
              </div>

              <input 
                type="text" 
                placeholder="Transaction ID / UTR भरें" 
                value={utr}
                onChange={(e) => setUtr(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-green-200 focus:ring-2 focus:ring-green-500 outline-none bg-white"
              />
              <p className="text-[10px] text-gray-500 text-center italic">पेमेंट के बाद स्क्रीनशॉट WhatsApp (917838429605) पर भेजें</p>
            </div>
          </div>

        </div>
      </main>

      <footer className="mt-20 border-t border-gray-200 bg-white py-12">
        <div className="max-w-6xl mx-auto px-6 text-center text-gray-500 text-sm">
          <p className="mb-2">HastRekha Expert © 2026 • उत्तर भारत के लिए विशेष</p>
          <p>यह सेवा केवल मनोरंजन और मार्गदर्शन के लिए है।</p>
        </div>
      </footer>
    </div>
  );
}