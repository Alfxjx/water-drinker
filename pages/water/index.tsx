import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { CopyToClipboard } from "react-copy-to-clipboard";

import { Button, TextButton } from "@/components/Button";
import { toast } from "@/components/Toast";
import { BaseLayout } from "@/components/Layout/base";
import { WaterItem, WaterWrapper } from "@/components/Pages/water/WaterItem";

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
			window.localStorage.setItem("current", router.query.left as string);
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
		window.localStorage.removeItem("getQuery");
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

	const handleText = () => {
		const urlPath = window?.location.href.split("?")[0];
		const target = window?.localStorage.getItem("target");
		const left = window?.localStorage.getItem("current");
		return `${urlPath}?target=${target}&left=${left}`;
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
							{targetList.length > 0 &&
								targetList.map((item, index) => {
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
							<Button
								btnType="primary"
								style={{ marginRight: "5px" }}
								onClick={() => doDrink()}
							>
								Drink ({current} left)
							</Button>
							<CopyToClipboard
								text={handleText()}
								onCopy={() => {
									toast.success("Copy Success");
								}}
							>
								<Button>Share</Button>
							</CopyToClipboard>
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
