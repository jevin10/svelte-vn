import { loadScene } from '$lib/server/gameLogic';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  const { success, scene, error } = await loadScene('start');
  if (!success) {
    throw new Error(error);
  }
  return { scene };
};
