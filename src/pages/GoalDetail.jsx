import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import PageLoader from '../components/PageLoader';

export default function GoalDetail() {
  const { id } = useParams();
  const [goal, setGoal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newMilestone, setNewMilestone] = useState('');
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [resources, setResources] = useState([]);
  const [newResource, setNewResource] = useState({ title: '', url: '' });
  const [shareCopied, setShareCopied] = useState(false);

  const fetchGoal = useCallback(() => {
    return api.get(`/api/goals/${id}`)
      .then(res => {
        setGoal(res.data);
        setEditData({
          title: res.data.title,
          description: res.data.description,
          category: res.data.category,
          status: res.data.status,
          targetDate: res.data.targetDate,
          tags: (res.data.tags || []).join(', '),
          isPublic: res.data.isPublic,
        });
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  const fetchNotes = useCallback(() => {
    return api.get(`/api/goals/${id}/notes`)
      .then(res => setNotes(res.data))
      .catch(err => console.error(err));
  }, [id]);

  const fetchResources = useCallback(() => {
    return api.get(`/api/goals/${id}/resources`)
      .then(res => setResources(res.data))
      .catch(err => console.error(err));
  }, [id]);

  useEffect(() => {
    fetchGoal();
    fetchNotes();
    fetchResources();
  }, [fetchGoal, fetchNotes, fetchResources]);

  const handleAddMilestone = async (e) => {
    e.preventDefault();
    if (!newMilestone.trim()) return;
    await api.post(`/api/goals/${id}/milestones`, { title: newMilestone });
    setNewMilestone('');
    fetchGoal();
  };

  const handleToggleMilestone = async (milestone) => {
    await api.put(`/api/goals/${id}/milestones/${milestone.id}`, {
      title: milestone.title,
      completed: !milestone.completed,
    });
    fetchGoal();
  };

  const handleDeleteMilestone = async (mId) => {
    await api.delete(`/api/goals/${id}/milestones/${mId}`);
    fetchGoal();
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const payload = {
      ...editData,
      tags: editData.tags.split(',').map(t => t.trim()).filter(Boolean),
    };
    await api.put(`/api/goals/${id}`, payload);
    setEditing(false);
    fetchGoal();
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    await api.post(`/api/goals/${id}/notes`, { content: newNote });
    setNewNote('');
    fetchNotes();
  };

  const handleDeleteNote = async (nId) => {
    await api.delete(`/api/goals/${id}/notes/${nId}`);
    fetchNotes();
  };

  const handleAddResource = async (e) => {
    e.preventDefault();
    if (!newResource.title.trim() || !newResource.url.trim()) return;
    await api.post(`/api/goals/${id}/resources`, newResource);
    setNewResource({ title: '', url: '' });
    fetchResources();
  };

  const handleDeleteResource = async (rId) => {
    await api.delete(`/api/goals/${id}/resources/${rId}`);
    fetchResources();
  };

  const handleCopyShare = async () => {
    const url = `${window.location.origin}/shared/${goal.id}`;
    try {
      await navigator.clipboard.writeText(url);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    } catch {
      window.prompt('Copy this link:', url);
    }
  };

  const statusColor = (status) => {
    if (status === 'COMPLETED') return 'bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400';
    if (status === 'ABANDONED') return 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400';
    return 'bg-brand-100 text-brand-700 dark:bg-brand-500/15 dark:text-brand-400';
  };

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-base px-4">
      <div className="w-full max-w-3xl">
        <PageLoader />
      </div>
    </div>
  );

  if (!goal) return (
    <div className="flex min-h-screen items-center justify-center bg-base">
      <p className="text-muted">Goal not found.</p>
    </div>
  );

  const completed = goal.milestones?.filter(m => m.completed).length || 0;
  const total = goal.milestones?.length || 0;
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="min-h-screen bg-base">

      <Navbar />

      <div className="mx-auto max-w-3xl px-4 pt-8 pb-28 sm:px-6 md:pb-8">

        {!editing ? (
          <div className="card mb-6 p-6">
            <div className="mb-3 flex items-start justify-between gap-3">
              <h2 className="font-display text-2xl font-semibold text-ink">{goal.title}</h2>
              <span className={`chip whitespace-nowrap ${statusColor(goal.status)}`}>
                {goal.status.replace('_', ' ')}
              </span>
            </div>
            {goal.description && (
              <p className="mb-4 text-muted">{goal.description}</p>
            )}
            <div className="space-y-1 text-sm text-muted">
              {goal.category && <p>Category: {goal.category}</p>}
              {goal.targetDate && <p>Target Date: {goal.targetDate}</p>}
            </div>

            {goal.tags?.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {goal.tags.map(tag => (
                  <span key={tag} className="chip bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-400">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-4 flex items-center gap-2">
              <button onClick={() => setEditing(true)} className="btn btn-outline">
                Edit Goal
              </button>
              <button
                onClick={handleCopyShare}
                className="btn btn-outline"
                title="Copy public link"
              >
                {goal.isPublic ? (shareCopied ? 'Link copied!' : 'Share') : 'Share'}
              </button>
            </div>
            {!goal.isPublic && (
              <p className="mt-2 text-xs text-muted">
                Turn on &quot;Share publicly&quot; when editing to get a public link.
              </p>
            )}
          </div>
        ) : (
          <div className="card mb-6 p-6">
            <h3 className="font-display mb-4 text-lg font-semibold text-ink">Edit Goal</h3>
            <form onSubmit={handleUpdate} className="space-y-4">
              <input type="text" value={editData.title}
                onChange={e => setEditData({ ...editData, title: e.target.value })}
                className="input" required />
              <textarea value={editData.description}
                onChange={e => setEditData({ ...editData, description: e.target.value })}
                className="input resize-none" rows={3} />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <input type="text" placeholder="Category" value={editData.category}
                  onChange={e => setEditData({ ...editData, category: e.target.value })}
                  className="input" />
                <input type="date" value={editData.targetDate}
                  onChange={e => setEditData({ ...editData, targetDate: e.target.value })}
                  className="input" />
              </div>
              <input type="text" placeholder="Tags (comma separated)" value={editData.tags}
                onChange={e => setEditData({ ...editData, tags: e.target.value })}
                className="input" />
              <select value={editData.status}
                onChange={e => setEditData({ ...editData, status: e.target.value })}
                className="input">
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
                <option value="ABANDONED">Abandoned</option>
              </select>
              <label className="flex cursor-pointer items-center gap-2 text-sm text-ink">
                <input type="checkbox" checked={editData.isPublic}
                  onChange={e => setEditData({ ...editData, isPublic: e.target.checked })}
                  className="h-4 w-4 cursor-pointer accent-brand-600" />
                Share this goal publicly
              </label>
              <div className="flex gap-2">
                <button type="submit" className="btn btn-primary flex-1">
                  Save Changes
                </button>
                <button type="button" onClick={() => setEditing(false)} className="btn btn-outline flex-1">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="card mb-6 p-6">
          <div className="mb-2 flex justify-between text-sm text-muted">
            <span>Milestone Progress</span>
            <span>{completed}/{total} completed</span>
          </div>
          <div className="h-3 w-full rounded-full bg-line">
            <div
              className="h-3 rounded-full bg-gradient-to-r from-brand-400 to-brand-700 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-1 text-right text-xs text-muted">{progress}%</p>
        </div>

        <div className="card mb-6 p-6">
          <h3 className="font-display mb-4 text-lg font-semibold text-ink">Milestones</h3>

          <form onSubmit={handleAddMilestone} className="mb-4 flex gap-2">
            <input type="text" placeholder="Add a milestone..." value={newMilestone}
              onChange={e => setNewMilestone(e.target.value)}
              className="input flex-1" />
            <button type="submit" className="btn btn-primary">Add</button>
          </form>

          {goal.milestones?.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted">No milestones yet. Add one above!</p>
          ) : (
            <ul className="space-y-2">
              {goal.milestones?.map(milestone => (
                <li key={milestone.id} className="flex items-center justify-between gap-3 rounded-xl border border-line bg-base p-3">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" checked={milestone.completed}
                      onChange={() => handleToggleMilestone(milestone)}
                      className="h-4 w-4 cursor-pointer accent-brand-600" />
                    <span className={`text-sm ${milestone.completed ? 'text-muted line-through' : 'text-ink'}`}>
                      {milestone.title}
                    </span>
                  </div>
                  <button onClick={() => handleDeleteMilestone(milestone.id)}
                    className="text-xs text-muted transition hover:text-red-500">
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card mb-6 p-6">
          <h3 className="font-display mb-4 text-lg font-semibold text-ink">Journal</h3>

          <form onSubmit={handleAddNote} className="mb-4">
            <textarea placeholder="Write a note about your progress..." value={newNote}
              onChange={e => setNewNote(e.target.value)}
              className="input resize-none" rows={3} />
            <button type="submit" className="btn btn-primary mt-2">Add Note</button>
          </form>

          {notes.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted">No notes yet. Reflect on your progress!</p>
          ) : (
            <ul className="space-y-3">
              {notes.map(note => (
                <li key={note.id} className="rounded-xl border border-line bg-base p-3">
                  <p className="whitespace-pre-wrap text-sm text-ink">{note.content}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs text-muted">
                      {new Date(note.createdAt).toLocaleDateString()} {new Date(note.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <button onClick={() => handleDeleteNote(note.id)}
                      className="text-xs text-muted transition hover:text-red-500">
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card p-6">
          <h3 className="font-display mb-4 text-lg font-semibold text-ink">Resources</h3>

          <form onSubmit={handleAddResource} className="mb-4 flex flex-col gap-2 sm:flex-row">
            <input type="text" placeholder="Title (e.g. Course page)" value={newResource.title}
              onChange={e => setNewResource({ ...newResource, title: e.target.value })}
              className="input flex-1" />
            <input type="url" placeholder="https://..." value={newResource.url}
              onChange={e => setNewResource({ ...newResource, url: e.target.value })}
              className="input flex-1" />
            <button type="submit" className="btn btn-primary">Add</button>
          </form>

          {resources.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted">No resources yet. Add helpful links!</p>
          ) : (
            <ul className="space-y-2">
              {resources.map(resource => (
                <li key={resource.id} className="flex items-center justify-between gap-3 rounded-xl border border-line bg-base p-3">
                  <a href={resource.url} target="_blank" rel="noopener noreferrer"
                    className="truncate text-sm text-brand-600 hover:underline dark:text-brand-400">
                    {resource.title}
                  </a>
                  <button onClick={() => handleDeleteResource(resource.id)}
                    className="ml-3 text-xs text-muted transition hover:text-red-500">
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
