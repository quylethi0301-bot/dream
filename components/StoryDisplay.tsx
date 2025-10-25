
import React from 'react';

interface StoryDisplayProps {
  storyParts: string[];
  choices: string[];
  isLoading: boolean;
  onSelectChoice: (choice: string) => void;
  onReset: () => void;
}

const LoadingSpinner: React.FC = () => (
    <div className="flex justify-center items-center p-4">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-amber-600"></div>
    </div>
);

export const StoryDisplay: React.FC<StoryDisplayProps> = ({ storyParts, choices, isLoading, onSelectChoice, onReset }) => {
  return (
    <div className="w-full max-w-3xl mx-auto p-6 md:p-8 bg-amber-100 rounded-2xl shadow-xl border-4 border-white">
      <div className="story-content space-y-4 text-amber-900 text-lg leading-relaxed font-serif-display">
        {storyParts.map((part, index) => (
          <p key={index} className="animate-fade-in">{part}</p>
        ))}
      </div>

      {isLoading && <LoadingSpinner />}

      {!isLoading && choices.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-bold text-center text-amber-800 mb-4 font-sans">Bạn sẽ làm gì tiếp theo?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {choices.map((choice, index) => (
              <button
                key={index}
                onClick={() => onSelectChoice(choice)}
                className="w-full px-4 py-3 bg-white text-amber-800 font-semibold rounded-lg shadow-md hover:bg-amber-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-transform transform hover:scale-105 duration-200"
              >
                {choice}
              </button>
            ))}
          </div>
        </div>
      )}

      {!isLoading && choices.length === 0 && storyParts.length > 0 && (
        <div className="text-center mt-8">
            <p className="font-serif-display text-2xl text-amber-900 mb-6">Hết.</p>
            <button
                onClick={onReset}
                className="px-6 py-3 bg-amber-600 text-white font-bold text-lg rounded-lg shadow-lg hover:bg-amber-700 focus:outline-none focus:ring-4 focus:ring-amber-400 transition-transform transform hover:scale-105 duration-300"
            >
                Bắt đầu một câu chuyện mới
            </button>
        </div>
      )}
    </div>
  );
};
