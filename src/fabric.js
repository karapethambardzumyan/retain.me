import { fabric } from 'fabric';

fabric.IText.prototype.isRTL = false;

fabric.IText.prototype._getCursorBoundariesOffsets = function(position) {
  if (this.cursorOffsetCache && 'top' in this.cursorOffsetCache) {
    return this.cursorOffsetCache;
  }
  var lineLeftOffset,
      lineIndex,
      charIndex,
      topOffset = 0,
      leftOffset = 0,
      boundaries,
      cursorPosition = this.get2DCursorLocation(position);
  charIndex = cursorPosition.charIndex;
  lineIndex = cursorPosition.lineIndex;
  for (var i = 0; i < lineIndex; i++) {
    topOffset += this.getHeightOfLine(i);
  }
  lineLeftOffset = this._getLineLeftOffset(lineIndex);
  var bound = this.__charBounds[lineIndex][charIndex];
  bound && (leftOffset = this.__lineWidths[lineIndex] - bound.left);
  if (this.charSpacing !== 0 && charIndex === this._textLines[lineIndex].length) {
    leftOffset -= this._getWidthOfCharSpacing();
  }
  boundaries = {
    top: topOffset,
    left: lineLeftOffset + (leftOffset > 0 ? leftOffset : 0),
  };
  this.cursorOffsetCache = boundaries;
  return this.cursorOffsetCache;
};
