

// ⚠️ NON funziona lato server! Quindi simula i dati
export async function getDemoUsers() {
    // Simulazione lato server
    const rows = Array.from({ length: 20 }).map((_, i) => ({
        id: i,
        name: `User ${i}`,
        position: i % 2 === 0 ? "Manager" : "Developer",
        avatar: `hsl(${i * 30}, 60%, 60%)`,
        phone: `+39 333 00000${i}`,
    }));

    const columns = [
        { field: "name", headerName: "Name", flex: 1 },
        { field: "position", headerName: "Position", flex: 1 },
        { field: "avatar", headerName: "Color", flex: 1 },
    ];

    return { rows, columns };
}
