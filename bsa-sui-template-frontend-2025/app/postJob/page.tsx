
'use client';
import React, { useState } from 'react';
import jobCategories from "../jobCategories.json";


export default function PostJobPage() {
    const initialForm = {
        name: '',
        description: '',
        remuneration: '',
        credibility: 0,
        category: '',
        durationDetermined: '',
        duration: '',
    };
    const [form, setForm] = useState(initialForm);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [customMessage, setCustomMessage] = useState<string | null>(null);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: name === 'credibility' ? Number(value) : value,
        }));
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        setSuccess(false);
        setCustomMessage(null);

        // TODO: Replace with actual API call
        setTimeout(() => {
            setSubmitting(false);
            setSuccess(true);
            setCustomMessage('Your job offer has been submitted! Thank you.');
            setForm(initialForm);
        }, 1200);
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col items-center py-12">
            <div className="w-full max-w-xl bg-white rounded-xl shadow-lg p-8">
                <h1 className="text-3xl font-bold text-[#202c54] mb-2">Post a Job Offer</h1>
                <p className="text-blue-700 mb-6">Fill out the form below to post a new job offer. All fields are required.</p>
                {customMessage && (
                    <div className="text-green-700 font-semibold text-center py-8">{customMessage}</div>
                )}
                {!customMessage && (
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-blue-800 font-medium mb-1">Job Name</label>
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                required
                                className="w-full border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-[#202c54]"
                                placeholder="What is the job about?"
                            />
                        </div>
                        <div>
                            <label className="block text-blue-800 font-medium mb-1">Description</label>
                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                required
                                rows={4}
                                className="w-full border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-[#202c54]"
                                placeholder="What is needed exactly?"
                            />
                        </div>
                        <div>
                            <label className="block text-blue-800 font-medium mb-1">Remuneration (per hour)</label>
                            <input
                                type="number"
                                name="remuneration"
                                value={form.remuneration}
                                onChange={handleChange}
                                required
                                min={0}
                                step={0.01}
                                className="w-full border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-[#202c54]"
                                placeholder="What is the job's payout?"
                            />
                        </div>
                        <div>
                            <label className="block text-blue-800 font-medium mb-1">Is the duration of the work determined?</label>
                            <div className="flex gap-6 mt-2">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="durationDetermined"
                                        value="yes"
                                        checked={form.durationDetermined === 'yes'}
                                        onChange={handleChange}
                                        className="accent-[#70b5fa]"
                                        required
                                    />
                                    <span className="text-[#202c54]">Yes</span>
                                </label>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="durationDetermined"
                                        value="no"
                                        checked={form.durationDetermined === 'no'}
                                        onChange={handleChange}
                                        className="accent-[#70b5fa]"
                                        required
                                    />
                                    <span className="text-[#202c54]">No</span>
                                </label>
                            </div>
                        </div>
                        {form.durationDetermined === 'yes' && (
                            <div>
                                <label className="block text-blue-800 font-medium mb-1">Duration of the job</label>
                                <input
                                    type="text"
                                    name="duration"
                                    value={form.duration}
                                    onChange={handleChange}
                                    placeholder="e.g. 4 weeks, 2 months"
                                    required
                                    className="w-full border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-[#202c54]"
                                />
                            </div>
                        )}
                        <div>
                            <label className="block text-blue-800 font-medium mb-1">Category</label>
                            <select
                                name="category"
                                value={form.category}
                                onChange={handleChange}
                                required
                                className="w-full border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-[#202c54]"
                            >
                                <option value="" disabled>Select a category...</option>
                                {jobCategories.map((cat: string) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                        {error && <div className="text-red-600">{error}</div>}
                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 rounded transition"
                        >
                            {submitting ? 'Posting...' : 'Post Job'}
                        </button>
                    </form>
                )}
            </div>
        </main>
    );
}