import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Upload, CheckCircle, XCircle, AlertCircle, Clock, User, Calendar, Filter, FileText, Eye, Activity, Menu, X, LogOut, Settings, Home, Database } from 'lucide-react';

// Mock API for demonstration
const mockAPI = {
  currentUser: null,
  
  async login(email, password) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (email === 'admin@example.com' && password === 'admin123') {
      this.currentUser = { id: 1, name: 'Admin User', email, role: 'Admin' };
      return { success: true, user: this.currentUser };
    } else if (email === 'analyst@example.com' && password === 'analyst123') {
      this.currentUser = { id: 2, name: 'Analyst User', email, role: 'Analyst' };
      return { success: true, user: this.currentUser };
    } else if (email === 'viewer@example.com' && password === 'viewer123') {
      this.currentUser = { id: 3, name: 'Viewer User', email, role: 'Viewer' };
      return { success: true, user: this.currentUser };
    }
    return { success: false, message: 'Invalid credentials' };
  },
  
  async register(name, email, password, role) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    this.currentUser = { id: Date.now(), name, email, role: role || 'Viewer' };
    return { success: true, user: this.currentUser };
  },
  
  logout() {
    this.currentUser = null;
  },
  
  async uploadFile(file, columnMapping) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const jobId = Math.random().toString(36).substr(2, 9);
        resolve({
          jobId,
          status: 'Processing',
          fileName: file.name,
          totalRecords: Math.floor(Math.random() * 1000) + 500
        });
      }, 1500);
    });
  },
  
  async getReconciliationData(filters) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const total = 1248;
        const matched = 892;
        const partiallyMatched = 156;
        const unmatched = 143;
        const duplicates = 57;
        
        resolve({
          summary: {
            totalRecords: total,
            matched,
            partiallyMatched,
            unmatched,
            duplicates,
            accuracy: ((matched / total) * 100).toFixed(2)
          },
          records: generateMockRecords(50),
          chartData: [
            { name: 'Matched', value: matched, color: '#10b981' },
            { name: 'Partial', value: partiallyMatched, color: '#f59e0b' },
            { name: 'Unmatched', value: unmatched, color: '#ef4444' },
            { name: 'Duplicates', value: duplicates, color: '#8b5cf6' }
          ]
        });
      }, 800);
    });
  },
  
  async getAuditTrail(recordId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 1,
            action: 'Record Created',
            user: 'System',
            timestamp: '2026-01-27T10:00:00Z',
            oldValue: null,
            newValue: { transactionId: recordId, amount: 1250.00 }
          },
          {
            id: 2,
            action: 'Amount Updated',
            user: this.currentUser?.name || 'John Doe',
            timestamp: '2026-01-27T11:30:00Z',
            oldValue: { amount: 1250.00 },
            newValue: { amount: 1275.50 }
          },
          {
            id: 3,
            action: 'Status Changed',
            user: 'Jane Smith',
            timestamp: '2026-01-27T14:15:00Z',
            oldValue: { status: 'Pending' },
            newValue: { status: 'Matched' }
          }
        ]);
      }, 500);
    });
  },
  
  async getUploadJobs() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            jobId: 'job_001',
            fileName: 'transactions_jan.csv',
            status: 'Completed',
            totalRecords: 1248,
            processedRecords: 1248,
            uploadedBy: 'Admin User',
            createdAt: '2026-01-25T09:00:00Z',
            completedAt: '2026-01-25T09:05:30Z'
          },
          {
            jobId: 'job_002',
            fileName: 'transactions_feb.xlsx',
            status: 'Processing',
            totalRecords: 856,
            processedRecords: 456,
            uploadedBy: 'Analyst User',
            createdAt: '2026-01-27T14:30:00Z'
          },
          {
            jobId: 'job_003',
            fileName: 'payments_Q1.csv',
            status: 'Failed',
            totalRecords: 2340,
            processedRecords: 1200,
            uploadedBy: 'Admin User',
            createdAt: '2026-01-26T11:15:00Z',
            errorMessage: 'Invalid column mapping'
          }
        ]);
      }, 600);
    });
  }
};

function generateMockRecords(count) {
  const statuses = ['Matched', 'Partially Matched', 'Not Matched', 'Duplicate'];
  const records = [];
  
  for (let i = 0; i < count; i++) {
    records.push({
      id: `REC${String(i + 1).padStart(6, '0')}`,
      transactionId: `TXN${String(i + 1).padStart(6, '0')}`,
      amount: (Math.random() * 10000).toFixed(2),
      referenceNumber: `REF${String(i + 1).padStart(8, '0')}`,
      date: new Date(2026, 0, Math.floor(Math.random() * 27) + 1).toISOString().split('T')[0],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      uploadedBy: ['Admin User', 'Analyst User', 'Jane Smith'][Math.floor(Math.random() * 3)],
      systemAmount: (Math.random() * 10000).toFixed(2)
    });
  }
  
  return records;
}

