"use client";
import { useState, useRef } from "react";
import Image from "next/image";

const PLANS = [
  {
    id: "free",
    name: "Free Overview",
    nameHi: "मुफ्त ओवरव्यू",
    price: 0,
    desc: "बेसिक लाइन्स का सारांश",
    color: "from-gray-500 to-gray-700",
    badge: null,
  },
  {
    id: "detailed",
    name: "Detailed Report",
    nameHi: "विस्तृत रिपोर्ट",
    price: 21,
    desc: "4 मुख्य रेखाओं का पूरा विश्लेषण",
    color: "from-rose-500 to-pink-700",
    badge: "Most Popular",
  },
  {
    id: "premium",
    name: "Premium Report",
    nameHi: "प्रीमियम रिपोर्ट",
    price: 51,
    desc: "Gemstone सलाह + शादी की भविष्यवाणी",
    color: "from-amber-500 to-yellow-700",
    badge: "Best Value",
  },
  {
    id: "monthly",
    name: "Monthly Membership",
    nameHi: "मासिक सदस्यता",
    price: 121,
    desc: "हर महीने 5 रिपोर्ट्स",
    color: "from-purple-600 to-violet-800",
    badge: null,
  },
];

export default function Home() {
  const [selectedPlan, setSelectedPlan] = useState(PLANS[1]);
  const [step, setStep] = useState<"select" | "upload" | "payment" | "done">("select");
  const [image, setImage] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", txnId: "" });
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmitOrder = async () => {
    if (!form.name || !form.email || !form.phone || !image) {
      alert("कृपया सभी जानकारी भरें और फोटो अपलोड करें।");
      return;
    }
    if (selectedPlan.price > 0 && !form.txnId) {
      alert("कृपया Transaction ID / UTR नंबर दर्ज करें।");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          plan: selectedPlan.id,
          price: selectedPlan.price,
          image, // base64
        }),
      });
      const data = await res.json();
      if (data.orderId) {
        setOrderId(data.orderId);
        setStep("done");
      } else {
        alert("कुछ गलत हुआ। दोबारा कोशिश करें।");
      }
    } catch {
      alert("Server error. Please try again.");
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-rose-50 via-amber-50 to-pink-50 font-sans">
      {/* Header */}
      <header className="bg-gradient-to-r from-rose-800 to-pink-900 text-white py-6 px-4 text-center shadow-lg">
        <div className="text-4xl mb-1">✋</div>
        <h1 className="text-2xl font-bold tracking-wide">HastRekha Expert</h1>
        <p className="text-rose-200 text-sm mt-1">हस्त रेखा विशेषज्ञ • उत्तर भारत</p>
        <div className="mt-2 inline-block bg-amber-400 text-amber-900 text-xs font-bold px-3 py-1 rounded-full">
          ⭐ 12,000+ महिलाओं का भरोसा
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8">

        {/* Step 1: Plan Selection */}
        {step === "select" && (
          <>
            <h2 className="text-center text-xl font-bold text-rose-900 mb-6">
              अपना प्लान चुनें
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {PLANS.map((plan) => (
                <div
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan)}
                  className={`relative cursor-pointer rounded-2xl p-5 border-2 transition-all shadow-md ${
                    selectedPlan.id === plan.id
                      ? "border-rose-600 bg-white shadow-rose-200 scale-[1.02]"
                      : "border-transparent bg-white hover:border-rose-300"
                  }`}
                >
                  {plan.badge && (
                    <span className="absolute top-3 right-3 bg-rose-600 text-white text-xs px-2 py-0.5 rounded-full">
                      {plan.badge}
                    </span>
                  )}
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center text-white font-bold text-lg`}>
                      ₹{plan.price}
                    </div>
                    <div>
                      <div className="font-bold text-gray-800">{plan.nameHi}</div>
                      <div className="text-sm text-gray-500">{plan.desc}</div>
                    </div>
                    <div className="ml-auto">
                      {selectedPlan.id === plan.id ? (
                        <div className="w-6 h-6 rounded-full bg-rose-600 flex items-center justify-center text-white text-xs">✓</div>
                      ) : (
                        <div className="w-6 h-6 rounded-full border-2 border-gray-300" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => setStep("upload")}
              className="mt-6 w-full bg-gradient-to-r from-rose-600 to-pink-700 text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:opacity-90 transition"
            >
              {selectedPlan.nameHi} लें →
            </button>
          </>
        )}

        {/* Step 2: Upload + Details */}
        {step === "upload" && (
          <>
            <button onClick={() => setStep("select")} className="text-rose-700 mb-4 flex items-center gap-1 text-sm">
              ← वापस जाएं
            </button>
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-rose-900 mb-4 text-center">
                📸 हथेली की फोटो अपलोड करें
              </h2>

              {/* Image Upload */}
              <div
                onClick={() => fileRef.current?.click()}
                className="border-2 border-dashed border-rose-300 rounded-xl p-8 text-center cursor-pointer hover:bg-rose-50 transition mb-5"
              >
                {image ? (
                  <img src={image} alt="Palm" className="max-h-56 mx-auto rounded-xl object-contain" />
                ) : (
                  <>
                    <div className="text-5xl mb-3">✋</div>
                    <p className="text-gray-500 text-sm">दाहिने हाथ की साफ फोटो अपलोड करें</p>
                    <p className="text-xs text-gray-400 mt-1">JPG / PNG • अच्छी रोशनी में लें</p>
                  </>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />

              {/* Form */}
              <div className="space-y-3">
                {[
                  { key: "name", label: "आपका नाम *", placeholder: "जैसे: Priya Sharma", type: "text" },
                  { key: "email", label: "Email Address *", placeholder: "report इस पर भेजी जाएगी", type: "email" },
                  { key: "phone", label: "WhatsApp Number *", placeholder: "10 अंक", type: "tel" },
                ].map(({ key, label, placeholder, type }) => (
                  <div key={key}>
                    <label className="text-sm font-medium text-gray-700 block mb-1">{label}</label>
                    <input
                      type={type}
                      placeholder={placeholder}
                      value={form[key as keyof typeof form]}
                      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-400"
                    />
                  </div>
                ))}
              </div>

              <button
                onClick={() => {
                  if (!form.name || !form.email || !form.phone || !image) {
                    alert("कृपया सभी जानकारी भरें।");
                    return;
                  }
                  setStep(selectedPlan.price === 0 ? "done" : "payment");
                  if (selectedPlan.price === 0) handleSubmitOrder();
                }}
                className="mt-5 w-full bg-gradient-to-r from-rose-600 to-pink-700 text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:opacity-90 transition"
              >
                {selectedPlan.price === 0 ? "Free Report पाएं" : `₹${selectedPlan.price} पेमेंट करें →`}
              </button>
            </div>
          </>
        )}

        {/* Step 3: Payment */}
        {step === "payment" && (
          <>
            <button onClick={() => setStep("upload")} className="text-rose-700 mb-4 flex items-center gap-1 text-sm">
              ← वापस जाएं
            </button>
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-rose-900 mb-2 text-center">💳 UPI Payment</h2>
              <p className="text-center text-gray-500 text-sm mb-5">नीचे QR स्कैन करें और ₹{selectedPlan.price} भेजें</p>

              {/* QR CODE - from public folder */}
              <div className="flex justify-center mb-4">
                <div className="border-4 border-rose-100 rounded-2xl p-3 shadow-md">
                  <Image
                    src="/qr.jpg"          // ← rename your file to qr.jpg in /public
                    alt="UPI QR Code"
                    width={220}
                    height={220}
                    className="rounded-xl"
                    unoptimized
                  />
                </div>
              </div>

              <div className="text-center text-sm text-gray-600 mb-5 space-y-1">
                <p className="font-semibold text-rose-800">abhisheks529@icici</p>
                <p className="text-gray-400">या</p>
                <p className="font-bold text-lg text-gray-700">+91 78384 29605</p>
                <p className="text-amber-600 font-medium">Amount: ₹{selectedPlan.price}</p>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5">
                <p className="text-sm text-amber-800 font-medium">⚠️ पेमेंट के बाद नीचे UTR / Transaction ID डालें</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Transaction ID / UTR Number *</label>
                <input
                  type="text"
                  placeholder="12 अंक का UTR या Transaction ID"
                  value={form.txnId}
                  onChange={(e) => setForm({ ...form, txnId: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-400"
                />
              </div>

              <button
                onClick={handleSubmitOrder}
                disabled={loading}
                className="mt-4 w-full bg-gradient-to-r from-green-600 to-emerald-700 text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:opacity-90 transition disabled:opacity-50"
              >
                {loading ? "Submit हो रहा है..." : "✅ Submit करें"}
              </button>
            </div>
          </>
        )}

        {/* Step 4: Done */}
        {step === "done" && (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="text-6xl mb-4">🙏</div>
            <h2 className="text-2xl font-bold text-rose-900 mb-2">धन्यवाद!</h2>
            {selectedPlan.price === 0 ? (
              <p className="text-gray-600">आपकी Free Report तैयार की जा रही है।</p>
            ) : (
              <>
                <p className="text-gray-600 mb-2">आपका ऑर्डर प्राप्त हुआ।</p>
                <p className="text-sm text-gray-500">Payment verify होने के बाद <strong>{form.email}</strong> पर report भेजी जाएगी।</p>
                <div className="mt-4 bg-rose-50 rounded-xl p-4 text-sm text-rose-800">
                  Order ID: <span className="font-mono font-bold">{orderId}</span>
                </div>
              </>
            )}
            <p className="mt-4 text-sm text-gray-400">आमतौर पर 2-4 घंटे में report मिलती है।</p>
            <button
              onClick={() => { setStep("select"); setImage(null); setForm({ name: "", email: "", phone: "", txnId: "" }); }}
              className="mt-6 text-rose-600 underline text-sm"
            >
              नई Report के लिए यहाँ क्लिक करें
            </button>
          </div>
        )}

        <p className="text-center text-xs text-gray-400 mt-8">
          HastRekha Expert © 2026 • उत्तर भारत • मनोरंजन के लिए मात्र
        </p>
      </div>
    </main>
  );
}