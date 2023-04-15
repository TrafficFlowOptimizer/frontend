import React from "react";
import { Link } from "react-router-dom";

export function LogIn() {
	return (
		<div>
			<p>Log in to process further</p>
			<form>
				<ul>
					<li>
						<label>email / username:</label>
						<input type="text" placeholder="username" />
					</li>
					<li>
						<label>password</label>
						<input type="password" />
					</li>
				</ul>
			</form>
			<button>
				<Link to="/crossing-choice" state={{ ifNewUser: false }}>
					Log In!
				</Link>
			</button>
		</div>
	);
}
