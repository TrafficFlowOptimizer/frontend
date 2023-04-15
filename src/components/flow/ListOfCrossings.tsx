import React from "react";
import { LogOut } from "../additional/LogOut";
import { Link } from "react-router-dom";

export function ListOfCrossings() {
	return (
		<div>
			<p>here will be list off crossings that you will be able to choose from</p>
			<button>
				<Link to="../../list-videos" relative="path">
					See video footage for chosen crossing
				</Link>
			</button>
			<button>
				<Link to="../../add-videos" relative="path">
					Add new video for chosen crossing
				</Link>
			</button>
			<button>
				<Link to="../new" relative="path">
					Create new crossing
				</Link>
			</button>
			<button>
				<Link to="../../results-choice" relative="path">
					Skip footage part and go to results choice panel
				</Link>
			</button>
			<LogOut />
		</div>
	);
}
