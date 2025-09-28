
"use client";
import React, { useState, useEffect, useRef } from "react";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { useRouter } from "next/navigation";

const sections = [
    { id: "intro", label: "Introduction" },
    { id: "how-it-works", label: "How It Works" },
    { id: "advantages", label: "Advantages" },
];

const explanations = {
    intro: `How to Use VeilAccord\n\nIntroduction\n\nIn a world where job seekers face bias based on their background, identity, or circumstances, VeilAccord offers a revolutionary solution. Our decentralized platform, powered by SUI blockchain, ensures anonymity and fairness in the job market. With our tagline, "Unveil Potential, Veil Identities," we empower anyone—regardless of who they are—to connect with employers and secure opportunities based purely on their skills and work ethic.\n\nWhat is VeilAccord?\n\nVeilAccord is a web-based, decentralized job platform that connects employers with job seekers using anonymous profiles (wallets) on the SUI blockchain. Employers post job offers as smart contracts, job seekers apply and complete tasks, and payments are securely processed in cryptocurrency (SUI) upon validation. Designed by EPFL students, VeilAccord prioritizes privacy, fairness, and efficiency, making it ideal for anyone who might face discrimination in traditional hiring processes.\n\nHow Does It Work?\n\nVeilAccord leverages blockchain technology to create a secure, anonymous, and decentralized job marketplace. Here’s the high-level process:\n\n- Anonymous Profiles: Job seekers connect via crypto wallets, keeping their personal details hidden.\n- Job Offers as Smart Contracts: Employers post jobs as contracts on the SUI blockchain, outlining tasks and payment terms.\n- Application and Work: Job seekers apply for roles, complete the work, and employers validate completion.\n- Secure Payments: Payments are made in SUI cryptocurrency, ensuring fast and transparent transactions.\n\nThis decentralized approach eliminates intermediaries, reduces bias, and ensures trust through blockchain’s immutability.`,
    "how-it-works": "This is a placeholder for the How It Works section. You can add your explanation here.",
    advantages: "This is a placeholder for the Advantages section. You can add your explanation here.",
};

type SectionKey = 'intro' | 'how-it-works' | 'advantages';

