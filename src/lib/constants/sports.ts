export const SPORT_CATEGORIES = [
  {
    category: "Team Sports",
    items: ["Football (Soccer)", "Futsal", "Volleyball", "Basketball"],
  },
  {
    category: "Combat Sports",
    items: ["Muay Thai", "Boxing", "MMA"],
  },
  {
    category: "Racquet Sports",
    items: ["Badminton", "Table Tennis", "Tennis"],
  },
  {
    category: "Individual & Fitness",
    items: ["Running", "Cycling", "Swimming", "Gym / Fitness"],
  },
  {
    category: "Precision & Leisure",
    items: ["Golf"],
  },
];

export const SPORTS = SPORT_CATEGORIES.flatMap((group) => group.items);
