
export default function Home() {
  return (
  <div className="min-h-screen flex flex-col items-center justify-center" style={{background: 'linear-gradient(135deg, #eaf6fd 0%, #f8fbff 60%, #70b5fa 100%)'}}>
      <section className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center py-20 px-4">
          <img
            src="veilaccord_logo.png"
            alt="VeilAccord Logo"
            className="w-32 h-32 mb-8 rounded-2xl shadow-lg border-4 border-[#70b5fa] bg-white"
            style={{ background: '#fff' }}
          />
        <h1 className="text-5xl font-extrabold mb-4 tracking-tight text-[#202c54] text-center drop-shadow-sm">
          VeilAccord
        </h1>
        <p className="text-xl font-medium text-[#70b5fa] mb-2 text-center">
          Unveil Potential, Veil Identities.
        </p>
        <p className="text-base text-[#202c54] mb-8 text-center max-w-xl">
          Modern platform for your job search and offers. Secure, fast, simple.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center mt-4">
          <a
            href="/counter"
            className="bg-[#70b5fa] hover:bg-[#4fa3f7] text-white font-semibold px-8 py-3 rounded-lg shadow transition-colors text-lg text-center"
          >
            Discover job offers
          </a>
          <a
            href="/create"
            className="bg-[#202c54] text-white font-semibold px-8 py-3 rounded-lg shadow hover:bg-[#31406e] transition-colors text-lg text-center"
          >
            Apply as employer
          </a>
        </div>
      </section>
    </div>
  );
}