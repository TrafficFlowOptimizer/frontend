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
	direction: TrafficLightDirection;
};

export type OptimizationResults = {
	connections: SingleConnectionOptimizationResults[];
};

export type SingleConnectionOptimizationResults = {
	currentFlow: number;
	previousFlow: number;
	lights: singleLightOptimizationResults[];
};

export enum TrafficLightDirection {
	LEFT = "LEFT",
	RIGHT = "RIGHT",
	FORWARD = "FORWARD",
	ARROW = "ARROW",
	TURNING = "TURNING",
	LEFT_RIGHT = "LEFT_RIGHT",
	LEFT_FORWARD = "LEFT_FORWARD",
	RIGHT_FORWARD = "RIGHT_FORWARD",
	LEFT_TURNING = "LEFT_TURNING",
}

export type EEIPointType = "exit" | "entrance" | "intermediate";

export type ExitEntrancePoint = {
	id: string;
	type: EEIPointType;
	xCord: number;
	yCord: number;
	street: string;
	capacity: number;
};

export type Connection = {
	id: string;
	name: string;
	trafficLightIDs: string[];
	sourceId: string;
	targetId: string;
};

export type TrafficLight = {
	id: string;
	name: string;
	direction: TrafficLightDirection;
};

export type FirstStageTrafficLight = {
	light: TrafficLight;
	eeiPointId: string;
};

export enum CollisionType {
	HEAVY = "HEAVY",
	LIGHT = "LIGHT",
}

export type Collision = {
	id: string;
	name: string;
	type: CollisionType;
	trafficLight1Id: string;
	trafficLight2Id: string;
};
