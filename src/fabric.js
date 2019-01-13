import { fabric } from 'fabric';

fabric.IText.prototype.isRTL = true;

fabric.IText.prototype.onKeyDown = function(e) { //?? there may be a need to implement ctrl+z functionallity
  if(!this.isEditing || this.inCompositionMode) {
    return;
  }
  //?? section with going new line is wrong, should be implemented
  if(e.keyCode === 13) {

  }
  if(e.keyCode === 8) {
    e.preventDefault();

    if(this.selectionStart === this.text.length) {
      return;
    }

    let value = this.hiddenTextarea.value.split('');
    value.splice(this.selectionStart, this.selectionStart === this.selectionEnd ? 1 : Math.abs(this.selectionStart - this.selectionEnd));
    value = value.join('');

    let start = this.selectionStart;
    let end = this.selectionStart === this.selectionEnd ? this.selectionStart + 1 : this.selectionEnd;
    this.removeStyleFromTo(start, end);

    this.hiddenTextarea.value = value;
    this.text = this.hiddenTextarea.value;
    this.hiddenTextarea.selectionStart = this.hiddenTextarea.selectionEnd = this.selectionEnd = this.selectionStart;


  }
  if(e.keyCode === 46) {
    e.preventDefault();

    if(this.selectionStart === this.selectionEnd && this.selectionStart === 0) {
      return;
    }

    let value = this.hiddenTextarea.value.split('');
    value.splice(this.selectionStart === this.selectionEnd ? this.selectionStart - 1 : this.selectionStart, this.selectionStart === this.selectionEnd ? 1 : Math.abs(this.selectionStart - this.selectionEnd));
    value = value.join('');

    let start = this.selectionStart === this.selectionEnd ? this.selectionStart - 1 : this.selectionStart;
    let end = this.selectionEnd;
    this.removeStyleFromTo(start, end);

    this.hiddenTextarea.value = value;
    this.text = this.hiddenTextarea.value;
    this.hiddenTextarea.selectionStart = this.hiddenTextarea.selectionEnd = this.selectionStart = this.selectionEnd = this.selectionStart === this.selectionEnd ? this.selectionStart - 1 : this.selectionStart;
  }
  if(e.keyCode in this.keysMap) {
    this[this.keysMap[e.keyCode]](e);
  }
  else if ((e.keyCode in this.ctrlKeysMapDown) && (e.ctrlKey || e.metaKey)) {
    this[this.ctrlKeysMapDown[e.keyCode]](e);
  }
  else {
    return;
  }
  e.stopImmediatePropagation();
  e.preventDefault();
  if(e.keyCode >= 33 && e.keyCode <= 40) {
    this.clearContextTop();
    this.renderCursorOrSelection();
  }
  else {
    this.canvas && this.canvas.requestRenderAll();
  }
},

fabric.IText.prototype._renderChars = function(method, ctx, line, left, top, lineIndex) {
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
};

fabric.IText.prototype._renderChar = function(method, ctx, lineIndex, charIndex, _char, left, top) {
  var decl = this._getStyleDeclaration(lineIndex, charIndex),
      fullDecl = this.getCompleteStyleDeclaration(lineIndex, charIndex),
      shouldFill = method === 'fillText' && fullDecl.fill,
      shouldStroke = method === 'strokeText' && fullDecl.stroke && fullDecl.strokeWidth;

  if (!shouldStroke && !shouldFill) {
    return;
  }
  decl && ctx.save();

  this._applyCharStyles(method, ctx, lineIndex, charIndex, fullDecl);

  if (decl && decl.textBackgroundColor) {
    this._removeShadow(ctx);
  }
  if (decl && decl.deltaY) {
    top += decl.deltaY;
  }

  shouldFill && ctx.fillText(_char, left, top);
  shouldStroke && ctx.strokeText(_char, left, top);
  decl && ctx.restore();
};

