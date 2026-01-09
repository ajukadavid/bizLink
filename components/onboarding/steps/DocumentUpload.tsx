"use client";

import { useState } from "react";
import { Upload, FileText, X } from "lucide-react";

interface DocumentUploadProps {
    onNext: (data: any) => void;
    onBack: () => void;
}

export function DocumentUpload({ onNext, onBack }: DocumentUploadProps) {
    const [files, setFiles] = useState<any[]>([]);

    // Mock file upload handler
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFiles((prev) => [
                ...prev,
                { name: file.name, size: (file.size / 1024).toFixed(2) + " KB" }
            ]);
        }
    };

    const removeFile = (index: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-8">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-gray-800">Verification Documents</h2>
                <p className="text-gray-500 mt-2">
                    Upload your CAC registration and other required documents.
                </p>
            </div>

            <div className="max-w-lg mx-auto space-y-6 bg-white/40 backdrop-blur-md p-8 rounded-2xl border border-white/50 shadow-sm">
                <div className="border-2 border-dashed border-green-200 bg-green-50/30 rounded-2xl p-10 text-center hover:bg-green-50/50 hover:border-green-300 transition-all duration-300 group cursor-pointer relative">
                    <input
                        type="file"
                        id="file-upload"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        onChange={handleFileChange}
                    />
                    <div className="flex flex-col items-center pointer-events-none">
                        <div className="p-4 bg-white rounded-full shadow-sm mb-4 group-hover:scale-110 transition-transform duration-300">
                            <Upload className="w-8 h-8 text-green-500" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-1">Click to Valid Upload</h3>
                        <p className="text-sm text-gray-500">
                            PDF, JPG, or PNG (Max 5MB)
                        </p>
                    </div>
                </div>

                {/* File List */}
                {files.length > 0 && (
                    <div className="space-y-3">
                        {files.map((file, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-white/60 border border-gray-100 rounded-xl shadow-sm">
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-green-100 rounded-lg">
                                        <FileText className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-800">{file.name}</p>
                                        <p className="text-xs text-gray-500">{file.size}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => removeFile(i)}
                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex gap-4 pt-6">
                    <button type="button" onClick={onBack} className="w-full h-12 inline-flex items-center justify-center rounded-xl text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400 disabled:opacity-50 border border-gray-200 bg-white/50 hover:bg-white text-gray-700 hover:text-gray-900 shadow-sm">
                        Back
                    </button>
                    <button onClick={() => onNext({ files })} className="w-full h-12 inline-flex items-center justify-center rounded-xl text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400 disabled:opacity-50 bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg hover:-translate-y-0.5">
                        Submit Documents
                    </button>
                </div>
            </div>
        </div>
    );
}
