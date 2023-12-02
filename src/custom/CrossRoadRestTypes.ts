import {
	Collision,
	Connection,
	Crossroad,
	CrossroadType,
	ExitEntrancePoint,
	TrafficLight,
} from "./CrossroadInterface";

export type CrossroadDescriptionRequest = {
	crossroad: Omit<Crossroad, "id">;
	roads: Omit<ExitEntrancePoint, "id">[];
	collisions: Omit<Collision, "id">[];
	connections: Omit<Connection, "id">[];
	trafficLights: Omit<TrafficLight, "id">[];
};

export type ResponseCrossroad = {
	id: string;
	name: string;
	location: string;
	creatorId: string;
	type: CrossroadType;
	roadIds: string[];
	collisionIds: string[];
	trafficLightIds: string[];
	connectionIds: string[];
};

export type ResponseConnection = {
	id: string;
	index: number;
	name: string;
	trafficLightIds: string[];
	carFlowIds: string[];
	sourceId: string;
	targetId: string;
};

export type ResponseCollision = {
	id: string;
	index: number;
	name: string;
	bothLightsCanBeOn: boolean;
	connection1Id: string;
	connection2Id: string;
};

export type CrossroadDescriptionResponse = {
	crossroad: ResponseCrossroad;
	roads: ExitEntrancePoint[];
	collisions: ResponseCollision[];
	connections: ResponseConnection[];
	trafficLights: TrafficLight[];
	image: string;
};
