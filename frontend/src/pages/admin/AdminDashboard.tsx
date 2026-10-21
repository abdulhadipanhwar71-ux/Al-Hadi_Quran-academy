import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, BookOpen, Calendar, CheckCircle2, Clock, AlertCircle,
  Search, Filter, LogOut, Video, Plus, Edit2, ShieldAlert, Check, X, Eye
} from 'lucide-react';
import { api } from '../../services/api';
import {
  DashboardStats, ApplicationRecord, StudentRecord, Course, ClassScheduleRecord
} from '../../types';

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'Approved':
      return {
        en: 'Approved',
        ur: 'منظور شدہ',
        cls: 'bg-emerald-100 text-emerald-800 border border-emerald-200'
      };
    case 'Rejected':
      return {
        en: 'Rejected',
        ur: 'مسترد شدہ',
        cls: 'bg-red-100 text-red-800 border border-red-200'
      };
    case 'More Information Required':
      return {
        en: 'More Information Required',
        ur: 'مزید معلومات درکار',
        cls: 'bg-amber-100 text-amber-800 border border-amber-200'
      };
    case 'Pending Review':
    default:
      return {
        en: 'Pending Review',
        ur: 'زیرِ غور',
        cls: 'bg-blue-50 text-blue-800 border border-blue-200'
      };
  }
};

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activeTab, setActiveTab] = useState<'applications' | 'students' | 'courses' | 'schedules'>('applications');

  // Applications tab state
  const [applications, setApplications] = useState<ApplicationRecord[]>([]);
  const [selectedApp, setSelectedApp] = useState<ApplicationRecord | null>(null);
  const [appStatusFilter, setAppStatusFilter] = useState<string>('');
  const [appSearch, setAppSearch] = useState<string>('');
  const [statusUpdateNote, setStatusUpdateNote] = useState('');

  // Students tab state
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [studentSearch, setStudentSearch] = useState('');

  // Courses tab state
  const [courses, setCourses] = useState<Course[]>([]);

  // Schedules tab state
  const [schedules, setSchedules] = useState<ClassScheduleRecord[]>([]);
  const [newScheduleCourseId, setNewScheduleCourseId] = useState<number>(1);
  const [newScheduleTitle, setNewScheduleTitle] = useState('');
  const [newScheduleTime, setNewScheduleTime] = useState('');
  const [newScheduleDuration, setNewScheduleDuration] = useState(30);
  const [newScheduleLink, setNewScheduleLink] = useState('');
  const [newScheduleTz, setNewScheduleTz] = useState('Asia/Karachi');
  const [showAddScheduleModal, setShowAddScheduleModal] = useState(false);

  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // Auth Verification
  useEffect(() => {
    const token = localStorage.getItem('alhadi_admin_token');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    loadDashboardData();
  }, [navigate]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [s, apps, stds, crs, scheds] = await Promise.all([
        api.getDashboardStats(),
        api.getApplications(),
        api.getStudents(),
        api.getAdminCourses(),
        api.getSchedules()
      ]);
      setStats(s);
      setApplications(apps);
      setStudents(stds);
      setCourses(crs);
      setSchedules(scheds);
    } catch (err) {
      // If unauthorized, redirect to login
      navigate('/admin/login');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (appId: number, newStatus: string, trialStatus?: string) => {
    try {
      await api.updateApplicationStatus(appId, {
        application_status: newStatus,
        trial_status: trialStatus,
        notes: statusUpdateNote || undefined
      });
      setActionMessage(`Application status updated to ${newStatus}.`);
      setSelectedApp(null);
      setStatusUpdateNote('');
      loadDashboardData();
    } catch (err: any) {
      alert(err.message || 'Failed to update status');
    }
  };

  const handleCreateSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createSchedule({
        course_id: newScheduleCourseId,
        title: newScheduleTitle.trim() || 'One-to-One Quran Lesson',
        class_type: 'One-to-One',
        start_time_utc: new Date(newScheduleTime).toISOString(),
        duration_minutes: Number(newScheduleDuration),
        is_recurring: false,
        timezone: newScheduleTz,
        meeting_link: newScheduleLink.trim(),
        notes: 'Created by Abdul Hadi Panhwar'
      });
      setShowAddScheduleModal(false);
      setNewScheduleTitle('');
      setNewScheduleLink('');
      setActionMessage('Class schedule successfully created!');
      loadDashboardData();
    } catch (err: any) {
      alert(err.message || 'Failed to create schedule');
    }
  };

  const handleLogout = async () => {
    await api.logout();
    navigate('/admin/login');
  };

  const filteredApps = applications.filter(a => {
    const matchesStatus = !appStatusFilter || a.application_status === appStatusFilter;
    const matchesSearch = !appSearch ||
      a.student_name.toLowerCase().includes(appSearch.toLowerCase()) ||
      a.contact_email.toLowerCase().includes(appSearch.toLowerCase()) ||
      a.country.toLowerCase().includes(appSearch.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 text-left">
      {/* Top Header */}
      <div className="bg-emerald-950 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg border border-amber-600/30">
        <div className="flex items-center gap-4">
          <img
            src="/logo.jpg"
            alt="Logo"
            className="w-14 h-14 rounded-full object-cover border-2 border-amber-400"
          />
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Administrator Dashboard
            </h1>
            <p className="text-xs text-amber-300 font-medium">
              Logged in as: Abdul Hadi (Head Administrator)
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 bg-emerald-900/80 hover:bg-red-800 text-white text-xs font-semibold px-4 py-2.5 rounded-xl border border-emerald-700/60 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Log Out</span>
        </button>
      </div>

      {actionMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-center justify-between">
          <span>{actionMessage}</span>
          <button onClick={() => setActionMessage(null)} className="text-emerald-700 font-bold">×</button>
        </div>
      )}

      {/* Overview Metrics Cards */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-xs">
            <span className="text-[11px] font-semibold text-slate-500 block uppercase">Total Applications</span>
            <span className="text-2xl font-extrabold text-slate-900">{stats.total_applications}</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-amber-200 bg-amber-50/30 shadow-xs">
            <span className="text-[11px] font-semibold text-amber-800 block uppercase">Pending Review</span>
            <span className="text-2xl font-extrabold text-amber-700">{stats.pending_applications}</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-emerald-200 shadow-xs">
            <span className="text-[11px] font-semibold text-emerald-700 block uppercase">Approved</span>
            <span className="text-2xl font-extrabold text-emerald-800">{stats.approved_applications}</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-xs">
            <span className="text-[11px] font-semibold text-slate-500 block uppercase">Active Students</span>
            <span className="text-2xl font-extrabold text-emerald-950">{stats.active_students}</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-xs">
            <span className="text-[11px] font-semibold text-slate-500 block uppercase">Trial Requests</span>
            <span className="text-2xl font-extrabold text-amber-600">{stats.trial_requests}</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-xs">
            <span className="text-[11px] font-semibold text-slate-500 block uppercase">Scheduled Classes</span>
            <span className="text-2xl font-extrabold text-slate-900">{stats.upcoming_classes}</span>
          </div>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-200 gap-2 text-xs font-bold">
        <button
          onClick={() => setActiveTab('applications')}
          className={`py-3 px-4 border-b-2 transition-colors ${
            activeTab === 'applications'
              ? 'border-emerald-700 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Applications ({applications.length})
        </button>

        <button
          onClick={() => setActiveTab('students')}
          className={`py-3 px-4 border-b-2 transition-colors ${
            activeTab === 'students'
              ? 'border-emerald-700 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Enrolled Students ({students.length})
        </button>

        <button
          onClick={() => setActiveTab('schedules')}
          className={`py-3 px-4 border-b-2 transition-colors ${
            activeTab === 'schedules'
              ? 'border-emerald-700 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Class Schedules ({schedules.length})
        </button>

        <button
          onClick={() => setActiveTab('courses')}
          className={`py-3 px-4 border-b-2 transition-colors ${
            activeTab === 'courses'
              ? 'border-emerald-700 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Course Catalog ({courses.length})
        </button>
      </div>

      {/* Tab 1: Applications Management */}
      {activeTab === 'applications' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-4 rounded-2xl border border-slate-200">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search name, email, country..."
                value={appSearch}
                onChange={(e) => setAppSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={appStatusFilter}
                onChange={(e) => setAppStatusFilter(e.target.value)}
                className="text-xs border border-slate-200 rounded-xl px-3 py-2 bg-white"
              >
                <option value="">All Statuses (تمام درخواستیں)</option>
                <option value="Pending Review">Pending Review (زیرِ غور)</option>
                <option value="Approved">Approved (منظور شدہ)</option>
                <option value="Rejected">Rejected (مسترد شدہ)</option>
                <option value="More Information Required">More Information Required (مزید معلومات درکار)</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-x-auto shadow-xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-4">Student</th>
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4">Course</th>
                  <th className="py-3.5 px-4">Contact</th>
                  <th className="py-3.5 px-4">Country & TZ</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredApps.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">
                      No applications found.
                    </td>
                  </tr>
                ) : (
                  filteredApps.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{app.student_name}</div>
                        <div className="text-[11px] text-slate-500">
                          Age: {app.student_age} {app.is_child && `(Guardian: ${app.guardian_name || 'N/A'})`}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          app.application_type === 'Free Trial'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {app.application_type}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-medium text-slate-700">
                        {app.course_title || `Course #${app.course_id}`}
                      </td>

                      <td className="py-3.5 px-4 text-[11px]">
                        <div>{app.contact_phone}</div>
                        <div className="text-slate-400">{app.contact_email}</div>
                      </td>

                      <td className="py-3.5 px-4 text-[11px]">
                        <div>{app.country}</div>
                        <div className="text-slate-400">{app.timezone}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        {(() => {
                          const badge = getStatusBadge(app.application_status);
                          return (
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold ${badge.cls}`}>
                              <span>{badge.en}</span>
                              <span className="font-arabic text-[9px] opacity-80">({badge.ur})</span>
                            </span>
                          );
                        })()}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setSelectedApp(app)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-emerald-700 hover:text-white rounded-lg text-[11px] font-semibold transition-colors"
                        >
                          Review
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Application Detail Modal */}
          {selectedApp && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200">
                <div className="flex items-center justify-between pb-3 border-b">
                  <h3 className="font-bold text-base text-slate-900">
                    Review Application #{selectedApp.id}
                  </h3>
                  <button onClick={() => setSelectedApp(null)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3 text-xs text-slate-700 leading-relaxed max-h-[60vh] overflow-y-auto">
                  <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl">
                    <div><strong>Student:</strong> {selectedApp.student_name}</div>
                    <div><strong>Age:</strong> {selectedApp.student_age}</div>
                    <div><strong>Guardian:</strong> {selectedApp.guardian_name || 'N/A'}</div>
                    <div><strong>Relation:</strong> {selectedApp.guardian_relation || 'N/A'}</div>
                    <div><strong>Phone:</strong> {selectedApp.contact_phone}</div>
                    <div><strong>Email:</strong> {selectedApp.contact_email}</div>
                    <div><strong>Country:</strong> {selectedApp.country}</div>
                    <div><strong>Timezone:</strong> {selectedApp.timezone}</div>
                  </div>

                  <div>
                    <strong>Preferred Schedule:</strong> {selectedApp.preferred_days} ({selectedApp.preferred_time})
                  </div>
                  <div>
                    <strong>Language:</strong> {selectedApp.preferred_language}
                  </div>

                  <div className="pt-2">
                    <label className="block font-semibold mb-1">Administrative Notes:</label>
                    <textarea
                      rows={2}
                      placeholder="Add private administrative notes..."
                      value={statusUpdateNote}
                      onChange={(e) => setStatusUpdateNote(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>
                </div>

                {/* Status Decision Buttons */}
                <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t">
                  <button
                    onClick={() => handleStatusChange(selectedApp.id, 'Approved', 'Trial Scheduled')}
                    className="px-4 py-2 bg-emerald-700 text-white font-bold rounded-xl text-xs hover:bg-emerald-800 transition-colors"
                  >
                    <span>Approve & Enroll</span>
                    <span className="opacity-80 font-arabic text-[10px] ml-1.5">(منظور کریں)</span>
                  </button>

                  <button
                    onClick={() => handleStatusChange(selectedApp.id, 'More Information Required')}
                    className="px-3 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs hover:bg-amber-600"
                  >
                    <span>Request Info</span>
                    <span className="opacity-80 font-arabic text-[10px] ml-1.5">(مزید معلومات)</span>
                  </button>

                  <button
                    onClick={() => handleStatusChange(selectedApp.id, 'Rejected')}
                    className="px-3 py-2 bg-red-100 text-red-700 font-bold rounded-xl text-xs hover:bg-red-200"
                  >
                    <span>Reject</span>
                    <span className="opacity-80 font-arabic text-[10px] ml-1.5">(مسترد کریں)</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Enrolled Students */}
      {activeTab === 'students' && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-x-auto shadow-xs">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">Student ID</th>
                <th className="py-3.5 px-4">Full Name</th>
                <th className="py-3.5 px-4">Guardian</th>
                <th className="py-3.5 px-4">Contact</th>
                <th className="py-3.5 px-4">Country & TZ</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Enrolled Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No enrolled students yet. Approve applications to automatically create student records.
                  </td>
                </tr>
              ) : (
                students.map((std) => (
                  <tr key={std.id} className="hover:bg-slate-50">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-500">#{std.id}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{std.full_name}</td>
                    <td className="py-3.5 px-4 text-slate-600">{std.guardian_name || 'N/A'}</td>
                    <td className="py-3.5 px-4">{std.contact_phone}</td>
                    <td className="py-3.5 px-4">{std.country} ({std.timezone})</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        {std.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                      {new Date(std.enrolled_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 3: Schedules */}
      {activeTab === 'schedules' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Weekly Class Sessions</h3>
              <p className="text-xs text-slate-500">Meeting links are private and visible only to the administrator.</p>
            </div>
            <button
              onClick={() => setShowAddScheduleModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Schedule New Class</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {schedules.map((sch) => (
              <div key={sch.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {sch.course_title || `Course #${sch.course_id}`}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {sch.status}
                  </span>
                </div>

                <h4 className="font-bold text-sm text-slate-900">{sch.title}</h4>

                <div className="text-xs text-slate-500 space-y-1">
                  <div><strong>Time (UTC):</strong> {new Date(sch.start_time_utc).toLocaleString()}</div>
                  <div><strong>Duration:</strong> {sch.duration_minutes} minutes</div>
                  <div><strong>Timezone:</strong> {sch.timezone}</div>
                </div>

                {sch.meeting_link && (
                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-[10px] text-slate-400 font-semibold block uppercase">Private Link:</span>
                    <a
                      href={sch.meeting_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-emerald-700 hover:underline flex items-center gap-1 mt-0.5 truncate"
                    >
                      <Video className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="truncate">{sch.meeting_link}</span>
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Add Schedule Modal */}
          {showAddScheduleModal && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-200">
                <div className="flex items-center justify-between pb-2 border-b">
                  <h3 className="font-bold text-base text-slate-900">Create Class Schedule</h3>
                  <button onClick={() => setShowAddScheduleModal(false)} className="text-slate-400">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleCreateSchedule} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold mb-1">Select Course</label>
                    <select
                      value={newScheduleCourseId}
                      onChange={(e) => setNewScheduleCourseId(parseInt(e.target.value))}
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                    >
                      {courses.map(c => (
                        <option key={c.id} value={c.id}>{c.title_en}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">Session Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Nazra Quran Weekly Class"
                      value={newScheduleTitle}
                      onChange={(e) => setNewScheduleTitle(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">Start Date & Time</label>
                    <input
                      type="datetime-local"
                      required
                      value={newScheduleTime}
                      onChange={(e) => setNewScheduleTime(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold mb-1">Duration (min)</label>
                      <input
                        type="number"
                        min="15"
                        max="180"
                        value={newScheduleDuration}
                        onChange={(e) => setNewScheduleDuration(parseInt(e.target.value))}
                        className="w-full p-2.5 rounded-xl border border-slate-200"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Timezone</label>
                      <input
                        type="text"
                        value={newScheduleTz}
                        onChange={(e) => setNewScheduleTz(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-200"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">Google Meet / Zoom Private Link</label>
                    <input
                      type="url"
                      placeholder="https://meet.google.com/xxx-xxxx-xxx"
                      value={newScheduleLink}
                      onChange={(e) => setNewScheduleLink(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-xs transition-colors"
                  >
                    Save Class Schedule
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Courses */}
      {activeTab === 'courses' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {courses.map((c) => (
            <div key={c.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-slate-400">#{c.display_order} • {c.code}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  c.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                }`}>
                  {c.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <h4 className="font-bold text-base text-slate-900">{c.title_en}</h4>
              <p className="font-arabic font-bold text-sm text-emerald-800">{c.title_ur}</p>
              <p className="text-xs text-slate-600 leading-relaxed">{c.description_en}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
