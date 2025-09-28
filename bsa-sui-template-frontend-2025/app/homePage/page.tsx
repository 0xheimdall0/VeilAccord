"use client";
import Link from "next/link";

import { useCurrentAccount } from "@mysten/dapp-kit";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const account = useCurrentAccount();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  useEffect(() => {
    if (mounted && !account) {
      router.replace("/");
    }
  }, [account, router, mounted]);
  if (!mounted) return null;
  if (!account) return null;
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
          <Link
            href="/jobOffers"
            className="bg-[#70b5fa] hover:bg-[#4fa3f7] text-white font-semibold px-8 py-3 rounded-lg shadow transition-colors text-lg text-center"
          >
            Browse job offers
          </Link>
          <Link
            href="/applyEmployer"
            className="bg-[#202c54] text-white font-semibold px-8 py-3 rounded-lg shadow hover:bg-[#31406e] transition-colors text-lg text-center"
          >
            Apply as employer
          </Link>
        </div>
      </section>
      <section
        className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center py-10 px-4 mt-4 mb-12 rounded-2xl shadow-lg border border-blue-100"
        style={{
          background: 'linear-gradient(135deg, #f3faff 0%, #f8fbff 60%, #b8d8fa 100%)'
        }}
      >
        <h2 className="text-2xl font-bold text-[#202c54] mb-4 text-center">About Us</h2>
        <div className="space-y-6">
          <p className="text-gray-700 text-base font-normal mb-2">
            VeilAccord was born during a hackathon in 2023, sparked by a shared frustration with discrimination in certain job markets. Our founders—<span className="font-semibold">Matteo Boscardin</span> (Frontend Developer & Graphic Designer), <span className="font-semibold">Egor Chernyshev</span> (Backend Developer & Marketing Manager), and <span className="font-semibold">Adrien Rossier</span> (Backend Developer & Community Manager)—are EPFL students dedicated to making a difference. Our mission is to make finding jobs easy for anyone, regardless of background, by leveraging the power of blockchain technology.
          </p>
          <p className="text-gray-700 text-base font-normal mb-2">
            We value <span className="font-semibold">trust</span>, <span className="font-semibold">fairness</span>, and <span className="font-semibold">innovation</span>, and we’re committed to reducing global unemployment rates by connecting talent with opportunity. As a team, we’re proud to have built VeilAccord on the fast and scalable SUI blockchain, and we’re excited to bring this platform to mobile devices in the future. Join us in unveiling potential while keeping identities veiled!
          </p>
        </div>
      </section>
    </div>
  );
}