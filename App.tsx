
import React, { useState, useCallback } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import type { Chat } from '@google/genai';
import type { StoryPreferences, StoryResponse } from './types';
import { StoryForm } from './components/StoryForm';
import { StoryDisplay } from './components/StoryDisplay';

const API_KEY = process.env.API_KEY;

const App: React.FC = () => {
  const [isStoryStarted, setIsStoryStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [storyParts, setStoryParts] = useState<string[]>([]);
  const [choices, setChoices] = useState<string[]>([]);
  const [chat, setChat] = useState<Chat | null>(null);

  const handleStartStory = useCallback(async (preferences: StoryPreferences) => {
    setIsLoading(true);
    setError(null);
    setStoryParts([]);
    setChoices([]);

    if (!API_KEY) {
      setError("API key is not configured.");
      setIsLoading(false);
      return;
    }

    try {
      const ai = new GoogleGenAI({ apiKey: API_KEY });

      const responseSchema = {
        type: Type.OBJECT,
        properties: {
          storyPart: {
            type: Type.STRING,
            description: "Một đoạn của câu chuyện."
          },
          choices: {
            type: Type.ARRAY,
            description: "Một mảng gồm 2 chuỗi cho lựa chọn tiếp theo của người dùng. Mảng này sẽ trống nếu câu chuyện kết thúc.",
            items: {
              type: Type.STRING,
            }
          }
        },
        required: ["storyPart", "choices"],
      };

      const systemInstruction = `Bạn là một người kể chuyện chuyên nghiệp cho trẻ em. Nhiệm vụ của bạn là tạo ra một câu chuyện tương tác "chọn cuộc phiêu lưu của riêng bạn".
      Sau khi viết một đoạn của câu chuyện, bạn PHẢI cung cấp chính xác hai lựa chọn để người đọc quyết định điều gì sẽ xảy ra tiếp theo.
      Định dạng phản hồi của bạn dưới dạng một đối tượng JSON có hai khóa: "storyPart" và "choices".
      "storyPart" phải là một chuỗi chứa đoạn truyện.
      "choices" phải là một mảng gồm hai chuỗi, mỗi chuỗi là một lựa chọn riêng biệt. Nếu câu chuyện nên kết thúc, hãy để mảng "choices" trống.`;

      const newChat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: responseSchema,
        },
      });

      setChat(newChat);

      const initialPrompt = `Bắt đầu một câu chuyện dựa trên các chi tiết sau:
      - Nhân vật chính: ${preferences.characterName || 'một người bạn dũng cảm'}
      - Bạn bè: ${preferences.friendName || 'một người bạn đồng hành trung thành'}
      - Thú cưng: ${preferences.petName || 'một con vật'} là ${preferences.petType || 'bí ẩn'}
      - Chủ đề: ${preferences.topic}
      - Bài học/Thông điệp: ${preferences.lesson || 'khám phá những điều mới mẻ'}
      - Trình độ đọc: ${preferences.readingLevel}`;
      
      const response = await newChat.sendMessage({ message: initialPrompt });

      const parsedResponse: StoryResponse = JSON.parse(response.text);

      setStoryParts([parsedResponse.storyPart]);
      setChoices(parsedResponse.choices);
      setIsStoryStarted(true);

    } catch (e) {
      console.error(e);
      setError("Đã xảy ra lỗi khi tạo câu chuyện. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSelectChoice = useCallback(async (choice: string) => {
    if (!chat) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await chat.sendMessage({ message: `Người dùng đã chọn: "${choice}". Hãy tiếp tục câu chuyện.` });
      
      const parsedResponse: StoryResponse = JSON.parse(response.text);
      
      setStoryParts(prev => [...prev, parsedResponse.storyPart]);
      setChoices(parsedResponse.choices);

    } catch (e) {
      console.error(e);
      setError("Đã xảy ra lỗi khi tiếp tục câu chuyện. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  }, [chat]);

  const handleReset = useCallback(() => {
    setIsStoryStarted(false);
    setStoryParts([]);
    setChoices([]);
    setError(null);
    setChat(null);
  }, []);
  
  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center p-4 md:p-8 bg-gradient-to-br from-amber-200 to-orange-200">
      <header className="text-center mb-8">
        <h1 className="text-4xl md:text-6xl font-serif-display font-extrabold text-amber-900">
          Thư viện Giấc Mơ 📚✨
        </h1>
        <p className="text-lg md:text-xl text-amber-800 mt-2">Nơi mỗi lựa chọn dệt nên một câu chuyện</p>
      </header>
      
      {error && (
        <div className="my-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg max-w-2xl w-full text-center">
          <p>{error}</p>
          <button onClick={handleReset} className="mt-2 font-bold underline">Thử lại</button>
        </div>
      )}

      {!isStoryStarted ? (
        <StoryForm onStartStory={handleStartStory} isLoading={isLoading} />
      ) : (
        <StoryDisplay
          storyParts={storyParts}
          choices={choices}
          isLoading={isLoading}
          onSelectChoice={handleSelectChoice}
          onReset={handleReset}
        />
      )}
      <footer className="mt-8 text-center text-amber-700">
        <p>Được tạo ra với trí tuệ nhân tạo Gemini</p>
      </footer>
    </main>
  );
};

export default App;
