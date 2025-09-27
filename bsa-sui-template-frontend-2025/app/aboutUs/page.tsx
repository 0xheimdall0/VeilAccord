
"use client";
import React from "react";

export default function AboutUs() {
    return (
        <div className="flex min-h-screen bg-gray-50">
            <main className="flex-1 p-10 flex flex-col items-center justify-center">
                <div className="bg-white rounded shadow p-8 max-w-2xl w-full">
                    <h1 className="text-3xl font-bold text-[#202c54] mb-6 text-center">About Us</h1>
                    <div className="space-y-6">
                        <p className="text-gray-700 text-base font-normal mb-2">
                            VeilAccord was born during a hackathon in 2023, sparked by a shared frustration with discrimination in certain job markets. Our founders—<span className="font-semibold">Matteo Boscardin</span> (Frontend Developer & Graphic Designer), <span className="font-semibold">Egor Chernyshev</span> (Backend Developer & Marketing Manager), and <span className="font-semibold">Adrien Rossier</span> (Backend Developer & Community Manager)—are EPFL students dedicated to making a difference. Our mission is to make finding jobs easy for anyone, regardless of background, by leveraging the power of blockchain technology.
                        </p>
                        <p className="text-gray-700 text-base font-normal mb-2">
                            We value <span className="font-semibold">trust</span>, <span className="font-semibold">fairness</span>, and <span className="font-semibold">innovation</span>, and we’re committed to reducing global unemployment rates by connecting talent with opportunity. As a team, we’re proud to have built VeilAccord on the fast and scalable SUI blockchain, and we’re excited to bring this platform to mobile devices in the future. Join us in unveiling potential while keeping identities veiled!
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}