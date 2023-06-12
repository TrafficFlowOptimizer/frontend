import React, { useEffect, useState } from "react";
import meme1 from "../../assets/memes/meme_1.jpg";
import meme2 from "../../assets/memes/meme_2.png";
import meme3 from "../../assets/memes/meme_3.jpg";
import meme4 from "../../assets/memes/meme_4.png";
import meme5 from "../../assets/memes/meme_5.jpeg";
import meme6 from "../../assets/memes/meme_6.jpg";
import meme7 from "../../assets/memes/meme_7.jpg";
import meme8 from "../../assets/memes/meme_8.jpg";
import meme0 from "../../assets/memes/everybodystaycalm-staycalm.gif";
import styled from "styled-components";

export function Memes() {
	const memes = [meme0, meme1, meme2, meme3, meme4, meme5, meme6, meme7, meme8];
	const [image, setImage] = useState(meme0);

	useEffect(() => {
		const timer = setInterval(() => {
			setImage((prevImage) => {
				let i = Math.floor(Math.random() * memes.length);
				while (prevImage === memes[i]) {
					i = Math.floor(Math.random() * 6);
				}
				return memes[i];
			});
		}, 5000);

		return () => clearTimeout(timer);
	}, []);

	return (
		<div>
			<StyledMeme src={image} alt="meme" />
		</div>
	);
}

export const StyledMeme = styled.img`
	width: 300px;
	height: 300px;

	margin: 20px;
`;