// Login Component
const LoginPage = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Viewer'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      let result;
      if (isLogin) {
        result = await mockAPI.login(formData.email, formData.password);
      } else {
        result = await mockAPI.register(formData.name, formData.email, formData.password, formData.role);
      }
      
      if (result.success) {
        onLogin(result.user);
      } else {
        setError(result.message || 'Authentication failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="inline-block p-3 bg-blue-100 rounded-full mb-4">
            <Database size={40} className="text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Reconciliation System
          </h1>
          <p className="text-gray-600">
            {isLogin ? 'Sign in to your account' : 'Create a new account'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="John Doe"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="••••••••"
            />
          </div>

          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Viewer">Viewer</option>
                <option value="Analyst">Analyst</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>
        </div>

        {isLogin && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-xs font-semibold text-gray-700 mb-2">Demo Credentials:</p>
            <div className="text-xs text-gray-600 space-y-1">
              <p>Admin: admin@example.com / admin123</p>
              <p>Analyst: analyst@example.com / analyst123</p>
              <p>Viewer: viewer@example.com / viewer123</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Dashboard Card Component
const DashboardCard = ({ title, value, icon: Icon, color, subtitle }) => (
  <div className="bg-white rounded-lg shadow-md p-6 border-l-4 hover:shadow-lg transition-shadow" style={{ borderLeftColor: color }}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600 font-medium">{title}</p>
        <p className="text-3xl font-bold mt-2" style={{ color }}>{value}</p>
        {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
      </div>
      <Icon size={40} style={{ color }} className="opacity-20" />
    </div>
  </div>
);

// File Upload Modal
const FileUploadModal = ({ onClose, onUpload, userRole }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState([]);
  const [columnMapping, setColumnMapping] = useState({});
  const [step, setStep] = useState(1);
  const [uploading, setUploading] = useState(false);
  
  const systemFields = ['Transaction ID', 'Amount', 'Reference Number', 'Date'];
  
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const mockPreview = Array(20).fill(null).map((_, i) => ({
        col1: `TXN${String(i + 1).padStart(6, '0')}`,
        col2: (Math.random() * 10000).toFixed(2),
        col3: `REF${String(i + 1).padStart(8, '0')}`,
        col4: '2026-01-15'
      }));
      setPreview(mockPreview);
      setStep(2);
    }
  };
  
  const handleUpload = async () => {
    setUploading(true);
    await onUpload(file, columnMapping);
    setUploading(false);
    onClose();
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b flex items-center justify-between sticky top-0 bg-white">
          <div>
            <h2 className="text-2xl font-bold">Upload Transaction File</h2>
            <p className="text-gray-600 mt-1">Step {step} of 3</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6">
          {step === 1 && (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-400 transition-colors">
              <Upload size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-lg font-medium mb-2">Choose a CSV or Excel file</p>
              <p className="text-sm text-gray-600 mb-4">Maximum 50,000 records</p>
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition-colors"
              >
                Select File
              </label>
            </div>
          )}
          
          {step === 2 && preview.length > 0 && (
            <div>
              <h3 className="font-semibold mb-4">Preview (First 5 of 20 rows)</h3>
              <div className="overflow-x-auto border rounded-lg mb-6">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {Object.keys(preview[0]).map((col) => (
                        <th key={col} className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {preview.slice(0, 5).map((row, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        {Object.values(row).map((val, i) => (
                          <td key={i} className="px-4 py-2 text-sm text-gray-900">{val}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button
                onClick={() => setStep(3)}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Continue to Mapping
              </button>
            </div>
          )}
          
          {step === 3 && (
            <div>
              <h3 className="font-semibold mb-4">Map Columns to System Fields</h3>
              <div className="space-y-4">
                {systemFields.map((field) => (
                  <div key={field} className="flex items-center gap-4">
                    <label className="w-1/3 font-medium">{field} <span className="text-red-500">*</span></label>
                    <select
                      className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      onChange={(e) => setColumnMapping({ ...columnMapping, [field]: e.target.value })}
                    >
                      <option value="">Select column...</option>
                      {preview.length > 0 && Object.keys(preview[0]).map((col) => (
                        <option key={col} value={col}>{col}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
              <button
                onClick={handleUpload}
                disabled={systemFields.some(f => !columnMapping[f]) || uploading}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed mt-6 transition-colors"
              >
                {uploading ? 'Uploading...' : 'Upload & Process'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Audit Timeline Modal
const AuditTimeline = ({ recordId, onClose }) => {
  const [auditTrail, setAuditTrail] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    mockAPI.getAuditTrail(recordId).then(data => {
      setAuditTrail(data);
      setLoading(false);
    });
  }, [recordId]);
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b flex items-center justify-between sticky top-0 bg-white">
          <h2 className="text-2xl font-bold">Audit Trail - {recordId}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6">
          {loading ? (
            <div className="text-center py-8">
              <Activity className="animate-spin mx-auto mb-4" size={32} />
              <p>Loading audit trail...</p>
            </div>
          ) : (
            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>
              {auditTrail.map((entry) => (
                <div key={entry.id} className="relative pl-16 pb-8">
                  <div className="absolute left-5 top-1.5 w-6 h-6 bg-blue-600 rounded-full border-4 border-white shadow"></div>
                  <div className="bg-gray-50 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-lg">{entry.action}</h4>
                      <span className="text-xs text-gray-500">
                        {new Date(entry.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                      <User size={14} />
                      <span>{entry.user}</span>
                    </div>
                    {entry.oldValue && (
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="font-medium text-red-600 mb-1">Old Value:</p>
                          <pre className="bg-red-50 p-2 rounded text-xs overflow-x-auto">
                            {JSON.stringify(entry.oldValue, null, 2)}
                          </pre>
                        </div>
                        <div>
                          <p className="font-medium text-green-600 mb-1">New Value:</p>
                          <pre className="bg-green-50 p-2 rounded text-xs overflow-x-auto">
                            {JSON.stringify(entry.newValue, null, 2)}
                          </pre>
                        </div>
                      </div>
                    )}
                    {!entry.oldValue && (
                      <div className="text-sm">
                        <p className="font-medium text-green-600 mb-1">Initial Value:</p>
                        <pre className="bg-green-50 p-2 rounded text-xs overflow-x-auto">
                          {JSON.stringify(entry.newValue, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="p-6 border-t flex justify-end sticky bottom-0 bg-white">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Upload Jobs View
const UploadJobsView = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    mockAPI.getUploadJobs().then(data => {
      setJobs(data);
      setLoading(false);
    });
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Processing': return 'bg-blue-100 text-blue-800';
      case 'Failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed': return <CheckCircle size={20} className="text-green-600" />;
      case 'Processing': return <Clock size={20} className="text-blue-600 animate-spin" />;
      case 'Failed': return <XCircle size={20} className="text-red-600" />;
      default: return <AlertCircle size={20} className="text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <Activity className="animate-spin mx-auto mb-4" size={32} />
        <p>Loading jobs...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6 border-b">
        <h2 className="text-xl font-semibold">Upload Jobs</h2>
        <p className="text-sm text-gray-600 mt-1">Track all file upload and processing jobs</p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Job ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">File Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Progress</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Uploaded By</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Created At</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {jobs.map((job) => (
              <tr key={job.jobId} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                  {job.jobId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex items-center gap-2">
                    <FileText size={16} className="text-gray-400" />
                    {job.fileName}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(job.status)}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                      {job.status}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2 w-32">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${(job.processedRecords / job.totalRecords) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs">
                      {job.processedRecords}/{job.totalRecords}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {job.uploadedBy}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {new Date(job.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Main App Component
const App = () => {
  const [user, setUser] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [showAudit, setShowAudit] = useState(null);
  const [currentView, setCurrentView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    status: ''
  });
  
  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [filters, user]);
  
  const loadData = async () => {
    setLoading(true);
    const result = await mockAPI.getReconciliationData(filters);
    setData(result);
    setLoading(false);
  };
  
  const handleLogin = (userData) => {
    setUser(userData);
  };
  
  const handleLogout = () => {
    mockAPI.logout();
    setUser(null);
    setData(null);
  };
  
  const handleUpload = async (file, mapping) => {
    const result = await mockAPI.uploadFile(file, mapping);
    alert(`File uploaded successfully! Job ID: ${result.jobId}\nStatus: ${result.status}\nTotal Records: ${result.totalRecords}`);
    loadData();
  };
  
  const getStatusIcon = (status) => {
    switch (status) {
      case 'Matched':
        return <CheckCircle size={20} className="text-green-600" />;
      case 'Partially Matched':
        return <AlertCircle size={20} className="text-yellow-600" />;
      case 'Not Matched':
        return <XCircle size={20} className="text-red-600" />;
      case 'Duplicate':
        return <AlertCircle size={20} className="text-purple-600" />;
      default:
        return <Clock size={20} className="text-gray-600" />;
    }
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'Matched':
        return 'bg-green-100 text-green-800';
      case 'Partially Matched':
        return 'bg-yellow-100 text-yellow-800';
      case 'Not Matched':
        return 'bg-red-100 text-red-800';
      case 'Duplicate':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }
  
  const canUpload = ['Admin', 'Analyst'].includes(user.role);
  
  if (loading && !data) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Activity className="animate-spin mx-auto mb-4" size={48} />
          <p className="text-xl font-semibold">Loading...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden text-gray-600 hover:text-gray-900"
              >
                <Menu size={24} />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Smart Reconciliation System</h1>
                <p className="text-sm text-gray-600">Intelligent transaction matching and audit trail</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-gray-600">{user.role}</p>
              </div>
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                {user.name.charAt(0)}
              </div>
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-red-600 transition-colors"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <div className="bg-white border-b sticky top-[73px] z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-6 overflow-x-auto">
            <button
              onClick={() => setCurrentView('dashboard')}
              className={`py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap flex items-center gap-2 ${
                currentView === 'dashboard'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Home size={18} />
              Dashboard
            </button>
            <button
              onClick={() => setCurrentView('reconciliation')}
              className={`py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap flex items-center gap-2 ${
                currentView === 'reconciliation'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Database size={18} />
              Reconciliation View
            </button>
            <button
              onClick={() => setCurrentView('jobs')}
              className={`py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap flex items-center gap-2 ${
                currentView === 'jobs'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Activity size={18} />
              Upload Jobs
            </button>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'dashboard' && data && (
          <>
            {/* Action Bar */}
            <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-4">
                <Filter size={20} className="text-gray-600" />
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                  className="px-3 py-2 border rounded-lg text-sm"
                  placeholder="From Date"
                />
                <input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                  className="px-3 py-2 border rounded-lg text-sm"
                  placeholder="To Date"
                />
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  className="px-3 py-2 border rounded-lg text-sm"
                >
                  <option value="">All Statuses</option>
                  <option value="Matched">Matched</option>
                  <option value="Partially Matched">Partially Matched</option>
                  <option value="Not Matched">Not Matched</option>
                  <option value="Duplicate">Duplicate</option>
                </select>
              </div>
              {canUpload && (
                <button
                  onClick={() => setShowUpload(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
                >
                  <Upload size={20} />
                  Upload File
                </button>
              )}
            </div>
            
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <DashboardCard
                title="Total Records"
                value={data.summary.totalRecords.toLocaleString()}
                icon={FileText}
                color="#3b82f6"
              />
              <DashboardCard
                title="Matched Records"
                value={data.summary.matched.toLocaleString()}
                icon={CheckCircle}
                color="#10b981"
                subtitle={`${data.summary.accuracy}% accuracy`}
              />
              <DashboardCard
                title="Unmatched Records"
                value={data.summary.unmatched.toLocaleString()}
                icon={XCircle}
                color="#ef4444"
              />
              <DashboardCard
                title="Duplicates"
                value={data.summary.duplicates.toLocaleString()}
                icon={AlertCircle}
                color="#8b5cf6"
              />
            </div>
            
            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">Reconciliation Status Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={data.chartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {data.chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">Records by Status</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data.chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}
        
        {currentView === 'reconciliation' && data && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">Reconciliation Records</h2>
              <p className="text-sm text-gray-600 mt-1">View and manage transaction matching results</p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Transaction ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Reference
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.records.slice(0, 20).map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {record.transactionId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${parseFloat(record.amount).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {record.referenceNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {record.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(record.status)}
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                            {record.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => setShowAudit(record.id)}
                          className="text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
                        >
                          <Eye size={16} />
                          View Audit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {currentView === 'jobs' && (
          <UploadJobsView />
        )}
      </div>
      
      {/* Modals */}
      {showUpload && (
        <FileUploadModal
          onClose={() => setShowUpload(false)}
          onUpload={handleUpload}
          userRole={user.role}
        />
      )}
      
      {showAudit && (
        <AuditTimeline
          recordId={showAudit}
          onClose={() => setShowAudit(null)}
        />
      )}
    </div>
  );
};

export default App;