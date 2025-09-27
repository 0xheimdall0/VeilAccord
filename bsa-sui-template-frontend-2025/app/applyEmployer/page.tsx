
"use client";
import React, { useState } from "react";

export default function ApplyEmployerPage() {
    const [form, setForm] = useState({
        companyName: "",
        email: "",
        website: "",
        contactPerson: "",
        phone: "",
        description: "",
    });
    const [submitted, setSubmitted] = useState(false);

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        // TODO: handle form submission (API call)
        setSubmitted(true);
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col items-center py-12">
            <div className="w-full max-w-xl bg-white rounded-xl shadow-lg p-8">
                <h1 className="text-3xl font-bold text-blue-900 mb-2">Apply as Employer</h1>
                <p className="text-blue-700 mb-6">
                    Fill out the form below to register your company and start posting job offers. Your application will be reviewed as soon as possible.
                </p>
                {submitted ? (
                    <div className="text-green-700 font-semibold text-center py-8">
                        Thank you for applying! We will review your application and contact you soon.
                    </div>
                ) : (
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-blue-800 font-medium mb-1" htmlFor="companyName">
                                Company Name
                            </label>
                            <input
                                id="companyName"
                                name="companyName"
                                type="text"
                                required
                                value={form.companyName}
                                onChange={handleChange}
                                className="w-full border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-[#202c54]"
                            />
                        </div>
                        <div>
                            <label className="block text-blue-800 font-medium mb-1" htmlFor="email">
                                Company Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                value={form.email}
                                onChange={handleChange}
                                className="w-full border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-[#202c54]"
                                placeholder="company.email@company.com"
                            />
                        </div>
                        <div>
                            <label className="block text-blue-800 font-medium mb-1" htmlFor="website">
                                Company Website
                            </label>
                            <input
                                id="website"
                                name="website"
                                type="url"
                                value={form.website}
                                onChange={handleChange}
                                className="w-full border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-[#202c54]"
                                placeholder="https://yourcompany.com"
                            />
                        </div>
                        <div>
                            <label className="block text-blue-800 font-medium mb-1" htmlFor="contactPerson">
                                Contact Person
                            </label>
                            <input
                                id="contactPerson"
                                name="contactPerson"
                                type="text"
                                required
                                value={form.contactPerson}
                                onChange={handleChange}
                                className="w-full border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-[#202c54]"
                                placeholder="e.g. John Smith"
                            />
                        </div>
                        <div>
                            <label className="block text-blue-800 font-medium mb-1" htmlFor="phone">
                                Phone Number
                            </label>
                            <input
                                id="phone"
                                name="phone"
                                type="tel"
                                value={form.phone}
                                onChange={handleChange}
                                className="w-full border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-[#202c54]"
                                placeholder="+1 234 567 890"
                            />
                        </div>
                        <div>
                            <label className="block text-blue-800 font-medium mb-1" htmlFor="description">
                                Company Description
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                className="w-full border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-[#202c54]"
                                rows={4}
                                required
                                value={form.description}
                                onChange={handleChange}
                                placeholder="Tell us about your company..."
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 rounded transition"
                        >
                            Submit Application
                        </button>
                    </form>
                )}
            </div>
        </main>
    );
}