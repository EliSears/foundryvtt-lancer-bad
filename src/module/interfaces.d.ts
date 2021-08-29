import {
  LancerSkill,
  LancerTalent,
  LancerCoreBonus,
  LancerLicense,
  LancerFrame,
  LancerPilotArmor,
  LancerPilotWeapon,
  LancerPilotGear,
  LancerMechWeapon,
  LancerMechSystem,
  LancerNpcFeature,
  LancerNpcClass,
  LancerNpcTemplate,
  LancerItemData,
  LancerItemType,
} from "./item/lancer-item";
import { RangeType, NPCTag } from "./enums";
import { EffectData } from "./helpers/npc";
import {
  EntryType,
  ITagTemplateData,
  License,
  LiveEntryTypes,
  MountType,
  OpCtx,
  Pilot,
  RegEntryTypes,
  Registry,
  RegNpcData,
  RegPilotData,
  RegSkillData,
} from "machine-mind";
import { FoundryRegActorData, FoundryRegItemData } from "./mm-util/foundry-reg";
import { LancerActorType } from "./actor/lancer-actor";
// ------------------------------------------------------
// |       UTILITY
// ------------------------------------------------------

declare interface ResourceData {
  value: number;
  min: number;
  max: number;
}

// ------------------------------------------------------
// |       SHEET DATA TYPES                             |
// ------------------------------------------------------

// These single generic type should cover all basic sheet use cases
export interface LancerItemSheetData<T extends LancerItemType> extends ItemSheet.Data<ItemSheet.Options> {
  // reg ctx
  mm: LiveEntryTypes<T>;

  // The license, if it could be recovered
  license: License | null;
}

export type CachedCloudPilot = {
  id: string;
  name: string;
  cloudID: string;
  cloudOwnerID: string;
};

export interface LancerActorSheetData<T extends LancerActorType> extends ActorSheet.Data<ActorSheet.Options> {
  // Item
  mm: LiveEntryTypes<T>;

  // Store active mech at the root level
  active_mech: Mech | null;
  // Store cloud pilot cache and potential cloud ids at the root level
  pilotCache: CachedCloudPilot[];
  cleanedOwnerID: string;
  vaultID: string;
  rawID: string;
}

// -------- Macro data -------------------------------------
declare interface LancerStatMacroData {
  title: string;
  bonus: string | number;
  effect?: EffectData | string;
}

declare interface LancerAttackMacroData {
  title: string;
  grit: number;
  acc: number;
  damage: DamageData[];
  overkill: boolean;
  effect: EffectData | string;
  on_hit?: string; // For NPC weapons - to be removed once they use EffectData
  tags: TagDataShort[];
  loaded: boolean;
  destroyed: boolean;
}

declare interface LancerTechMacroData {
  title: string;
  t_atk: number;
  action: string;
  acc: number;
  effect: string;
  tags: TagDataShort[];
}

declare interface LancerActionMacroData {
  title: string;
  t_atk: number;
  acc: number;
  actionName: string;
  detail: string;
  tags: TagDataShort[];
}

declare interface LancerTalentMacroData {
  talent: LancerTalentData;
  rank: number;
}

declare interface LancerGenericMacroData {
  title: string;
  effect: EffectData | string;
}

declare interface LancerReactionMacroData {
  title: string;
  trigger: string;
  effect: string;
  tags?: TagDataShort[];
}

declare interface LancerTextMacroData {
  title: string;
  description: string;
  tags?: TagDataShort[];
}

declare interface LancerOverchargeMacroData {
  level: number;
  roll: Roll;
}

declare interface LancerMacroData {
  command: string;
  iconPath?: string;
  title: string;
}

export interface GenControlContext<T> {
  // T is whatever is yielded by get_data/handled by commit_func
  // Raw information
  elt: HTMLElement;
  path: string;
  action: "delete" | "null" | "splice" | "set" | "append" | "insert";
  raw_val?: string;
  item_override_path?: string; // For writeback overriding

  // Deduced information
  data: T; // Typically the sheet data
  path_target: null | any; // What path resolved to on data, if anything
  item_override: AnyMMActor | AnyMMItem | null;
  parsed_val?: any; // Parsed version of raw_val

  // For hooks to use
  commit_func: (data: T) => void | Promise<void>;
}

// Context menu interface compatible with core foundry and our custom tippy menus
export interface ContextMenuItem {
  name: string;
  icon?: string; // class used to generate icon, if it should exist at all. e.x. "fa fa-fw fa-times"
  callback: (target: JQuery) => void | Promise<void> // argument is the element to which the context menu attaches
}
