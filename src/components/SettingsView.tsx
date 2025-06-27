import React from 'react';
import { User, Bell, Shield, Palette, Globe } from 'lucide-react';
import { User as SupabaseUser } from '@supabase/supabase-js';

interface SettingsViewProps {
  user: SupabaseUser | null;
}

export function SettingsView({ user }: SettingsViewProps) {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">Manage your account and preferences</p>
        </div>

        <div className="space-y-6">
          {/* Profile Settings */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <User className="h-6 w-6 text-gray-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">Profile</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input 
                  type="email" 
                  value={user?.email || ''} 
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Display Name</label>
                <input 
                  type="text" 
                  placeholder="Enter your name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <Bell className="h-6 w-6 text-gray-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">Notifications</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">Email Notifications</h3>
                  <p className="text-sm text-gray-600">Receive updates via email</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">Push Notifications</h3>
                  <p className="text-sm text-gray-600">Receive push notifications</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Privacy & Security */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <Shield className="h-6 w-6 text-gray-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">Privacy & Security</h2>
            </div>
            
            <div className="space-y-4">
              <button className="w-full text-left p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <h3 className="font-medium text-gray-900">Change Password</h3>
                <p className="text-sm text-gray-600">Update your account password</p>
              </button>
              
              <button className="w-full text-left p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <h3 className="font-medium text-gray-900">Two-Factor Authentication</h3>
                <p className="text-sm text-gray-600">Add an extra layer of security</p>
              </button>
            </div>
          </div>

          {/* Appearance */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <Palette className="h-6 w-6 text-gray-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">Appearance</h2>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Light</option>
                <option>Dark</option>
                <option>System</option>
              </select>
            </div>
          </div>

          {/* Language */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <Globe className="h-6 w-6 text-gray-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">Language</h2>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Display Language</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>English</option>
                <option>한국어</option>
                <option>日本語</option>
                <option>中文</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}