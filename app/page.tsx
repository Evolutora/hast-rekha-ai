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

    if (tiers[selectedTier].price > 0 && !utr) {
      alert('Paid Report के लिए कृपया पेमेंट करें और 12-digit UTR (Transaction ID) नंबर भरें।');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call to your /api/analyze-palm
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsSubmitted(true);
    } catch (error) {
      alert('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-rose-50 flex items-center justify-center p-6 text-center">
        <div className="bg-white p-10 rounded-3xl shadow-2xl max-w-md border border-rose-100">
          <div className="text-6xl mb-6">✅</div>
          <h2 className="text-3xl font-bold mb-4 text-gray-900">सबमिट हो गया!</h2>
          <p className="text-gray-600 mb-6">
            धन्यवाद! हमने आपका डेटा और UTR नंबर <b>{utr}</b> प्राप्त कर लिया है। <br /><br />
            {tiers[selectedTier].price > 0 ? (
              "पेमेंट वेरिफिकेशन के बाद, आपकी विस्तृत रिपोर्ट 2-4 घंटों के भीतर आपके WhatsApp पर भेज दी जाएगी।"
            ) : (
              "आपकी फ्री रिपोर्ट प्रोसेस हो रही है। कृपया अपना ईमेल चेक करें।"
            )}
          </p>
          <button 
            onClick={() => setIsSubmitted(false)}
            className="bg-rose-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-rose-700 transition-colors"
          >
            वापस जाएं
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50 font-sans text-gray-900">
      <header className="bg-white/80 backdrop-blur-md border-b border-rose-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-rose-600 to-pink-600 rounded-xl flex items-center justify-center text-white text-2xl">✋</div>
            <h1 className="text-2xl font-bold tracking-tight">HastRekha Expert</h1>
          </div>
          <div className="hidden sm:block text-sm font-medium text-rose-600 bg-rose-50 px-4 py-2 rounded-full">
            ✨ 12,000+ संतुष्ट महिलाएं
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
            अपनी हथेली से <span className="text-rose-600">भविष्य</span> जानें
          </h2>
          <p className="text-gray-600">Love • Career • Health • Marriage Analysis</p>
        </div>

        {/* Dynamic Testimonial */}
        <div className="max-w-2xl mx-auto mb-12 bg-white/60 border border-rose-100 rounded-2xl p-6 text-center italic shadow-sm transition-all duration-500">
          "{testimonials[currentTestimonial].text}"
          <p className="text-xs font-bold text-rose-400 mt-2">— {testimonials[currentTestimonial].name}</p>
        </div>

        {/* Pricing Selection */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {Object.entries(tiers).map(([key, tier]) => (
            <button 
              key={key}
              onClick={() => setSelectedTier(key as any)}
              className={`p-5 rounded-2xl border-2 transition-all text-left ${selectedTier === key ? 'border-rose-500 bg-white shadow-lg' : 'border-transparent bg-white/40 hover:bg-white/60'}`}
            >
              <h3 className="font-bold text-sm md:text-base">{tier.name}</h3>
              <p className="text-2xl font-black text-rose-600">₹{tier.price}</p>
              <p className="text-[10px] text-gray-500 mt-1">{tier.benefit}</p>
            </button>
          ))}
        </div>

        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Section 1: Data Collection */}
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-rose-50">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
              <span className="bg-rose-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
              डिटेल्स अपलोड करें
            </h3>
            
            <div className="space-y-4">
              <label className="block border-2 border-dashed border-rose-200 rounded-2xl p-8 text-center cursor-pointer hover:bg-rose-50 transition-colors bg-rose-50/20">
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                {preview ? (
                  <img src={preview} alt="Preview" className="h-40 mx-auto rounded-xl object-cover shadow-md" />
                ) : (
                  <div className="text-gray-400">
                    <p className="text-4xl mb-2">📸</p>
                    <p className="text-sm font-medium">दाहिने हाथ की फोटो चुनें</p>
                  </div>
                )}
              </label>

              <input 
                type="email" placeholder="आपका ईमेल एड्रेस" 
                className="w-full p-4 rounded-xl border border-gray-100 bg-gray-50 outline-none focus:ring-2 focus:ring-rose-400"
                value={email} onChange={(e) => setEmail(e.target.value)}
              />
              <input 
                type="tel" placeholder="WhatsApp नंबर" 
                className="w-full p-4 rounded-xl border border-gray-100 bg-gray-50 outline-none focus:ring-2 focus:ring-rose-400"
                value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)}
              />
            </div>
          </div>

          {/* Section 2: Payment & Submission */}
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-green-50">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-3 text-green-700">
              <span className="bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
              पेमेंट और सबमिट
            </h3>

            <div className="text-center">
              <div className="bg-white p-4 rounded-2xl inline-block mb-4 shadow-inner border border-green-100">
                {/* Updated to simple filename for reliability */}
                <img src="/qr.jpg" alt="UPI QR" className="w-52 h-52 object-contain" />
              </div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">UPI ID</p>
              <p className="text-lg font-mono font-bold text-green-800 mb-6">abhisheks529@icici</p>
              
              <input 
                type="text" placeholder="Transaction UTR (12 digits)" 
                className="w-full p-4 rounded-xl border border-green-200 bg-green-50/30 outline-none focus:ring-2 focus:ring-green-400 mb-5 font-mono text-center"
                value={utr} onChange={(e) => setUtr(e.target.value)}
              />
              
              <button 
                onClick={handleSubmit} disabled={isLoading}
                className="w-full py-4 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-rose-200 transition-all active:scale-95 disabled:opacity-50"
              >
                {isLoading ? "प्रोसेसिंग..." : "अभी सबमिट करें"}
              </button>
              <p className="text-[10px] text-gray-500 mt-4 italic text-center">
                पेमेंट के बाद स्क्रीनशॉट WhatsApp (917838429605) पर जरूर भेजें।
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-12 text-center text-gray-400 text-xs border-t border-rose-50 mt-12 bg-white">
         HastRekha Expert © 2026 • उत्तर भारत के प्रसिद्ध हस्त रेखा विशेषज्ञ
      </footer>
    </div>
  );
}