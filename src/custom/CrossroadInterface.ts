export enum CrossroadType {
  PRIVATE = "PRIVATE",
  PUBLIC = "PUBLIC",
}

export type Crossroad = {
  id: string;
  name: string;
  location: string;
  creatorId: string;
  type: CrossroadType;
  roadIds: string[];
  collisionsIds: string[];
  trafficLightIds: string[];
  connectionIds: string[];
};

export type OptimizationResults = {
  results: singleLightOptimizationResults[];
};

export type singleLightOptimizationResults = {
  lightId: number;
  sequence: number[];
  flow: number;
};
