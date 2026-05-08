"use client";

import { useState, useEffect } from "react";
import { Lock, Users, TrendingUp, TrendingDown, Search, Download, Phone, Eye, X, LogOut } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import Navbar from "@/components/Navbar";
import ThemeToggle from "@/components/ThemeToggle";

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);

  // Only check cookie-based auth on mount; do NOT auto-set isAuthenticated without a cookie
  const checkAuth = async () => {
    try {
      const res = await fetch("/api/admin/data");
      if (res.ok) {
        const json = await res.json();
        // Treat mock-only response (no real cookie) as unauthenticated
        if (json.isMock) return;
        setIsAuthenticated(true);
        setData(json.data);
      }
    } catch (e) {
      // Not authenticated — stay on login page
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError("Please enter your password.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        // After successful login, re-fetch data with the now-set cookie
        const dataRes = await fetch("/api/admin/data");
        if (dataRes.ok) {
          const json = await dataRes.json();
          setData(json.data);
          setIsAuthenticated(true);
        } else {
          setError("Login succeeded but failed to load data.");
        }
      } else {
        setError("Invalid password. Please try again.");
        setPassword("");
      }
    } catch (err) {
      setError("Login failed. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    setIsAuthenticated(false);
    setData([]);
    setPassword("");
    setError("");
  };

  const exportCSV = () => {
    if (!data.length) return;
    const headers = Object.keys(data[0]).join(",");
    const rows = data.map(row =>
      Object.values(row).map(val =>
        typeof val === 'string' ? `"${val.replace(/"/g, '""')}"` : val
      ).join(",")
    ).join("\n");
    const csv = `${headers}\n${rows}`;
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `hcc-survey-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors" style={{ backgroundColor: 'var(--bg-page)' }}>
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center mb-4">
            <img src="/hccngl.jpg" alt="HCC Logo" className="h-16 w-16 rounded-full object-cover shadow-md border-2 border-hcc-blue/20" />
          </div>
          <h2 className="text-center text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Admin Portal</h2>
          <p className="mt-1 text-center text-sm" style={{ color: 'var(--text-secondary)' }}>Holy Cross College — Secure Access</p>
        </div>

        <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="py-8 px-6 shadow-sm rounded-2xl border transition-colors" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            <form className="space-y-5" onSubmit={handleLogin}>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="hcc-input pr-9 text-sm"
                    placeholder="Enter password"
                    autoComplete="current-password"
                  />
                </div>
                {error && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <span>⚠</span> {error}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2.5 px-4 rounded-lg text-sm font-semibold text-white bg-hcc-blue hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-hcc-blue/30 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Verifying…" : "Sign In"}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Analytics Calculation
  const totalResponses = data.length;
  const interested = data.filter(d => d.interest_level === 'Very Interested' || d.interest_level === 'Interested').length;
  const notInterested = data.filter(d => d.interest_level === 'Not Interested').length;

  // Prepare District Data
  const districtCounts = data.reduce((acc, curr) => {
    acc[curr.district] = (acc[curr.district] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const districtChartData = Object.keys(districtCounts).map(k => ({ name: k, value: districtCounts[k] }));

  // Prepare Course Data
  const courseCounts = data.reduce((acc, curr) => {
    if (curr.course_interest && Array.isArray(curr.course_interest)) {
      curr.course_interest.forEach((c: string) => {
        acc[c] = (acc[c] || 0) + 1;
      });
    }
    return acc;
  }, {} as Record<string, number>);
  const courseChartData = Object.keys(courseCounts).map(k => ({ name: k.substring(0, 15) + (k.length > 15 ? '…' : ''), value: courseCounts[k] })).sort((a, b) => b.value - a.value).slice(0, 5);

  const COLORS = ['#0B3D91', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6'];

  const filteredData = data.filter(d =>
    (d.full_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (d.mobile || '').includes(searchTerm) ||
    (d.district?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const interestBadge = (level: string) => {
    if (level === 'Very Interested') return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300';
    if (level === 'Interested') return 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300';
    if (level === 'Not Interested') return 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300';
    return 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300';
  };

  const card = "rounded-2xl shadow-sm border transition-colors";
  const cardStyle = { backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' };

  return (
    <div className="min-h-screen pb-16 transition-colors" style={{ backgroundColor: 'var(--bg-page)' }}>
      <Navbar />
      <div className="pt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Admin Dashboard</h1>
            <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>Manage and analyze admission survey responses</p>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={exportCSV}
              className={`${card} flex items-center gap-2 px-4 py-2 hover:opacity-80 transition-opacity text-sm font-medium`}
              style={{ ...cardStyle, color: 'var(--text-primary)' }}
            >
              <Download size={16} /> Export CSV
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/40 text-red-600 dark:text-red-400 px-4 py-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors text-sm font-medium"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <div className={`${card} p-5 flex items-center gap-4`} style={cardStyle}>
            <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-xl text-hcc-blue dark:text-blue-400 shrink-0">
              <Users size={24} />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide" style={{ color: 'var(--text-secondary)' }}>Total Responses</p>
              <p className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>{totalResponses}</p>
            </div>
          </div>
          <div className={`${card} p-5 flex items-center gap-4`} style={cardStyle}>
            <div className="bg-emerald-50 dark:bg-emerald-900/30 p-3 rounded-xl text-emerald-600 dark:text-emerald-400 shrink-0">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide" style={{ color: 'var(--text-secondary)' }}>Interested</p>
              <p className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>{interested}</p>
            </div>
          </div>
          <div className={`${card} p-5 flex items-center gap-4`} style={cardStyle}>
            <div className="bg-red-50 dark:bg-red-900/30 p-3 rounded-xl text-red-500 dark:text-red-400 shrink-0">
              <TrendingDown size={24} />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide" style={{ color: 'var(--text-secondary)' }}>Not Interested</p>
              <p className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>{notInterested}</p>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
          <div className={`${card} p-6`} style={cardStyle}>
            <h3 className="text-base font-semibold mb-5" style={{ color: 'var(--text-primary)' }}>Top Course Interests</h3>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={courseChartData} layout="vertical" margin={{ top: 5, right: 24, left: 20, bottom: 5 }}>
                  <XAxis type="number" tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} />
                  <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: 'rgba(11,61,145,0.04)' }} contentStyle={{ borderRadius: 8, border: '1px solid var(--border-color)', fontSize: 13, backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)' }} />
                  <Bar dataKey="value" fill="#0B3D91" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className={`${card} p-6`} style={cardStyle}>
            <h3 className="text-base font-semibold mb-5" style={{ color: 'var(--text-primary)' }}>District Distribution</h3>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={districtChartData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={(props: any) => `${props.name ?? ''} ${((props.percent ?? 0) * 100).toFixed(0)}%`} labelLine={false}>
                    {districtChartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid var(--border-color)', fontSize: 13, backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className={`${card} overflow-hidden`} style={cardStyle}>
          <div className="p-5 border-b flex flex-col sm:flex-row justify-between items-center gap-4" style={{ borderColor: 'var(--border-color)' }}>
            <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>Recent Responses</h3>
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search name, phone, district…"
                className="hcc-input pl-9 text-sm py-2"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-2.5 top-2.5 h-4 w-4" style={{ color: 'var(--text-secondary)' }} />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full" style={{ borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--bg-page)' }}>
                  {["Student", "Contact", "Interest", "Courses", "Actions"].map((h, idx) => (
                    <th key={h} className={`px-5 py-3 text-xs font-semibold uppercase tracking-wider ${idx === 4 ? 'text-right' : 'text-left'}`} style={{ color: 'var(--text-secondary)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredData.map((student, i) => (
                  <tr
                    key={student.id || i}
                    className="transition-colors"
                    style={{ borderTop: `1px solid var(--border-color)` }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--bg-page)')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{student.full_name}</div>
                      <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>{student.district} · {student.distance}</div>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="text-sm" style={{ color: 'var(--text-primary)' }}>{student.mobile}</div>
                      <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>{student.preferred_contact}{student.best_time ? ` · ${student.best_time}` : ''}</div>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${interestBadge(student.interest_level)}`}>
                        {student.interest_level}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="text-sm truncate max-w-[180px]" style={{ color: 'var(--text-primary)' }} title={Array.isArray(student.course_interest) ? student.course_interest.join(", ") : ''}>
                        {Array.isArray(student.course_interest) ? student.course_interest.join(", ") : '–'}
                      </div>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <a href={`tel:${student.mobile}`} className="text-hcc-blue p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors" title="Call">
                          <Phone size={15} />
                        </a>
                        <a href={`https://wa.me/91${student.mobile}`} target="_blank" rel="noopener noreferrer" className="p-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors flex items-center" title="WhatsApp">
                          <img src="/whattsapp.png" alt="WhatsApp" className="w-4 h-4 object-contain" />
                        </a>
                        <button onClick={() => setSelectedStudent(student)} className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors" style={{ color: 'var(--text-secondary)' }} title="View Details">
                          <Eye size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredData.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-5 py-10 text-center text-sm" style={{ color: 'var(--text-secondary)' }}>No responses found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail Modal */}
        {selectedStudent && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className={`${card} w-full max-w-lg shadow-2xl overflow-hidden`} style={cardStyle}>
              <div className="flex justify-between items-center px-6 py-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
                <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>Response Details</h3>
                <button onClick={() => setSelectedStudent(null)} className="hover:opacity-60 transition-opacity" style={{ color: 'var(--text-secondary)' }}>
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    ["Name", selectedStudent.full_name],
                    ["Mobile", selectedStudent.mobile],
                    ["District", selectedStudent.district],
                    ["Submitted", new Date(selectedStudent.created_at).toLocaleString()],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <p className="text-xs uppercase tracking-wide mb-0.5" style={{ color: 'var(--text-secondary)' }}>{label}</p>
                      <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>{value}</p>
                    </div>
                  ))}
                </div>

                <hr style={{ borderColor: 'var(--border-color)' }} />

                <div>
                  <p className="text-xs uppercase tracking-wide mb-1" style={{ color: 'var(--text-secondary)' }}>Interest Level</p>
                  <span className={`px-2.5 py-1 inline-flex text-xs font-semibold rounded-full ${interestBadge(selectedStudent.interest_level)}`}>
                    {selectedStudent.interest_level}
                  </span>
                  {selectedStudent.interest_level === 'Not Interested' && (
                    <p className="text-sm text-red-500 mt-2 italic">
                      Reasons: {Array.isArray(selectedStudent.not_interested_reasons) ? selectedStudent.not_interested_reasons.join(", ") : ''} {selectedStudent.other_reason ? `(${selectedStudent.other_reason})` : ''}
                    </p>
                  )}
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wide mb-1" style={{ color: 'var(--text-secondary)' }}>Study Plan & Courses</p>
                  <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>{Array.isArray(selectedStudent.study_plan) ? selectedStudent.study_plan.join(", ") : selectedStudent.study_plan}</p>
                  {Array.isArray(selectedStudent.course_interest) && selectedStudent.course_interest.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {selectedStudent.course_interest.map((c: string) => (
                        <span key={c} className="bg-blue-50 dark:bg-blue-900/30 text-hcc-blue dark:text-blue-300 px-2 py-0.5 rounded text-xs font-medium">{c}</span>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wide mb-1" style={{ color: 'var(--text-secondary)' }}>Distance & Transportation</p>
                  <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>{selectedStudent.distance}</p>
                  <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>Affects decision: {selectedStudent.transportation_issue}</p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wide mb-1" style={{ color: 'var(--text-secondary)' }}>Contact Preferences</p>
                  <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>{selectedStudent.preferred_contact}{selectedStudent.best_time ? ` · ${selectedStudent.best_time}` : ''}</p>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
