"use client";

import { useEffect, useState, useCallback } from "react";
import { apiFetch } from "@/lib/api";

interface UserProfile {
  user_id: number;
  email: string;
  full_name: string | null;
  role: string;
  is_active: boolean;
  last_login: string | null;
  created_at: string;
}

type Tab = "profile" | "users";

export default function AccountPage() {
  const [tab, setTab] = useState<Tab>("profile");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  const [profileForm, setProfileForm] = useState({ full_name: "", email: "" });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [passwordForm, setPasswordForm] = useState({ current_password: "", new_password: "", confirm_password: "" });
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [showCreateUser, setShowCreateUser] = useState(false);
  const [createForm, setCreateForm] = useState({ email: "", password: "", full_name: "", role: "admin" });
  const [createSaving, setCreateSaving] = useState(false);
  const [createMsg, setCreateMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [editForm, setEditForm] = useState({ full_name: "", email: "", role: "" });
  const [editSaving, setEditSaving] = useState(false);
  const [editMsg, setEditMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [resetPasswordUser, setResetPasswordUser] = useState<UserProfile | null>(null);
  const [resetPassword, setResetPassword] = useState("");
  const [resetSaving, setResetSaving] = useState(false);
  const [resetMsg, setResetMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchProfile = useCallback(async () => {
    try {
      const res = await apiFetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        setProfileForm({ full_name: data.full_name || "", email: data.email });
      }
    } catch { /* */ }
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await apiFetch("/api/auth/users");
      if (res.ok) setUsers(await res.json());
    } catch { /* */ }
  }, []);

  useEffect(() => {
    Promise.all([fetchProfile(), fetchUsers()]).finally(() => setLoading(false));
  }, [fetchProfile, fetchUsers]);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileMsg(null);
    try {
      const res = await apiFetch("/api/auth/me", {
        method: "PUT",
        body: JSON.stringify(profileForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update profile");
      setProfile((p) => (p ? { ...p, ...data } : p));
      setProfileMsg({ type: "success", text: "Profile updated successfully." });
    } catch (err) {
      setProfileMsg({ type: "error", text: err instanceof Error ? err.message : "Failed to update" });
    } finally {
      setProfileSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg(null);
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      setPasswordMsg({ type: "error", text: "New passwords do not match." });
      return;
    }
    setPasswordSaving(true);
    try {
      const res = await apiFetch("/api/auth/me/password", {
        method: "PATCH",
        body: JSON.stringify({
          current_password: passwordForm.current_password,
          new_password: passwordForm.new_password,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to change password");
      setPasswordForm({ current_password: "", new_password: "", confirm_password: "" });
      setPasswordMsg({ type: "success", text: "Password changed successfully." });
    } catch (err) {
      setPasswordMsg({ type: "error", text: err instanceof Error ? err.message : "Failed to change password" });
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateSaving(true);
    setCreateMsg(null);
    try {
      const res = await apiFetch("/api/auth/users", {
        method: "POST",
        body: JSON.stringify(createForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create user");
      setUsers((prev) => [data, ...prev]);
      setCreateForm({ email: "", password: "", full_name: "", role: "admin" });
      setShowCreateUser(false);
      setCreateMsg({ type: "success", text: "User created successfully." });
    } catch (err) {
      setCreateMsg({ type: "error", text: err instanceof Error ? err.message : "Failed to create user" });
    } finally {
      setCreateSaving(false);
    }
  };

  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setEditSaving(true);
    setEditMsg(null);
    try {
      const res = await apiFetch(`/api/auth/users/${editingUser.user_id}`, {
        method: "PUT",
        body: JSON.stringify(editForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update user");
      setUsers((prev) => prev.map((u) => (u.user_id === editingUser.user_id ? { ...u, ...data } : u)));
      setEditingUser(null);
      setEditMsg({ type: "success", text: "User updated." });
    } catch (err) {
      setEditMsg({ type: "error", text: err instanceof Error ? err.message : "Failed to update user" });
    } finally {
      setEditSaving(false);
    }
  };

  const handleToggleActive = async (user: UserProfile) => {
    try {
      const res = await apiFetch(`/api/auth/users/${user.user_id}`, {
        method: "PUT",
        body: JSON.stringify({ is_active: !user.is_active }),
      });
      if (res.ok) {
        const data = await res.json();
        setUsers((prev) => prev.map((u) => (u.user_id === user.user_id ? { ...u, ...data } : u)));
      }
    } catch { /* */ }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetPasswordUser) return;
    setResetSaving(true);
    setResetMsg(null);
    try {
      const res = await apiFetch(`/api/auth/users/${resetPasswordUser.user_id}/password`, {
        method: "PATCH",
        body: JSON.stringify({ new_password: resetPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to reset password");
      setResetPassword("");
      setResetPasswordUser(null);
      setResetMsg({ type: "success", text: "Password reset successfully." });
    } catch (err) {
      setResetMsg({ type: "error", text: err instanceof Error ? err.message : "Failed to reset password" });
    } finally {
      setResetSaving(false);
    }
  };

  const inputCls =
    "block w-full px-3 py-2 bg-white border border-zinc-300 rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors";
  const btnPrimary =
    "inline-flex items-center justify-center px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-60 transition-colors";
  const btnSecondary =
    "inline-flex items-center justify-center px-4 py-2 rounded-lg border border-zinc-300 bg-white text-zinc-700 text-sm font-medium hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors";

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-zinc-800">Account Settings</h1>
        <p className="text-sm text-zinc-500 mt-1">Manage your profile and admin users</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-zinc-100 rounded-xl w-fit">
        {([["profile", "My Profile"], ["users", "Manage Users"]] as const).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === key
                ? "bg-white text-zinc-800 shadow-sm"
                : "text-zinc-500 hover:text-zinc-700"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── My Profile Tab ── */}
      {tab === "profile" && (
        <div className="space-y-6">
          {/* Profile info card */}
          <div className="bg-white rounded-2xl border border-zinc-200/80 p-6">
            <h2 className="text-base font-semibold text-zinc-800 mb-4">Profile Information</h2>
            {profileMsg && (
              <div className={`mb-4 px-4 py-3 rounded-lg text-sm ${profileMsg.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
                {profileMsg.text}
              </div>
            )}
            <form onSubmit={handleProfileSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="profile-name" className="block text-sm font-medium text-zinc-700 mb-1">Full Name</label>
                  <input
                    id="profile-name"
                    type="text"
                    className={inputCls}
                    value={profileForm.full_name}
                    onChange={(e) => setProfileForm((p) => ({ ...p, full_name: e.target.value }))}
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="profile-email" className="block text-sm font-medium text-zinc-700 mb-1">Email Address</label>
                  <input
                    id="profile-email"
                    type="email"
                    className={inputCls}
                    value={profileForm.email}
                    onChange={(e) => setProfileForm((p) => ({ ...p, email: e.target.value }))}
                    required
                  />
                </div>
              </div>
              {profile && (
                <div className="flex items-center gap-4 text-xs text-zinc-400 pt-1">
                  <span>Role: <span className="font-medium text-zinc-600 capitalize">{profile.role}</span></span>
                  {profile.last_login && (
                    <span>Last login: {new Date(profile.last_login).toLocaleDateString()}</span>
                  )}
                </div>
              )}
              <div className="flex justify-end">
                <button type="submit" disabled={profileSaving} className={btnPrimary}>
                  {profileSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>

          {/* Change password card */}
          <div className="bg-white rounded-2xl border border-zinc-200/80 p-6">
            <h2 className="text-base font-semibold text-zinc-800 mb-4">Change Password</h2>
            {passwordMsg && (
              <div className={`mb-4 px-4 py-3 rounded-lg text-sm ${passwordMsg.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
                {passwordMsg.text}
              </div>
            )}
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label htmlFor="current-pw" className="block text-sm font-medium text-zinc-700 mb-1">Current Password</label>
                <input
                  id="current-pw"
                  type="password"
                  className={inputCls}
                  value={passwordForm.current_password}
                  onChange={(e) => setPasswordForm((p) => ({ ...p, current_password: e.target.value }))}
                  required
                  autoComplete="current-password"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="new-pw" className="block text-sm font-medium text-zinc-700 mb-1">New Password</label>
                  <input
                    id="new-pw"
                    type="password"
                    className={inputCls}
                    value={passwordForm.new_password}
                    onChange={(e) => setPasswordForm((p) => ({ ...p, new_password: e.target.value }))}
                    required
                    minLength={6}
                    autoComplete="new-password"
                  />
                </div>
                <div>
                  <label htmlFor="confirm-pw" className="block text-sm font-medium text-zinc-700 mb-1">Confirm New Password</label>
                  <input
                    id="confirm-pw"
                    type="password"
                    className={inputCls}
                    value={passwordForm.confirm_password}
                    onChange={(e) => setPasswordForm((p) => ({ ...p, confirm_password: e.target.value }))}
                    required
                    minLength={6}
                    autoComplete="new-password"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button type="submit" disabled={passwordSaving} className={btnPrimary}>
                  {passwordSaving ? "Changing..." : "Change Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Manage Users Tab ── */}
      {tab === "users" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-zinc-800">Admin Users</h2>
            <button
              onClick={() => { setShowCreateUser((v) => !v); setCreateMsg(null); }}
              className={btnPrimary}
            >
              <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              New User
            </button>
          </div>

          {createMsg && !showCreateUser && (
            <div className={`px-4 py-3 rounded-lg text-sm ${createMsg.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
              {createMsg.text}
            </div>
          )}

          {editMsg && !editingUser && (
            <div className={`px-4 py-3 rounded-lg text-sm ${editMsg.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
              {editMsg.text}
            </div>
          )}

          {resetMsg && !resetPasswordUser && (
            <div className={`px-4 py-3 rounded-lg text-sm ${resetMsg.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
              {resetMsg.text}
            </div>
          )}

          {/* Create user form */}
          {showCreateUser && (
            <div className="bg-white rounded-2xl border border-zinc-200/80 p-6">
              <h3 className="text-sm font-semibold text-zinc-800 mb-4">Create New Admin User</h3>
              {createMsg && (
                <div className={`mb-4 px-4 py-3 rounded-lg text-sm ${createMsg.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
                  {createMsg.text}
                </div>
              )}
              <form onSubmit={handleCreateUser} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="new-user-name" className="block text-sm font-medium text-zinc-700 mb-1">Full Name</label>
                    <input
                      id="new-user-name"
                      type="text"
                      className={inputCls}
                      value={createForm.full_name}
                      onChange={(e) => setCreateForm((p) => ({ ...p, full_name: e.target.value }))}
                      placeholder="Staff name"
                    />
                  </div>
                  <div>
                    <label htmlFor="new-user-email" className="block text-sm font-medium text-zinc-700 mb-1">Email</label>
                    <input
                      id="new-user-email"
                      type="email"
                      className={inputCls}
                      value={createForm.email}
                      onChange={(e) => setCreateForm((p) => ({ ...p, email: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="new-user-pw" className="block text-sm font-medium text-zinc-700 mb-1">Password</label>
                    <input
                      id="new-user-pw"
                      type="password"
                      className={inputCls}
                      value={createForm.password}
                      onChange={(e) => setCreateForm((p) => ({ ...p, password: e.target.value }))}
                      required
                      minLength={6}
                      autoComplete="new-password"
                    />
                  </div>
                  <div>
                    <label htmlFor="new-user-role" className="block text-sm font-medium text-zinc-700 mb-1">Role</label>
                    <select
                      id="new-user-role"
                      className={inputCls}
                      value={createForm.role}
                      onChange={(e) => setCreateForm((p) => ({ ...p, role: e.target.value }))}
                    >
                      <option value="admin">Admin</option>
                      <option value="editor">Editor</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <button type="button" onClick={() => setShowCreateUser(false)} className={btnSecondary}>Cancel</button>
                  <button type="submit" disabled={createSaving} className={btnPrimary}>
                    {createSaving ? "Creating..." : "Create User"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Edit user modal */}
          {editingUser && (
            <div className="bg-white rounded-2xl border border-zinc-200/80 p-6">
              <h3 className="text-sm font-semibold text-zinc-800 mb-4">Edit User — {editingUser.email}</h3>
              {editMsg && (
                <div className={`mb-4 px-4 py-3 rounded-lg text-sm ${editMsg.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
                  {editMsg.text}
                </div>
              )}
              <form onSubmit={handleEditUser} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="edit-name" className="block text-sm font-medium text-zinc-700 mb-1">Full Name</label>
                    <input
                      id="edit-name"
                      type="text"
                      className={inputCls}
                      value={editForm.full_name}
                      onChange={(e) => setEditForm((p) => ({ ...p, full_name: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label htmlFor="edit-email" className="block text-sm font-medium text-zinc-700 mb-1">Email</label>
                    <input
                      id="edit-email"
                      type="email"
                      className={inputCls}
                      value={editForm.email}
                      onChange={(e) => setEditForm((p) => ({ ...p, email: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="edit-role" className="block text-sm font-medium text-zinc-700 mb-1">Role</label>
                    <select
                      id="edit-role"
                      className={inputCls}
                      value={editForm.role}
                      onChange={(e) => setEditForm((p) => ({ ...p, role: e.target.value }))}
                    >
                      <option value="admin">Admin</option>
                      <option value="editor">Editor</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <button type="button" onClick={() => setEditingUser(null)} className={btnSecondary}>Cancel</button>
                  <button type="submit" disabled={editSaving} className={btnPrimary}>
                    {editSaving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Reset password form */}
          {resetPasswordUser && (
            <div className="bg-white rounded-2xl border border-zinc-200/80 p-6">
              <h3 className="text-sm font-semibold text-zinc-800 mb-4">
                Reset Password — {resetPasswordUser.full_name || resetPasswordUser.email}
              </h3>
              {resetMsg && (
                <div className={`mb-4 px-4 py-3 rounded-lg text-sm ${resetMsg.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
                  {resetMsg.text}
                </div>
              )}
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="max-w-sm">
                  <label htmlFor="reset-pw" className="block text-sm font-medium text-zinc-700 mb-1">New Password</label>
                  <input
                    id="reset-pw"
                    type="password"
                    className={inputCls}
                    value={resetPassword}
                    onChange={(e) => setResetPassword(e.target.value)}
                    required
                    minLength={6}
                    autoComplete="new-password"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button type="button" onClick={() => setResetPasswordUser(null)} className={btnSecondary}>Cancel</button>
                  <button type="submit" disabled={resetSaving} className={btnPrimary}>
                    {resetSaving ? "Resetting..." : "Reset Password"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Users table */}
          <div className="bg-white rounded-2xl border border-zinc-200/80 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 bg-zinc-50/50">
                    <th className="text-left px-5 py-3 font-semibold text-zinc-600">Name</th>
                    <th className="text-left px-5 py-3 font-semibold text-zinc-600">Email</th>
                    <th className="text-left px-5 py-3 font-semibold text-zinc-600">Role</th>
                    <th className="text-left px-5 py-3 font-semibold text-zinc-600">Status</th>
                    <th className="text-right px-5 py-3 font-semibold text-zinc-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {users.map((user) => (
                    <tr key={user.user_id} className="hover:bg-zinc-50/50 transition-colors">
                      <td className="px-5 py-3 font-medium text-zinc-800">
                        {user.full_name || "—"}
                        {profile && user.user_id === profile.user_id && (
                          <span className="ml-2 text-[10px] font-semibold uppercase tracking-wider text-primary-600 bg-primary-50 px-1.5 py-0.5 rounded-full">You</span>
                        )}
                      </td>
                      <td className="px-5 py-3 text-zinc-500">{user.email}</td>
                      <td className="px-5 py-3">
                        <span className="capitalize text-zinc-600">{user.role}</span>
                      </td>
                      <td className="px-5 py-3">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${user.is_active ? "text-emerald-600" : "text-zinc-400"}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${user.is_active ? "bg-emerald-500" : "bg-zinc-300"}`} />
                          {user.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => {
                              setEditingUser(user);
                              setEditForm({ full_name: user.full_name || "", email: user.email, role: user.role || "admin" });
                              setEditMsg(null);
                            }}
                            className="p-1.5 text-zinc-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                            title="Edit user"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                            </svg>
                          </button>
                          <button
                            onClick={() => {
                              setResetPasswordUser(user);
                              setResetPassword("");
                              setResetMsg(null);
                            }}
                            className="p-1.5 text-zinc-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                            title="Reset password"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
                            </svg>
                          </button>
                          {profile && user.user_id !== profile.user_id && (
                            <button
                              onClick={() => handleToggleActive(user)}
                              className={`p-1.5 rounded-lg transition-colors ${
                                user.is_active
                                  ? "text-zinc-400 hover:text-red-600 hover:bg-red-50"
                                  : "text-zinc-400 hover:text-emerald-600 hover:bg-emerald-50"
                              }`}
                              title={user.is_active ? "Deactivate user" : "Activate user"}
                            >
                              {user.is_active ? (
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                </svg>
                              ) : (
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              )}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-5 py-8 text-center text-zinc-400">No users found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
