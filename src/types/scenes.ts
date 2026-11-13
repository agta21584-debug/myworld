export type SceneId = 'bedroom' | 'studio' | 'kiss' | 'concert' | 'courtyard';

export type HerOutfitId = 'tribal_black' | 'ebash_tee' | 'velvet_red' | 'cat_tee';
export type HisOutfitId = 'ebash_tee' | 'tactical' | 'balaclava';

export interface HotspotRect {
  id: string;
  label: string;
  x: number;
  y: number;
  w: number;
  h: number;
  message: string;
  speaker?: 'her' | 'him' | 'love';
  grantsHeart?: boolean;
}

export interface SceneMeta {
  id: SceneId;
  shortTitle: string;
  title: string;
  sweetOpening: string;
  herLines: string[];
  himLines: string[];
  hotspots: HotspotRect[];
  defaultHerOutfit: HerOutfitId;
  defaultHisOutfit: HisOutfitId;
  specialActionLabel: string;
  specialActionHint: string;
}

export interface AlbumPhoto {
  id: string;
  src: string;
  caption: string;
  sceneId: SceneId;
  sceneName: string;
}
