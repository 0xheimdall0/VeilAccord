"use client";
import React, { useState, useEffect } from "react";
import './jobOffersScrollbar.css';
import jobCategories from "../jobCategories.json";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { useRouter } from "next/navigation";

type JobOffer = {
    id: number;
    name: string;
    description: string;
    remuneration: number; // per job
    credibility: number; // simple score 0-5
    category: string;
    durationDetermined: 'yes' | 'no';
    duration?: string;
};

const jobOffers: JobOffer[] = [
    // Engineering
    { id: 1, name: "Frontend Engineer (React/Next.js)", description: "Build pixel-perfect UIs and optimize performance in a modern Next.js app.", remuneration: 18000, credibility: 4.6, category: "Engineering", durationDetermined: 'yes', duration: '3 months' },
    { id: 2, name: "Backend Engineer (Node.js)", description: "Design robust APIs and services using Node.js and Postgres.", remuneration: 12000, credibility: 4.3, category: "Engineering", durationDetermined: 'no' },
    { id: 3, name: "DevOps Engineer (AWS)", description: "Automate CI/CD and infrastructure with Terraform on AWS.", remuneration: 15000, credibility: 4.8, category: "Engineering", durationDetermined: 'yes', duration: '8 weeks' },

    // Design
    { id: 10, name: "Product Designer (Figma)", description: "Create user flows and high-fidelity prototypes for a SaaS dashboard.", remuneration: 8000, credibility: 4.2, category: "Design", durationDetermined: 'yes', duration: '6 weeks' },
    { id: 11, name: "UX Researcher (Remote)", description: "Conduct interviews and usability testing; synthesize insights.", remuneration: 5000, credibility: 4.1, category: "Design", durationDetermined: 'no' },

    // Marketing
    { id: 20, name: "Growth Marketer (B2B SaaS)", description: "Own experiments across paid, SEO, and lifecycle marketing.", remuneration: 7000, credibility: 4.0, category: "Marketing", durationDetermined: 'no' },
    { id: 21, name: "Content Strategist", description: "Plan and write authority content with a focus on conversions.", remuneration: 4000, credibility: 3.9, category: "Marketing", durationDetermined: 'yes', duration: '1 month' },

    // Sales
    { id: 30, name: "Account Executive (Mid-Market)", description: "Manage pipeline, demos, and negotiations for mid-market deals.", remuneration: 6000, credibility: 4.4, category: "Sales", durationDetermined: 'no' },
    { id: 31, name: "Sales Development Representative", description: "Qualify leads and book meetings for AEs.", remuneration: 9000, credibility: 3.8, category: "Sales", durationDetermined: 'yes', duration: '12 weeks' },

    // Operations
    { id: 40, name: "Operations Coordinator", description: "Improve internal processes and vendor management.", remuneration: 5000, credibility: 4.1, category: "Operations", durationDetermined: 'no' },

    // Healthcare
    { id: 50, name: "Registered Nurse (Night Shift)", description: "Provide patient care and coordinate with medical staff.", remuneration: 14000, credibility: 4.7, category: "Healthcare", durationDetermined: 'yes', duration: '2 months' },

    // Education
    { id: 60, name: "STEM Tutor (Part-Time)", description: "Tutor HS students in math and physics.", remuneration: 2000, credibility: 4.5, category: "Education", durationDetermined: 'no' },

    // Finance
    { id: 70, name: "Financial Analyst (FP&A)", description: "Build forecasts and support monthly business reviews.", remuneration: 12000, credibility: 4.2, category: "Finance", durationDetermined: 'yes', duration: '10 weeks' },

    // Information Technology
    { id: 80, name: "IT Support Specialist", description: "Resolve L1/L2 tickets and maintain asset inventory.", remuneration: 3500, credibility: 3.9, category: "Information Technology", durationDetermined: 'no' },

    // Legal
    { id: 90, name: "Paralegal (Corporate)", description: "Assist with contracts and entity management.", remuneration: 7000, credibility: 4.3, category: "Legal", durationDetermined: 'yes', duration: '6 weeks' },

    // Human Resources
    { id: 100, name: "HR Generalist", description: "Support recruiting, onboarding, and policy updates.", remuneration: 4500, credibility: 4.0, category: "Human Resources", durationDetermined: 'no' },

    // Customer Service
    { id: 110, name: "Customer Support Representative", description: "Handle tickets and improve help center content.", remuneration: 2800, credibility: 3.7, category: "Customer Service", durationDetermined: 'yes', duration: '4 weeks' },

    // Logistics
    { id: 120, name: "Logistics Coordinator", description: "Track shipments and optimize routes.", remuneration: 4000, credibility: 4.1, category: "Logistics", durationDetermined: 'no' },

    // Manufacturing
    { id: 130, name: "CNC Machine Operator", description: "Operate CNC machines and perform quality checks.", remuneration: 12000, credibility: 3.8, category: "Manufacturing", durationDetermined: 'yes', duration: '3 months' },

    // Construction
    { id: 140, name: "Site Supervisor", description: "Coordinate subcontractors and ensure safety compliance.", remuneration: 8000, credibility: 4.2, category: "Construction", durationDetermined: 'no' },

    // Hospitality
    { id: 150, name: "Hotel Front Desk Associate", description: "Deliver excellent guest service and manage reservations.", remuneration: 5000, credibility: 3.6, category: "Hospitality", durationDetermined: 'yes', duration: '2 months' },

    // Science & Research
    { id: 160, name: "Research Assistant (Biotech)", description: "Run assays and maintain lab notes.", remuneration: 6000, credibility: 4.4, category: "Science & Research", durationDetermined: 'no' },

    // Arts & Entertainment
    { id: 170, name: "Video Editor (Short-form)", description: "Edit short videos for social media.", remuneration: 3500, credibility: 4.0, category: "Arts & Entertainment", durationDetermined: 'yes', duration: '5 weeks' },

    // Government
    { id: 180, name: "Policy Analyst (Local Govt)", description: "Analyze proposals and prepare briefs.", remuneration: 7000, credibility: 4.1, category: "Government", durationDetermined: 'no' },

    // Nonprofit
    { id: 190, name: "Program Coordinator", description: "Coordinate volunteers and track impact metrics.", remuneration: 9000, credibility: 4.2, category: "Nonprofit", durationDetermined: 'yes', duration: '12 weeks' },

    // Agriculture
    { id: 200, name: "Farm Operations Assistant", description: "Assist with crop management and equipment upkeep.", remuneration: 3000, credibility: 3.7, category: "Agriculture", durationDetermined: 'no' },

    // Real Estate
    { id: 210, name: "Property Manager", description: "Oversee maintenance and tenant relations.", remuneration: 24000, credibility: 4.0, category: "Real Estate", durationDetermined: 'yes', duration: '6 months' },

    // Retail
    { id: 220, name: "Store Manager", description: "Lead store operations and team scheduling.", remuneration: 6000, credibility: 3.9, category: "Retail", durationDetermined: 'no' },

    // Energy
    { id: 230, name: "Solar Project Engineer", description: "Design solar systems and produce BOMs.", remuneration: 13000, credibility: 4.5, category: "Energy", durationDetermined: 'yes', duration: '10 weeks' },

    // Transportation
    { id: 240, name: "Fleet Manager", description: "Manage maintenance and compliance for fleet.", remuneration: 7500, credibility: 4.1, category: "Transportation", durationDetermined: 'no' },

    // Security
    { id: 250, name: "Security Operations Analyst", description: "Monitor alerts and triage incidents.", remuneration: 10000, credibility: 4.3, category: "Security", durationDetermined: 'yes', duration: '8 weeks' },

    // Media & Communication
    { id: 260, name: "Social Media Manager", description: "Plan content calendar and report on KPIs.", remuneration: 5000, credibility: 4.0, category: "Media & Communication", durationDetermined: 'no' },

    // Sports & Recreation
    { id: 270, name: "Fitness Coach (Certified)", description: "Lead group classes and 1:1 sessions.", remuneration: 4500, credibility: 4.2, category: "Sports & Recreation", durationDetermined: 'yes', duration: '9 weeks' },

    // Other
    { id: 280, name: "Office Administrator", description: "Support day-to-day office operations.", remuneration: 3500, credibility: 3.8, category: "Other", durationDetermined: 'no' },
];

