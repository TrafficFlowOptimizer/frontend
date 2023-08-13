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
	direction: TrafficLightType;
};

export type OptimizationResults = {
	connections: SingleConnectionOptimizationResults[];
};

export type SingleConnectionOptimizationResults = {
	currentFlow: number;
	previousFlow: number;
	lights: singleLightOptimizationResults[];
};

export enum TrafficLightType {
	LEFT,
	RIGHT,
	FORWARD,
	ARROW,
	TURNING,
	LEFT_RIGHT,
	LEFT_FORWARD,
	RIGHT_FORWARD,
	LEFT_TURNING,
}

export type ExitEntrancePoint = {
	id: string;
	type: "exit" | "entrance";
	x_cord: number;
	y_cord: number;
	street: string;
};
