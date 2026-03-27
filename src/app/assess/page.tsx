"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navigation from "@/components/Navigation";
import ChatInterface from "@/components/ChatInterface";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AssessPage() {
  const router = useRouter();
  const [completed, setCompleted] = useState(false);

  const handleComplete = (data: Record<string, unknown>) => {
    // Store assessment data in localStorage for the dashboard
    if (typeof window !== "undefined") {
      localStorage.setItem("futurewealth_assessment", JSON.stringify(data));
      localStorage.setItem("futurewealth_completed", "true");
    }
    setCompleted(true);
    // Navigate to dashboard after a brief delay
    setTimeout(() => {
      router.push("/dashboard");
    }, 2000);
  };

  return (
    <>
      <Navigation />
      <div className="pt-16 h-screen flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0 px-4 py-3 border-b border-white/5 flex items-center gap-3">
          <Link
            href="/"
            className="p-2 rounded-lg hover:bg-surface-light transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-slate-500" />
          </Link>
          <div>
            <h1 className="text-sm font-semibold text-white">Financial Life Assessment</h1>
            <p className="text-xs text-slate-500">12-minute guided conversation</p>
          </div>
        </div>

        {/* Chat or completion */}
        {completed ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center animate-fade-up">
              <div className="w-16 h-16 rounded-full bg-emerald/20 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-emerald" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Assessment Complete!</h2>
              <p className="text-slate-400">Building your financial future...</p>
            </div>
          </div>
        ) : (
          <ChatInterface onComplete={handleComplete} />
        )}
      </div>
    </>
  );
}
