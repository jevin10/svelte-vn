// src/lib/types.ts

export type Position = 'left' | 'center' | 'right';
export type EmotionKey = string;

export interface Asset {
  id: string;
  url: string;
}

export interface Character {
  id: string;
  name: string;
  emotions: Record<EmotionKey, {
    sprite: Asset;
    thumbnail: Asset;
  }>;
}

// the relevant data for a character to be used in a scene
export interface SceneCharacter {
  characterId: string;
  emotion: EmotionKey;
  position: Position;
}

export interface DialogueLine {
  characterId: string;
  text: string;
  emotion: EmotionKey;
  movement?: {
    position: Position;
    transition?: string;
  };
}

export interface Choice {
  text: string;
  nextSceneId: string;
}

export interface Scene {
  id: string;
  background: Asset;
  characters: SceneCharacter[];
  dialogue: DialogueLine[];
  choices?: Choice[];
  nextSceneId?: string;
}

export interface GameState {
  currentSceneId: string; // Points to scene
  choiceHistory: string[]; // stored as Choice[]
}
