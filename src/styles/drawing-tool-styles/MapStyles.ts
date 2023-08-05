import styled from "styled-components";

export const CreatorInformation = styled.p`
	text-align: center;
`;

export const mapContainerStyle = {
	width: "1250px",
	height: "520px",
	margin: "0px 20px",
	border: "1px solid black",
};

export const LeafletContainer = styled.div`	
	display: flex;
	flex-direction: column;
	flex-wrap: no-wrap;
	justify-content: center;
	align-items: center;
`;

export const WorkaroundInnerDiv = styled.div`
	flex: 1;
	height: 520px;
	width: 1250px;
	margin: 10px 0px;
`;

export const ButtonsDiv = styled.div`
	display: flex;
	flex-direction: row;
	flex-wrap: no-wrap;
	justify-content: center;
	align-items: center;
`;

export const LightMapStyles = [
	{
		"featureType": "all",
		"elementType": "all",
		"stylers": [
			{
				"visibility": "on"
			}
		]
	},
	{
		"featureType": "administrative",
		"elementType": "all",
		"stylers": [
			{
				"visibility": "on"
			}
		]
	},
	{
		"featureType": "administrative",
		"elementType": "geometry.fill",
		"stylers": [
			{
				"color": "#ff0000"
			}
		]
	},
	{
		"featureType": "administrative",
		"elementType": "labels",
		"stylers": [
			{
				"visibility": "on"
			}
		]
	},
	{
		"featureType": "administrative",
		"elementType": "labels.text",
		"stylers": [
			{
				"visibility": "on"
			}
		]
	},
	{
		"featureType": "administrative",
		"elementType": "labels.text.fill",
		"stylers": [
			{
				"color": "#444444"
			},
			{
				"visibility": "on"
			}
		]
	},
	{
		"featureType": "administrative",
		"elementType": "labels.text.stroke",
		"stylers": [
			{
				"visibility": "on"
			}
		]
	},
	{
		"featureType": "administrative",
		"elementType": "labels.icon",
		"stylers": [
			{
				"visibility": "on"
			}
		]
	},
	{
		"featureType": "administrative.country",
		"elementType": "all",
		"stylers": [
			{
				"visibility": "on"
			}
		]
	},
	{
		"featureType": "administrative.province",
		"elementType": "all",
		"stylers": [
			{
				"visibility": "on"
			}
		]
	},
	{
		"featureType": "administrative.locality",
		"elementType": "all",
		"stylers": [
			{
				"visibility": "on"
			}
		]
	},
	{
		"featureType": "administrative.neighborhood",
		"elementType": "all",
		"stylers": [
			{
				"visibility": "on"
			}
		]
	},
	{
		"featureType": "administrative.land_parcel",
		"elementType": "all",
		"stylers": [
			{
				"visibility": "on"
			}
		]
	},
	{
		"featureType": "landscape",
		"elementType": "all",
		"stylers": [
			{
				"color": "#f2f2f2"
			},
			{
				"visibility": "on"
			}
		]
	},
	{
		"featureType": "poi",
		"elementType": "all",
		"stylers": [
			{
				"visibility": "off"
			}
		]
	},
	{
		"featureType": "poi",
		"elementType": "geometry",
		"stylers": [
			{
				"visibility": "on"
			},
			{
				"color": "#aacda0"
			}
		]
	},
	{
		"featureType": "poi.attraction",
		"elementType": "all",
		"stylers": [
			{
				"visibility": "on"
			}
		]
	},
	{
		"featureType": "poi.business",
		"elementType": "all",
		"stylers": [
			{
				"visibility": "on"
			}
		]
	},
	{
		"featureType": "poi.business",
		"elementType": "geometry.fill",
		"stylers": [
			{
				"visibility": "on"
			},
			{
				"color": "#dcd493"
			}
		]
	},
	{
		"featureType": "poi.government",
		"elementType": "geometry",
		"stylers": [
			{
				"visibility": "on"
			}
		]
	},
	{
		"featureType": "poi.medical",
		"elementType": "all",
		"stylers": [
			{
				"visibility": "on"
			}
		]
	},
	{
		"featureType": "poi.park",
		"elementType": "all",
		"stylers": [
			{
				"visibility": "on"
			}
		]
	},
	{
		"featureType": "poi.place_of_worship",
		"elementType": "all",
		"stylers": [
			{
				"visibility": "on"
			}
		]
	},
	{
		"featureType": "poi.school",
		"elementType": "all",
		"stylers": [
			{
				"visibility": "on"
			}
		]
	},
	{
		"featureType": "poi.sports_complex",
		"elementType": "all",
		"stylers": [
			{
				"visibility": "on"
			}
		]
	},
	{
		"featureType": "road",
		"elementType": "all",
		"stylers": [
			{
				"saturation": -100
			},
			{
				"lightness": 45
			},
			{
				"visibility": "on"
			}
		]
	},
	{
		"featureType": "road.highway",
		"elementType": "all",
		"stylers": [
			{
				"visibility": "simplified"
			}
		]
	},
	{
		"featureType": "road.highway",
		"elementType": "geometry.fill",
		"stylers": [
			{
				"color": "#e04040"
			}
		]
	},
	{
		"featureType": "road.arterial",
		"elementType": "geometry.fill",
		"stylers": [
			{
				"color": "#eac37d"
			}
		]
	},
	{
		"featureType": "road.arterial",
		"elementType": "labels.icon",
		"stylers": [
			{
				"visibility": "off"
			}
		]
	},
	{
		"featureType": "transit",
		"elementType": "all",
		"stylers": [
			{
				"visibility": "off"
			}
		]
	},
	{
		"featureType": "transit",
		"elementType": "geometry.fill",
		"stylers": [
			{
				"color": "#2c0000"
			},
			{
				"visibility": "on"
			}
		]
	},
	{
		"featureType": "water",
		"elementType": "all",
		"stylers": [
			{
				"color": "#5c96bc"
			},
			{
				"visibility": "on"
			}
		]
	}
];

