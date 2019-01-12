import { fabric } from 'fabric';

fabric.IText.prototype.isRTL = false;

// fabric.IText.prototype.moveCursorLeft = function(e) {
//   if (this._text.length - this.selectionStart === 0 && this._text.length - this.selectionEnd === 0) {
//     return;
//   }
//   this._moveCursorLeftOrRight('Right', e);
// };
//
// fabric.IText.prototype.moveCursorRight = function(e) {
//   if (this._text.length - this.selectionStart >= this._text.length && this._text.length - this.selectionEnd >= this._text.length) {
//     return;
//   }
//   this._moveCursorLeftOrRight('Left', e);
// };
//
// fabric.IText.prototype._getCursorBoundariesOffsets = function(position) {
//   if (this.cursorOffsetCache && 'top' in this.cursorOffsetCache) {
//     return this.cursorOffsetCache;
//   }
//   var lineLeftOffset,
//       lineIndex,
//       charIndex,
//       topOffset = 0,
//       leftOffset = 0,
//       boundaries,
//       cursorPosition = this.get2DCursorLocation(position);
//   charIndex = cursorPosition.charIndex;
//   lineIndex = cursorPosition.lineIndex;
//   for (var i = 0; i < lineIndex; i++) {
//     topOffset += this.getHeightOfLine(i);
//   }
//   lineLeftOffset = this._getLineLeftOffset(lineIndex);
//   var bound = this.__charBounds[lineIndex][charIndex];
//   bound && (leftOffset = this.__lineWidths[lineIndex] - bound.left);
//   if (this.charSpacing !== 0 && charIndex === this._textLines[lineIndex].length) {
//     leftOffset -= this._getWidthOfCharSpacing();
//   }
//   boundaries = {
//     top: topOffset,
//     left: lineLeftOffset + (leftOffset > 0 ? leftOffset : 0),
//   };
//   this.cursorOffsetCache = boundaries;
//   return this.cursorOffsetCache;
// };
//
// fabric.IText.prototype.renderSelection = function(boundaries, ctx) {
//   var selectionStart = this.inCompositionMode ? this.hiddenTextarea.selectionStart : this.selectionStart,
//       selectionEnd = this.inCompositionMode ? this.hiddenTextarea.selectionEnd : this.selectionEnd,
//       isJustify = this.textAlign.indexOf('justify') !== -1,
//       start = this.get2DCursorLocation(selectionStart),
//       end = this.get2DCursorLocation(selectionEnd),
//       startLine = start.lineIndex,
//       endLine = end.lineIndex,
//       startChar = start.charIndex < 0 ? 0 : start.charIndex,
//       endChar = end.charIndex < 0 ? 0 : end.charIndex;
//
//   for (var i = startLine; i <= endLine; i++) {
//     var lineOffset = this._getLineLeftOffset(i) || 0,
//         lineHeight = this.getHeightOfLine(i),
//         realLineHeight = 0, boxStart = 0, boxEnd = 0;
//
//     if (i === startLine) {
//       boxStart = this.__charBounds[startLine][startChar].left;
//     }
//     if (i >= startLine && i < endLine) {
//       boxEnd = isJustify && !this.isEndOfWrapping(i) ? this.width : this.getLineWidth(i) || 5; // WTF is this 5?
//     }
//     else if (i === endLine) {
//       if (endChar === 0) {
//         boxEnd = this.__charBounds[endLine][endChar].left;
//       }
//       else {
//         var charSpacing = this._getWidthOfCharSpacing();
//         boxEnd = this.__charBounds[endLine][endChar - 1].left
//           + this.__charBounds[endLine][endChar - 1].width - charSpacing;
//       }
//     }
//     realLineHeight = lineHeight;
//     if (this.lineHeight < 1 || (i === endLine && this.lineHeight > 1)) {
//       lineHeight /= this.lineHeight;
//     }
//     if (this.inCompositionMode) {
//       ctx.fillStyle = this.compositionColor || 'black';
//       ctx.fillRect(
//         boundaries.left + lineOffset + boxStart,
//         boundaries.top + boundaries.topOffset + lineHeight,
//         boxEnd - boxStart,
//         1);
//     }
//     else {
//       ctx.fillStyle = this.selectionColor;
//       ctx.fillRect(
//         boundaries.left + lineOffset + this.__lineWidths[start.lineIndex] - boxEnd,
//         boundaries.top + boundaries.topOffset,
//         boxEnd - boxStart,
//         lineHeight);
//     }
//
//
//     boundaries.topOffset += realLineHeight;
//   }
// };
//
// fabric.IText.prototype.renderCursor = function(boundaries, ctx) {
//   var cursorLocation = this.get2DCursorLocation(),
//       lineIndex = cursorLocation.lineIndex,
//       charIndex = this._text.length - cursorLocation.charIndex,
//       charHeight = this.getValueOfPropertyAt(lineIndex, charIndex, 'fontSize'),
//       multiplier = this.scaleX * this.canvas.getZoom(),
//       cursorWidth = this.cursorWidth / multiplier,
//       topOffset = boundaries.topOffset,
//       dy = this.getValueOfPropertyAt(lineIndex, charIndex, 'deltaY');
//
//   topOffset += (1 - this._fontSizeFraction) * this.getHeightOfLine(lineIndex) / this.lineHeight
//     - charHeight * (1 - this._fontSizeFraction);
//
//   if (this.inCompositionMode) {
//     this.renderSelection(boundaries, ctx);
//   }
//
//   ctx.fillStyle = this.getValueOfPropertyAt(lineIndex, charIndex, 'fill');
//   ctx.globalAlpha = this.__isMousedown ? 1 : this._currentCursorOpacity;
//
//   ctx.fillRect(
//     boundaries.left + (boundaries.leftOffset) - cursorWidth / 2,
//     topOffset + boundaries.top + dy,
//     cursorWidth,
//     charHeight);
// };

