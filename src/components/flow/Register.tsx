import React from "react";
import { Link } from "react-router-dom";

export function Register() {
	//might be good to create pop up about the successful creation of the account
	return (
		<div>
			<p>Sign up to be able to use our app!</p>
			<form>
				<ul>
					<li>
						<label>email:</label>
						<input type="email" />
					</li>
					<li>
						<label>username:</label>
						<input type="text" placeholder="username" />
					</li>
					<li>
						<label>password</label>
						<input type="password" />
					</li>
					<li>
						<label>repeat password</label>
						<input type="password" />
					</li>
				</ul>
			</form>
			<button>
				<Link to="/crossing-choice" state={{ ifNewUser: true }}>
					Sign Up!
				</Link>
			</button>
		</div>
	);
}
