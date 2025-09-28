"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";
import Image from "next/image";

// Assuming homePage uses a similar container and card style
export default function LandingPage() {
  const router = useRouter();
  const account = useCurrentAccount();

  useEffect(() => {
    if (account) {
      router.replace("/homePage");
    }
  }, [account, router]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center">
        <header className="flex flex-col items-center mb-8">
          <Image
            src="/veilaccord_logo.png"
            alt="VeilAccord Logo"
            width={80}
            height={80}
            className="mb-4"
          />
          <h1 className="text-3xl font-extrabold text-blue-700 mb-1">VeilAccord</h1>
          <p className="text-base text-gray-500 font-medium">
            Empowering Privacy, Enabling Trust
          </p>
        </header>
        <ConnectButton className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold text-lg shadow hover:bg-blue-700 transition mb-4" />
        <p className="text-gray-400 text-center text-sm">
          Connect your wallet to access the service.
        </p>

      </div>
    </main>
  );
}
