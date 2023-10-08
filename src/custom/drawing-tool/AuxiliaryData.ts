import {
	Crossroad,
	CrossroadType,
	ExitEntrancePoint,
	FirstStageTrafficLight,
	TrafficLightDirection,
} from "../CrossroadInterface";

export const COUNTRIES = [
	"Afghanistan",
	"Albania",
	"Algeria",
	"Andorra",
	"Angola",
	"Anguilla",
	"Antigua &amp; Barbuda",
	"Argentina",
	"Armenia",
	"Aruba",
	"Australia",
	"Austria",
	"Azerbaijan",
	"Bahamas",
	"Bahrain",
	"Bangladesh",
	"Barbados",
	"Belarus",
	"Belgium",
	"Belize",
	"Benin",
	"Bermuda",
	"Bhutan",
	"Bolivia",
	"Bosnia &amp; Herzegovina",
	"Botswana",
	"Brazil",
	"British Virgin Islands",
	"Brunei",
	"Bulgaria",
	"Burkina Faso",
	"Burundi",
	"Cambodia",
	"Cameroon",
	"Cape Verde",
	"Cayman Islands",
	"Chad",
	"Chile",
	"China",
	"Colombia",
	"Congo",
	"Cook Islands",
	"Costa Rica",
	"Cote D Ivoire",
	"Croatia",
	"Cruise Ship",
	"Cuba",
	"Cyprus",
	"Czech Republic",
	"Denmark",
	"Djibouti",
	"Dominica",
	"Dominican Republic",
	"Ecuador",
	"Egypt",
	"El Salvador",
	"Equatorial Guinea",
	"Estonia",
	"Ethiopia",
	"Falkland Islands",
	"Faroe Islands",
	"Fiji",
	"Finland",
	"France",
	"French Polynesia",
	"French West Indies",
	"Gabon",
	"Gambia",
	"Georgia",
	"Germany",
	"Ghana",
	"Gibraltar",
	"Greece",
	"Greenland",
	"Grenada",
	"Guam",
	"Guatemala",
	"Guernsey",
	"Guinea",
	"Guinea Bissau",
	"Guyana",
	"Haiti",
	"Honduras",
	"Hong Kong",
	"Hungary",
	"Iceland",
	"India",
	"Indonesia",
	"Iran",
	"Iraq",
	"Ireland",
	"Isle of Man",
	"Israel",
	"Italy",
	"Jamaica",
	"Japan",
	"Jersey",
	"Jordan",
	"Kazakhstan",
	"Kenya",
	"Kuwait",
	"Kyrgyz Republic",
	"Laos",
	"Latvia",
	"Lebanon",
	"Lesotho",
	"Liberia",
	"Libya",
	"Liechtenstein",
	"Lithuania",
	"Luxembourg",
	"Macau",
	"Macedonia",
	"Madagascar",
	"Malawi",
	"Malaysia",
	"Maldives",
	"Mali",
	"Malta",
	"Mauritania",
	"Mauritius",
	"Mexico",
	"Moldova",
	"Monaco",
	"Mongolia",
	"Montenegro",
	"Montserrat",
	"Morocco",
	"Mozambique",
	"Namibia",
	"Nepal",
	"Netherlands",
	"Netherlands Antilles",
	"New Caledonia",
	"New Zealand",
	"Nicaragua",
	"Niger",
	"Nigeria",
	"Norway",
	"Oman",
	"Pakistan",
	"Palestine",
	"Panama",
	"Papua New Guinea",
	"Paraguay",
	"Peru",
	"Philippines",
	"Poland",
	"Portugal",
	"Puerto Rico",
	"Qatar",
	"Reunion",
	"Romania",
	"Russia",
	"Rwanda",
	"Saint Pierre &amp; Miquelon",
	"Samoa",
	"San Marino",
	"Satellite",
	"Saudi Arabia",
	"Senegal",
	"Serbia",
	"Seychelles",
	"Sierra Leone",
	"Singapore",
	"Slovakia",
	"Slovenia",
	"South Africa",
	"South Korea",
	"Spain",
	"Sri Lanka",
	"St Kitts &amp; Nevis",
	"St Lucia",
	"St Vincent",
	"St. Lucia",
	"Sudan",
	"Suriname",
	"Swaziland",
	"Sweden",
	"Switzerland",
	"Syria",
	"Taiwan",
	"Tajikistan",
	"Tanzania",
	"Thailand",
	"Timor L'Este",
	"Togo",
	"Tonga",
	"Trinidad &amp; Tobago",
	"Tunisia",
	"Turkey",
	"Turkmenistan",
	"Turks &amp; Caicos",
	"Uganda",
	"Ukraine",
	"United Arab Emirates",
	"United Kingdom",
	"United States",
	"Uruguay",
	"Uzbekistan",
	"Venezuela",
	"Vietnam",
	"Virgin Islands (US)",
	"Yemen",
	"Zambia",
	"Zimbabwe",
];

export const BASIC_INFORMATION_ERROR_MESSAGES = {
	zero_length: "All fields require input",
	invalid_country: "Such country doesn't exist",
	invalid_city: "No such city in this country",
	invalid_capacity: "Capacity needs to be a positive integer of 'infinity'",
	used_id: "This id is already in use, try another one",
};

export const CROSSROAD_MODEL_TEMPLATE: Crossroad = {
	id: "",
	name: "",
	location: "",
	creatorId: "1",
	type: CrossroadType.PRIVATE,
	roadIds: [],
	collisionsIds: [],
	trafficLightIds: [],
	connectionIds: [],
};

export const EXITS_ENTRANCES_TEMPLATE: ExitEntrancePoint = {
	id: "",
	type: "entrance",
	xCord: 0,
	yCord: 0,
	street: "",
	capacity: -1,
};

export const EEIPointOffset = 7.5;

export const FIRST_STAGE_TRAFFIC_LIGHT_TEMPLATE: FirstStageTrafficLight = {
	light: {
		id: "",
		name: "",
		direction: TrafficLightDirection.FORWARD,
	},
	eeiPointId: "",
};

export const HEAVY_COLLISION_DESCRIPTION =
	"The lights cannot be green at the same time";

export const LIGHT_COLLISION_DESCRIPTION =
	"the lights can be green at the same time, but it will make cars' passage slower";
