"use client";

import React, { useEffect, useState } from "react";
import { Briefcase, MapPin, Tag, Plus, Trash2, CheckCircle2, AlertCircle, Loader2, Eye, EyeOff, ExternalLink, Calendar, Mail, Phone, Home, Sparkles, GraduationCap, Award } from "lucide-react";

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
  summary?: string;
  education?: string;
  experience?: string;
  coverLetter?: string;
  createdAt: string;
}

export default function AdminCareersPage() {
  const [activeTab, setActiveTab] = useState<"requirements" | "submissions">("requirements");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [submissions, setSubmissions] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Expanded submission ID state
  const [expandedAppId, setExpandedAppId] = useState<number | null>(null);

  // Form states (Job Requirements)
  const [title, setTitle] = useState("");
  const [dept, setDept] = useState("Engineering");
  const [loc, setLoc] = useState("");
  const [type, setType] = useState("Full-time");
  
  // Status states
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/careers");
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setJobs(data.jobs || []);
        }
      }
    } catch (err) {
      console.error("Failed to load jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/careers/submissions");
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setSubmissions(data.submissions || []);
        }
      }
    } catch (err) {
      console.error("Failed to load applications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "requirements") {
      fetchJobs();
    } else {
      fetchSubmissions();
    }
    setSuccessMsg("");
    setErrorMsg("");
  }, [activeTab]);

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
    if (!confirm("Are you sure you want to delete this job requirement? It will disappear from the careers portal immediately.")) {
      return;
    }

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
    <div className="flex flex-col gap-6 p-1 md:p-6 font-sans text-slate-800">
      
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Careers Portal Admin</h1>
          <p className="text-sm text-slate-500 font-medium">Manage job openings and review submitted job applications.</p>
        </div>
        
        {/* Navigation Tabs */}
        <div className="flex bg-slate-100 p-1.5 rounded-xl border border-slate-200 self-start md:self-auto">
          <button
            onClick={() => setActiveTab("requirements")}
            className={`px-4 py-2 text-xs font-bold rounded-lg cursor-pointer transition-all ${activeTab === "requirements" ? "bg-white text-blue-600 shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
          >
            📋 Job Requirements
          </button>
          <button
            onClick={() => setActiveTab("submissions")}
            className={`px-4 py-2 text-xs font-bold rounded-lg cursor-pointer transition-all ${activeTab === "submissions" ? "bg-white text-blue-600 shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
          >
            📥 Applications
          </button>
        </div>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start gap-2.5 text-sm text-emerald-800 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-2.5 text-sm text-red-800 animate-fade-in">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* REQUIREMENTS TAB */}
      {activeTab === "requirements" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Form */}
          <form onSubmit={handleAddJob} className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-blue-600" /> Add New Position
            </h2>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Position Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Lead React Developer"
                className="w-full bg-white border border-slate-200 focus:border-blue-500 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Department</label>
              <select
                value={dept}
                onChange={(e) => setDept(e.target.value)}
                className="w-full bg-white border border-slate-200 focus:border-blue-500 rounded-xl px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
              >
                <option value="Engineering">Engineering</option>
                <option value="Product & Design">Product & Design</option>
                <option value="Growth & Operations">Growth & Operations</option>
                <option value="Sales & Marketing">Sales & Marketing</option>
                <option value="Human Resources">Human Resources</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Location</label>
              <input
                type="text"
                required
                value={loc}
                onChange={(e) => setLoc(e.target.value)}
                placeholder="e.g. Kochi, India / Hybrid"
                className="w-full bg-white border border-slate-200 focus:border-blue-500 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Job Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-white border border-slate-200 focus:border-blue-500 rounded-xl px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
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
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold text-sm py-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 mt-2"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} Add Position
            </button>
          </form>

          {/* Right Column: Listing Table */}
          <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-blue-600" /> Active Positions
              </h2>
              <span className="text-xs font-bold bg-slate-100 text-slate-600 px-3 py-1 rounded-full border border-slate-200">
                {jobs.length} Positions
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-150">
                    <th className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider py-3.5 px-6">Position</th>
                    <th className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider py-3.5 px-6">Department</th>
                    <th className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider py-3.5 px-6">Location</th>
                    <th className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="py-12 text-center text-sm text-slate-500">
                        <Loader2 className="w-6 h-6 animate-spin mx-auto text-blue-600 mb-2" /> Loading requirements...
                      </td>
                    </tr>
                  ) : jobs.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-16 text-center text-sm text-slate-500">
                        No active jobs. Use form to create.
                      </td>
                    </tr>
                  ) : (
                    jobs.map((j) => (
                      <tr key={j.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex flex-col gap-0.5">
                            <span className="font-bold text-slate-900 text-sm leading-snug">{j.title}</span>
                            <span className="text-[10px] font-extrabold bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-100 inline-block w-max uppercase tracking-wider">{j.type}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-sm text-slate-600 font-semibold">{j.dept}</td>
                        <td className="py-4 px-6 text-xs text-slate-500 font-semibold">{j.loc}</td>
                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={() => handleDeleteJob(j.id)}
                            className="text-red-500 hover:text-red-750 hover:bg-red-50 rounded-lg p-2 cursor-pointer inline-flex border border-transparent hover:border-red-100"
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
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-blue-600" /> Form Submissions (Careers)
            </h2>
            <span className="text-xs font-bold bg-slate-100 text-slate-600 px-3 py-1 rounded-full border border-slate-200">
              {submissions.length} Total Submissions
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-150">
                  <th className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider py-3.5 px-6">Applicant</th>
                  <th className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider py-3.5 px-6">Position</th>
                  <th className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider py-3.5 px-6">Date</th>
                  <th className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider py-3.5 px-6">Resume</th>
                  <th className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-16 text-center text-sm text-slate-500">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto text-blue-600 mb-2" />
                      Loading submissions...
                    </td>
                  </tr>
                ) : submissions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-20 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <Mail className="w-10 h-10 text-slate-300" />
                        <span className="text-sm font-semibold text-slate-500">No applications received yet</span>
                        <span className="text-xs text-slate-400">Submissions from candidate apply forms will appear here.</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  submissions.map((sub) => {
                    const isExpanded = expandedAppId === sub.id;
                    return (
                      <React.Fragment key={sub.id}>
                        {/* Summary Row */}
                        <tr className={`hover:bg-slate-50/50 transition-colors ${isExpanded ? "bg-slate-50/70" : ""}`}>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              {sub.photoUrl ? (
                                <img
                                  src={sub.photoUrl}
                                  alt={`${sub.firstName} ${sub.lastName}`}
                                  className="w-9 h-9 rounded-full object-cover border border-slate-200"
                                  onError={(e) => {
                                    (e.target as HTMLElement).style.display = "none";
                                  }}
                                />
                              ) : (
                                <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                                  {sub.firstName[0]}{sub.lastName[0]}
                                </div>
                              )}
                              <div className="flex flex-col gap-0.5">
                                <span className="font-bold text-slate-900 text-sm leading-none">
                                  {sub.firstName} {sub.lastName}
                                </span>
                                <span className="text-xs text-slate-500 font-semibold">{sub.email}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-sm text-slate-700 font-bold">
                            {sub.jobTitle}
                          </td>
                          <td className="py-4 px-6 text-xs text-slate-500 font-semibold">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" />
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
                              className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-bold hover:underline"
                            >
                              Resume <ExternalLink className="w-3 h-3" />
                            </a>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <div className="inline-flex items-center gap-2">
                              <button
                                onClick={() => toggleExpandApp(sub.id)}
                                className={`p-2 rounded-lg border transition-all cursor-pointer ${isExpanded ? "bg-slate-800 border-slate-800 text-white" : "text-slate-600 border-slate-200 hover:bg-slate-100"}`}
                                title={isExpanded ? "Hide Details" : "View Details"}
                              >
                                {isExpanded ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                              <button
                                onClick={() => handleDeleteSubmission(sub.id)}
                                className="text-red-500 hover:text-red-750 hover:bg-red-50 rounded-lg p-2 cursor-pointer border border-transparent hover:border-red-100"
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
                            <td colSpan={5} className="bg-slate-50/50 p-6 border-b border-slate-200">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-600 leading-relaxed max-w-4xl">
                                
                                {/* Contact and Identity */}
                                <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col gap-3 shadow-sm">
                                  <h4 className="text-slate-900 font-black text-[10px] uppercase tracking-widest text-blue-600">
                                    Candidate Details
                                  </h4>
                                  {sub.headline && (
                                    <div className="border-b border-slate-100 pb-2">
                                      <span className="text-[10px] font-bold text-slate-400 block uppercase">Headline</span>
                                      <span className="font-bold text-slate-800 text-sm">{sub.headline}</span>
                                    </div>
                                  )}
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                    <div>
                                      <span className="text-[10px] font-bold text-slate-400 block uppercase">Phone</span>
                                      <span className="font-semibold text-slate-700 flex items-center gap-1 mt-0.5">
                                        <Phone className="w-3.5 h-3.5 text-slate-400" /> {sub.phone || "N/A"}
                                      </span>
                                    </div>
                                    <div>
                                      <span className="text-[10px] font-bold text-slate-400 block uppercase">Address</span>
                                      <span className="font-semibold text-slate-700 flex items-center gap-1 mt-0.5">
                                        <Home className="w-3.5 h-3.5 text-slate-400" /> {sub.address || "N/A"}
                                      </span>
                                    </div>
                                  </div>
                                  {sub.photoUrl && (
                                    <div className="mt-1">
                                      <span className="text-[10px] font-bold text-slate-400 block uppercase">Profile / Photo Link</span>
                                      <a href={sub.photoUrl} target="_blank" rel="noreferrer" className="text-blue-600 font-semibold hover:underline flex items-center gap-1 mt-0.5 break-all">
                                        {sub.photoUrl} <ExternalLink className="w-3 h-3 shrink-0" />
                                      </a>
                                    </div>
                                  )}
                                </div>

                                {/* Summary & Qualifications */}
                                <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col gap-3 shadow-sm">
                                  <h4 className="text-slate-900 font-black text-[10px] uppercase tracking-widest text-blue-600">
                                    Qualifications
                                  </h4>
                                  {sub.summary && (
                                    <div>
                                      <span className="text-[10px] font-bold text-slate-400 block uppercase flex items-center gap-1">
                                        <Sparkles className="w-3 h-3" /> Summary
                                      </span>
                                      <p className="font-semibold text-slate-700 mt-1 bg-slate-50 p-2 rounded-lg border border-slate-100 whitespace-pre-wrap">{sub.summary}</p>
                                    </div>
                                  )}
                                  {sub.education && (
                                    <div>
                                      <span className="text-[10px] font-bold text-slate-400 block uppercase flex items-center gap-1">
                                        <GraduationCap className="w-3.5 h-3.5" /> Education
                                      </span>
                                      <p className="font-semibold text-slate-700 mt-1 bg-slate-50 p-2 rounded-lg border border-slate-100 whitespace-pre-wrap">{sub.education}</p>
                                    </div>
                                  )}
                                  {sub.experience && (
                                    <div>
                                      <span className="text-[10px] font-bold text-slate-400 block uppercase flex items-center gap-1">
                                        <Award className="w-3.5 h-3.5" /> Experience
                                      </span>
                                      <p className="font-semibold text-slate-700 mt-1 bg-slate-50 p-2 rounded-lg border border-slate-100 whitespace-pre-wrap">{sub.experience}</p>
                                    </div>
                                  )}
                                </div>

                                {/* Cover Letter */}
                                {sub.coverLetter && (
                                  <div className="bg-white border border-slate-200 rounded-xl p-4 md:col-span-2 shadow-sm flex flex-col gap-1.5">
                                    <h4 className="text-slate-900 font-black text-[10px] uppercase tracking-widest text-blue-600 flex items-center gap-1">
                                      ✉️ Cover Letter
                                    </h4>
                                    <p className="font-medium text-slate-700 bg-slate-50/50 p-3 rounded-lg border border-slate-150 whitespace-pre-wrap leading-relaxed">
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
