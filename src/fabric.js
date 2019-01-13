import { fabric } from 'fabric';

fabric.IText.prototype.isRTL = true;

fabric.IText.prototype.onKeyDown = function(e) { //?? there may be a need to implement ctrl+z functionallity
  if(!this.isEditing || this.inCompositionMode) {
    return;
  }
  // section with going new line is wrong, should be implemented
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

    this.hiddenTextarea.value = value;
    this.text = this.hiddenTextarea.value;
    this.hiddenTextarea.selectionStart = this.hiddenTextarea.selectionEnd = this.selectionEnd = this.selectionStart;

    // const cursorPosition = this.get2DCursorLocation(this.selectionStart);
    // this._deleteStyleDeclaration(cursorPosition.lineIndex, cursorPosition.charIndex); //?? I think styles should be managed manually when any char is deleted
  }
  if(e.keyCode === 46) {
    e.preventDefault();

    if(this.selectionStart === this.selectionEnd && this.selectionStart === 0) {
      return;
    }

    let value = this.hiddenTextarea.value.split('');
    value.splice(this.selectionStart === this.selectionEnd ? this.selectionStart - 1 : this.selectionStart, this.selectionStart === this.selectionEnd ? 1 : Math.abs(this.selectionStart - this.selectionEnd));
    value = value.join('');

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

fabric.IText.prototype.updateFromTextArea = function() {
  if(!this.hiddenTextarea) {
    return;
  }

  this.hiddenTextarea.selectionStart = this.hiddenTextarea.selectionStart - 1;
  this.hiddenTextarea.selectionEnd = this.hiddenTextarea.selectionEnd - 1;

  let lastChar = getDifference(this.text, this.hiddenTextarea.value);
  let text = this.hiddenTextarea.value;
  let index = text.indexOf(lastChar);

  // section with numbers direction is wrong, should be refactored
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
