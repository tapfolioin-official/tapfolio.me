"use client";

import React, { useEffect, useState } from "react";
import {
  Briefcase,
  MapPin,
  Tag,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  ExternalLink,
  Calendar,
  Mail,
  Phone,
  Home,
  Sparkles,
  GraduationCap,
  Award,
} from "lucide-react";

interface Job {
  id: number;
  title: string;
  dept: string;
  loc: string;
  type: string;
  createdAt: string;
}

interface Application {
  id: number;
  jobTitle: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  headline?: string;
  photoUrl?: string;
  resumeLink: string;
  coverLetter?: string;
  summary?: string;
  education?: string;
  experience?: string;
  createdAt: string;
}

export default function AdminCareersPage() {
  const [activeTab, setActiveTab] = useState<"requirements" | "submissions">("requirements");

  // State: Jobs Requirements
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [dept, setDept] = useState("Engineering");
  const [loc, setLoc] = useState("");
  const [type, setType] = useState("Full-time");

  // State: Submissions
  const [submissions, setSubmissions] = useState<Application[]>([]);
  const [expandedAppId, setExpandedAppId] = useState<number | null>(null);

  // Status Alerts
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const fetchJobs = async () => {
    try {
      const res = await fetch("/api/admin/careers");
      const data = await res.json();
      if (res.ok && data.success) {
        setJobs(data.jobs);
      }
    } catch (err) {
      console.error("Fetch jobs error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubmissions = async () => {
    try {
      const res = await fetch("/api/admin/careers/submissions");
      const data = await res.json();
      if (res.ok && data.success) {
        setSubmissions(data.submissions);
      }
    } catch (err) {
      console.error("Fetch applications error:", err);
    }
  };

  useEffect(() => {
    fetchJobs();
    fetchSubmissions();
  }, []);

  const handleAddJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMsg("");
    setErrorMsg("");

    if (!title || !loc) {
      setErrorMsg("Please fill in all required fields.");
      setIsSaving(false);
      return;
    }

    try {
      const res = await fetch("/api/admin/careers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, dept, loc, type }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMsg("Job requirement added successfully!");
        setTitle("");
        setLoc("");
        fetchJobs();
      } else {
        setErrorMsg(data.error || "Failed to add job requirement.");
      }
    } catch (err) {
      console.error("Add job requirement error:", err);
      setErrorMsg("A network error occurred. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteJob = async (id: number) => {
    if (!confirm("Are you sure you want to delete this position?")) return;

    setSuccessMsg("");
    setErrorMsg("");

    try {
      const res = await fetch(`/api/admin/careers?id=${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMsg("Job requirement deleted successfully!");
        fetchJobs();
      } else {
        setErrorMsg(data.error || "Failed to delete job requirement.");
      }
    } catch (err) {
      console.error("Delete job error:", err);
      setErrorMsg("A network error occurred. Please try again.");
    }
  };

  const handleDeleteSubmission = async (id: number) => {
    if (!confirm("Are you sure you want to archive/delete this applicant's form submission? This action is permanent.")) {
      return;
    }

    setSuccessMsg("");
    setErrorMsg("");

    try {
      const res = await fetch(`/api/admin/careers/submissions?id=${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMsg("Application submission deleted successfully!");
        fetchSubmissions();
        if (expandedAppId === id) setExpandedAppId(null);
      } else {
        setErrorMsg(data.error || "Failed to delete submission.");
      }
    } catch (err) {
      console.error("Delete application error:", err);
      setErrorMsg("A network error occurred. Please try again.");
    }
  };

  const toggleExpandApp = (id: number) => {
    setExpandedAppId(expandedAppId === id ? null : id);
  };

  return (
    <div className="flex flex-col gap-6 p-1 md:p-6 font-sans text-slate-100">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Careers Portal Admin</h1>
          <p className="text-sm text-slate-400 font-medium">Manage job openings and review submitted job applications.</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex bg-[#0d1322] p-1.5 rounded-xl border border-white/10 self-start md:self-auto">
          <button
            onClick={() => setActiveTab("requirements")}
            className={`px-4 py-2 text-xs font-bold rounded-lg cursor-pointer transition-all ${
              activeTab === "requirements"
                ? "bg-blue-600/30 text-sky-400 border border-sky-400/40 shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            📋 Job Requirements
          </button>
          <button
            onClick={() => setActiveTab("submissions")}
            className={`px-4 py-2 text-xs font-bold rounded-lg cursor-pointer transition-all ${
              activeTab === "submissions"
                ? "bg-blue-600/30 text-sky-400 border border-sky-400/40 shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            📥 Applications
          </button>
        </div>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 flex items-start gap-2.5 text-sm text-emerald-300">
          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-4 flex items-start gap-2.5 text-sm text-rose-300">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* REQUIREMENTS TAB */}
      {activeTab === "requirements" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form */}
          <form
            onSubmit={handleAddJob}
            className="lg:col-span-4 bg-[#0d1322] border border-white/10 rounded-2xl p-6 shadow-xl flex flex-col gap-4"
          >
            <h2 className="text-base font-bold text-white border-b border-white/10 pb-2 flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-sky-400" /> Add New Position
            </h2>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Position Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Lead React Developer"
                className="w-full bg-[#090d16] border border-white/10 focus:border-sky-400 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-400 transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Department</label>
              <select
                value={dept}
                onChange={(e) => setDept(e.target.value)}
                className="w-full bg-[#090d16] border border-white/10 focus:border-sky-400 rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-sky-400 transition-all cursor-pointer"
              >
                <option value="Engineering">Engineering</option>
                <option value="Product & Design">Product & Design</option>
                <option value="Growth & Operations">Growth & Operations</option>
                <option value="Sales & Marketing">Sales & Marketing</option>
                <option value="Human Resources">Human Resources</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Location</label>
              <input
                type="text"
                required
                value={loc}
                onChange={(e) => setLoc(e.target.value)}
                placeholder="e.g. Kochi, India / Hybrid"
                className="w-full bg-[#090d16] border border-white/10 focus:border-sky-400 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-400 transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Job Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-[#090d16] border border-white/10 focus:border-sky-400 rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-sky-400 transition-all cursor-pointer"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="w-full bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 disabled:opacity-50 text-white font-bold text-sm py-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 mt-2 shadow-lg shadow-sky-500/20"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} Add Position
            </button>
          </form>

          {/* Right Column: Listing Table */}
          <div className="lg:col-span-8 bg-[#0d1322] border border-white/10 rounded-2xl shadow-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-base font-bold text-white flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-sky-400" /> Active Positions
              </h2>
              <span className="text-xs font-bold bg-white/5 text-slate-300 px-3 py-1 rounded-full border border-white/10">
                {jobs.length} Positions
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/[0.02] border-b border-white/10">
                    <th className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider py-3.5 px-6">Position</th>
                    <th className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider py-3.5 px-6">Department</th>
                    <th className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider py-3.5 px-6">Location</th>
                    <th className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="py-12 text-center text-sm text-slate-400">
                        <Loader2 className="w-6 h-6 animate-spin mx-auto text-sky-400 mb-2" /> Loading requirements...
                      </td>
                    </tr>
                  ) : jobs.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-16 text-center text-sm text-slate-400">
                        No active jobs. Use form to create.
                      </td>
                    </tr>
                  ) : (
                    jobs.map((j) => (
                      <tr key={j.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex flex-col gap-0.5">
                            <span className="font-bold text-white text-sm leading-snug">{j.title}</span>
                            <span className="text-[10px] font-extrabold bg-blue-500/20 text-sky-300 px-2 py-0.5 rounded border border-blue-500/30 inline-block w-max uppercase tracking-wider">
                              {j.type}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-sm text-slate-300 font-semibold">{j.dept}</td>
                        <td className="py-4 px-6 text-xs text-slate-400 font-semibold">{j.loc}</td>
                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={() => handleDeleteJob(j.id)}
                            className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg p-2 cursor-pointer inline-flex border border-transparent transition-all"
                            title="Delete Position"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUBMISSIONS TAB */}
      {activeTab === "submissions" && (
        <div className="bg-[#0d1322] border border-white/10 rounded-2xl shadow-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-sky-400" /> Form Submissions (Careers)
            </h2>
            <span className="text-xs font-bold bg-white/5 text-slate-300 px-3 py-1 rounded-full border border-white/10">
              {submissions.length} Total Submissions
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/[0.02] border-b border-white/10">
                  <th className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider py-3.5 px-6">Applicant</th>
                  <th className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider py-3.5 px-6">Position</th>
                  <th className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider py-3.5 px-6">Date</th>
                  <th className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider py-3.5 px-6">Resume</th>
                  <th className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-16 text-center text-sm text-slate-400">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto text-sky-400 mb-2" />
                      Loading submissions...
                    </td>
                  </tr>
                ) : submissions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-20 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <Mail className="w-10 h-10 text-slate-500" />
                        <span className="text-sm font-semibold text-slate-300">No applications received yet</span>
                        <span className="text-xs text-slate-500">Submissions from candidate apply forms will appear here.</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  submissions.map((sub) => {
                    const isExpanded = expandedAppId === sub.id;
                    return (
                      <React.Fragment key={sub.id}>
                        {/* Summary Row */}
                        <tr className={`hover:bg-white/[0.02] transition-colors ${isExpanded ? "bg-white/[0.04]" : ""}`}>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              {sub.photoUrl ? (
                                <img
                                  src={sub.photoUrl}
                                  alt={`${sub.firstName} ${sub.lastName}`}
                                  className="w-9 h-9 rounded-full object-cover border border-white/10"
                                  onError={(e) => {
                                    (e.target as HTMLElement).style.display = "none";
                                  }}
                                />
                              ) : (
                                <div className="w-9 h-9 rounded-full bg-blue-500/20 text-sky-400 flex items-center justify-center font-bold text-sm border border-blue-500/30">
                                  {sub.firstName[0]}
                                  {sub.lastName[0]}
                                </div>
                              )}
                              <div className="flex flex-col gap-0.5">
                                <span className="font-bold text-white text-sm leading-none">
                                  {sub.firstName} {sub.lastName}
                                </span>
                                <span className="text-xs text-slate-400 font-semibold">{sub.email}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-sm text-slate-200 font-bold">{sub.jobTitle}</td>
                          <td className="py-4 px-6 text-xs text-slate-400 font-semibold">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-sky-400" />
                              {new Date(sub.createdAt).toLocaleDateString(undefined, {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <a
                              href={sub.resumeLink}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-xs text-sky-400 hover:text-sky-300 font-bold hover:underline"
                            >
                              Resume <ExternalLink className="w-3 h-3" />
                            </a>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <div className="inline-flex items-center gap-2">
                              <button
                                onClick={() => toggleExpandApp(sub.id)}
                                className={`p-2 rounded-lg border transition-all cursor-pointer ${
                                  isExpanded
                                    ? "bg-sky-500/20 border-sky-400/40 text-sky-300"
                                    : "text-slate-400 border-white/10 hover:bg-white/5 hover:text-white"
                                }`}
                                title={isExpanded ? "Hide Details" : "View Details"}
                              >
                                {isExpanded ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                              <button
                                onClick={() => handleDeleteSubmission(sub.id)}
                                className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg p-2 cursor-pointer border border-transparent transition-all"
                                title="Delete Submission"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>

                        {/* Expandable Details Block */}
                        {isExpanded && (
                          <tr>
                            <td colSpan={5} className="bg-white/[0.015] p-6 border-b border-white/10">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-300 leading-relaxed max-w-4xl">
                                {/* Contact and Identity */}
                                <div className="bg-[#090d16] border border-white/10 rounded-xl p-4 flex flex-col gap-3 shadow-sm">
                                  <h4 className="font-black text-[10px] uppercase tracking-widest text-sky-400">
                                    Candidate Details
                                  </h4>
                                  {sub.headline && (
                                    <div className="border-b border-white/10 pb-2">
                                      <span className="text-[10px] font-bold text-slate-500 block uppercase">Headline</span>
                                      <span className="font-bold text-white text-sm">{sub.headline}</span>
                                    </div>
                                  )}
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                    <div>
                                      <span className="text-[10px] font-bold text-slate-500 block uppercase">Phone</span>
                                      <span className="font-semibold text-slate-300 flex items-center gap-1 mt-0.5">
                                        <Phone className="w-3.5 h-3.5 text-slate-500" /> {sub.phone || "N/A"}
                                      </span>
                                    </div>
                                    <div>
                                      <span className="text-[10px] font-bold text-slate-500 block uppercase">Address</span>
                                      <span className="font-semibold text-slate-300 flex items-center gap-1 mt-0.5">
                                        <Home className="w-3.5 h-3.5 text-slate-500" /> {sub.address || "N/A"}
                                      </span>
                                    </div>
                                  </div>
                                  {sub.photoUrl && (
                                    <div className="mt-1">
                                      <span className="text-[10px] font-bold text-slate-500 block uppercase">Profile / Photo Link</span>
                                      <a
                                        href={sub.photoUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-sky-400 font-semibold hover:underline flex items-center gap-1 mt-0.5 break-all"
                                      >
                                        {sub.photoUrl} <ExternalLink className="w-3 h-3 shrink-0" />
                                      </a>
                                    </div>
                                  )}
                                </div>

                                {/* Summary & Qualifications */}
                                <div className="bg-[#090d16] border border-white/10 rounded-xl p-4 flex flex-col gap-3 shadow-sm">
                                  <h4 className="font-black text-[10px] uppercase tracking-widest text-sky-400">
                                    Qualifications
                                  </h4>
                                  {sub.summary && (
                                    <div>
                                      <span className="text-[10px] font-bold text-slate-500 block uppercase flex items-center gap-1">
                                        <Sparkles className="w-3 h-3" /> Summary
                                      </span>
                                      <p className="font-semibold text-slate-300 mt-1 bg-white/[0.02] p-2.5 rounded-lg border border-white/5 whitespace-pre-wrap">
                                        {sub.summary}
                                      </p>
                                    </div>
                                  )}
                                  {sub.education && (
                                    <div>
                                      <span className="text-[10px] font-bold text-slate-500 block uppercase flex items-center gap-1">
                                        <GraduationCap className="w-3.5 h-3.5" /> Education
                                      </span>
                                      <p className="font-semibold text-slate-300 mt-1 bg-white/[0.02] p-2.5 rounded-lg border border-white/5 whitespace-pre-wrap">
                                        {sub.education}
                                      </p>
                                    </div>
                                  )}
                                  {sub.experience && (
                                    <div>
                                      <span className="text-[10px] font-bold text-slate-500 block uppercase flex items-center gap-1">
                                        <Award className="w-3.5 h-3.5" /> Experience
                                      </span>
                                      <p className="font-semibold text-slate-300 mt-1 bg-white/[0.02] p-2.5 rounded-lg border border-white/5 whitespace-pre-wrap">
                                        {sub.experience}
                                      </p>
                                    </div>
                                  )}
                                </div>

                                {/* Cover Letter */}
                                {sub.coverLetter && (
                                  <div className="bg-[#090d16] border border-white/10 rounded-xl p-4 md:col-span-2 shadow-sm flex flex-col gap-1.5">
                                    <h4 className="font-black text-[10px] uppercase tracking-widest text-sky-400 flex items-center gap-1">
                                      ✉️ Cover Letter
                                    </h4>
                                    <p className="font-medium text-slate-300 bg-white/[0.02] p-3 rounded-lg border border-white/5 whitespace-pre-wrap leading-relaxed">
                                      {sub.coverLetter}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
