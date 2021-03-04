import Head from "next/head";
import styles from "../styles/Global.module.css";
import { Line } from "react-chartjs-2";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Button, Box, Checkbox, Image } from "../shared/chakra";

const setChartState = (e, props) => {
    const { set_visibility_chart, visibility_chart } = props;
    set_visibility_chart(!visibility_chart);
};

const chartOptions = {
    elements: {
        line: {
            tension: 0,
        },
    },
    hover: {
        mode: "point",
    },
    legend: {
        position: "top",
        labels: {
            fontSize: 20,
        },
    },
    pointRadius: 3,
    pointHoverRadius: 3,
};

const base_url = "https://api.kingsofbinary.com/boomcrash_";

export default function Home() {
    const canvas = useRef();
    const [chartData, setChartData] = useState({});
    const [width, setWidth] = useState(null);
    const [height, setHeight] = useState(null);
    const [visibility_chart1, set_visibility_chart1] = useState(true);
    const [visibility_chart2, set_visibility_chart2] = useState(true);
    const [visibility_chart3, set_visibility_chart3] = useState(true);
    const [location, setLocation] = useState({});

    const chart = () => {
        setWidth(window.innerWidth);
        setHeight(window.innerHeight + 50);
        const updateData = async () => {
            const url = base_url + location?.search?.replace("?", "");
            const {
                data: { buffer, candles },
            } = await axios.get(url);
            const _buffer = { ...buffer };

            const _percentages = [];
            const _totalLeft = [];
            for (let i in _buffer) {
                const value = _buffer[i];
                const totalLeft = Object.values(_buffer).reduce(
                    (a, b) => parseInt(a) + parseInt(b),
                    0
                );
                _percentages[i] = (value / totalLeft) * 100;
                _totalLeft[i] = totalLeft;
                delete _buffer[i];
            }

            setChartData({
                labels: Object.keys(buffer),
                datasets: [
                    {
                        label: `Counter`,
                        data: Object.values(buffer),
                        backgroundColor: ["rgb(20, 150, 50, 0.8)"],
                        pointBackgroundColor: "rgb(0, 0, 0, 0.5)",
                        borderWidth: 1,
                    },
                    {
                        label: `Percentage`,
                        data: Object.values(_percentages),
                        backgroundColor: ["rgb(111, 223, 200, 0.7)"],
                        pointBackgroundColor: "rgb(0, 0, 0, 0.5)",
                        borderWidth: 1,
                    },
                    {
                        label: `Total left`,
                        data: Object.values(_totalLeft),
                        backgroundColor: ["rgb(111, 100, 200, 0.7)"],
                        pointBackgroundColor: "rgb(0, 0, 0, 0.5)",
                        borderWidth: 1,
                    },
                ],
            });
        };
        updateData();
        setInterval(async () => await updateData(), 1000);
    };

    useEffect(() => {
        const data = { ...chartData };
        try {
            data.datasets[0].hidden = !visibility_chart1;
            data.datasets[1].hidden = !visibility_chart2;
            data.datasets[2].hidden = !visibility_chart3;
        } catch {}
        console.log(1);
        setChartData(data);
    }, [visibility_chart1, visibility_chart2, visibility_chart3]);

    useEffect(() => {
        setLocation(window.location);
    }, []);

    useEffect(() => {
        if (location.search) {
            chart();
        }
    }, [location]);
    return (
        <div className={styles.container}>
            <Head>
                <title>BoomCrash Analysis</title>
                <link rel="icon" href="/logo.png" />
            </Head>

            <Box className={styles.main} overflowX="hidden">
                <Line
                    ref={canvas}
                    data={chartData}
                    options={chartOptions}
                    width={width}
                    height={height}
                ></Line>
                <Box
                    pos="fixed"
                    top="100px"
                    right="300px"
                    display="flex"
                    flexDir="column"
                    textAlign="right"
                    margin="auto"
                    marginRight="0"
                >
                    <Checkbox
                        isChecked={location?.search === "?boom_1000"}
                        onChange={(e) => {
                            location.search = "?boom_1000";
                        }}
                    >
                        <Box fontSize="25px">Boom 1000 Index</Box>
                    </Checkbox>
                    <Checkbox
                        isChecked={location?.search === "?boom_500"}
                        onChange={(e) => {
                            location.search = "?boom_500";
                        }}
                    >
                        <Box fontSize="25px">Boom 500 Index</Box>
                    </Checkbox>
                    <Checkbox
                        isChecked={location?.search === "?crash_1000"}
                        onChange={(e) => {
                            location.search = "?crash_1000";
                        }}
                    >
                        <Box fontSize="25px">Crash 1000 Index</Box>
                    </Checkbox>
                    <Checkbox
                        isChecked={location?.search === "?crash_500"}
                        onChange={(e) => {
                            location.search = "?crash_500";
                        }}
                    >
                        <Box fontSize="25px">Crash 500 Index</Box>
                    </Checkbox>
                </Box>
                <Box
                    pos="fixed"
                    top="100px"
                    right="100px"
                    display="flex"
                    flexDir="column"
                    textAlign="right"
                    margin="auto"
                    marginRight="0"
                >
                    <Checkbox
                        isChecked={visibility_chart1}
                        onChange={(e) =>
                            setChartState(e, {
                                visibility_chart: visibility_chart1,
                                set_visibility_chart: set_visibility_chart1,
                            })
                        }
                    >
                        <Box fontSize="25px">Counter</Box>
                    </Checkbox>
                    <Checkbox
                        isChecked={visibility_chart2}
                        onChange={(e) =>
                            setChartState(e, {
                                visibility_chart: visibility_chart2,
                                set_visibility_chart: set_visibility_chart2,
                            })
                        }
                    >
                        <Box fontSize="25px">Percentage</Box>
                    </Checkbox>
                    <Checkbox
                        isChecked={visibility_chart3}
                        onChange={(e) =>
                            setChartState(e, {
                                visibility_chart: visibility_chart3,
                                set_visibility_chart: set_visibility_chart3,
                            })
                        }
                    >
                        <Box fontSize="25px">Total left</Box>
                    </Checkbox>
                </Box>

                <Box
                    pos="fixed"
                    top="50px"
                    left="100px"
                    w="300px"
                    display="flex"
                    flexDir="column"
                    textAlign="right"
                    margin="auto"
                    marginRight="0"
                >
                    <Image src="/logo.svg"></Image>
                </Box>
            </Box>
        </div>
    );
}
