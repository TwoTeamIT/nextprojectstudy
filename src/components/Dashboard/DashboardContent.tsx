"use client";

import PageHeader from "@/components/PageHeader/PageHeader";
import { LineChart, PieChart } from "@mui/x-charts";
import { Box } from "@mui/material";

export default function DashboardContent({ dict }: { dict: any }) {
    const cardStyle = {
        flex: "1 1 300px",
        background: "#f5f5f5",
        padding: "1rem",
        borderRadius: "8px",
    };

    return (
        <>
            <PageHeader title={dict.Title} />
            <section style={{ padding: "1rem" }}>
                <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                    <div style={cardStyle}>
                        <h3>{dict.Card3Title || "Ultimo accesso"}</h3>
                        <p>{dict.LastAccessLabel || "15 luglio 2025, 10:45"}</p>
                    </div>
                </div>
            </section>
            <section style={{ padding: "1rem" }}>
                <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                    <div style={cardStyle}>
                        <h3>{dict.Card1Title || "Utenti attivi"}</h3>
                        <p>{dict.Card1Description || "Numero di utenti attivi oggi."}</p>
                        <strong>128</strong>
                    </div>
                    <Box mt={4}>
                        <h3 style={{ marginBottom: "1rem" }}>Accessi giornalieri</h3>
                        <LineChart
                            series={[{ data: [30, 50, 40, 60, 80], label: "Accessi" }]}
                            xAxis={[{ data: ["Lun", "Mar", "Mer", "Gio", "Ven"], scaleType: "point" }]}
                            width={600}
                            height={300}
                        />
                    </Box>
                </div>
            </section>

            <section style={{ padding: "1rem" }}>
                <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                    <div style={cardStyle}>
                        <h3>{dict.Card2Title || "Report mensili"}</h3>
                        <p>{dict.Card2Description || "Statistiche aggiornate del mese."}</p>
                        <button style={{ padding: "0.5rem 1rem" }}>
                            {dict.ViewReports || "Apri"}
                        </button>

                    </div>
                    <Box mt={4} style={{ flex: "1 1 150px" }}>
                        <h3 style={{ marginBottom: "1rem" }}>Report categorie</h3>
                        <PieChart
                            series={[
                                {
                                    innerRadius: 60,
                                    outerRadius: 120,
                                    paddingAngle: 5,
                                    cornerRadius: 5,
                                    data: [
                                        { id: 0, value: 40, label: "Categoria A" },
                                        { id: 1, value: 25, label: "Categoria B" },
                                        { id: 2, value: 20, label: "Categoria C" },
                                        { id: 3, value: 15, label: "Categoria D" },
                                    ],
                                },
                            ]}
                            width={400}
                            height={300}
                            slotProps={{
                                legend: {
                                    labelStyle: {
                                        fontSize: 14,
                                    },
                                },
                                pieArcLabel: {
                                    style: {
                                        fontSize: 14,
                                        fill: "#000", // colore del testo
                                    },
                                },
                            }}
                        />

                    </Box>
                </div>
            </section>
        </>
    );
}
