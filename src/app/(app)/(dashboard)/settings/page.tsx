"use client"
import React, { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import { toast } from "react-toastify"

type Theme = "light" | "dark" | "system"

export default function SettingsPage() {
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const avatarPreview = useMemo(
    () => (avatarFile ? URL.createObjectURL(avatarFile) : "/avatar-placeholder.png"),
    [avatarFile]
  )

  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")

  const [theme, setTheme] = useState<Theme>("system")
  const [notifyProduct, setNotifyProduct] = useState(true)
  const [notifySecurity, setNotifySecurity] = useState(true)

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)

  // Load basic defaults for demo; in a real app fetch from your API
  useEffect(() => {
    try {
      const storedTheme = (localStorage.getItem("theme") as Theme) || "system"
      setTheme(storedTheme)
      // Example placeholders
      setFullName("Jane Scholar")
      setEmail("jane@example.com")
    } catch {}
  }, [])

  useEffect(() => {
    return () => {
      if (avatarFile) URL.revokeObjectURL(avatarPreview)
    }
  }, [avatarFile, avatarPreview])

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // For demo, only send fullName; avatar upload would require storage
      const res = await fetch('/api/user/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to update profile')
      }
      toast.success('Profile updated')
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Profile update failed'
      toast.error(msg)
    }
  }

  const handleSavePreferences = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/user/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme, notifyProduct, notifySecurity }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to save preferences')
      }
      localStorage.setItem('theme', theme)
      toast.success('Preferences saved')
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to save preferences'
      toast.error(msg)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword.length < 8) return toast.error("Password must be at least 8 characters")
    if (newPassword !== confirmPassword) return toast.error("Passwords do not match")
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to update password')
      }
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      toast.success('Password updated')
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to update password'
      toast.error(msg)
    }
  }

  const handleDeleteAccount = async () => {
    try {
      if (!confirm('Are you sure you want to delete your account? This cannot be undone.')) return
      const res = await fetch('/api/user/delete', { method: 'POST' })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to delete account')
      }
      toast.success('Account deleted')
      window.location.href = '/sign-in'
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to delete account'
      toast.error(msg)
    }
  }

  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Settings</h1>
          <p className="text-slate-500 text-sm">Manage your profile, preferences, and security.</p>
        </div>
      </header>

      {/* Profile */}
      <section className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Profile</h2>
        <form onSubmit={handleSaveProfile} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          <div className="md:col-span-1 flex flex-col items-center gap-3">
            <div className="relative w-24 h-24 rounded-full overflow-hidden bg-slate-100">
              <Image src={avatarPreview} alt="Avatar" fill className="object-cover" />
            </div>
            <label className="inline-flex items-center px-3 py-2 rounded bg-slate-800 text-white text-sm cursor-pointer hover:bg-slate-700">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0] || null
                  setAvatarFile(f)
                }}
              />
              Change Avatar
            </label>
          </div>
          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full name</label>
              <input
                className="w-full border border-slate-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-300"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input
                type="email"
                className="w-full border border-slate-300 rounded px-3 py-2 bg-slate-50 text-slate-500"
                value={email}
                disabled
              />
            </div>
            <div className="sm:col-span-2">
              <button type="submit" className="inline-flex items-center px-4 py-2 rounded bg-slate-800 text-white text-sm font-medium hover:bg-slate-700">
                Save profile
              </button>
            </div>
          </div>
        </form>
      </section>

      {/* Preferences */}
      <section className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Preferences</h2>
        <form onSubmit={handleSavePreferences} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Theme</label>
            <select
              className="w-full border border-slate-300 rounded px-3 py-2"
              value={theme}
              onChange={(e) => setTheme(e.target.value as Theme)}
            >
              <option value="system">System</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
            <p className="text-xs text-slate-500 mt-1">Saved locally to your device.</p>
          </div>
          <div className="space-y-3">
            <label className="block text-sm font-medium text-slate-700 mb-1">Notifications</label>
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input type="checkbox" className="accent-slate-800" checked={notifyProduct} onChange={(e) => setNotifyProduct(e.target.checked)} />
              Product updates
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input type="checkbox" className="accent-slate-800" checked={notifySecurity} onChange={(e) => setNotifySecurity(e.target.checked)} />
              Security alerts
            </label>
          </div>
          <div className="sm:col-span-2">
            <button type="submit" className="inline-flex items-center px-4 py-2 rounded bg-slate-800 text-white text-sm font-medium hover:bg-slate-700">
              Save preferences
            </button>
          </div>
        </form>
      </section>

      {/* Security */}
      <section className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Security</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Current password</label>
              <input
                type="password"
                className="w-full border border-slate-300 rounded px-3 py-2"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">New password</label>
                <input
                  type="password"
                  className="w-full border border-slate-300 rounded px-3 py-2"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Confirm password</label>
                <input
                  type="password"
                  className="w-full border border-slate-300 rounded px-3 py-2"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <button type="submit" className="inline-flex items-center px-4 py-2 rounded bg-slate-800 text-white text-sm font-medium hover:bg-slate-700">
              Update password
            </button>
          </form>

          <div className="space-y-4">
            <div className="flex items-center justify-between border rounded-lg p-4">
              <div>
                <p className="font-medium text-slate-800">Two-factor authentication</p>
                <p className="text-sm text-slate-500">Add an extra layer of security to your account.</p>
              </div>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={twoFactorEnabled}
                  onChange={(e) => setTwoFactorEnabled(e.target.checked)}
                />
                <div className="w-11 h-6 bg-slate-300 peer-checked:bg-slate-800 rounded-full relative transition-colors">
                  <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${twoFactorEnabled ? 'translate-x-5' : ''}`}></div>
                </div>
              </label>
            </div>
            {twoFactorEnabled && (
              <p className="text-sm text-slate-600">2FA setup is enabled. Complete configuration in your authenticator app.</p>
            )}
          </div>
        </div>
      </section>

      {/* Danger Zone */}
      <section className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-red-600 mb-2">Danger zone</h2>
        <p className="text-sm text-slate-600 mb-4">Deleting your account is irreversible. All your data will be permanently removed.</p>
        <button
          onClick={handleDeleteAccount}
          className="inline-flex items-center px-4 py-2 rounded bg-red-600 text-white text-sm font-medium hover:bg-red-700"
        >
          Delete account
        </button>
      </section>
    </main>
  )
}