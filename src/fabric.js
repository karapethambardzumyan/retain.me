import { fabric } from 'fabric';

fabric.IText.prototype.isRTL = false;

fabric.IText.prototype.enableRTL = function() {
  this.isRTL = true;
};

fabric.IText.prototype.disableRTL = function() {
  this.isRTL = false;
};

fabric.IText.prototype.onKeyDown = function(e) {
  if(this.isRTL) {
    if (!this.isEditing || this.inCompositionMode) {
      return;
    }

    if(e.keyCode === 8) {
      e.preventDefault();

      let start = e.target.selectionStart;
      let end = e.target.selectionEnd;
      let value = e.target.value.split('');

      let pos = this.get2DCursorLocation(start);
      if(pos.charIndex === 0 && this._textLines[pos.lineIndex].length === 0 && value.length !== 0) {
        value.splice(start - 1, 1);
        this.removeStyleFromTo(start - 1, start);
        value.splice((start - (this._textLines[this.get2DCursorLocation(start).lineIndex - 1].length)) - 1, 1);
        this.removeStyleFromTo((start - (this._textLines[this.get2DCursorLocation(start).lineIndex - 1].length)) - 1, (start - (this._textLines[this.get2DCursorLocation(start).lineIndex - 1].length)));

        e.target.value = value.join('');
        e.target.selectionStart = (start - (this._textLines[this.get2DCursorLocation(start).lineIndex - 1].length)) - 1;
        e.target.selectionEnd = (start - (this._textLines[this.get2DCursorLocation(start).lineIndex - 1].length)) - 1;

        this.updateFromTextArea();
        this.fire('changed');
        if(this.canvas) {
          this.canvas.fire('text:changed', { target: this });
          this.canvas.requestRenderAll();
        }

        return;
      }

      if(isNumber(value[start]) && isNumber(value[start + 1])) {
        if(start === end) {
          let lineIndex = this.get2DCursorLocation().lineIndex;
          let charIndex = this.get2DCursorLocation().charIndex;
          let lineText = this._textLines[lineIndex];
          let char = value[start];
          let firstPartOfText = lineText.slice(0, charIndex);
          let secondPartOfText = lineText.slice(charIndex, lineText.length);
          let insertionIndex = secondPartOfText.join('').match(/[^0-9]/);
          insertionIndex = insertionIndex ? firstPartOfText.length + insertionIndex.index : lineText.length;

          for(var i = 0, textLines = this._textLines; i <= textLines.length; i++) {
            if(i < lineIndex) {
              insertionIndex += textLines[i].length + 1;
            }
          };

          value.splice(insertionIndex - 1, 1);
          e.target.value = value.join('');
          e.target.selectionStart = start;
          e.target.selectionEnd = start;

          this.removeStyleFromTo(insertionIndex - 1, insertionIndex);
        } else {
          value.splice(start, end - start);

          e.target.value = value.join('');
          e.target.selectionStart = start;
          e.target.selectionEnd = start;

          this.removeStyleFromTo(start, end);
        }

        this.updateFromTextArea();
        this.fire('changed');
        if(this.canvas) {
          this.canvas.fire('text:changed', { target: this });
          this.canvas.requestRenderAll();
        }

        return;
      } else {
        let start = e.target.selectionStart;
        let end = e.target.selectionEnd;
        let value = e.target.value.split('');

        if(start === end) {
          value.splice(start, 1);

          e.target.value = value.join('');
          e.target.selectionStart = start;
          e.target.selectionEnd = end;

          this.removeStyleFromTo(start, start + 1);
        } else {
          value.splice(start, end - start);

          e.target.value = value.join('');
          e.target.selectionStart = start;
          e.target.selectionEnd = start;

          this.removeStyleFromTo(start, end);
        }
      }

      this.updateFromTextArea();
      return;
    }

    if(e.keyCode === 46) {
      e.preventDefault();

      let start = e.target.selectionStart;
      let end = e.target.selectionEnd;
      let value = e.target.value.split('');

      if(start === end && start === 0) {
        return;
      }

      if(start === end) {
        value.splice(start - 1, 1);

        e.target.value = value.join('');
        e.target.selectionStart = start - 1;
        e.target.selectionEnd = end - 1;

        this.removeStyleFromTo(e.target.selectionStart, e.target.selectionStart + 1);
      } else {
        value.splice(start, end - start);

        e.target.value = value.join('');
        e.target.selectionStart = start;
        e.target.selectionEnd = start;

        this.removeStyleFromTo(start, end);
      }

      this.updateFromTextArea();
      return;
    }

    if (e.keyCode in this.keysMap) {
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
    if (e.keyCode >= 33 && e.keyCode <= 40) {
      // if i press an arrow key just update selection
      this.clearContextTop();
      this.renderCursorOrSelection();
    }
    else {
      this.canvas && this.canvas.requestRenderAll();
    }
  } else {
    if (!this.isEditing || this.inCompositionMode) {
      return;
    }
    if (e.keyCode in this.keysMap) {
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
    if (e.keyCode >= 33 && e.keyCode <= 40) {
      // if i press an arrow key just update selection
      this.clearContextTop();
      this.renderCursorOrSelection();
    }
    else {
      this.canvas && this.canvas.requestRenderAll();
    }
  }
};

fabric.IText.prototype.onInput = function(e) {
  if(this.isRTL) {
    e && e.stopPropagation();
    if(!this.isEditing) {
      return;
    }

    let selectionStart = e.target.selectionStart - 1;
    let selectionEnd = e.target.selectionEnd - 1;
    let value = e.target.value.split('');
    let lineIndex = this.get2DCursorLocation().lineIndex;
    let charIndex = this.get2DCursorLocation().charIndex;
    let lineText = this._textLines[lineIndex];
    let char = value[selectionStart];

    e.target.selectionStart = selectionStart;
    e.target.selectionEnd = selectionEnd;

    if(e.inputType === 'insertLineBreak') {
      let lineIndex = this.get2DCursorLocation().lineIndex;
      let charIndex = this.get2DCursorLocation().charIndex;
      let textLines = this._textLines;
      let lineText = this._textLines[lineIndex];

      if(charIndex !== 0 && charIndex === lineText.length) {
        console.log('right');
        textLines.splice(lineIndex, 0, []);

        value = textLines.map(line => line.join('')).join('\n');
        e.target.value = value;
        e.target.selectionStart = selectionStart + 1;
        e.target.selectionEnd = selectionEnd + 1;

        const prevStyles = {};
        const newStyles = {};
        for(let i = lineIndex; i < Object.keys(this._textLines).length; i++) {
          if(this.styles[i]) {
            newStyles[i+1] = this.styles[i];
          }
        }
        for(let i = 0; i < lineIndex; i++) {
          prevStyles[i] = this.styles[i];
        }

        this.styles = {
          ...prevStyles,
          ...newStyles
        };
      } else if(charIndex === 0) {
        console.log('left');
        textLines.splice(lineIndex + 1, 0, []);

        value = textLines.map(line => line.join('')).join('\n');
        e.target.value = value;
        e.target.selectionStart = selectionStart + lineText.length + 1;
        e.target.selectionEnd = selectionEnd + lineText.length + 1;

        let pos = this.get2DCursorLocation(e.target.selectionStart);
        this.shiftLineStyles(pos.lineIndex - 1, 1);

        this.lb = 'left';
        this.lastLineStyle = Object.assign({}, this.styles[pos.lineIndex - 1] ? this.styles[pos.lineIndex - 1][0] : {});
      } else {
        console.log('center');
        this.insertNewStyleBlock('\n', e.target.selectionStart);
        e.target.selectionStart = e.target.selectionStart + 1;
      }

      this.updateFromTextArea();
      this.fire('changed');
      if(this.canvas) {
        this.canvas.fire('text:changed', { target: this });
        this.canvas.requestRenderAll();
      }

      return;
    }

    if(isNumber(value[selectionStart]) && isNumber(value[selectionStart + 1])) {
      let firstPartOfText = lineText.slice(0, charIndex);
      let secondPartOfText = lineText.slice(charIndex, lineText.length);
      let insertionIndex = secondPartOfText.join('').match(/[^0-9]/);
      insertionIndex = insertionIndex ? firstPartOfText.length + insertionIndex.index : lineText.length;

      for(var i = 0, textLines = this._textLines; i <= textLines.length; i++) {
        if(i < lineIndex) {
          insertionIndex += textLines[i].length + 1;
        }
      };

      value.splice(selectionStart, 1);
      value.splice(insertionIndex, 0, char);
      e.target.value = value.join('');
      e.target.selectionStart = selectionStart;
      e.target.selectionEnd = selectionEnd;

      this.insertNewStyleBlock(char, insertionIndex);
      let style = this._getStyleDeclaration(lineIndex, charIndex);
      style && this.setSelectionStyles(style, insertionIndex, insertionIndex + 1);

      this.updateFromTextArea();
      this.fire('changed');
      if(this.canvas) {
        this.canvas.fire('text:changed', { target: this });
        this.canvas.requestRenderAll();
      }
    } else if(e.data) {
      this.insertNewStyleBlock(e.data, e.target.selectionStart);

      let pos = this.get2DCursorLocation(e.target.selectionStart);
      if(this.lb === 'left-first-time') {
        delete this.styles[pos.lineIndex][1];//?? not a good solution
        this.lb = null;
      }

      if(this.selectionStart !== this.selectionEnd) {
        this.removeStyleFromTo(this.selectionStart, this.selectionEnd);
      }

      if(this.canvas) {
        this.canvas.fire('text:changed', { target: this });
        this.canvas.requestRenderAll();
      }
    }

    this.updateFromTextArea();
    this.fire('changed');
    if(this.canvas) {
      this.canvas.fire('text:changed', { target: this });
      this.canvas.requestRenderAll();
    }
  } else {
    var fromPaste = this.fromPaste;
    this.fromPaste = false;
    e && e.stopPropagation();
    if (!this.isEditing) {
      return;
    }
    // decisions about style changes.
    var nextText = this._splitTextIntoLines(this.hiddenTextarea.value).graphemeText,
        charCount = this._text.length,
        nextCharCount = nextText.length,
        removedText, insertedText,
        charDiff = nextCharCount - charCount;
    if (this.hiddenTextarea.value === '') {
      this.styles = { };
      this.updateFromTextArea();
      this.fire('changed');
      if (this.canvas) {
        this.canvas.fire('text:changed', { target: this });
        this.canvas.requestRenderAll();
      }
      return;
    }

    var textareaSelection = this.fromStringToGraphemeSelection(
      this.hiddenTextarea.selectionStart,
      this.hiddenTextarea.selectionEnd,
      this.hiddenTextarea.value
    );
    var backDelete = this.selectionStart > textareaSelection.selectionStart;

    if (this.selectionStart !== this.selectionEnd) {
      removedText = this._text.slice(this.selectionStart, this.selectionEnd);
      charDiff += this.selectionEnd - this.selectionStart;
    }
    else if (nextCharCount < charCount) {
      if (backDelete) {
        removedText = this._text.slice(this.selectionEnd + charDiff, this.selectionEnd);
      }
      else {
        removedText = this._text.slice(this.selectionStart, this.selectionStart - charDiff);
      }
    }
    insertedText = nextText.slice(textareaSelection.selectionEnd - charDiff, textareaSelection.selectionEnd);
    if (removedText && removedText.length) {
      if (this.selectionStart !== this.selectionEnd) {
        this.removeStyleFromTo(this.selectionStart, this.selectionEnd);
      }
      else if (backDelete) {
        // detect differencies between forwardDelete and backDelete
        this.removeStyleFromTo(this.selectionEnd - removedText.length, this.selectionEnd);
      }
      else {
        this.removeStyleFromTo(this.selectionEnd, this.selectionEnd + removedText.length);
      }
    }
    if (insertedText.length) {
      if (fromPaste && insertedText.join('') === fabric.copiedText) {
        this.insertNewStyleBlock(insertedText, this.selectionStart, fabric.copiedTextStyle);
      }
      else {
        this.insertNewStyleBlock(insertedText, this.selectionStart);
      }
    }
    this.updateFromTextArea();
    this.fire('changed');
    if (this.canvas) {
      this.canvas.fire('text:changed', { target: this });
      this.canvas.requestRenderAll();
    }
  }
};

fabric.IText.prototype._renderChars = function(method, ctx, line, left, top, lineIndex) {
  if(this.isRTL) {
    let lineHeight = this.getHeightOfLine(lineIndex);
    let charBox;
    let leftOffset = 0;

    top -= lineHeight * this._fontSizeFraction / this.lineHeight;

    ctx.save();
    for(let i = 0; i < line.length; i++) {
      charBox = this.__charBounds[lineIndex][i];
      leftOffset = left + charBox.width + charBox.left - charBox.kernedWidth;

      this._renderChar(method, ctx, lineIndex, i, line[i], leftOffset, top, lineHeight);
    }
    ctx.restore();
  } else {
    // set proper line offset
    var lineHeight = this.getHeightOfLine(lineIndex),
        isJustify = this.textAlign.indexOf('justify') !== -1,
        actualStyle,
        nextStyle,
        charsToRender = '',
        charBox,
        boxWidth = 0,
        timeToRender,
        shortCut = !isJustify && this.charSpacing === 0 && this.isEmptyStyles(lineIndex);

    ctx.save();
    top -= lineHeight * this._fontSizeFraction / this.lineHeight;
    if (shortCut) {
      // render all the line in one pass without checking
      this._renderChar(method, ctx, lineIndex, 0, this.textLines[lineIndex], left, top, lineHeight);
      ctx.restore();
      return;
    }
    for (var i = 0, len = line.length - 1; i <= len; i++) {
      timeToRender = i === len || this.charSpacing;
      charsToRender += line[i];
      charBox = this.__charBounds[lineIndex][i];
      if (boxWidth === 0) {
        left += charBox.kernedWidth - charBox.width;
        boxWidth += charBox.width;
      }
      else {
        boxWidth += charBox.kernedWidth;
      }
      if (isJustify && !timeToRender) {
        if (this._reSpaceAndTab.test(line[i])) {
          timeToRender = true;
        }
      }
      if (!timeToRender) {
        // if we have charSpacing, we render char by char
        actualStyle = actualStyle || this.getCompleteStyleDeclaration(lineIndex, i);
        nextStyle = this.getCompleteStyleDeclaration(lineIndex, i + 1);
        timeToRender = this._hasStyleChanged(actualStyle, nextStyle);
      }
      if (timeToRender) {
        this._renderChar(method, ctx, lineIndex, i, charsToRender, left, top, lineHeight);
        charsToRender = '';
        actualStyle = nextStyle;
        left += boxWidth;
        boxWidth = 0;
      }
    }
    ctx.restore();
  }
};

fabric.IText.prototype._renderChar = function(method, ctx, lineIndex, charIndex, _char, left, top) {
  if(this.isRTL) {
    var decl = this._getStyleDeclaration(lineIndex, charIndex),
        fullDecl = this.getCompleteStyleDeclaration(lineIndex, charIndex),
        shouldFill = method === 'fillText' && fullDecl.fill,
        shouldStroke = method === 'strokeText' && fullDecl.stroke && fullDecl.strokeWidth;

    if (!shouldStroke && !shouldFill) {
      return;
    }
    decl && ctx.save();

    this._applyCharStyles(method, ctx, lineIndex, charIndex - 1, fullDecl);

    if (decl && decl.textBackgroundColor) {
      this._removeShadow(ctx);
    }
    if (decl && decl.deltaY) {
      top += decl.deltaY;
    }

    shouldFill && ctx.fillText(_char, left, top);
    shouldStroke && ctx.strokeText(_char, left, top);
    decl && ctx.restore();
  } else {
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
  }
};

fabric.IText.prototype.insertCharStyleObject = function(lineIndex, charIndex, quantity, copiedStyle) {
  if(this.isRTL) {
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
  } else {
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
    var newStyle = currentLineStyles[charIndex ? charIndex - 1 : 1];
    while (newStyle && quantity--) {
      this.styles[lineIndex][charIndex + quantity] = fabric.util.object.clone(newStyle);
    }
  }
};

fabric.IText.prototype.renderCursor = function(boundaries, ctx) {
    if(this.isRTL) {
      var cursorLocation = this.get2DCursorLocation(),
          lineIndex = cursorLocation.lineIndex,
          charIndex = cursorLocation.charIndex > 0 ? cursorLocation.charIndex : 0,
          charHeight = this.getValueOfPropertyAt(lineIndex, charIndex, 'fontSize'),
          multiplier = this.scaleX * this.canvas.getZoom(),
          cursorWidth = this.cursorWidth / multiplier,
          topOffset = boundaries.topOffset,
          dy = this.getValueOfPropertyAt(lineIndex, charIndex, 'deltaY');

      topOffset += (1 - this._fontSizeFraction) * this.getHeightOfLine(lineIndex) / this.lineHeight
        - charHeight * (1 - this._fontSizeFraction);

      if (this.inCompositionMode) {
        this.renderSelection(boundaries, ctx);
      }

      ctx.fillStyle = this.getValueOfPropertyAt(lineIndex, charIndex, 'fill');
      ctx.globalAlpha = this.__isMousedown ? 1 : this._currentCursorOpacity;
      ctx.fillRect(
        boundaries.left + boundaries.leftOffset - cursorWidth / 2,
        topOffset + boundaries.top + dy,
        cursorWidth,
        charHeight);
    } else {
      var cursorLocation = this.get2DCursorLocation(),
          lineIndex = cursorLocation.lineIndex,
          charIndex = cursorLocation.charIndex > 0 ? cursorLocation.charIndex - 1 : 0,
          charHeight = this.getValueOfPropertyAt(lineIndex, charIndex, 'fontSize'),
          multiplier = this.scaleX * this.canvas.getZoom(),
          cursorWidth = this.cursorWidth / multiplier,
          topOffset = boundaries.topOffset,
          dy = this.getValueOfPropertyAt(lineIndex, charIndex, 'deltaY');

      topOffset += (1 - this._fontSizeFraction) * this.getHeightOfLine(lineIndex) / this.lineHeight
        - charHeight * (1 - this._fontSizeFraction);

      if (this.inCompositionMode) {
        this.renderSelection(boundaries, ctx);
      }

      ctx.fillStyle = this.getValueOfPropertyAt(lineIndex, charIndex, 'fill');
      ctx.globalAlpha = this.__isMousedown ? 1 : this._currentCursorOpacity;
      ctx.fillRect(
        boundaries.left + boundaries.leftOffset - cursorWidth / 2,
        topOffset + boundaries.top + dy,
        cursorWidth,
        charHeight);
    }
};

fabric.IText.prototype.selectWord = function(selectionStart) {
  if(this.isRTL) {
    selectionStart = selectionStart || this.selectionStart;
    var newSelectionStart = this.searchWordBoundary(selectionStart, -1), /* search backwards */
        newSelectionEnd = this.searchWordBoundary(selectionStart, 1); /* search forward */

    this.selectionStart = newSelectionStart;
    this.selectionEnd = newSelectionEnd;

    this.text[this.selectionStart] === '\n' && (this.selectionStart = this.selectionStart + 1);

    this._fireSelectionChanged();
    this._updateTextarea();
    this.renderCursorOrSelection();
  } else {
    selectionStart = selectionStart || this.selectionStart;
    var newSelectionStart = this.searchWordBoundary(selectionStart, -1), /* search backwards */
        newSelectionEnd = this.searchWordBoundary(selectionStart, 1); /* search forward */

    this.selectionStart = newSelectionStart;
    this.selectionEnd = newSelectionEnd;
    this._fireSelectionChanged();
    this._updateTextarea();
    this.renderCursorOrSelection();
  }
};

function isNumber(str) {
  str = parseInt(str);
  return (typeof str === 'number' && !isNaN(str));
};
