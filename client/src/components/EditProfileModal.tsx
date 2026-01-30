import React, { useState, useEffect } from 'react';
import { User, UpdateProfileDto, updateUserProfile } from '../api/users';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onUpdate: () => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onUpdate,
}) => {
  const [formData, setFormData] = useState<UpdateProfileDto>({
    name: '',
    email: '',
    bio: '',
    major: '',
    graduationYear: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        bio: user.bio || '',
        major: user.major || '',
        graduationYear: user.graduationYear || '',
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    try {
      await updateUserProfile(user._id, formData);
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-[#192633] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-[#324d67]">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-[#192633] border-b border-slate-200 dark:border-[#324d67] p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Edit Profile</h2>
          <button
            onClick={onClose}
            className="size-10 rounded-full hover:bg-slate-100 dark:hover:bg-[#324d67] flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-bold mb-2" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-[#324d67] bg-white dark:bg-[#0d1419] focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter your name"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-[#324d67] bg-white dark:bg-[#0d1419] focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="your.email@example.com"
              required
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-bold mb-2" htmlFor="bio">
              Bio
            </label>
            <textarea
              id="bio"
              value={formData.bio}
              onChange={(e) =>
                setFormData({ ...formData, bio: e.target.value })
              }
              className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-[#324d67] bg-white dark:bg-[#0d1419] focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              placeholder="Tell us about yourself..."
              rows={4}
            />
          </div>

          {/* Major */}
          <div>
            <label className="block text-sm font-bold mb-2" htmlFor="major">
              Major / Field of Study
            </label>
            <input
              id="major"
              type="text"
              value={formData.major}
              onChange={(e) =>
                setFormData({ ...formData, major: e.target.value })
              }
              className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-[#324d67] bg-white dark:bg-[#0d1419] focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g., Computer Science"
            />
          </div>

          {/* Graduation Year */}
          <div>
            <label
              className="block text-sm font-bold mb-2"
              htmlFor="graduationYear"
            >
              Graduation Year
            </label>
            <input
              id="graduationYear"
              type="text"
              value={formData.graduationYear}
              onChange={(e) =>
                setFormData({ ...formData, graduationYear: e.target.value })
              }
              className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-[#324d67] bg-white dark:bg-[#0d1419] focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g., Class of 2025"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-[#324d67]">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-lg border border-slate-200 dark:border-[#324d67] hover:bg-slate-50 dark:hover:bg-[#324d67] font-bold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 rounded-lg bg-primary text-white font-bold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