export default function ExplainVAPage() {
    const [selectedSection, setSelectedSection] = useState<SectionKey>(sections[0].id as SectionKey);
    const account = useCurrentAccount();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);
    const redirectTimeout = useRef<NodeJS.Timeout | null>(null);
    useEffect(() => {
        if (mounted && !account) {
            redirectTimeout.current = setTimeout(() => {
                if (!account) router.replace("/");
            }, 300);
        }
        return () => {
            if (redirectTimeout.current) clearTimeout(redirectTimeout.current);
        };
    }, [account, router, mounted]);
    if (!mounted) return null;
    if (!account) return null;

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r p-6">
                <nav>
                    <ul className="space-y-2">
                        {sections.map((section) => (
                            <li key={section.id}>
                                <button
                                    className={`w-full text-left px-4 py-2 rounded font-semibold text-black ${
                                        selectedSection === section.id
                                            ? "bg-blue-100 border border-blue-300"
                                            : "hover:bg-gray-100 border border-transparent"
                                    }`}
                                    onClick={() => setSelectedSection(section.id as SectionKey)}
                                >
                                    {section.label}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-10">
                <h1 className="text-3xl font-bold mb-6">{sections.find(s => s.id === selectedSection)?.label}</h1>
                <div className="bg-white rounded shadow p-6">
                    {selectedSection === 'intro' ? (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-[#202c54] mb-2">How to Use VeilAccord</h2>
                            <h3 className="text-xl font-semibold text-blue-800 mb-1">Introduction</h3>
                            <p className="text-gray-700 text-base font-normal mb-4">
                                In a world where job seekers face bias based on their background, identity, or circumstances, VeilAccord offers a revolutionary solution. Our decentralized platform, powered by SUI blockchain, ensures anonymity and fairness in the job market. With our tagline, <span className="font-semibold italic">"Unveil Potential, Veil Identities,"</span> we empower anyone—regardless of who they are—to connect with employers and secure opportunities based purely on their skills and work ethic.
                            </p>
                            <h3 className="text-lg font-semibold text-blue-800 mb-1">What is VeilAccord?</h3>
                            <p className="text-gray-700 text-base font-normal mb-4">
                                VeilAccord is a web-based, decentralized job platform that connects employers with job seekers using anonymous profiles (wallets) on the SUI blockchain. Employers post job offers as smart contracts, job seekers apply and complete tasks, and payments are securely processed in cryptocurrency (SUI) upon validation. Designed by EPFL students, VeilAccord prioritizes privacy, fairness, and efficiency, making it ideal for anyone who might face discrimination in traditional hiring processes.
                            </p>
                            <h3 className="text-lg font-semibold text-blue-800 mb-1">How Does It Work?</h3>
                            <p className="text-gray-700 text-base font-normal mb-2">
                                VeilAccord leverages blockchain technology to create a secure, anonymous, and decentralized job marketplace. Here’s the high-level process:
                            </p>
                            <ul className="list-disc pl-6 text-gray-700 text-base font-normal space-y-1 mb-4">
                                <li><span className="font-medium">Anonymous Profiles:</span> Job seekers connect via crypto wallets, keeping their personal details hidden.</li>
                                <li><span className="font-medium">Job Offers as Smart Contracts:</span> Employers post jobs as contracts on the SUI blockchain, outlining tasks and payment terms.</li>
                                <li><span className="font-medium">Application and Work:</span> Job seekers apply for roles, complete the work, and employers validate completion.</li>
                                <li><span className="font-medium">Secure Payments:</span> Payments are made in SUI cryptocurrency, ensuring fast and transparent transactions.</li>
                            </ul>
                            <p className="text-gray-700 text-base font-normal">
                                This decentralized approach eliminates intermediaries, reduces bias, and ensures trust through blockchain’s immutability.
                            </p>
                        </div>
                    ) : selectedSection === 'how-it-works' ? (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-[#202c54] mb-2">Step-by-Step Guide to Using VeilAccord</h2>
                            <h3 className="text-xl font-semibold text-blue-800 mb-1">Getting Started</h3>
                            <p className="text-gray-700 text-base font-normal mb-2">Getting started with VeilAccord is simple. Follow these steps to find and complete jobs:</p>
                            <ol className="list-decimal pl-6 text-gray-700 text-base font-normal space-y-1 mb-4">
                                <li><span className="font-medium">Connect Your Wallet:</span> Set up a SUI-compatible crypto wallet (e.g., Sui Wallet) and connect it to VeilAccord’s web platform. No personal information is required.</li>
                                <li><span className="font-medium">Browse Job Listings:</span> Explore a variety of job offers posted by employers, from freelance gigs to short-term contracts.</li>
                                <li><span className="font-medium">Apply for a Job:</span> Select a job that matches your skills and submit an application through your anonymous wallet.</li>
                                <li><span className="font-medium">Complete the Work:</span> Once accepted, perform the job tasks as outlined in the smart contract.</li>
                                <li><span className="font-medium">Get Paid:</span> After the employer validates your work, payment in SUI is automatically transferred to your wallet.</li>
                            </ol>
                        </div>
                    ) : selectedSection === 'advantages' ? (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-[#202c54] mb-2">Advantages of VeilAccord</h2>
                            <p className="text-gray-700 text-base font-normal mb-2">Why choose VeilAccord over traditional job platforms? Here’s what sets us apart:</p>
                            <div className="overflow-x-auto">
                                <table className="min-w-full border border-blue-200 rounded-lg mb-6">
                                    <thead>
                                        <tr className="bg-blue-50">
                                            <th className="px-4 py-2 text-left text-blue-800 font-semibold text-base border-b">Advantage</th>
                                            <th className="px-4 py-2 text-left text-blue-800 font-semibold text-base border-b">Description</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="px-4 py-2 font-medium text-[#202c54] border-b">No Ads</td>
                                            <td className="px-4 py-2 text-gray-700 border-b">Enjoy a clean, distraction-free experience with zero advertisements.</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-2 font-medium text-[#202c54] border-b">Secure</td>
                                            <td className="px-4 py-2 text-gray-700 border-b">Blockchain-based smart contracts ensure your work and payments are protected.</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-2 font-medium text-[#202c54] border-b">Private</td>
                                            <td className="px-4 py-2 text-gray-700 border-b">Anonymous profiles let you showcase your skills without exposing personal details.</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-2 font-medium text-[#202c54] border-b">Fairness</td>
                                            <td className="px-4 py-2 text-gray-700 border-b">By veiling identities, we level the playing field for all job seekers.</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <h3 className="text-xl font-semibold text-blue-800 mb-1">Key Features</h3>
                            <ul className="list-disc pl-6 text-gray-700 text-base font-normal space-y-1 mb-4">
                                <li><span className="font-medium">Anonymity:</span> Apply for jobs without revealing your identity, reducing the risk of discrimination.</li>
                                <li><span className="font-medium">Fast Transactions:</span> Powered by SUI blockchain, payments are processed quickly and securely.</li>
                                <li><span className="font-medium">Secure Platform:</span> Blockchain ensures tamper-proof contracts and transparent interactions.</li>
                                <li><span className="font-medium">Decentralized:</span> No middleman—job seekers and employers connect directly, fostering trust and efficiency.</li>
                            </ul>
                            <h3 className="text-lg font-semibold text-blue-800 mb-1">Tips & Troubleshooting</h3>
                            <p className="text-gray-700 text-base font-normal">For pro tips, common issues, and frequently asked questions, visit the FAQ section on our website. It covers everything from wallet setup to resolving payment disputes, ensuring you have a smooth experience.</p>
                        </div>
                    ) : (
                        <p className="text-gray-700 text-base font-normal">{explanations[selectedSection]}</p>
                    )}
                </div>
            </main>
        </div>
    );
}
