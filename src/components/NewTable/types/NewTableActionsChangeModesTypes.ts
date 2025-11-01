export interface INewTableOnOffModes {
  on?: string[];
  off?: string[];
  withChildren?: boolean;
};

export type TNewTableActionsChangeModesStandart = Record<string, INewTableOnOffModes>;