export default function JobOffersPage() {
    const [selectedClass, setSelectedClass] = useState(jobCategories[0] || "");
    const filteredOffers = jobOffers.filter((offer) => offer.category === selectedClass);
    const account = useCurrentAccount();
    const router = useRouter();

    useEffect(() => {
        if (!account) {
            router.replace("/"); // Redirect to landing if not connected
        }
    }, [account, router]);

    if (!account) {
        // Prevents rendering any content before redirect
        return null;
    }

    return (
        <div className="min-h-screen flex items-start" style={{background: 'linear-gradient(135deg, #eaf6fd 0%, #f8fbff 60%, #70b5fa 100%)'}}>
            <aside
                className="sticky top-0 h-screen bg-white/80 shadow-lg flex flex-col items-stretch overflow-y-auto custom-scrollbar min-w-[220px] max-w-[260px] py-8 px-3 z-10"
                style={{ maxHeight: '100vh', marginLeft: 0, marginRight: 0, borderTopLeftRadius: 0, borderBottomLeftRadius: 0, left: 0 }}
            >
                <h2 className="text-lg font-bold text-[#202c54] mb-4 px-2">Domains</h2>
                {jobCategories.map((jobClass: string) => (
                    <button
                        key={jobClass}
                        onClick={() => setSelectedClass(jobClass)}
                        className={`mb-2 px-4 py-2 rounded-lg border font-semibold text-base transition-colors text-left ${selectedClass === jobClass ? "bg-[#70b5fa] text-white border-[#70b5fa]" : "bg-white text-[#202c54] border-[#70b5fa] hover:bg-blue-100"}`}
                    >
                        {jobClass}
                    </button>
                ))}
            </aside>
            <main className="flex-1 flex flex-col justify-center items-center w-full max-w-2xl min-h-screen px-4 mx-auto">
                <h1 className="text-5xl font-extrabold mb-4 tracking-tight text-[#202c54] text-center drop-shadow-sm">
                    Job Offers
                </h1>
                <p className="text-xl font-medium text-[#70b5fa] mb-6 text-center">
                    Find your next opportunity
                </p>
                <div className="w-full pb-20">
                    {filteredOffers.length === 0 ? (
                        <div className="bg-white rounded-xl shadow p-6 text-center text-[#202c54] font-medium">
                            No job offers in this category.
                        </div>
                    ) : (
                        <ul className="space-y-4">
                            {filteredOffers.map((offer) => (
                                <li key={offer.id} className="bg-white rounded-xl shadow p-6 text-[#202c54]">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-xl font-extrabold tracking-tight">{offer.name}</h3>
                                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-semibold">{offer.category}</span>
                                            </div>
                                            <p className="text-sm text-[#38507a] mb-3">{offer.description}</p>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                                                <div className="bg-blue-50 rounded-md px-3 py-2">
                                                    <span className="block text-[#38507a]">Remuneration</span>
                                                    <span className="font-semibold text-[#202c54]">${offer.remuneration.toFixed(2)} total</span>
                                                </div>
                                                <div className="bg-blue-50 rounded-md px-3 py-2">
                                                    <span className="block text-[#38507a]">Duration</span>
                                                    <span className="font-semibold text-[#202c54]">{offer.durationDetermined === 'yes' ? (offer.duration || 'Specified') : 'To be discussed'}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="shrink-0">
                                            <button
                                                onClick={() => alert(`You accepted: ${offer.name}`)}
                                                className="bg-[#70b5fa] hover:bg-blue-500 text-white font-semibold px-4 py-2 rounded-lg shadow"
                                            >
                                                Accept
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </main>
        </div>
    );
}