import React, { useEffect, useState } from "react";
import meme0 from "../../assets/memes/meme_0.jpg";
import meme1 from "../../assets/memes/meme_1.jpg";
import meme2 from "../../assets/memes/meme_2.png";
import meme3 from "../../assets/memes/meme_3.jpg";
import meme4 from "../../assets/memes/meme_4.png";
import meme5 from "../../assets/memes/meme_5.jpeg";
import meme6 from "../../assets/memes/meme_6.jpg";
import meme7 from "../../assets/memes/meme_7.jpg";
import meme8 from "../../assets/memes/meme_8.jpg";
import meme9 from "../../assets/memes/meme_9.webp";
import meme10 from "../../assets/memes/meme_10.gif";
import meme11 from "../../assets/memes/meme_11.jpg";
import meme12 from "../../assets/memes/meme_12.jpg";
import meme13 from "../../assets/memes/meme_13.jpg";
import meme14 from "../../assets/memes/meme_14.jpg";
import meme15 from "../../assets/memes/meme_15.png";
import meme16 from "../../assets/memes/meme_16.png";
import meme17 from "../../assets/memes/meme_17.jpg";
import meme18 from "../../assets/memes/meme_18.webp";
import meme19 from "../../assets/memes/meme_19.jpg";
import meme20 from "../../assets/memes/meme_20.jpeg";
import meme21 from "../../assets/memes/meme_21.png";
import meme22 from "../../assets/memes/meme_22.png";
import meme23 from "../../assets/memes/meme_23.png";
import meme24 from "../../assets/memes/meme_24.jpg";
import meme25 from "../../assets/memes/meme_25.jpg";
import meme26 from "../../assets/memes/meme_26.jpeg";
import meme27 from "../../assets/memes/meme_27.jpg";
import meme28 from "../../assets/memes/meme_28.webp";
import styled from "styled-components";

export function Memes() {
	const memes = [
		meme0,
		meme1,
		meme2,
		meme3,
		meme4,
		meme5,
		meme6,
		meme7,
		meme8,
		meme9,
		meme10,
		meme11,
		meme12,
		meme13,
		meme14,
		meme15,
		meme16,
		meme17,
		meme18,
		meme19,
		meme20,
		meme21,
		meme22,
		meme23,
		meme24,
		meme25,
		meme26,
		meme27,
		meme28,
	];
	const [image, setImage] = useState(meme1);

	useEffect(() => {
		const timer = setInterval(() => {
			setImage((prevImage) => {
				let i = Math.floor(Math.random() * memes.length);
				while (prevImage === memes[i]) {
					i = Math.floor(Math.random() * memes.length);
				}
				return memes[i];
			});
		}, 7000);

		return () => clearTimeout(timer);
	}, []);

	return (
		<div>
			<StyledMeme src={image} alt="meme" />
		</div>
	);
}

export const StyledMeme = styled.img`
	width: 30rem;
	height: 30rem;

	margin: 20px;
`;