fabric.IText.prototype.updateFromTextArea = function() {
  if(!this.hiddenTextarea) {
    return;
  }

  this.hiddenTextarea.selectionStart = this.hiddenTextarea.selectionStart - 1;
  this.hiddenTextarea.selectionEnd = this.hiddenTextarea.selectionEnd - 1;

  let lastChar = getDifference(this.text, this.hiddenTextarea.value);
  let text = this.hiddenTextarea.value;
  let index = text.indexOf(lastChar);

  //?? section with numbers direction is wrong, should be refactored
  if(isNumber(lastChar) && isNumber(text[index + 1])) {
    let closestNanIndex = text.match(/[^0-9]/);
    closestNanIndex = closestNanIndex && closestNanIndex.index - 1;
    text = text.split('');
    text.splice(index, 1);
    text.splice(closestNanIndex, 0, lastChar);
    text = text.join('');

    this.hiddenTextarea.value = text;
    this.hiddenTextarea.selectionStart = index;
    this.hiddenTextarea.selectionEnd = index;
  }

  this.cursorOffsetCache = { };
  this.text = this.hiddenTextarea.value;

  if(this._shouldClearDimensionCache()) {
    this.initDimensions();
    this.setCoords();
  }
  var newSelection = this.fromStringToGraphemeSelection(this.hiddenTextarea.selectionStart, this.hiddenTextarea.selectionEnd, this.hiddenTextarea.value);
  this.selectionEnd = this.selectionStart = newSelection.selectionEnd;
  if(!this.inCompositionMode) {
    this.selectionStart = newSelection.selectionStart;
  }
  this.updateTextareaPosition();
};

fabric.IText.prototype.renderCursor = function(boundaries, ctx) {
  var cursorLocation = this.get2DCursorLocation(),
      lineIndex = cursorLocation.lineIndex,
      charIndex = cursorLocation.charIndex > 0 ? cursorLocation.charIndex - 1 : 0,
      charHeight = this.getValueOfPropertyAt(lineIndex, charIndex, 'fontSize'),
      multiplier = this.scaleX * this.canvas.getZoom(),
      cursorWidth = this.cursorWidth / multiplier,
      topOffset = boundaries.topOffset,
      dy = this.getValueOfPropertyAt(lineIndex, charIndex, 'deltaY');

  topOffset += (1 - this._fontSizeFraction) * this.getHeightOfLine(lineIndex) / this.lineHeight - charHeight * (1 - this._fontSizeFraction);

  if (this.inCompositionMode) {
    this.renderSelection(boundaries, ctx);
  }

  ctx.fillStyle = this.getValueOfPropertyAt(lineIndex, charIndex + 1, 'fill');
  ctx.globalAlpha = this.__isMousedown ? 1 : this._currentCursorOpacity;
  ctx.fillRect(
    boundaries.left + boundaries.leftOffset - cursorWidth / 2,
    topOffset + boundaries.top + dy,
    cursorWidth,
    charHeight);
};

fabric.IText.prototype.insertCharStyleObject = function(lineIndex, charIndex, quantity, copiedStyle) {
  if (!this.styles) {
    this.styles = {};
  }
  var currentLineStyles       = this.styles[lineIndex],
      currentLineStylesCloned = currentLineStyles ? fabric.util.object.clone(currentLineStyles) : {};

  quantity || (quantity = 1);
  // shift all char styles by quantity forward
  // 0,1,2,3 -> (charIndex=2) -> 0,1,3,4 -> (insert 2) -> 0,1,2,3,4
  for (var index in currentLineStylesCloned) {
    var numericIndex = parseInt(index, 10);
    if (numericIndex >= charIndex) {
      currentLineStyles[numericIndex + quantity] = currentLineStylesCloned[numericIndex];
      // only delete the style if there was nothing moved there
      if (!currentLineStylesCloned[numericIndex - quantity]) {
        delete currentLineStyles[numericIndex];
      }
    }
  }
  this._forceClearCache = true;
  if (copiedStyle) {
    while (quantity--) {
      if (!Object.keys(copiedStyle[quantity]).length) {
        continue;
      }
      if (!this.styles[lineIndex]) {
        this.styles[lineIndex] = {};
      }
      this.styles[lineIndex][charIndex + quantity] = fabric.util.object.clone(copiedStyle[quantity]);
    }
    return;
  }
  if (!currentLineStyles) {
    return;
  }
  var newStyle = currentLineStyles[charIndex ? charIndex + 1 : 1];
  while (newStyle && quantity--) {
    this.styles[lineIndex][charIndex + quantity] = fabric.util.object.clone(newStyle);
  }
};

// helpers
function getDifference(a, b) {
  let i = 0;
  let j = 0;
  let result = '';

  while (j < b.length) {
    if(a[i] != b[j] || i == a.length) {
      result += b[j];
    } else {
      i++;
    }

    j++;
  }

  return result;
};

function isNumber(str) {
  str = parseInt(str);

  return (typeof str === 'number' && !isNaN(str));
};
