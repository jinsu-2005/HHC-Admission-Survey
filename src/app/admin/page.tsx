"use client";

import { useState, useEffect } from "react";
import { Lock, Users, TrendingUp, TrendingDown, Search, Download, Phone, MessageCircle, Eye, X, LogOut } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import Navbar from "@/components/Navbar";

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);

  const checkAuth = async () => {
    try {
      const res = await fetch("/api/admin/data");
      if (res.ok) {
        setIsAuthenticated(true);
        const json = await res.json();
        setData(json.data);
      }
    } catch (e) {
      // Not authenticated
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        checkAuth();
      } else {
        setError("Invalid password");
      }
    } catch (err) {
      setError("Login failed");
    } finally {
      setLoading(false);
    }
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
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">Admin Access</h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Please enter your password to continue
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white dark:bg-slate-800 py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100 dark:border-slate-700">
            <form className="space-y-6" onSubmit={handleLogin}>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password (default: admin123)</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 sm:text-sm border-gray-300 dark:border-slate-600 rounded-md p-3 border focus:ring-hcc-blue focus:border-hcc-blue dark:bg-slate-900 dark:text-white"
                    placeholder="Enter password"
                  />
                </div>
                {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-hcc-blue hover:bg-blue-800 focus:outline-none transition-colors"
              >
                {loading ? "Verifying..." : "Sign in"}
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
  const courseChartData = Object.keys(courseCounts).map(k => ({ name: k.substring(0, 15) + (k.length > 15 ? '...' : ''), value: courseCounts[k] })).sort((a,b) => b.value - a.value).slice(0, 5);

  const COLORS = ['#0B3D91', '#FFB81C', '#10B981', '#3B82F6', '#8B5CF6'];

  const filteredData = data.filter(d => 
    (d.full_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (d.mobile || '').includes(searchTerm) ||
    (d.district?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 pb-12">
      <Navbar />
      <div className="pt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Manage and analyze admission survey responses</p>
          </div>
          <div className="flex gap-3">
            <button onClick={exportCSV} className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-white px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors text-sm font-medium">
              <Download size={18} /> Export CSV
            </button>
            <button onClick={() => { setIsAuthenticated(false); setPassword(""); }} className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors text-sm font-medium">
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 flex items-center gap-4">
            <div className="bg-blue-100 dark:bg-blue-900/50 p-4 rounded-xl text-hcc-blue dark:text-blue-400">
              <Users size={28} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Responses</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalResponses}</p>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 flex items-center gap-4">
            <div className="bg-green-100 dark:bg-green-900/50 p-4 rounded-xl text-green-600 dark:text-green-400">
              <TrendingUp size={28} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Interested Students</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{interested}</p>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 flex items-center gap-4">
            <div className="bg-red-100 dark:bg-red-900/50 p-4 rounded-xl text-red-600 dark:text-red-400">
              <TrendingDown size={28} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Not Interested</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{notInterested}</p>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Top Course Interests</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={courseChartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={120} tick={{fontSize: 12}} />
                  <Tooltip cursor={{fill: 'rgba(0,0,0,0.05)'}} />
                  <Bar dataKey="value" fill="var(--color-hcc-blue)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">District Distribution</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={districtChartData} cx="50%" cy="50%" outerRadius={100} fill="#8884d8" dataKey="value" label>
                    {districtChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
          <div className="p-6 border-b border-gray-100 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-center gap-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Responses</h3>
            <div className="relative w-full sm:w-64">
              <input 
                type="text" 
                placeholder="Search name, phone..." 
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-hcc-blue dark:bg-slate-900 dark:text-white text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
              <thead className="bg-gray-50 dark:bg-slate-800/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Interest Level</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Courses</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
                {filteredData.map((student, i) => (
                  <tr key={student.id || i} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{student.full_name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{student.district} • {student.distance}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">{student.mobile}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{student.preferred_contact} • {student.best_time}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${student.interest_level === 'Very Interested' ? 'bg-green-100 text-green-800' : 
                          student.interest_level === 'Interested' ? 'bg-blue-100 text-blue-800' :
                          student.interest_level === 'Not Interested' ? 'bg-red-100 text-red-800' : 
                          'bg-yellow-100 text-yellow-800'}`}>
                        {student.interest_level}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 dark:text-white truncate max-w-[200px]" title={Array.isArray(student.course_interest) ? student.course_interest.join(", ") : ''}>
                        {Array.isArray(student.course_interest) ? student.course_interest.join(", ") : '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end gap-2">
                      <a href={`tel:${student.mobile}`} className="text-hcc-blue hover:text-blue-900 p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg" title="Call">
                        <Phone size={16} />
                      </a>
                      <a href={`https://wa.me/91${student.mobile}`} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-900 p-2 bg-green-50 dark:bg-green-900/30 rounded-lg" title="WhatsApp">
                        <MessageCircle size={16} />
                      </a>
                      <button onClick={() => setSelectedStudent(student)} className="text-gray-600 hover:text-gray-900 dark:text-gray-300 p-2 bg-gray-100 dark:bg-slate-700 rounded-lg" title="View Details">
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredData.length === 0 && (
                  <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">No responses found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {selectedStudent && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-slate-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Response Details</h3>
                <button onClick={() => setSelectedStudent(null)} className="text-gray-400 hover:text-gray-500">
                  <X size={24} />
                </button>
              </div>
              <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Name</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{selectedStudent.full_name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Mobile</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{selectedStudent.mobile}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">District</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{selectedStudent.district}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Submitted At</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{new Date(selectedStudent.created_at).toLocaleString()}</p>
                  </div>
                </div>
                
                <hr className="border-gray-100 dark:border-slate-700" />
                
                <div>
                  <p className="text-xs text-gray-500">Interest Level</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{selectedStudent.interest_level}</p>
                  {selectedStudent.interest_level === 'Not Interested' && (
                    <p className="text-sm text-red-600 mt-1 italic">
                      Reasons: {Array.isArray(selectedStudent.not_interested_reasons) ? selectedStudent.not_interested_reasons.join(", ") : ''} {selectedStudent.other_reason ? `(${selectedStudent.other_reason})` : ''}
                    </p>
                  )}
                </div>

                <div>
                  <p className="text-xs text-gray-500">Study Plan & Courses</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{selectedStudent.study_plan}</p>
                  {Array.isArray(selectedStudent.course_interest) && selectedStudent.course_interest.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedStudent.course_interest.map((c: string) => (
                        <span key={c} className="bg-blue-50 dark:bg-slate-700 text-hcc-blue dark:text-blue-300 px-2 py-1 rounded text-xs font-medium">
                          {c}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                
                <div>
                  <p className="text-xs text-gray-500">Distance & Transportation</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{selectedStudent.distance}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Issue affecting decision: {selectedStudent.transportation_issue}</p>
                </div>
                
                <div>
                  <p className="text-xs text-gray-500">Contact Preferences</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{selectedStudent.preferred_contact} during {selectedStudent.best_time}</p>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
