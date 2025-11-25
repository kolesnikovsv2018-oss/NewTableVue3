import type { INewMenuItem } from "@/components/NewContextMenu/types";

export type INewReestrContexMenuItems = Record<string, INewMenuItem[]>

export interface INewReestrSettingsActionEvent {
  name: string,
  payload?: unknown,
}
