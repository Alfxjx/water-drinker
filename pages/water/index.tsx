import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Lottie from "react-lottie";
import { useRouter } from "next/router";
import { Button, TextButton } from "@/components/Button";
import WaterLottie from "../../public/glass-water.json";
import { toast } from "@/components/Toast";
import { BaseLayout } from "@/components/Layout/base";
import { formatDate } from "@/utils/formatDate";

const WaterWrapper = styled.div`
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

const WaterItem = ({
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
				autoplay: true,
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
			speed={4}
			isStopped={!isDrink}
		></Lottie>
	);
};

export default function Water() {
	const router = useRouter();

	const [number, setNumber] = useState(0);
	// 目标
	const [target, setTarget] = useState(0);
	const [targetList, setTargetList] = useState([]);
	// 剩余
	const [current, setCurrent] = useState(0);

	useEffect(() => {
		function getDataFromStorage() {
			const temp = Number(window.localStorage.getItem("target"));
			const currentFromStorage = window.localStorage.getItem("current");
			if (currentFromStorage) {
				setCurrent(Number(currentFromStorage));
			} else {
				setCurrent(temp);
			}
			setTarget(temp);
		}
		function getDataFromQuery() {
			const temp = Number(router.query.target);
			const currentFromQuery = Number(router.query.left);
			window.localStorage.setItem("getQuery", "getFromQuery");
			window.localStorage.setItem("left", router.query.left as string);
			window.localStorage.setItem("target", router.query.target as string);
			if (currentFromQuery) {
				setCurrent(Number(currentFromQuery));
			} else {
				setCurrent(temp);
			}
			setTarget(temp);
		}
		// 只有当query有数据，并且没有保存到storage里面的时候触发从query拿
		if (
			router.query &&
			router.query.target &&
			!window.localStorage.getItem("getQuery")
		) {
			getDataFromQuery();
		} else {
			getDataFromStorage();
		}
	}, [router]);

	useEffect(() => {
		const temp = [];
		for (let i = 0; i < target; i++) {
			temp.push({
				index: `cup ${i}`,
				water: false,
			});
		}
		for (let j = 0; j < target - current; j++) {
			temp[j].water = true;
		}
		setTargetList(() => [...temp]);
	}, [target, current]);

	useEffect(() => {
		if (current === 0 && target !== 0) {
			toast.success("You drunk enough water today");
		}
	}, [current, target]);

	const targetSet = () => {
		window.localStorage.setItem("target", number.toString());
		setTarget(number);
		setCurrent(number);
	};

	const targetReset = () => {
		window.localStorage.removeItem("target");
		window.localStorage.removeItem("current");
		setTarget(0);
	};

	const doDrink = () => {
		setCurrent(current - 1);
		window.localStorage.setItem("current", (current - 1).toString());
		targetList[target - current].water = true;
		setTargetList(() => [...targetList]);
	};

	const handleDrink = (index) => {
		// BUG double toast
		// toast(`cup ${index}`)
	};
	return (
		<BaseLayout title="drink water">
			<WaterWrapper>
				<div className="card">
					<div className="title">{`Let's Drink!`}</div>
					<div className="target-wrapper">
						<div className="targets">
							{Number(target) > 0 ? (
								<div>
									<div className="text">
										TARGET: Drink {target} cups of water a day
									</div>
									<div></div>
								</div>
							) : (
								<div className="hoz">
									<input
										type="range"
										min="0"
										max="9"
										step="1"
										value={number}
										onChange={(e) => {
											setNumber(Number(e.target.value));
										}}
									/>
									<Button style={{ marginLeft: "1rem" }} onClick={targetSet}>
										{number} cups
									</Button>
								</div>
							)}
						</div>
						<TextButton
							style={{ textDecoration: "underline" }}
							onClick={targetReset}
						>
							Reset
						</TextButton>
					</div>

					<div className="results">
						<div className="cups">
							{targetList.map((item, index) => {
								return (
									<WaterItem
										key={item.index}
										isDrink={item.water}
										handleDrink={() => handleDrink(index)}
									/>
								);
							})}
						</div>
					</div>

					{target > 0 && current > 0 ? (
						<div className="handlers">
							<Button btnType="primary" onClick={() => doDrink()}>
								Drink ({current} left)
							</Button>
						</div>
					) : (
						target > 0 && (
							<div className="res">Misson Completed, See you tommorow</div>
						)
					)}
				</div>
			</WaterWrapper>
		</BaseLayout>
	);
}
