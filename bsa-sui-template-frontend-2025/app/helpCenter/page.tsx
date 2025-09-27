
"use client";
import React from "react";
import Link from "next/link";

const faqs = [
    {
        question: "How do I reset my password?",
        answer:
            "Go to your account settings, click on 'Change Password', and follow the instructions.",
    },
    {
        question: "Where can I find my transaction history?",
        answer:
            "Navigate to the Dashboard and select 'Transaction History' from the sidebar.",
    },
    {
        question: "How do I contact support?",
        answer:
            "Use the contact form below or reach out via our social media channels.",
    },
];

const socialLinks = [
    {
        name: "Twitter",
        url: "https://twitter.com/yourproject",
        icon: (
            <svg width="20" height="20" fill="currentColor" aria-hidden="true">
                <path d="M20 3.924a8.19 8.19 0 0 1-2.357.646A4.117 4.117 0 0 0 19.448 2.3a8.224 8.224 0 0 1-2.605.996A4.107 4.107 0 0 0 9.85 6.03a11.65 11.65 0 0 1-8.457-4.287a4.106 4.106 0 0 0 1.27 5.482A4.073 4.073 0 0 1 .8 6.575v.052a4.107 4.107 0 0 0 3.292 4.025a4.095 4.095 0 0 1-1.853.07a4.108 4.108 0 0 0 3.834 2.85A8.233 8.233 0 0 1 0 17.544a11.616 11.616 0 0 0 6.29 1.844c7.547 0 11.675-6.155 11.675-11.495c0-.175-.004-.349-.012-.522A8.18 8.18 0 0 0 20 3.924z" />
            </svg>
        ),
    },
    {
        name: "Discord",
        url: "https://discord.gg/yourproject",
        icon: (
            <svg width="20" height="20" fill="currentColor" aria-hidden="true">
                <path d="M17 4.5A3.5 3.5 0 0 0 13.5 1h-7A3.5 3.5 0 0 0 3 4.5v11A3.5 3.5 0 0 0 6.5 19h7a3.5 3.5 0 0 0 3.5-3.5v-11zM8.5 8a1.5 1.5 0 1 1 0 3a1.5 1.5 0 0 1 0-3zm3 0a1.5 1.5 0 1 1 0 3a1.5 1.5 0 0 1 0-3z" />
            </svg>
        ),
    },
    {
        name: "Telegram",
        url: "https://t.me/yourproject",
        icon: (
            <svg width="20" height="20" fill="currentColor" aria-hidden="true">
                <path d="M19.5 3.5l-3.5 15a1 1 0 0 1-1.5.6l-4.2-3.1l-2 1.9a.5.5 0 0 1-.8-.2l-1.2-3.7l-3.7-1.2a.5.5 0 0 1-.2-.8l1.9-2l-3.1-4.2A1 1 0 0 1 2.5 3.5l15-3.5a1 1 0 0 1 1.2 1.2z" />
            </svg>
        ),
    },
];

export default function HelpCenterPage() {
    const initialForm = { email: '', category: '', message: '' };
    const [form, setForm] = React.useState(initialForm);
    const [customMessage, setCustomMessage] = React.useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setCustomMessage(null);
        // Simulate async submit
        setTimeout(() => {
            setCustomMessage('Your support request has been submitted! Thank you.');
            setForm(initialForm);
        }, 1000);
    };

    return (
        <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-blue-50 to-blue-100 py-12">
            <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8">
                <h1 className="text-3xl font-bold mb-8 text-center text-[#202c54]">Help Center</h1>
                <section className="mb-12">
                    <h2 className="text-2xl font-semibold mb-6 text-[#202c54]">Frequently Asked Questions</h2>
                    <div className="space-y-6">
                        {faqs.map((faq, idx) => (
                            <div key={idx} className="bg-blue-50 rounded-lg p-5 shadow">
                                <h3 className="font-medium text-lg mb-2 text-[#202c54]">{faq.question}</h3>
                                <p className="text-gray-700">{faq.answer}</p>
                            </div>
                        ))}
                    </div>
                </section>
                <section>
                    <h2 className="text-2xl font-semibold mb-6 text-[#202c54] text-center">Contact & Social</h2>
                    <div className="flex flex-col items-center justify-center">
                        <ul className="flex flex-wrap gap-4 mb-8 justify-center">
                            {socialLinks.map((link) => (
                                <li key={link.name} className="list-none">
                                    <Link
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 rounded transition justify-center text-black"
                                    >
                                        {link.icon}
                                        <span className="font-medium text-black">{link.name}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        {customMessage && (
                            <div className="text-green-700 font-semibold text-center py-8 w-full">{customMessage}</div>
                        )}
                        {!customMessage && (
                        <form
                            className="bg-blue-50 rounded-lg p-6 shadow space-y-4 max-w-2xl w-full mx-auto"
                            onSubmit={handleSubmit}
                        >
                            <h3 className="text-lg font-medium mb-2 text-[#202c54] text-center">Contact Support</h3>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-black" htmlFor="email">
                                    Email<span className="text-red-500 ml-1">*</span>
                                </label>
                                <input
                                    className="w-full border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
                                    type="email"
                                    id="email"
                                    name="email"
                                    required
                                    autoComplete="email"
                                    value={form.email}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-black" htmlFor="category">
                                    Category<span className="text-red-500 ml-1">*</span>
                                </label>
                                <select
                                    className="w-full border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
                                    id="category"
                                    name="category"
                                    required
                                    value={form.category}
                                    onChange={handleChange}
                                >
                                    <option value="" disabled>Select a category...</option>
                                    <option value="account">Account/Login Issue</option>
                                    <option value="payment">Payment/Billing</option>
                                    <option value="job-posting">Job Posting Problem</option>
                                    <option value="application">Application/Job Search</option>
                                    <option value="bug">Bug/Error Report</option>
                                    <option value="feedback">Feedback/Suggestion</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-black" htmlFor="message">
                                    Message<span className="text-red-500 ml-1">*</span>
                                </label>
                                <textarea
                                    className="w-full border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
                                    id="message"
                                    name="message"
                                    rows={4}
                                    required
                                    value={form.message}
                                    onChange={handleChange}
                                />
                            </div>
                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition w-full"
                            >
                                Send
                            </button>
                        </form>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}