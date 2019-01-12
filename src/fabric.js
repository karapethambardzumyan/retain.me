import { fabric } from 'fabric';

fabric.IText.prototype.isRTL = true;

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

  const lastChar = getDifference(this.text, this.hiddenTextarea.value);
  const index = this.hiddenTextarea.value.indexOf(lastChar);

  if(isNumber(this.hiddenTextarea.value[index]) && isNumber(this.hiddenTextarea.value[index + 1])) {
    let str = this.hiddenTextarea.value;
    str = str.split('');
    str.splice(index, 1);
    str.splice(index + 1, 0, lastChar);
    this.hiddenTextarea.value = str.join('');
    this.hiddenTextarea.selectionStart = index + 1;
    this.hiddenTextarea.selectionEnd = index + 1;
  }

  this.cursorOffsetCache = { };
  this.text = this.hiddenTextarea.value;

  this.hiddenTextarea.selectionStart = this.hiddenTextarea.selectionStart - 1;
  this.hiddenTextarea.selectionEnd = this.hiddenTextarea.selectionEnd - 1;

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
