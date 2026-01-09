"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Wizard } from "@/components/onboarding/Wizard";
import { RoleSelection } from "@/components/onboarding/steps/RoleSelection";
import { BusinessProfile } from "@/components/onboarding/steps/BusinessProfile";
import { DocumentUpload } from "@/components/onboarding/steps/DocumentUpload";
import { InvestorPreferences } from "@/components/onboarding/steps/InvestorPreferences";
import AnimatedBackground from "@/components/onboarding/AnimatedBackground";

export default function OnboardingPage() {
    const router = useRouter();
    const createBusiness = useMutation(api.onboarding.createBusinessProfile);
    const createInvestor = useMutation(api.onboarding.createInvestorProfile);

    const [step, setStep] = useState(0);
    const [role, setRole] = useState<"business" | "investor" | null>(null);
    const [direction, setDirection] = useState(1);
    const [formData, setFormData] = useState<any>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleRoleSelect = (selected: "business" | "investor") => {
        setRole(selected);
        handleNext({});
    };

    const handleNext = (data: any = {}) => {
        setFormData((prev: any) => ({ ...prev, ...data }));
        setDirection(1);
        setStep((prev) => prev + 1);
    };

    const handleBack = () => {
        setDirection(-1);
        setStep((prev) => prev - 1);
    };

    const handleBusinessSubmit = async (data: any) => {
        setIsSubmitting(true);
        try {
            // Merge final step data
            const finalData = { ...formData, ...data };

            // Transform files to schema format (MOCK)
            const documents = finalData.files?.map((f: any) => ({
                type: "generic_doc",
                url: `https://mock-storage.com/${f.name}`,
                status: "pending"
            })) || [];

            await createBusiness({
                businessName: finalData.businessName,
                registrationNumber: finalData.registrationNumber,
                taxId: finalData.taxId,
                documents,
            });

            router.push("/dashboard"); // Redirect after success
        } catch (error) {
            console.error("Onboarding failed:", error);
            alert("Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInvestorSubmit = async (data: any) => {
        setIsSubmitting(true);
        try {
            const finalData = { ...formData, ...data };

            await createInvestor({
                sectors: finalData.sectors,
                capitalRange: finalData.capitalRange,
                riskAppetite: finalData.riskAppetite,
                geography: [], // TODO: Add geography step or field
            });

            router.push("/dashboard");
        } catch (error) {
            console.error("Onboarding failed:", error);
            alert("Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Determine which component to render based on step index and role
    const renderStep = () => {
        // Shared Step 0: Role Selection
        if (step === 0) {
            return <RoleSelection onSelect={handleRoleSelect} />;
        }

        // Business Flow
        if (role === "business") {
            switch (step) {
                case 1:
                    return <BusinessProfile onNext={handleNext} onBack={handleBack} initialData={formData} />;
                case 2:
                    return <DocumentUpload onNext={handleBusinessSubmit} onBack={handleBack} />;
                default:
                    return null;
            }
        }

        // Investor Flow
        if (role === "investor") {
            switch (step) {
                case 1:
                    return <InvestorPreferences onNext={handleInvestorSubmit} onBack={handleBack} initialData={formData} />;
                default:
                    return null;
            }
        }

        return null;
    };

    return (
        <main className="min-h-screen bg-transparent relative flex flex-col items-center justify-center p-4 selection:bg-green-100">
            <AnimatedBackground />

            <div className="w-full max-w-4xl z-10 relative">
                {/* Progress Bar */}
                <div className="mb-12 max-w-2xl mx-auto">
                    <div className="h-1.5 w-full bg-green-100/50 rounded-full overflow-hidden backdrop-blur-sm">
                        <div
                            className="h-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-700 ease-out rounded-full shadow-[0_0_10px_rgba(74,222,128,0.3)]"
                            style={{ width: `${((step + 1) / (role === 'business' ? 3 : 2)) * 100}%` }}
                        />
                    </div>
                </div>

                <Wizard step={step} direction={direction}>
                    {renderStep()}
                </Wizard>
            </div>
        </main>
    );
}
