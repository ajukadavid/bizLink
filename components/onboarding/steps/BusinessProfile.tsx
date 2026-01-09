"use client";

import { useState } from "react";

interface BusinessProfileProps {
    onNext: (data: any) => void;
    onBack: () => void;
    initialData?: any;
}

export function BusinessProfile({ onNext, onBack, initialData = {} }: BusinessProfileProps) {
    const [formData, setFormData] = useState({
        businessName: initialData.businessName || "",
        registrationNumber: initialData.registrationNumber || "",
        taxId: initialData.taxId || "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onNext(formData);
    };

    return (
        <div className="space-y-8">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-gray-800">Business Details</h2>
                <p className="text-gray-500 mt-2">
                    Tell us about your company to get verified.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 max-w-lg mx-auto bg-white/40 backdrop-blur-md p-8 rounded-2xl border border-white/50 shadow-sm">
                <div className="space-y-2">
                    <label htmlFor="businessName" className="text-sm font-semibold text-gray-700 ml-1">Business Name</label>
                    <input
                        id="businessName"
                        name="businessName"
                        placeholder="e.g. Acme Corp"
                        required
                        value={formData.businessName}
                        onChange={handleChange}
                        className="flex h-12 w-full rounded-xl border border-gray-200 bg-white/60 px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="registrationNumber" className="text-sm font-semibold text-gray-700 ml-1">Registration Number (CAC)</label>
                    <input
                        id="registrationNumber"
                        name="registrationNumber"
                        placeholder="e.g. RC123456"
                        required
                        value={formData.registrationNumber}
                        onChange={handleChange}
                        className="flex h-12 w-full rounded-xl border border-gray-200 bg-white/60 px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="taxId" className="text-sm font-semibold text-gray-700 ml-1">Tax Identification Number <span className="text-gray-400 font-normal">(Optional)</span></label>
                    <input
                        id="taxId"
                        name="taxId"
                        placeholder="e.g. 1234-5678"
                        value={formData.taxId}
                        onChange={handleChange}
                        className="flex h-12 w-full rounded-xl border border-gray-200 bg-white/60 px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
                    />
                </div>

                <div className="flex gap-4 pt-6">
                    <button type="button" onClick={onBack} className="w-full h-12 inline-flex items-center justify-center rounded-xl text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400 disabled:opacity-50 border border-gray-200 bg-white/50 hover:bg-white text-gray-700 hover:text-gray-900 shadow-sm">
                        Back
                    </button>
                    <button type="submit" className="w-full h-12 inline-flex items-center justify-center rounded-xl text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400 disabled:opacity-50 bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg hover:-translate-y-0.5">
                        Next Step
                    </button>
                </div>
            </form>
        </div>
    );
}
