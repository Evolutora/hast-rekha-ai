// app/page.tsx
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
    if (!selectedFile) {
      alert('कृपया अपनी हथेली की फोटो अपलोड करें');
      return;
    }
    if (!email || !whatsapp) {
      alert('कृपया ईमेल और व्हाट्सएप नंबर दोनों भरें');
      return;
    }

    const tierInfo = tiers[selectedTier];
    const amount = tierInfo.price;

    alert(`✅ आपने ${tierInfo.name} चुना है (₹${amount})\n\nकृपया ₹${amount} इस UPI QR को स्कैन करके भेजें।\n\nPhone: 917838429605\n\nभेजने के बाद स्क्रीनशॉट लेकर WhatsApp पर भेज दें। हम जल्दी रिपोर्ट भेज देंगे।`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50 font-sans">
      <header className="bg-white border-b border-rose-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-rose-600 to-pink-600 rounded-2xl flex items-center justify-center text-white text-3xl">✋</div>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">HastRekha Expert</h1>
              <p className="text-sm text-rose-600">हस्त रेखा विशेषज्ञ • उत्तर भारत</p>
            </div>
          </div>
          <div className="text-sm text-zinc-500">12,000+ महिलाओं का भरोसा</div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-semibold leading-tight mb-6 text-gray-900">
            अपनी हथेली में छुपी<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-pink-600">अपनी कहानी</span> जानिए
          </h2>
          <p className="text-xl text-gray-600">Love • शादी • Career • भविष्य</p>
        </div>

        {/* Tiers */}
        <div className="grid md:grid-cols-4 gap-6 mb-20">
          {Object.entries(tiers).map(([key, tier]) => (
            <div 
              key={key}
              onClick={() => setSelectedTier(key as any)}
              className={`bg-white rounded-3xl p-8 cursor-pointer transition-all border ${selectedTier === key ? 'border-rose-600 shadow-xl' : 'border-gray-200 hover:border-rose-300'}`}
            >
              <h3 className="text-xl font-semibold mb-2">{tier.name}</h3>
              <p className="text-4xl font-bold text-rose-600 mb-6">₹{tier.price}</p>
              <p className="text-sm text-gray-600">{tier.hindi}</p>
              <p className="text-xs text-gray-500 mt-4">{tier.benefit}</p>
            </div>
          ))}
        </div>

        {/* Upload Section */}
        <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl p-10">
          <div className="text-center mb-10">
            <h3 className="text-3xl font-semibold mb-3">अपनी हथेली अपलोड करें</h3>
            <p className="text-gray-600">साफ फोटो अपलोड करें और अपनी रिपोर्ट पाएं</p>
          </div>

          {preview && (
            <div className="mb-8 rounded-2xl overflow-hidden border border-rose-200">
              <img src={preview} alt="Palm" className="w-full" />
            </div>
          )}

          <label className="block mb-8">
            <div className="border-2 border-dashed border-rose-300 hover:border-rose-500 rounded-3xl p-12 text-center cursor-pointer">
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              <p className="text-5xl mb-4">📸</p>
              <p className="font-medium">दाहिने हाथ की साफ फोटो अपलोड करें</p>
            </div>
          </label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <input
              type="email"
              placeholder="आपका ईमेल एड्रेस"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-5 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:border-rose-500"
            />
            <input
              type="tel"
              placeholder="WhatsApp नंबर (10 अंक)"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              maxLength={10}
              className="px-5 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:border-rose-500"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={!selectedFile || !email || !whatsapp || isLoading}
            className="w-full bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-semibold py-5 rounded-2xl text-lg transition-all disabled:opacity-50 mb-6"
          >
            {isLoading ? 'प्रोसेस हो रहा है...' : `${tiers[selectedTier].name} लें - ₹${tiers[selectedTier].price}`}
          </button>

          {/* UPI QR Code Section */}
          <div className="mt-8 p-8 border-2 border-dashed border-green-400 bg-green-50 rounded-3xl text-center">
            <h4 className="font-semibold text-green-700 mb-4">UPI से पेमेंट करें</h4>
            <p className="text-sm mb-6">नीचे दिए QR कोड को स्कैन करके ₹{tiers[selectedTier].price} भेजें</p>
            
            <div className="mx-auto mb-6 w-64 h-64 bg-white p-4 rounded-2xl shadow-inner">
              <img 
                src="https://files.oaiusercontent.com/file-VvN8vN8vN8vN8vN8vN8vN8vN?se=2026-04-30T00%3A00%3A00Z&sp=r&sv=2024-08-04&sr=b&rscc=max-age%3D31536000%2C%20immutable&rscd=attachment%3B%20filename%3Dphoto_6312291453748581112_x%20%281%29.jpg" 
                alt="UPI QR Code" 
                className="w-full h-full object-contain"
              />
            </div>

            <p className="font-mono text-lg font-medium text-green-800 mb-2">abhisheks529@icici</p>
            <p className="text-sm text-gray-600">Phone: 917838429605</p>
          </div>
        </div>
      </main>

      <footer className="bg-zinc-900 text-zinc-400 py-12 text-center text-sm">
        HastRekha Expert © 2026 • उत्तर भारत के लिए • मनोरंजन के लिए मात्र
      </footer>
    </div>
  );
}