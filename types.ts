
export interface StoryPreferences {
  characterName: string;
  friendName: string;
  petName: string;
  petType: string;
  topic: string;
  lesson: string;
  readingLevel: string;
}

export interface StoryResponse {
  storyPart: string;
  choices: string[];
}
