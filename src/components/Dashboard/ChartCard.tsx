"use client";

import { LineChart } from "@mui/x-charts";
import { Box } from "@mui/material";

export default function ChartCard() {
    const lineChartData = [30, 50, 40, 60, 80];
    const labels = ["Lun", "Mar", "Mer", "Gio", "Ven"];

    return (
        <Box mt={4}>
            <h3 style={{ marginBottom: "1rem" }}>Accessi giornalieri</h3>
            <LineChart
                series={[{ data: lineChartData, label: "Accessi" }]}
                xAxis={[{ data: labels, scaleType: "point" }]}
                width={600}
                height={300}
            />
        </Box>
    );
}
