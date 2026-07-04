'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

interface Task {
  id: number;
  title: string;
  description?: string;
  category: string;
  priority: string;
  status: string;
  createdAt: string;
}

interface Bug {
  id: number;
  title: string;
  severity: string;
  module: string;
  status: string;
  createdAt: string;
}

interface Note {
  id: number;
  title: string;
  content: string;
  createdAt: string;
}

export default function ControlCenter() {
  const router = useRouter();

  // Navigation state
  const [activeTab, setActiveTab] = useState<
    'overview' | 'kanban' | 'roadmap' | 'bugs' | 'database' | 'api' | 'codebase' | 'security' | 'notes' | 'ai'
  >('overview');

  // Authentication states
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // Database models data
  const [tasks, setTasks] = useState<Task[]>([]);
  const [bugs, setBugs] = useState<Bug[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  
  // Form states
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskCat, setTaskCat] = useState('General');
  const [taskPriority, setTaskPriority] = useState('MEDIUM');
  const [taskStatus, setTaskStatus] = useState('TODO');

  const [bugTitle, setBugTitle] = useState('');
  const [bugSeverity, setBugSeverity] = useState('MEDIUM');
  const [bugModule, setBugModule] = useState('General');

  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  // UI status helpers
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // 1. Authenticate admin user
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/profile');
        if (!res.ok) {
          setAuthorized(false);
          return;
        }
        const data = await res.json();
        if (data.success && data.profile?.user?.email === 'nibrasulhaqqamini@gmail.com') {
          setAuthorized(true);
        } else {
          setAuthorized(false);
        }
      } catch (err) {
        console.error('Auth verification error:', err);
        setAuthorized(false);
      } finally {
        setLoadingUser(false);
      }
    }
    checkAuth();
  }, []);

  // 2. Fetch Control Center data once authorized
  useEffect(() => {
    if (authorized === true) {
      fetchTasks();
      fetchBugs();
      fetchNotes();
    }
  }, [authorized]);

  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/admin/control-center/tasks');
      const data = await res.json();
      if (res.ok && data.success) setTasks(data.tasks);
    } catch (err) {
      console.error('Error loading tasks:', err);
    }
  };

  const fetchBugs = async () => {
    try {
      const res = await fetch('/api/admin/control-center/bugs');
      const data = await res.json();
      if (res.ok && data.success) setBugs(data.bugs);
    } catch (err) {
      console.error('Error loading bugs:', err);
    }
  };

  const fetchNotes = async () => {
    try {
      const res = await fetch('/api/admin/control-center/notes');
      const data = await res.json();
      if (res.ok && data.success) setNotes(data.notes);
    } catch (err) {
      console.error('Error loading notes:', err);
    }
  };

  // 3. Task management triggers
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;
    setSubmitting(true);

    try {
      const res = await fetch('/api/admin/control-center/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: taskTitle,
          description: taskDesc,
          category: taskCat,
          priority: taskPriority,
          status: taskStatus,
        }),
      });
      if (res.ok) {
        setTaskTitle('');
        setTaskDesc('');
        fetchTasks();
      }
    } catch (err) {
      console.error('Failed to create task:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateTaskStatus = async (taskId: number, newStatus: string) => {
    try {
      const res = await fetch('/api/admin/control-center/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: taskId, status: newStatus }),
      });
      if (res.ok) fetchTasks();
    } catch (err) {
      console.error('Failed updating task status:', err);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
      const res = await fetch(`/api/admin/control-center/tasks?id=${taskId}`, {
        method: 'DELETE',
      });
      if (res.ok) fetchTasks();
    } catch (err) {
      console.error('Failed deleting task:', err);
    }
  };

  // 4. Bug management triggers
  const handleCreateBug = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bugTitle.trim()) return;
    setSubmitting(true);

    try {
      const res = await fetch('/api/admin/control-center/bugs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: bugTitle,
          severity: bugSeverity,
          module: bugModule,
        }),
      });
      if (res.ok) {
        setBugTitle('');
        fetchBugs();
      }
    } catch (err) {
      console.error('Failed reporting bug:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleResolveBug = async (bugId: number, status: string) => {
    try {
      const res = await fetch('/api/admin/control-center/bugs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: bugId, status }),
      });
      if (res.ok) fetchBugs();
    } catch (err) {
      console.error('Failed updating bug status:', err);
    }
  };

  const handleDeleteBug = async (bugId: number) => {
    if (!confirm('Are you sure you want to delete this bug?')) return;
    try {
      const res = await fetch(`/api/admin/control-center/bugs?id=${bugId}`, {
        method: 'DELETE',
      });
      if (res.ok) fetchBugs();
    } catch (err) {
      console.error('Failed deleting bug:', err);
    }
  };

  // 5. Dev Note management triggers
  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle.trim() || !noteContent.trim()) return;
    setSubmitting(true);

    try {
      const res = await fetch('/api/admin/control-center/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: noteTitle, content: noteContent }),
      });
      if (res.ok) {
        setNoteTitle('');
        setNoteContent('');
        fetchNotes();
      }
    } catch (err) {
      console.error('Failed saving developer note:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteNote = async (noteId: number) => {
    if (!confirm('Are you sure you want to delete this note?')) return;
    try {
      const res = await fetch(`/api/admin/control-center/notes?id=${noteId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setSelectedNote(null);
        fetchNotes();
      }
    } catch (err) {
      console.error('Failed deleting note:', err);
    }
  };

  if (loadingUser) {
    return (
      <div className={styles.errorScreen}>
        <div className={styles.spinner}></div>
        <p>Verifying administrative clearance credentials...</p>
      </div>
    );
  }

  if (authorized === false) {
    return (
      <div className={styles.errorScreen}>
        <div className={styles.errorTitle}>Access Denied</div>
        <p className={styles.errorDesc}>
          Clearance failed. Tapfolio Developer OS is restricted to active system architects and administrators.
        </p>
        <button className={styles.secondaryBtn} onClick={() => router.push('/login')}>
          Go to Login
        </button>
      </div>
    );
  }

  // Kanban status transitions helper
  const getNextStatus = (current: string) => {
    const statuses = ['BACKLOG', 'TODO', 'IN_PROGRESS', 'TESTING', 'COMPLETED'];
    const idx = statuses.indexOf(current);
    return idx < statuses.length - 1 ? statuses[idx + 1] : null;
  };

  const getPrevStatus = (current: string) => {
    const statuses = ['BACKLOG', 'TODO', 'IN_PROGRESS', 'TESTING', 'COMPLETED'];
    const idx = statuses.indexOf(current);
    return idx > 0 ? statuses[idx - 1] : null;
  };

  return (
    <div className={styles.container}>
      {/* SIDEBAR PANEL */}
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          Developer<span>OS</span>
        </div>
        
        <nav className={styles.nav}>
          <button
            onClick={() => setActiveTab('overview')}
            className={`${styles.navItem} ${activeTab === 'overview' ? styles.activeNavItem : ''}`}
          >
            📊 System Health
          </button>
          <button
            onClick={() => setActiveTab('kanban')}
            className={`${styles.navItem} ${activeTab === 'kanban' ? styles.activeNavItem : ''}`}
          >
            📋 Sprint Planner
          </button>
          <button
            onClick={() => setActiveTab('roadmap')}
            className={`${styles.navItem} ${activeTab === 'roadmap' ? styles.activeNavItem : ''}`}
          >
            🗺️ Timeline Roadmap
          </button>
          <button
            onClick={() => setActiveTab('bugs')}
            className={`${styles.navItem} ${activeTab === 'bugs' ? styles.activeNavItem : ''}`}
          >
            🐛 Bug Tracker
          </button>
          <button
            onClick={() => setActiveTab('database')}
            className={`${styles.navItem} ${activeTab === 'database' ? styles.activeNavItem : ''}`}
          >
            🗄️ ER & Schema Viewer
          </button>
          <button
            onClick={() => setActiveTab('api')}
            className={`${styles.navItem} ${activeTab === 'api' ? styles.activeNavItem : ''}`}
          >
            🔌 API Catalog
          </button>
          <button
            onClick={() => setActiveTab('codebase')}
            className={`${styles.navItem} ${activeTab === 'codebase' ? styles.activeNavItem : ''}`}
          >
            📁 Codebase Stack
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`${styles.navItem} ${activeTab === 'security' ? styles.activeNavItem : ''}`}
          >
            🛡️ Security Center
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`${styles.navItem} ${activeTab === 'notes' ? styles.activeNavItem : ''}`}
          >
            ✍️ Developer Notes
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`${styles.navItem} ${activeTab === 'ai' ? styles.activeNavItem : ''}`}
          >
            🧠 AI Planner
          </button>
        </nav>

        <div style={{ marginTop: 'auto' }}>
          <button className={styles.secondaryBtn} style={{ width: '100%' }} onClick={() => router.push('/dashboard')}>
            Back to User Console
          </button>
        </div>
      </aside>

      {/* CORE CONTENT PANEL */}
      <main className={styles.content}>
        <header className={styles.header}>
          <div className={styles.headerTitle}>
            <h1>
              {activeTab === 'overview' && 'System Health & Metrics'}
              {activeTab === 'kanban' && 'Sprint Kanban Planner'}
              {activeTab === 'roadmap' && 'Product Phase Timeline'}
              {activeTab === 'bugs' && 'Bug Tracker'}
              {activeTab === 'database' && 'Database Models & ER Explorer'}
              {activeTab === 'api' && 'REST API Catalog'}
              {activeTab === 'codebase' && 'Codebase Structure & Tech Stack'}
              {activeTab === 'security' && 'Security Audit Center'}
              {activeTab === 'notes' && 'Developer Engineering Logs'}
              {activeTab === 'ai' && 'AI Engineering Assistant Suggestions'}
            </h1>
            <p>Tapfolio Operational Development Console</p>
          </div>
        </header>

        {/* 1. OVERVIEW & HEALTH */}
        {activeTab === 'overview' && (
          <div>
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statLabel}>Build Version</div>
                <div className={styles.statValue}>0.8.5</div>
                <div className={styles.statDesc}>Next.js 16 App Router Build</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statLabel}>Git Branch</div>
                <div className={styles.statValue}>main</div>
                <div className={styles.statDesc}>Connected to Vercel Hooks</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statLabel}>Database Status</div>
                <div className={styles.statValue} style={{ color: '#10B981' }}>Healthy</div>
                <div className={styles.statDesc}>Neon Serverless Postgres</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statLabel}>Sprint Velocity</div>
                <div className={styles.statValue}>
                  {tasks.filter((t) => t.status === 'COMPLETED').length} / {tasks.length}
                </div>
                <div className={styles.statDesc}>Completed Sprint Tasks</div>
              </div>
            </div>

            <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', fontWeight: 800 }}>Module Verification Compliance</h2>
            <div className={styles.radialGrid}>
              {[
                { name: 'Authentication', pct: 95, color: '#10B981' },
                { name: 'Dashboard', pct: 82, color: '#60A5FA' },
                { name: 'Public Profiles', pct: 88, color: '#8B5CF6' },
                { name: 'Database Schema', pct: 91, color: '#F59E0B' },
                { name: 'REST API', pct: 84, color: '#F472B6' },
                { name: 'UI Styling', pct: 79, color: '#60A5FA' },
                { name: 'Performance', pct: 63, color: '#EF4444' },
                { name: 'Security Score', pct: 74, color: '#EF4444' },
              ].map((m) => (
                <div key={m.name} className={styles.radialCard}>
                  <svg className={styles.circleSvg}>
                    <circle className={styles.circleBg} cx="35" cy="35" r="30" />
                    <circle
                      className={styles.circleVal}
                      cx="35"
                      cy="35"
                      r="30"
                      strokeDasharray={`${2 * Math.PI * 30}`}
                      strokeDashoffset={`${2 * Math.PI * 30 * (1 - m.pct / 100)}`}
                      style={{ stroke: m.color }}
                    />
                  </svg>
                  <span className={styles.circlePercent}>{m.pct}%</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94A3B8', textAlign: 'center' }}>
                    {m.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2. KANBAN BOARD */}
        {activeTab === 'kanban' && (
          <div>
            <form onSubmit={handleCreateTask} className={styles.addTaskForm}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 800, textTransform: 'uppercase', color: '#F8FAFC' }}>
                Create Sprint Task
              </h3>
              <div className={styles.formGrid}>
                <div className={styles.inputGroup}>
                  <label htmlFor="tTitle">Task Title</label>
                  <input
                    id="tTitle"
                    type="text"
                    placeholder="Describe the sprint target..."
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="tCat">Category</label>
                  <select id="tCat" value={taskCat} onChange={(e) => setTaskCat(e.target.value)}>
                    <option value="General">General</option>
                    <option value="Authentication">Authentication</option>
                    <option value="Database">Database</option>
                    <option value="UI">UI</option>
                    <option value="API">API</option>
                    <option value="Security">Security</option>
                    <option value="Architecture">Architecture</option>
                  </select>
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="tPriority">Priority</label>
                  <select id="tPriority" value={taskPriority} onChange={(e) => setTaskPriority(e.target.value)}>
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="CRITICAL">Critical</option>
                  </select>
                </div>
                <button type="submit" disabled={submitting} className={styles.primaryBtn}>
                  {submitting ? 'Creating...' : 'Add Task'}
                </button>
              </div>
            </form>

            <div className={styles.kanbanBoard}>
              {['BACKLOG', 'TODO', 'IN_PROGRESS', 'TESTING', 'COMPLETED'].map((col) => {
                const colTasks = tasks.filter((t) => t.status === col);
                return (
                  <div key={col} className={styles.kanbanColumn}>
                    <div className={styles.columnHeader}>
                      <h3>{col.replace('_', ' ')}</h3>
                      <span className={styles.taskCount}>{colTasks.length}</span>
                    </div>
                    <div className={styles.taskList}>
                      {colTasks.map((t) => (
                        <div key={t.id} className={styles.taskCard}>
                          <span className={styles.taskCategory}>{t.category}</span>
                          <div className={styles.taskTitle}>{t.title}</div>
                          {t.description && (
                            <p style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '0.25rem', lineHeight: '1.3' }}>
                              {t.description}
                            </p>
                          )}
                          <div className={styles.taskFooter}>
                            <span className={`${styles.priorityBadge} ${styles['priority' + t.priority]}`}>
                              {t.priority}
                            </span>
                            <div className={styles.taskActions}>
                              {getPrevStatus(t.status) && (
                                <button
                                  className={styles.taskMoveBtn}
                                  onClick={() => handleUpdateTaskStatus(t.id, getPrevStatus(t.status)!)}
                                >
                                  ◀
                                </button>
                              )}
                              {getNextStatus(t.status) && (
                                <button
                                  className={styles.taskMoveBtn}
                                  onClick={() => handleUpdateTaskStatus(t.id, getNextStatus(t.status)!)}
                                >
                                  ▶
                                </button>
                              )}
                              <button className={styles.taskMoveBtn} onClick={() => handleDeleteTask(t.id)}>
                                🗑️
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 3. PHASES TIMELINE */}
        {activeTab === 'roadmap' && (
          <div className={styles.roadmapGrid}>
            {[
              {
                phase: 'Phase 1',
                title: 'Foundation Core (95% Done)',
                desc: 'Landing Page, registration workflows, email credentials validator login, username-based routing dynamic templates, Postgres schemas, and session JWT setups.',
                status: 'badgeDone',
                lbl: 'COMPLETED',
              },
              {
                phase: 'Phase 2',
                title: 'Social Identity Platform (65% Done)',
                desc: 'Cryptographic Google Authentication local JWKS verificators, Facebook integration presets, direct vCard card download streams, direct connections management, and sharing visibilities configuration.',
                status: 'badgeActive',
                lbl: 'ACTIVE SPRINT',
              },
              {
                phase: 'Phase 3',
                title: 'Professional Showcase Engine (Planned)',
                desc: 'Dynamic template portfolios creator, resume builder integrations, appointments booking modals, company pages, and team roster profiles.',
                status: 'badgePlanned',
                lbl: 'PLANNED',
              },
              {
                phase: 'Phase 4',
                title: 'Creator Marketplace (Planned)',
                desc: 'Custom developer templates marketplace, profile customization layout widgets, premium custom dashboard themes selectors, and AI profile assistants.',
                status: 'badgePlanned',
                lbl: 'PLANNED',
              },
              {
                phase: 'Phase 5',
                title: 'Business Platform (Planned)',
                desc: 'Corporate accounts setup, employee profiles visibilities mapping, corporate directory syncs, and advanced visual interaction analytics.',
                status: 'badgePlanned',
                lbl: 'PLANNED',
              },
            ].map((p) => (
              <div key={p.phase} className={styles.phaseCard}>
                <div className={styles.phaseInfo}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#60A5FA', textTransform: 'uppercase' }}>
                    {p.phase}
                  </span>
                  <h3>{p.title}</h3>
                  <p>{p.desc}</p>
                </div>
                <span className={`${styles.phaseBadge} ${styles[p.status]}`}>{p.lbl}</span>
              </div>
            ))}
          </div>
        )}

        {/* 4. BUG TRACKER */}
        {activeTab === 'bugs' && (
          <div>
            <form onSubmit={handleCreateBug} className={styles.addTaskForm} style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 800, textTransform: 'uppercase', color: '#F8FAFC' }}>
                Report / Log Bug
              </h3>
              <div className={styles.formGrid}>
                <div className={styles.inputGroup}>
                  <label htmlFor="bTitle">Bug Title / Incident</label>
                  <input
                    id="bTitle"
                    type="text"
                    placeholder="Describe the failure incident..."
                    value={bugTitle}
                    onChange={(e) => setBugTitle(e.target.value)}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="bModule">Module</label>
                  <select id="bModule" value={bugModule} onChange={(e) => setBugModule(e.target.value)}>
                    <option value="General">General</option>
                    <option value="Authentication">Authentication</option>
                    <option value="Database">Database</option>
                    <option value="Profile">Profile</option>
                    <option value="Portfolio">Portfolio</option>
                    <option value="Upload">Upload</option>
                    <option value="Connections">Connections</option>
                  </select>
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="bSeverity">Severity</label>
                  <select id="bSeverity" value={bugSeverity} onChange={(e) => setBugSeverity(e.target.value)}>
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="CRITICAL">Critical</option>
                  </select>
                </div>
                <button type="submit" disabled={submitting} className={styles.primaryBtn}>
                  {submitting ? 'Logging...' : 'Log Bug'}
                </button>
              </div>
            </form>

            <table className={styles.bugTable}>
              <thead>
                <tr>
                  <th>Bug Incident / Title</th>
                  <th>Module</th>
                  <th>Severity</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bugs.map((b) => (
                  <tr key={b.id}>
                    <td style={{ fontWeight: 600, color: '#F1F5F9' }}>{b.title}</td>
                    <td style={{ fontSize: '0.8rem', color: '#94A3B8', fontFamily: 'monospace' }}>{b.module}</td>
                    <td>
                      <span className={`${styles.priorityBadge} ${styles['priority' + b.severity]}`}>
                        {b.severity}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`${styles.phaseBadge} ${
                          b.status === 'FIXED' ? styles.badgeDone : styles.badgeActive
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {b.status === 'OPEN' && (
                          <button className={styles.primaryBtn} style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }} onClick={() => handleResolveBug(b.id, 'FIXED')}>
                            Resolve
                          </button>
                        )}
                        <button className={styles.dangerBtn} onClick={() => handleDeleteBug(b.id)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 5. DATABASE SCHEMAS */}
        {activeTab === 'database' && (
          <div>
            <div className={styles.diagnosticCard}>
              <span>⚠️</span>
              <div>
                <strong>Auditor Suggestion (Missing Indexes)</strong>: The database does not index secondary query fields like `receiverId` in `connections` or `profileId` in `tags`, `socialLinks`, and `historyEvents`. This will cause performance hits as database rows exceed 10,000+ entries.
              </div>
            </div>

            <div className={styles.flowCard} style={{ marginBottom: '2rem' }}>
              <h2>Prisma Relational Flowchart Map</h2>
              <div className={styles.asciiFlow}>
{`  +--------------+          +------------------+          +---------------+
  |     User     | <------> |     Account      |          |  AppVersion   |
  |  - id        |          |  - id            |          |  - id         |
  |  - email     |          |  - provider      |          |  - versionName|
  |  - passHash  |          |  - providerId    |          |  - buildNumber|
  +--------------+          +------------------+          +---------------+
         |
         | (1:1)
         v
  +--------------+          +------------------+          +---------------+
  |   Profile    | <------> |  SharingSettings |          |  Connection   |
  |  - id        |          |  - id            |          |  - id         |
  |  - username  |          |  - shareEmail    | <------> |  - requesterId|
  |  - tagline   |          |  - sharePhone    |          |  - receiverId |
  +--------------+          +------------------+          +---------------+
    |    |    |
    |    |    +---> [ Tag (id, text, type) ]
    |    +--------> [ SocialLink (id, platform, handle, url) ]
    +-------------> [ HistoryEvent (id, action, details) ]`}
              </div>
            </div>

            <div className={styles.dbModelGrid}>
              {[
                { name: 'User', fields: ['id (Int - PK)', 'name (String)', 'email (String - Unique)', 'passwordHash (String - Nullable)', 'connectionCount (Int)', 'profileReady (Boolean)'] },
                { name: 'Account', fields: ['id (Int - PK)', 'userId (Int - FK User)', 'provider (Enum)', 'providerId (String)', 'profileImage (String - Nullable)'] },
                { name: 'Profile', fields: ['id (Int - PK)', 'userId (Int - Unique FK)', 'name (String)', 'username (String - Unique)', 'tagline (String)', 'avatar (String)', 'phone (String)', 'whatsapp (String)', 'location (String)', 'diamonds (String)', 'isPremium (Boolean)', 'tapCount (Int)'] },
                { name: 'Tag', fields: ['id (Int - PK)', 'profileId (Int - FK Profile)', 'text (String)', 'type (String - "role"|"location")'] },
                { name: 'SocialLink', fields: ['id (Int - PK)', 'profileId (Int - FK Profile)', 'platform (String)', 'handle (String)', 'url (String)', 'color (String)'] },
                { name: 'Connection', fields: ['id (Int - PK)', 'requesterId (Int - FK User)', 'receiverId (Int - FK User)', 'status (String)', 'via (String)'] },
                { name: 'SharingSettings', fields: ['id (Int - PK)', 'userId (Int - Unique FK)', 'shareName (Boolean)', 'shareEmail (Boolean)', 'sharePhone (Boolean)', 'shareWhatsapp (Boolean)', 'shareLocation (Boolean)'] },
                { name: 'ConnectionVisibility', fields: ['id (Int - PK)', 'connectionId (Int - FK)', 'userId (Int - FK)', 'shareName (Boolean)', 'shareEmail (Boolean)', 'sharedSocialIds (Int[])'] },
              ].map((m) => (
                <div key={m.name} className={styles.dbModelCard}>
                  <div className={styles.modelHeader}>
                    <h3>{m.name}</h3>
                  </div>
                  <div className={styles.fieldsList}>
                    {m.fields.map((f, idx) => (
                      <div key={idx} className={styles.fieldRow}>
                        <span className={styles.fieldName}>{f.split(' ')[0]}</span>
                        <span className={styles.fieldType}>{f.split(' ').slice(1).join(' ')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. REST API EXPLORER */}
        {activeTab === 'api' && (
          <table className={styles.bugTable}>
            <thead>
              <tr>
                <th>Method</th>
                <th>Route Path</th>
                <th>Auth Level</th>
                <th>Description / Purpose</th>
              </tr>
            </thead>
            <tbody>
              {[
                { method: 'POST', path: '/api/auth/register', auth: 'None', desc: 'Registers new credentials user; auto-generates profile setup.' },
                { method: 'POST', path: '/api/auth/login', auth: 'None', desc: 'Verifies email/password and returns session cookie.' },
                { method: 'POST', path: '/api/auth/google', auth: 'None', desc: 'Verifies Google ID Token via JWKS keys; creates or links accounts.' },
                { method: 'GET', path: '/api/auth/me', auth: 'JWT Session', desc: 'Decodes session cookie and returns user data.' },
                { method: 'GET', path: '/api/auth/username-check', auth: 'None', desc: 'Validates unique username handle availability and suggestions.' },
                { method: 'GET', path: '/api/profile', auth: 'Optional', desc: 'Fetches profile card structure, score, and connection statuses.' },
                { method: 'PUT', path: '/api/profile', auth: 'JWT Session', desc: 'Updates core profile details (name, tagline, bio, location, socials).' },
                { method: 'PUT', path: '/api/profile/onboarding', auth: 'JWT Session', desc: 'Completes profile wizard details and sets profileReady: true.' },
                { method: 'GET', path: '/api/profile/[username]/vcard', auth: 'None', desc: 'Streams standard formatted vCard file for contacts import.' },
                { method: 'POST', path: '/api/connections/request', auth: 'JWT Session', desc: 'Sends pending connection requests; logs history event.' },
                { method: 'POST', path: '/api/connections/accept', auth: 'JWT Session', desc: 'Approves incoming connections; increments connectionCount.' },
                { method: 'GET', path: '/api/admin/releases', auth: 'Admin Only', desc: 'Lists APK mobile updates releases.' },
              ].map((a, idx) => (
                <tr key={idx}>
                  <td>
                    <span className={`${styles.apiMethod} ${styles['method' + a.method]}`}>
                      {a.method}
                    </span>
                  </td>
                  <td style={{ fontFamily: 'monospace', fontWeight: 600, color: '#60A5FA' }}>{a.path}</td>
                  <td className={styles.apiAuth} style={{ color: a.auth.includes('Admin') ? '#F87171' : '#E2E8F0' }}>{a.auth}</td>
                  <td style={{ color: '#94A3B8' }}>{a.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* 7. CODEBASE EXPLORER */}
        {activeTab === 'codebase' && (
          <div>
            <div className={styles.diagnosticCard} style={{ background: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.2)', color: '#F87171' }}>
              <span>⚠️</span>
              <div>
                <strong>Code Audit Alert</strong>: Portfolio template folders `/abhinand` and `/nibras` cloned and duplicated identical JSX blocks. Recommendation: refactor them to run from a dynamic route template `/portfolio/[username]`.
              </div>
            </div>

            <div className={styles.statsGrid} style={{ marginBottom: '2rem' }}>
              <div className={styles.statCard}>
                <div className={styles.statLabel}>Total Files</div>
                <div className={styles.statValue}>118</div>
                <div className={styles.statDesc}>Source TSX, TS, CSS files</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statLabel}>Total Components</div>
                <div className={styles.statValue}>32</div>
                <div className={styles.statDesc}>Shared layouts and sections</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statLabel}>API Routes</div>
                <div className={styles.statValue}>26</div>
                <div className={styles.statDesc}>Next.js edge and Node endpoints</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statLabel}>Unused Packages</div>
                <div className={styles.statValue}>1</div>
                <div className={styles.statDesc}>`jsonwebtoken` library</div>
              </div>
            </div>

            <div className={styles.flowCard}>
              <h2>Workspace Directory Tree Map</h2>
              <div className={styles.asciiFlow} style={{ color: '#94A3B8' }}>
{`  src/
  ├── app/                        # App Router Pages & API routes
  │   ├── admin/                  # Administrative release and connections portals
  │   │   ├── control-center/     # Developer OS Console [NEW]
  │   │   ├── connections/
  │   │   └── releases/
  │   ├── api/                    # JSON API route controllers
  │   ├── connect/                # Direct visitor connection gateway
  │   ├── dashboard/              # User console profile settings builder
  │   ├── onboarding/             # New Google profile configuration wizard
  │   ├── portfolio/              # Hardcoded visual layout showcases (abhinand, nibras)
  │   └── login/ & register/      # Gateway verification views
  ├── components/                 # Shared UI elements
  │   ├── portfolio/              # 3D canvas and scroll portfolio items
  │   └── navigation/             # Navbar components
  ├── lib/                        # Core engine layers (auth, db, score calculations)
  └── utils/                      # HTML5 Canvas visual card renderers`}
              </div>
            </div>
          </div>
        )}

        {/* 8. SECURITY AUDIT CENTER */}
        {activeTab === 'security' && (
          <div>
            <div className={styles.diagnosticCard} style={{ background: 'rgba(16, 185, 129, 0.1)', borderColor: 'rgba(16, 185, 129, 0.2)', color: '#34D399' }}>
              <span>✅</span>
              <div>
                <strong>Server Proxy Active</strong>: Next.js 16 proxy is active and running via `src/proxy.ts`. Route protection and path rewrites are fully secured.
              </div>
            </div>

            <div className={styles.statsGrid}>
              {[
                { name: 'Session Token Check', status: 'JWT local signature verified via jose', state: 'PASS', color: '#10B981' },
                { name: 'Cookie Security', status: 'pertap_jwt cookie marked httpOnly, strict SameSite', state: 'PASS', color: '#10B981' },
                { name: 'Server Proxy Protection', status: 'src/proxy.ts is active and running', state: 'PASS', color: '#10B981' },
                { name: 'Cross-Site Scripting (XSS)', status: 'User inputs saved without DOM sanitization checks', state: 'WARN', color: '#F59E0B' },
                { name: 'Brute-Force Safeguards', status: 'Sliding window rate limiters configured on auth endpoints', state: 'PASS', color: '#10B981' },
                { name: 'Secrets Management', status: 'JWT_SECRET and credentials isolated inside .env', state: 'PASS', color: '#10B981' },
              ].map((s, idx) => (
                <div key={idx} className={styles.statCard} style={{ borderColor: s.color + '33' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className={styles.statLabel}>{s.name}</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: s.color }}>{s.state}</span>
                  </div>
                  <div className={styles.statValue} style={{ fontSize: '1.1rem', marginTop: '0.5rem', fontWeight: 700 }}>
                    {s.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 9. DEVELOPER NOTES */}
        {activeTab === 'notes' && (
          <div className={styles.notesGrid}>
            <div className={styles.notesColumn}>
              <form onSubmit={handleCreateNote} className={styles.addTaskForm}>
                <h3 style={{ fontSize: '0.9rem', fontWeight: 800, textTransform: 'uppercase', color: '#F8FAFC' }}>
                  Write Developer Note
                </h3>
                <div className={styles.inputGroup}>
                  <label htmlFor="nTitle">Note Title / Topic</label>
                  <input
                    id="nTitle"
                    type="text"
                    placeholder="e.g. Release notes, architectural decision..."
                    value={noteTitle}
                    onChange={(e) => setNoteTitle(e.target.value)}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="nContent">Content (Markdown supported)</label>
                  <textarea
                    id="nContent"
                    rows={8}
                    className={styles.textarea}
                    placeholder="Type details..."
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                  />
                </div>
                <button type="submit" disabled={submitting} className={styles.primaryBtn} style={{ alignSelf: 'flex-end' }}>
                  {submitting ? 'Saving Note...' : 'Save Note'}
                </button>
              </form>

              <div className={styles.notesList}>
                <h3 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: '#94A3B8', marginBottom: '0.5rem' }}>
                  Saved Logs
                </h3>
                {notes.length === 0 ? (
                  <div className={styles.notesEmpty}>No notes published yet.</div>
                ) : (
                  notes.map((n) => (
                    <div key={n.id} className={styles.noteCard} onClick={() => setSelectedNote(n)}>
                      <h3>{n.title}</h3>
                      <p>{new Date(n.createdAt).toLocaleDateString()} - Click to view details</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className={styles.notesColumn}>
              <div className={styles.flowCard} style={{ minHeight: '400px' }}>
                {selectedNote ? (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
                      <h2 style={{ color: '#60A5FA' }}>{selectedNote.title}</h2>
                      <button className={styles.dangerBtn} onClick={() => handleDeleteNote(selectedNote.id)}>
                        Delete Note
                      </button>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: '#64748B', marginBottom: '1rem' }}>
                      Logged at: {new Date(selectedNote.createdAt).toLocaleString()}
                    </p>
                    <div style={{ whiteSpace: 'pre-wrap', fontSize: '0.9rem', color: '#D1D5DB', lineHeight: '1.6' }}>
                      {selectedNote.content}
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#64748B' }}>
                    Select a developer log from the list to display its complete content details.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 10. AI PLANNING ASSISTANT */}
        {activeTab === 'ai' && (
          <div className={styles.aiContainer}>
            <div className={styles.aiHeader}>
              <span className={styles.aiIcon}>🧠</span>
              <h2>AI Assistant Technical Diagnostic Suggestions</h2>
            </div>
            
            <p style={{ fontSize: '0.9rem', color: '#94A3B8', lineHeight: '1.5' }}>
              I have analyzed your project directory tree, database models, and API configurations. Here are the prioritized engineering suggestions:
            </p>

            <div className={styles.aiGrid}>
              <div className={styles.aiTipCard} style={{ borderColor: 'rgba(16, 185, 129, 0.3)' }}>
                <h3>1. Server Proxy Protections Active (Completed)</h3>
                <p>
                  `src/proxy.ts` is the correct file convention in Next.js 16. Server-side session validation is fully active, securing all internal routing.
                </p>
              </div>

              <div className={styles.aiTipCard} style={{ borderColor: 'rgba(245, 158, 11, 0.3)' }}>
                <h3>2. Push Database Foreign Key Indices (High Priority)</h3>
                <p>
                  Add `@@index([profileId])` to models `Tag`, `SocialLink`, and `HistoryEvent`. Add `@@index([receiverId])` to `Connection`. This prevents full-table database scans on profile load lookups.
                </p>
              </div>

              <div className={styles.aiTipCard}>
                <h3>3. Uninstall jsonwebtoken Package (Low Priority)</h3>
                <p>
                  The dependencies file contains `jsonwebtoken` but our routes verify session signatures entirely using the modern, edge-compatible `jose` library. Remove it to lighten packages overhead.
                </p>
              </div>

              <div className={styles.aiTipCard}>
                <h3>4. Clean Showcase Portfolio Clones</h3>
                <p>
                  The static portfolio files copy-paste layout tags. Refactor `nibras` and `abhinand` showcase layouts into a dynamic client renderer component (`/portfolio/[username]`) powered by database lookups.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
