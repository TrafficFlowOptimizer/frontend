export enum CrossroadType {
	PRIVATE = "private",
	PUBLIC = "public",
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


export type singleLightOptimizationResults = {
	lightId: number;
	sequence: number[];
	direction: string;
};

export type OptimizationResults = {
	connections: SingleConnectionOptimizationResults[];
};

export type SingleConnectionOptimizationResults = {
	flow: number;
	lights: singleLightOptimizationResults[];
};