export const DarkMapStyles = [
	{
		"featureType": "all",
		"elementType": "geometry.fill",
		"stylers": [
			{
				"hue": "#ff0000"
			}
		]
	},
	{
		"featureType": "all",
		"elementType": "labels.text.fill",
		"stylers": [
			{
				"saturation": 36
			},
			{
				"color": "#000000"
			},
			{
				"lightness": 40
			}
		]
	},
	{
		"featureType": "all",
		"elementType": "labels.text.stroke",
		"stylers": [
			{
				"visibility": "on"
			},
			{
				"color": "#000000"
			},
			{
				"lightness": 16
			}
		]
	},
	{
		"featureType": "all",
		"elementType": "labels.icon",
		"stylers": [
			{
				"visibility": "off"
			}
		]
	},
	{
		"featureType": "administrative",
		"elementType": "geometry.fill",
		"stylers": [
			{
				"color": "#6d0202"
			},
			{
				"lightness": 20
			},
			{
				"visibility": "on"
			}
		]
	},
	{
		"featureType": "administrative",
		"elementType": "geometry.stroke",
		"stylers": [
			{
				"color": "#e1cdcd"
			},
			{
				"lightness": 17
			},
			{
				"weight": 1.2
			}
		]
	},
	{
		"featureType": "administrative.country",
		"elementType": "geometry.fill",
		"stylers": [
			{
				"hue": "#ff0000"
			}
		]
	},
	{
		"featureType": "landscape",
		"elementType": "geometry",
		"stylers": [
			{
				"lightness": 20
			},
			{
				"color": "#353537"
			}
		]
	},
	{
		"featureType": "poi",
		"elementType": "geometry",
		"stylers": [
			{
				"lightness": 21
			},
			{
				"color": "#344036"
			}
		]
	},
	{
		"featureType": "poi",
		"elementType": "geometry.stroke",
		"stylers": [
			{
				"color": "#ff0000"
			}
		]
	},
	{
		"featureType": "poi.attraction",
		"elementType": "geometry.fill",
		"stylers": [
			{
				"hue": "#ff0000"
			}
		]
	},
	{
		"featureType": "poi.business",
		"elementType": "geometry.fill",
		"stylers": [
			{
				"color": "#5a543f"
			}
		]
	},
	{
		"featureType": "road.highway",
		"elementType": "geometry.fill",
		"stylers": [
			{
				"color": "#4f3913"
			},
			{
				"lightness": 17
			},
			{
				"visibility": "on"
			}
		]
	},
	{
		"featureType": "road.highway",
		"elementType": "geometry.stroke",
		"stylers": [
			{
				"color": "#000000"
			},
			{
				"lightness": 29
			},
			{
				"weight": 0.2
			}
		]
	},
	{
		"featureType": "road.arterial",
		"elementType": "geometry",
		"stylers": [
			{
				"color": "#000000"
			},
			{
				"lightness": 18
			}
		]
	},
	{
		"featureType": "road.arterial",
		"elementType": "geometry.fill",
		"stylers": [
			{
				"visibility": "on"
			},
			{
				"color": "#666043"
			}
		]
	},
	{
		"featureType": "road.local",
		"elementType": "geometry",
		"stylers": [
			{
				"color": "#000000"
			},
			{
				"lightness": 16
			},
			{
				"visibility": "on"
			}
		]
	},
	{
		"featureType": "transit",
		"elementType": "geometry",
		"stylers": [
			{
				"color": "#000000"
			},
			{
				"lightness": 19
			}
		]
	},
	{
		"featureType": "transit",
		"elementType": "geometry.fill",
		"stylers": [
			{
				"visibility": "on"
			},
			{
				"color": "#662828"
			}
		]
	},
	{
		"featureType": "transit.station.airport",
		"elementType": "geometry.fill",
		"stylers": [
			{
				"visibility": "off"
			}
		]
	},
	{
		"featureType": "transit.station.bus",
		"elementType": "geometry.fill",
		"stylers": [
			{
				"visibility": "on"
			},
			{
				"color": "#ff0000"
			}
		]
	},
	{
		"featureType": "transit.station.rail",
		"elementType": "geometry.fill",
		"stylers": [
			{
				"visibility": "on"
			},
			{
				"color": "#ff0000"
			}
		]
	},
	{
		"featureType": "water",
		"elementType": "geometry",
		"stylers": [
			{
				"color": "#1b2332"
			},
			{
				"lightness": 17
			}
		]
	}
];