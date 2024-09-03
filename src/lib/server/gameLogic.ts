// src/lib/server/gameLogic.ts

import type { Scene, Asset, SceneCharacter, DialogueLine, Choice } from '$lib/types';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { dev } from '$app/environment';

const dataPath = dev ? 'src/lib/server/data' : 'path/to/prod/data';

async function createScene(
  prevSceneId: string,
  background: Asset,
  characters: SceneCharacter[],
  dialogue: DialogueLine[],
  choices?: Choice[],
  nextSceneId?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const scenesPath = join(dataPath, 'scenes.json');
    const scenesData = await readFile(scenesPath, 'utf-8');
    const scenes: Scene[] = JSON.parse(scenesData);

    const newScene: Scene = {
      id: uuidv4(),
      background,
      characters,
      dialogue,
      choices,
      nextSceneId
    };

    scenes.push(newScene);

    // Update previous scene's nextSceneId if it exists
    const prevSceneIndex = scenes.findIndex(scene => scene.id === prevSceneId);
    if (prevSceneIndex !== -1) {
      scenes[prevSceneIndex].nextSceneId = newScene.id;
    }

    await writeFile(scenesPath, JSON.stringify(scenes, null, 2));
    return { success: true };
  } catch (error) {
    console.error('Error creating scene:', error);
    return { success: false, error: error.message };
  }
}

export { createScene };
