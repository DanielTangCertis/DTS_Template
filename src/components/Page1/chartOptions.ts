export const option1 = () => {
  // Line chart data for Nivo
  return [
    {
      id: 'Inflow',
      data: [
        { x: 'Jun', y: 57.9 },
        { x: 'Jul', y: 65.2 },
        { x: 'Aug', y: 71.2 },
        { x: 'Sep', y: 110 },
        { x: 'Oct', y: 89.5 },
        { x: 'Nov', y: 92 },
        { x: 'Dec', y: 98.44 },
      ],
    },
    {
      id: 'Outflow',
      data: [
        { x: 'Jun', y: 47.9 },
        { x: 'Jul', y: 120 },
        { x: 'Aug', y: 61.2 },
        { x: 'Sep', y: 68.3 },
        { x: 'Oct', y: 79.5 },
        { x: 'Nov', y: 52 },
        { x: 'Dec', y: 88.44 },
      ],
    },
  ];
};

export const option2 = () => {
  // Pie chart data for Nivo
  return [
    { id: 'Fire Alarm', value: 9, label: 'Fire Alarm' },
    { id: 'Sanitary', value: 3, label: 'Sanitary' },
    { id: 'Power Trips', value: 4, label: 'Power Trips' },
    { id: 'Trespassing', value: 5, label: 'Trespassing' },
    { id: 'Near Misses', value: 11, label: 'Near Misses' },
  ];
};

export const option3 = () => {
  // Bar chart data for Nivo
  return [
    { category: 'Fire Alarm', value: 4748.06 },
    { category: 'Trespassing', value: 3330.26 },
    { category: 'Near Misses', value: 3030.21 },
    { category: 'Sanitary', value: 2700 },
    { category: 'Power trips', value: 2224.53 },
  ];
};

export const option4 = () => {
  // Bar chart data for personnel overview
  return [
    { id: 'cat1', value: 23 },
    { id: 'cat2', value: 84 },
    { id: 'cat3', value: 101 },
    { id: 'cat4', value: 74 },
    { id: 'cat5', value: 87 },
  ];
};