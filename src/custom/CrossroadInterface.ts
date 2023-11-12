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
	roadIds: number[];
	collisionIds: number[];
	trafficLightIds: number[];
	connectionIds: number[];
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

export type EEIPointType = "EXIT" | "ENTRANCE" | "INTERMEDIATE";

export type ExitEntrancePoint = {
	id: string;
	index: number;
	type: EEIPointType;
	xCord: number;
	yCord: number;
	name: string;
	capacity: number;
};

export type Connection = {
	id: string;
	index: number;
	name: string;
	trafficLightIds: number[];
	sourceId: number;
	targetId: number;
};

export type TrafficLight = {
	id: string;
	index: number;
	direction: TrafficLightDirection;
};

export type FirstStageTrafficLight = {
	light: TrafficLight;
	eeiPointIndex: number;
};

export type Collision = {
	id: string;
	index: number;
	name: string;
	bothLightsCanBeOn: boolean;
	connection1Id: number;
	connection2Id: number;
};
