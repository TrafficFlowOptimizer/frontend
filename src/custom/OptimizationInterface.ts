import { TrafficLight, TrafficLightDirection } from "./CrossroadInterface";

export enum Day {
	MONDAY = "MONDAY",
	TUESDAY = "TUESDAY",
	WEDNESDAY = "WEDNESDAY",
	THURSDAY = "THURSDAY",
	FRIDAY = "FRIDAY",
	SATURDAY = "SATURDAY",
	SUNDAY = "SUNDAY",
}

export enum Hour {
	T0000,
	T0100,
	T0200,
	T0300,
	T0400,
	T0500,
	T0600,
	T0700,
	T0800,
	T0900,
	T1000,
	T1100,
	T1200,
	T1300,
	T1400,
	T1500,
	T1600,
	T1700,
	T1800,
	T1900,
	T2000,
	T2100,
	T2200,
	T2300,
}

export type TimeInterval = {
	hour: Hour;
	day: Day;
};

export type Detection = {
	id: number;
	detectedCars: number;
	detectedBusses: number;
	connectionId: string;
};

export type OptimizationResults = {
	lightsSequenceMapCurrent: Map<number, number[]>;
	connectionsFlowRatioMapCurrent: Map<number, number>;
	lightsSequenceMapPrevious: Map<number, number[]>;
	connectionsFlowRatioMapPrevious: Map<number, number>;
	connectionsLightsMap: Map<number, TrafficLight[]>;
	roadsLightsMap: Map<number, TrafficLight[]>;
	lightsDirectionMap: Map<number, TrafficLightDirection>;
};
