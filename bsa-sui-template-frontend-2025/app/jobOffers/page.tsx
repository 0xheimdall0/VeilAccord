

"use client";
import React, { useState } from "react";
import './jobOffersScrollbar.css';
import jobCategories from "../jobCategories.json";

const jobOffers: { id: number; title: string; class: string }[] = [];

export default function JobOffersPage() {
    const [selectedClass, setSelectedClass] = useState("");
    const filteredOffers = jobOffers.filter((offer) => offer.class === selectedClass);

    return (
        <div className="min-h-screen flex items-start" style={{background: 'linear-gradient(135deg, #eaf6fd 0%, #f8fbff 60%, #70b5fa 100%)'}}>
            <aside
                className="sticky top-0 h-screen bg-white/80 shadow-lg flex flex-col items-stretch overflow-y-auto custom-scrollbar min-w-[220px] max-w-[260px] py-8 px-3 z-10"
                style={{ maxHeight: '100vh', marginLeft: 0, marginRight: 0, borderTopLeftRadius: 0, borderBottomLeftRadius: 0, left: 0 }}
            >
                <h2 className="text-lg font-bold text-[#202c54] mb-4 px-2">Domains</h2>
                <button
                    onClick={() => setSelectedClass("")}
                    className={`mb-2 px-4 py-2 rounded-lg border font-semibold text-base transition-colors text-left ${selectedClass === "" ? "bg-[#70b5fa] text-white border-[#70b5fa]" : "bg-white text-[#202c54] border-[#70b5fa] hover:bg-blue-100"}`}
                >
                    All
                </button>
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
                                <li key={offer.id} className="bg-white rounded-xl shadow p-6 text-[#202c54] font-semibold text-lg">
                                    {offer.title}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </main>
        </div>
    );
}