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
	ENTIRE = "ENTIRE",
	LEFT = "LEFT",
	RIGHT = "RIGHT",
	FORWARD = "FORWARD",
	ARROW_LEFT = "ARROW_LEFT",
	ARROW_RIGHT = "ARROW_RIGHT",
	UTURN = "U_TURN",
	LEFT_RIGHT = "LEFT_RIGHT",
	LEFT_FORWARD = "LEFT_FORWARD",
	RIGHT_FORWARD = "RIGHT_FORWARD",
	UTURN_LEFT = "UTURN_LEFT ",
}

export type EEIPointType = "exit" | "entrance" | "intermediate";

export type ExitEntrancePoint = {
	id: string;
	index: string;
	type: EEIPointType;
	xCord: number;
	yCord: number;
	street: string;
	capacity: number;
};

export type Connection = {
	id: string;
	index: string;
	name: string;
	trafficLightIDs: string[];
	sourceId: string;
	targetId: string;
};

export type TrafficLight = {
	id: string;
	index: string;
	direction: TrafficLightDirection;
};

export type FirstStageTrafficLight = {
	light: TrafficLight;
	eeiPointIndex: string;
};

export type Collision = {
	id: string;
	index: string;
	name: string;
	bothLightsCanBeOn: boolean;
	connection1Id: string;
	connection2Id: string;
};
