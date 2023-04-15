import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import image from "../../assets/changing_code.jpg";

export function Welcome() {
	return (
		<div>
			<h1>Welcome to Traffic Flow Optimizer!</h1>
			<ul>
				<li>To start:</li>
				<li>
					<button>
						<Link to="/login">Login</Link>
					</button>
				</li>
				<li>or</li>
				<li>
					<button>
						<Link to="/register">Register</Link>
					</button>
				</li>
			</ul>
			<TestDiv></TestDiv>
		</div>
	);
}

export const TestDiv = styled.div`
	width: 1125px;
	height: 957px;
	background-color: orange;
	background: url(${image});
`;
