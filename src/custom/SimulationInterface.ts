import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { RotateProp, SizeProp } from "@fortawesome/fontawesome-svg-core";

export type SimulationLightSymbol = {
	symbol: IconDefinition;
	symbolSize: SizeProp;
	symbolTopShift: number;
	symbolLeftShift: number;
	symbolRotation: RotateProp | undefined;
};
