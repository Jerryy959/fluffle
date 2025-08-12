interface Island {
    id: number;
    x: number;
    y: number;
    radius: number;
}

const islands: Island[] = [
    { id: 1, x: 700, y: 300, radius: 250 },
    { id: 2, x: 950, y: 500, radius: 120 },
    { id: 3, x: 1250, y: 400, radius: 100 },
    { id: 4, x: 250, y: 450, radius: 140},
];

const isInsideIsland = (island: Island, x: number, y: number): boolean => {
    const distance = Math.sqrt((x - island.x) ** 2 + (y - island.y) ** 2);
    return distance <= island.radius;
};

const getIslandCenter = (islandId: number): [number, number] => {
    const island = islands.find((i) => i.id === islandId);
    return island ? [island.x, island.y] : [0, 0];
};

export { islands, isInsideIsland, getIslandCenter };