"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Mail, User, Phone, Link as LinkIcon, FileText, CheckCircle2, AlertCircle, Briefcase, Info } from "lucide-react";

function ApplyFormContent() {
  const searchParams = useSearchParams();
  const title = searchParams.get("title") || "Job Application";
  const dept = searchParams.get("dept") || "Operations";
  const loc = searchParams.get("loc") || "Remote";

  // Form states
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [headline, setHeadline] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [resumeLink, setResumeLink] = useState("");
  const [summary, setSummary] = useState("");
  const [education, setEducation] = useState("");
  const [experience, setExperience] = useState("");
  const [message, setMessage] = useState(""); // Cover Letter
  const [customAccessKey, setCustomAccessKey] = useState("");
  
  // Submission states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  // Retrieve custom access key from localStorage on mount
  useEffect(() => {
    const savedKey = localStorage.getItem("tapfolio_web3forms_key");
    if (savedKey) {
      setCustomAccessKey(savedKey);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");
    setErrorMessage("");

    const envKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;
    const finalAccessKey = (customAccessKey || envKey || "").trim();

    if (!finalAccessKey) {
      setIsSubmitting(false);
      setSubmitStatus("error");
      setErrorMessage("Missing Web3Forms Access Key. Please provide an access key in your .env or paste it in the field below.");
      return;
    }

    if (customAccessKey) {
      localStorage.setItem("tapfolio_web3forms_key", customAccessKey);
    }

    try {
      const response = await fetch("/api/careers/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          access_key: finalAccessKey,
          job_title: title,
          department: dept,
          location: loc,
          first_name: firstName,
          last_name: lastName,
          email: email,
          headline: headline,
          phone: phone,
          address: address,
          photo_or_profile_url: photoUrl,
          resume_link: resumeLink,
          summary: summary,
          education: education,
          experience: experience,
          cover_letter: message,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitStatus("success");
        
        // Success Action: Auto-close after 2.5 seconds or redirect
        setTimeout(() => {
          if (window.opener) {
            window.close();
          } else {
            window.location.href = "/careers";
          }
        }, 2500);
      } else {
        setSubmitStatus("error");
        setErrorMessage(data.message || "Failed to submit application to Web3Forms.");
      }
    } catch (error) {
      console.error("Web3Forms submission error:", error);
      setSubmitStatus("error");
      setErrorMessage("A network error occurred. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasEnvKey = !!process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;

  return (
    <div className="max-w-2xl w-full bg-slate-900/40 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden flex flex-col gap-6 my-8">
      {/* Spotlight Gradient Backdrop */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />
      
      {/* Header */}
      <div className="flex flex-col gap-1 z-10">
        <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest flex items-center gap-1.5">
          <Briefcase className="w-3.5 h-3.5" /> Dynamic Application
        </span>
        <h1 className="text-2xl font-bold text-white leading-snug">
          Apply for {title}
        </h1>
        <span className="text-xs text-slate-400">
          {dept} • {loc}
        </span>
      </div>

      {submitStatus === "success" ? (
        <div className="flex flex-col items-center justify-center text-center py-12 gap-4 z-10 animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h4 className="text-lg font-bold text-white">Application Submitted!</h4>
          <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
            Thank you for applying to Tapfolio. Your information has been successfully forwarded to our careers inbox via Web3Forms.
          </p>
          <span className="text-[11px] text-slate-500 animate-pulse mt-2">
            Closing window and returning to careers portal...
          </span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 z-10">
          {submitStatus === "error" && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-red-400">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="text-[10px] text-slate-500 text-right uppercase tracking-wider font-semibold">
            * Required fields
          </div>

          {/* Section 1: Personal Information */}
          <div className="flex flex-col gap-4 border-b border-slate-800 pb-6">
            <h4 className="text-xs font-black text-blue-400 uppercase tracking-widest">
              Personal Information
            </h4>

            {/* Name Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="John"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Doe"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-300">
                  Phone
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 99999 99999"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                />
                <span className="text-[10px] text-slate-500 flex items-start gap-1">
                  <Info className="w-3 h-3 shrink-0 mt-0.5" />
                  The hiring team may use this number to contact you about this job.
                </span>
              </div>
            </div>

            {/* Address & Headline */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-300">
                  Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Kanayannur, India"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                />
                <span className="text-[10px] text-slate-500 flex items-start gap-1">
                  <Info className="w-3 h-3 shrink-0 mt-0.5" />
                  Include your city, region, and country, so that employers can easily manage your application.
                </span>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-300">
                  Headline
                </label>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="Senior Software Engineer / Product Designer"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>
            </div>

            {/* Photo Link */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-300">
                Photo / Profile URL
              </label>
              <input
                type="url"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                placeholder="https://example.com/photo.jpg or LinkedIn profile link"
                className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>

          {/* Section 2: Professional Profile */}
          <div className="flex flex-col gap-4 border-b border-slate-800 pb-6">
            <h4 className="text-xs font-black text-blue-400 uppercase tracking-widest">
              Professional Profile
            </h4>

            {/* Resume Link */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1">
                Resume Link <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                required
                value={resumeLink}
                onChange={(e) => setResumeLink(e.target.value)}
                placeholder="https://drive.google.com/file/d/... or portfolio URL"
                className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>

            {/* Summary */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-300">
                Summary
              </label>
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Briefly summarize your professional background..."
                className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500 h-20 resize-none transition-all"
              />
            </div>

            {/* Education */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-300">
                Education
              </label>
              <textarea
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                placeholder="Degree, Institution, Graduation Year, etc."
                className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500 h-20 resize-none transition-all"
              />
            </div>

            {/* Experience */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-300">
                Experience
              </label>
              <textarea
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                placeholder="Relevant work history, companies, roles, and accomplishments..."
                className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500 h-24 resize-none transition-all"
              />
            </div>
          </div>

          {/* Section 3: Cover Letter */}
          <div className="flex flex-col gap-4">
            <h4 className="text-xs font-black text-blue-400 uppercase tracking-widest">
              Details
            </h4>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-300">
                Cover letter (Optional)
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us why you are excited to join Tapfolio..."
                className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500 h-28 resize-none transition-all"
              />
            </div>
          </div>

          {/* Access Key fallback */}
          {!hasEnvKey && (
            <div className="flex flex-col gap-1.5 border-t border-slate-800/80 pt-4 mt-2">
              <label className="text-xs font-bold text-blue-400 uppercase tracking-wide flex items-center gap-1.5">
                🔑 Web3Forms Access Key
              </label>
              <input
                type="text"
                required
                value={customAccessKey}
                onChange={(e) => setCustomAccessKey(e.target.value)}
                placeholder="Paste your Web3Forms Access Key here"
                className="w-full bg-slate-950/80 border border-blue-900/30 focus:border-blue-500 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800/50 text-white font-bold text-sm py-3.5 rounded-xl cursor-pointer transition-all mt-2 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting Application...
              </>
            ) : (
              "Submit Form"
            )}
          </button>
        </form>
      )}
    </div>
  );
}

export default function ApplyPage() {
  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 font-sans flex items-center justify-center p-4">
      <Suspense fallback={
        <div className="text-sm text-slate-400">Loading form parameters...</div>
      }>
        <ApplyFormContent />
      </Suspense>
    </div>
  );
}
