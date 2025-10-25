
import React, { useState, useCallback } from 'react';
import type { StoryPreferences } from '../types';

interface StoryFormProps {
  onStartStory: (preferences: StoryPreferences) => void;
  isLoading: boolean;
}

const readingLevels = ['Đơn giản', 'Trung bình', 'Nâng cao'];
const topics = ['Khủng long', 'Vũ trụ', 'Siêu anh hùng', 'Khu rừng Phép thuật', 'Thám hiểm Đại dương'];

export const StoryForm: React.FC<StoryFormProps> = ({ onStartStory, isLoading }) => {
  const [prefs, setPrefs] = useState<StoryPreferences>({
    characterName: '',
    friendName: '',
    petName: '',
    petType: '',
    topic: topics[0],
    lesson: '',
    readingLevel: readingLevels[0],
  });

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPrefs(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStartStory(prefs);
  };

  const InputField: React.FC<{ name: keyof StoryPreferences; label: string; placeholder: string; required?: boolean }> = ({ name, label, placeholder, required = false }) => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-amber-800 mb-1">{label}</label>
      <input
        type="text"
        id={name}
        name={name}
        value={prefs[name]}
        onChange={handleChange}
        placeholder={placeholder}
        required={required}
        className="w-full px-4 py-2 bg-white border border-amber-300 rounded-lg shadow-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition duration-200"
      />
    </div>
  );

  return (
    <div className="w-full max-w-2xl mx-auto p-8 bg-amber-100 rounded-2xl shadow-xl border-4 border-white">
      <h2 className="text-3xl md:text-4xl font-serif-display font-bold text-center text-amber-900 mb-2">Tạo nên câu chuyện của bạn</h2>
      <p className="text-center text-amber-700 mb-8">Hãy điền vào các chi tiết bên dưới để bắt đầu cuộc phiêu lưu!</p>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField name="characterName" label="Tên nhân vật chính" placeholder="Ví dụ: An" required />
          <InputField name="friendName" label="Tên người bạn" placeholder="Ví dụ: Bình" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField name="petName" label="Tên thú cưng" placeholder="Ví dụ: Mực" />
          <InputField name="petType" label="Loài thú cưng" placeholder="Ví dụ: chú chó" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="topic" className="block text-sm font-medium text-amber-800 mb-1">Chủ đề yêu thích</label>
            <select
              id="topic"
              name="topic"
              value={prefs.topic}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-white border border-amber-300 rounded-lg shadow-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition duration-200"
            >
              {topics.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="readingLevel" className="block text-sm font-medium text-amber-800 mb-1">Trình độ đọc</label>
            <select
              id="readingLevel"
              name="readingLevel"
              value={prefs.readingLevel}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-white border border-amber-300 rounded-lg shadow-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition duration-200"
            >
              {readingLevels.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
        </div>
        <div>
          <InputField name="lesson" label="Bài học hoặc thông điệp" placeholder="Ví dụ: Tầm quan trọng của sự chia sẻ" />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center items-center px-6 py-3 bg-amber-600 text-white font-bold text-lg rounded-lg shadow-lg hover:bg-amber-700 focus:outline-none focus:ring-4 focus:ring-amber-400 transition-transform transform hover:scale-105 duration-300 disabled:bg-amber-400 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Đang dệt nên giấc mơ...
            </>
          ) : (
            'Bắt đầu câu chuyện của tôi ✨'
          )}
        </button>
      </form>
    </div>
  );
};
