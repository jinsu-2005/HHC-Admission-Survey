"use client";

export default function FloatingContact() {
  return (
    <a
      href="https://wa.me/918838517277?text=Hello,%20I%20am%20interested%20in%20Holy%20Cross%20College%20admission%20guidance."
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-lg shadow-green-500/30 transition-transform hover:scale-110 active:scale-95"
      aria-label="Contact us on WhatsApp"
    >
      <img src="/whattsapp.png" alt="WhatsApp" className="w-8 h-8 object-contain" />
    </a>
  );
}
