// export const lineSampleData = () => {
//   // Line chart data for Nivo
//   return [
//     {
//       id: 'Inflow',
//       data: [
//         { x: 'Jun', y: 57.9 },
//         { x: 'Jul', y: 65.2 },
//         { x: 'Aug', y: 71.2 },
//         { x: 'Sep', y: 110 },
//         { x: 'Oct', y: 89.5 },
//         { x: 'Nov', y: 92 },
//         { x: 'Dec', y: 98.44 },
//       ],
//     },
//     {
//       id: 'Outflow',
//       data: [
//         { x: 'Jun', y: 47.9 },
//         { x: 'Jul', y: 120 },
//         { x: 'Aug', y: 61.2 },
//         { x: 'Sep', y: 68.3 },
//         { x: 'Oct', y: 79.5 },
//         { x: 'Nov', y: 52 },
//         { x: 'Dec', y: 88.44 },
//       ],
//     },
//   ];
// };

// export const pieSampleData = () => {
//   // Pie chart data for Nivo
//   return [
//     { id: 'Fire Alarm', value: 9, label: 'Fire Alarm' },
//     { id: 'Sanitary', value: 3, label: 'Sanitary' },
//     { id: 'Power Trips', value: 4, label: 'Power Trips' },
//     { id: 'Trespassing', value: 5, label: 'Trespassing' },
//     { id: 'Near Misses', value: 11, label: 'Near Misses' },
//   ];
// };

// export const barSampleData = () => {
//   // Bar chart data for Nivo
//   return [
//     { category: 'Fire Alarm', value: 4748.06 },
//     { category: 'Trespassing', value: 3330.26 },
//     { category: 'Near Misses', value: 3030.21 },
//     { category: 'Sanitary', value: 2700 },
//     { category: 'Power trips', value: 2224.53 },
//   ];
// };

// export const barSampleData2 = () => {
//   // Bar chart data for personnel overview
//   return [
//     { id: 'cat1', value: 23 },
//     { id: 'cat2', value: 84 },
//     { id: 'cat3', value: 101 },
//     { id: 'cat4', value: 74 },
//     { id: 'cat5', value: 87 },
//   ];
// };

export const lineSampleData = () => {
  return [
    {
      id: "Inflow",
      data: [
        { x: "Jun", y: 57.9 },
        { x: "Jul", y: 65.2 },
        { x: "Aug", y: 71.2 },
        { x: "Sep", y: 110 },
        { x: "Oct", y: 89.5 },
        { x: "Nov", y: 92 },
        { x: "Dec", y: 98.44 },
      ],
    },
    {
      id: "Outflow",
      data: [
        { x: "Jun", y: 47.9 },
        { x: "Jul", y: 120 },
        { x: "Aug", y: 61.2 },
        { x: "Sep", y: 68.3 },
        { x: "Oct", y: 79.5 },
        { x: "Nov", y: 52 },
        { x: "Dec", y: 88.44 },
      ],
    },
  ];
};

export const pieSampleData = () => {
  // Remove the 'label' property - nivo doesn't need it
  return [
    { id: "Fire Alarm", value: 9 },
    { id: "Sanitary", value: 3 },
    { id: "Power Trips", value: 4 },
    { id: "Trespassing", value: 5 },
    { id: "Near Misses", value: 11 },
  ];
};

export const barSampleData = () => {
  // Use consistent property names
  return [
    { id: "Fire Alarm", value: 4748.06 },
    { id: "Trespassing", value: 3330.26 },
    { id: "Near Misses", value: 3030.21 },
    { id: "Sanitary", value: 2700 },
    { id: "Power trips", value: 2224.53 },
  ];
};

export const barSampleData2 = () => {
  return [
    { id: "cat1", value: 23 },
    { id: "cat2", value: 84 },
    { id: "cat3", value: 101 },
    { id: "cat4", value: 74 },
    { id: "cat5", value: 87 },
  ];
};

export const lineSampleData2 = () => {
  return [
    {
      id: "japan",
      data: [
        {
          x: "plane",
          y: 234,
        },
        {
          x: "helicopter",
          y: 20,
        },
        {
          x: "boat",
          y: 294,
        },
        {
          x: "train",
          y: 260,
        },
        {
          x: "subway",
          y: 237,
        },
        {
          x: "bus",
          y: 43,
        },
        {
          x: "car",
          y: 220,
        },
        {
          x: "moto",
          y: 266,
        },
        {
          x: "bicycle",
          y: 45,
        },
        {
          x: "horse",
          y: 58,
        },
        {
          x: "skateboard",
          y: 188,
        },
        {
          x: "others",
          y: 26,
        },
      ],
    },
    {
      id: "france",
      data: [
        {
          x: "plane",
          y: 116,
        },
        {
          x: "helicopter",
          y: 7,
        },
        {
          x: "boat",
          y: 230,
        },
        {
          x: "train",
          y: 96,
        },
        {
          x: "subway",
          y: 0,
        },
        {
          x: "bus",
          y: 77,
        },
        {
          x: "car",
          y: 116,
        },
        {
          x: "moto",
          y: 152,
        },
        {
          x: "bicycle",
          y: 59,
        },
        {
          x: "horse",
          y: 260,
        },
        {
          x: "skateboard",
          y: 280,
        },
        {
          x: "others",
          y: 288,
        },
      ],
    },
    {
      id: "us",
      data: [
        {
          x: "plane",
          y: 194,
        },
        {
          x: "helicopter",
          y: 173,
        },
        {
          x: "boat",
          y: 114,
        },
        {
          x: "train",
          y: 213,
        },
        {
          x: "subway",
          y: 275,
        },
        {
          x: "bus",
          y: 150,
        },
        {
          x: "car",
          y: 175,
        },
        {
          x: "moto",
          y: 189,
        },
        {
          x: "bicycle",
          y: 140,
        },
        {
          x: "horse",
          y: 140,
        },
        {
          x: "skateboard",
          y: 283,
        },
        {
          x: "others",
          y: 183,
        },
      ],
    },
    {
      id: "germany",
      data: [
        {
          x: "plane",
          y: 277,
        },
        {
          x: "helicopter",
          y: 54,
        },
        {
          x: "boat",
          y: 240,
        },
        {
          x: "train",
          y: 290,
        },
        {
          x: "subway",
          y: 79,
        },
        {
          x: "bus",
          y: 191,
        },
        {
          x: "car",
          y: 272,
        },
        {
          x: "moto",
          y: 288,
        },
        {
          x: "bicycle",
          y: 76,
        },
        {
          x: "horse",
          y: 139,
        },
        {
          x: "skateboard",
          y: 187,
        },
        {
          x: "others",
          y: 72,
        },
      ],
    },
    {
      id: "norway",
      data: [
        {
          x: "plane",
          y: 146,
        },
        {
          x: "helicopter",
          y: 92,
        },
        {
          x: "boat",
          y: 206,
        },
        {
          x: "train",
          y: 165,
        },
        {
          x: "subway",
          y: 219,
        },
        {
          x: "bus",
          y: 208,
        },
        {
          x: "car",
          y: 212,
        },
        {
          x: "moto",
          y: 84,
        },
        {
          x: "bicycle",
          y: 98,
        },
        {
          x: "horse",
          y: 115,
        },
        {
          x: "skateboard",
          y: 249,
        },
        {
          x: "others",
          y: 65,
        },
      ],
    },
  ];
};
