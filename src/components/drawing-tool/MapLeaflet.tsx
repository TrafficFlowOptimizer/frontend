import React, { useRef } from "react";
import { useThemeContext } from "../../custom/ThemeContext";
import { BaseButtonLink } from "../../styles/MainTheme";
import { PositiveButton } from "../../styles/PositiveButton";
import {
	DarkMapStyles,
	LightMapStyles,
	mapContainerStyle,
	LeafletContainer,
	WorkaroundInnerDiv,
} from "../../styles/MapStyles";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";

export function MapLeaflet() {
	const { theme } = useThemeContext();
	const { isLoaded } = useJsApiLoader({
		id: "google-map-script",
		googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY!,
	});

	const mapRef = useRef<google.maps.Map | null>(null);

	const onLoad = (map: google.maps.Map): void => {
		mapRef.current = map;
	};

	const onUnMount = (): void => {
		mapRef.current = null;
	};

	const initialCenter = {
		lat: 50.048727868815526,
		lng: 19.93246018908391,
	};

	const mapOptions = {
		styles: theme === "light" ? LightMapStyles : DarkMapStyles,
		disableDefaultUI: false,
		zoomControl: true,
	};

	return !isLoaded ? (
		<LeafletContainer>Loading Error</LeafletContainer>
	) : (
		<LeafletContainer>
			<p>Please choose location, adjust zoom-out and press Next Button</p>
			<WorkaroundInnerDiv>
				<GoogleMap
					mapContainerStyle={mapContainerStyle}
					options={mapOptions}
					center={initialCenter}
					zoom={18}
					onLoad={onLoad}
					onUnmount={onUnMount}
				/>
			</WorkaroundInnerDiv>
			<PositiveButton>
				<BaseButtonLink to="../basic-information">Next</BaseButtonLink>
			</PositiveButton>
		</LeafletContainer>
	);
}
