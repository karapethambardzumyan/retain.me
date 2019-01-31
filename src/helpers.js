export function getCoordsLeft(target) {
  const coords = target.calcCoords();
  const newCoords = {};

  if(target.angle === 360 || target.angle === 0 || target.angle > 270 && target.angle < 360) {
    newCoords.x = coords.tl.x;
    newCoords.y = coords.tl.y;
    newCoords.originX = 'left';
    newCoords.originY = 'top';
  }

  if(target.angle > 0 && target.angle <= 90) {
    newCoords.x = coords.bl.x;
    newCoords.y = coords.bl.y;
    newCoords.originX = 'left';
    newCoords.originY = 'bottom';
  }

  if(target.angle > 90 && target.angle <= 180) {
    newCoords.x = coords.br.x;
    newCoords.y = coords.br.y;
    newCoords.originX = 'right';
    newCoords.originY = 'bottom';
  }

  if(target.angle > 180 && target.angle <= 270) {
    newCoords.x = coords.tr.x;
    newCoords.y = coords.tr.y;
    newCoords.originX = 'right';
    newCoords.originY = 'top';
  }

  return newCoords;
};

export function getCoordsTop(target) {
  const coords = target.calcCoords();
  const newCoords = {};

  if(target.angle === 360 || target.angle === 0 || target.angle > 270 && target.angle < 360) {
    newCoords.x = coords.tr.x;
    newCoords.y = coords.tr.y;
    newCoords.originX = 'right';
    newCoords.originY = 'top';
  }

  if(target.angle > 0 && target.angle <= 90) {
    newCoords.x = coords.tl.x;
    newCoords.y = coords.tl.y;
    newCoords.originX = 'left';
    newCoords.originY = 'top';
  }

  if(target.angle > 90 && target.angle <= 180) {
    newCoords.x = coords.bl.x;
    newCoords.y = coords.bl.y;
    newCoords.originX = 'left';
    newCoords.originY = 'bottom';
  }

  if(target.angle > 180 && target.angle <= 270) {
    newCoords.x = coords.br.x;
    newCoords.y = coords.br.y;
    newCoords.originX = 'right';
    newCoords.originY = 'bottom';
  }

  return newCoords;
};
