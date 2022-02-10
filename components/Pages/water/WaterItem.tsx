import Lottie from "react-lottie";
import styled from "styled-components";
import WaterLottie from "../../../public/glass-water.json";

export const WaterWrapper = styled.div`
	width: 100%;
	height: 70vh;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	background: ${({ theme }) => theme.background};

	.card {
		width: 50%;
		@media (max-width: 600px) {
			width: 80%;
		}
		border-radius: 10px;
		padding: 1rem 1rem 2rem;
		box-shadow: rgba(0, 0, 0, 0.1) 0px 10px 50px;
		color: ${({ theme }) => theme.themeColor};
		background: ${({ theme }) => theme.backgroundSuperLight};
		.title {
			font-size: 1.5rem;
			font-weight: 700;
			text-align: center;
			margin: 2rem 0;
		}
		.target-wrapper {
			display: flex;
			justify-content: space-around;
			align-items: center;
			.targets {
				.hoz {
					display: flex;
					justify-content: space-around;
					align-items: center;
				}
			}
		}
		.results {
			margin-top: 2rem;
			.cups {
				display: flex;
				flex-wrap: wrap;
				justify-content: space-around;
				align-items: center;
			}
		}
		.res {
			color: ${({ theme }) => theme.themeColor};
			margin: 0 auto;
			text-align: center;
			font-size: 1.25rem;
			font-weight: 700;
			margin-top: 1.5rem;
		}
		.handlers {
			margin: 2rem 0 0;
			width: 100%;
			display: flex;
			justify-content: center;
			button {
				width: 80%;
			}
		}
	}
`;

export const WaterItem = ({
	isDrink,
	handleDrink,
}: {
	isDrink: boolean;
	handleDrink: () => void;
}) => {
	return (
		<Lottie
			options={{
				loop: false,
				autoplay: isDrink,
				animationData: WaterLottie,
				rendererSettings: {
					preserveAspectRatio: " xMidYMid slice",
				},
			}}
			eventListeners={[
				{
					eventName: "complete",
					callback: () => handleDrink(),
				},
			]}
			isClickToPauseDisabled={true}
			height={50}
			width={50}
			speed={8}
			isStopped={!isDrink}
		></Lottie>
	);
};
