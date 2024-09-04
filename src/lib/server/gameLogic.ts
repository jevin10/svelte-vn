// src/lib/server/gameLogic.ts

import type { Scene, Asset, SceneCharacter, DialogueLine, Choice } from '$lib/types';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { dev } from '$app/environment';

const dataPath = dev ? 'src/lib/server/data' : 'path/to/prod/data';

async function getScenesData(): Promise<Scene[]> {
  const scenesPath = join(dataPath, 'scenes.json');
  const scenesData = await readFile(scenesPath, 'utf-8');
  const parsedData = JSON.parse(scenesData);
  return parsedData.scenes;
}

// Create a scene and upload it to scenes.json
export async function createScene(
  prevSceneId: string,
  background: Asset,
  characters: SceneCharacter[],
  dialogue: DialogueLine[],
  choices?: Choice[],
  nextSceneId?: string
): Promise<{ success: boolean; error?: string }> {
  try {
  	const scenesPath = join(dataPath, 'scenes.json');
    const scenes: Scene[] = await getScenesData();

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

		// add scene to scenes.json
    await writeFile(scenesPath, JSON.stringify(scenes, null, 2));
    return { success: true };
  } catch (error: unknown) {
    console.error('Error creating scene:', error);
		if (error instanceof Error) {
			return { success: false, error: error.message };
		} else {
			return { success: false, error: String(error) };
		}
  }
}

// Return scene from scenes.json
export async function loadScene(
  sceneId: string
): Promise<{ success: boolean; scene?: Scene; error?: string }> {
  try {
    const scenes: Scene[] = await getScenesData();

    const scene = scenes.find(s => s.id === sceneId);
    
    if (!scene) {
      return { success: false, error: `Scene with id ${sceneId} not found` };
    }

    return { success: true, scene };
  } catch (error: unknown) {
    console.error('Error loading scene:', error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    } else {
      return { success: false, error: String(error) };
    }
  }
}