// fabric.IText.prototype._renderChars = function(method, ctx, line, left, top, lineIndex) {
//   // set proper line offset
//   var lineHeight = this.getHeightOfLine(lineIndex),
//       isJustify = this.textAlign.indexOf('justify') !== -1,
//       actualStyle,
//       nextStyle,
//       charsToRender = '',
//       charBox,
//       boxWidth = 0,
//       timeToRender,
//       shortCut = !isJustify && this.charSpacing === 0 && this.isEmptyStyles(lineIndex);
//
//   console.log('_renderChars method is started');
//   ctx.save();
//   top -= lineHeight * this._fontSizeFraction / this.lineHeight;
//   if(shortCut) {
//     // render all the line in one pass without checking
//     this._renderChar(method, ctx, lineIndex, 0, this.textLines[lineIndex], left, top, lineHeight);
//     ctx.restore();
//     return;
//   }
//
//   for (var i = 0, len = line.length - 1; i <= len; i++) {
//     timeToRender = i === len || this.charSpacing;
//     charsToRender += line[len - i];
//
//     charBox = this.__charBounds[lineIndex][len - i];
//     if (boxWidth === 0) {
//       left += charBox.kernedWidth - charBox.width;
//       boxWidth += charBox.width;
//     }
//     else {
//       boxWidth += charBox.kernedWidth;
//     }
//     if (!timeToRender) {
//       if (this._reSpaceAndTab.test(line[len - i])) {
//         timeToRender = true;
//       }
//     }
//
//     if (!timeToRender) {
//       actualStyle = actualStyle || this.getCompleteStyleDeclaration(lineIndex, len - i);
//       nextStyle = this.getCompleteStyleDeclaration(lineIndex, (len - i) - 1);
//       timeToRender = this._hasStyleChanged(actualStyle, nextStyle);
//     }
//     if (timeToRender) {
//       this._renderChar(method, ctx, lineIndex, len - i, charsToRender, left, top, lineHeight);
//       charsToRender = '';
//       actualStyle = nextStyle;
//       left += boxWidth;
//       boxWidth = 0;
//     }
//
//   }
//
//   ctx.restore();
//   console.log('_renderChars method is completed');
// };

fabric.IText.prototype._renderChars = function(method, ctx, line, left, top, lineIndex) {
  console.log('_renderChars method is started');

  let lineHeight = this.getHeightOfLine(lineIndex);
  let charBox;
  let leftOffset = 0;

  top -= lineHeight * this._fontSizeFraction / this.lineHeight;

  ctx.save();
  for(let i = 0; i < line.length; i++) {
    charBox = this.__charBounds[lineIndex][i];
    leftOffset = left + charBox.width + charBox.left- charBox.kernedWidth;

    this._renderChar(method, ctx, lineIndex, i, line[i], leftOffset, top, lineHeight);
  }
  ctx.restore();

  console.log('_renderChars method is completed');
};
