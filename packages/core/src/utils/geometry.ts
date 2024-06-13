export function isPointInFrontOfPlane(
  point: number[],
  planePoint: number[],
  planeNormal: number[],
) {
  // Calculate the vector from the plane to the point
  const vectorToPlane = [
    point[0] - planePoint[0],
    point[1] - planePoint[1],
    point[2] - planePoint[2],
  ];

  // Calculate the dot product between the normal vector and the vector to the point
  const dotProduct =
    planeNormal[0] * vectorToPlane[0] +
    planeNormal[1] * vectorToPlane[1] +
    planeNormal[2] * vectorToPlane[2];

  return dotProduct > 0;
}
