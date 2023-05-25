export enum CrossingType {
	PRIVATE = "private",
	PUBLIC = "public",
}

export type Crossing = {
	_id: string;
	name: string;
	location: string;
	creatorId: string;
	type: CrossingType;
	roadIds: string[];
	collisionsIds: string[];
	trafficLightsIds: string[];
};

export type OptimizationResults = {
	results: singleLightOptimizationResults[];
};

export type singleLightOptimizationResults = {
	lightId: number;
	sequence: number[];
	flow: number;
};
