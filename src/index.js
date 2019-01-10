import main from './main';
import controll from './controll';
import background from './background';
import text from './text';

fabric.IText.prototype.isRTL = false;

// fabric.IText.prototype.fromGraphemeToStringSelection = function(start, end, _text) {
//   var smallerTextStart = _text.slice(0, start),
//       graphemeStart = smallerTextStart.join('').length;
//
//   if (start === end) {
//     return { selectionStart: _text.length - graphemeStart, selectionEnd: _text.length - graphemeStart };
//   }
//
//   var smallerTextEnd = _text.slice(start, end),
//       graphemeEnd = smallerTextEnd.join('').length;
//
//   return { selectionStart: graphemeStart, selectionEnd: graphemeStart + graphemeEnd };
// };

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

function updateToolbar(e) {
  const target = e.target;
  let start = target.selectionStart - 1;
  let end = target.selectionEnd - 1;
  const _text = target._text;
  const styles = target.getSelectionStyles(0, _text.length);

  let prev = _text[start - 1];
  prev = prev === '\n' ? '\\n' : prev;
  let current = _text[start];
  current = current === '\n' ? '\\n' : current;
  let next = _text[start + 1];
  next = next === '\n' ? '\\n' : next;

  if(current === '\\n' || prev === undefined || start !== end) {
    start = start + 1;
  }

  if(next === undefined) {
    start = start - 1;
  }

  if(next === '\\n' && start !== end) {
    start = start + 2;
  }

  text.updateToolbar(styles[start]);

  document.getElementById('font-template').removeAttribute('disabled');
};

function clearLeftAlignment() {
  main.canvas.remove(main.leftAlignment);
  main.leftAlignment = null;
};

function clearCenterAlignment() {
  main.canvas.remove(main.centerAlignment);
  main.centerAlignment = null;
};

function clearRightAlignment() {
  main.canvas.remove(main.rightAlignment);
  main.rightAlignment = null;
};

function clearHorizontalAlignment() {
  main.canvas.remove(main.horizontalAlignment);
  main.horizontalAlignment = null;
};

function clearHorizontalCenterAlignment() {
  main.canvas.remove(main.horizontalCenterAlignment);
  main.horizontalCenterAlignment = null;
};

function clearVerticalCenterAlignment() {
  main.canvas.remove(main.verticalCenterAlignment);
  main.verticalCenterAlignment = null;
};

function clearAllAlignment() {
  clearLeftAlignment();
  clearCenterAlignment();
  clearRightAlignment();
  clearHorizontalAlignment();
  clearHorizontalCenterAlignment();
  clearVerticalCenterAlignment();
};

function drawLeftAlignment(target) {
  let { left, __lineWidths, width } = target;
  let textWidth = Math.max.apply(null, __lineWidths);
  let offsetLeft = left + textWidth;

  main.canvas.remove(main.leftAlignment);
  main.leftAlignment = new fabric.Line([offsetLeft, 0, offsetLeft, main.canvas.height], {
    left: target.alignment.left,
    top: 0,
    stroke: '#000',
    selectable: false
  });

  main.canvas.add(main.leftAlignment);
  main.canvas.renderAll();
};

function drawCenterAlignment(target, leftPos) {
  let { left, __lineWidths, width } = target;
  let textWidth = Math.max.apply(null, __lineWidths);
  let offsetLeft = left + textWidth;

  main.canvas.remove(main.centerAlignment);
  main.centerAlignment = new fabric.Line([leftPos, 0, leftPos, main.canvas.height], {
    left: leftPos,
    top: 0,
    stroke: '#000',
    selectable: false
  });

  main.canvas.add(main.centerAlignment);
  main.canvas.renderAll();
};

function drawRightAlignment(target) {
  let { left, __lineWidths, width } = target;
  let textWidth = Math.max.apply(null, __lineWidths);
  let offsetLeft = left + textWidth;

  main.canvas.remove(main.rightAlignment);
  main.rightAlignment = new fabric.Line([offsetLeft, 0, offsetLeft, main.canvas.height], {
    left: target.alignment.right,
    top: 0,
    stroke: '#000',
    selectable: false
  });

  main.canvas.add(main.rightAlignment);
  main.canvas.renderAll();
};

function drawHorizontalAlignment(height) {
  main.canvas.remove(main.horizontalAlignment);
  main.horizontalAlignment = new fabric.Line([0, 0, main.canvas.width, 0], {
    left: 0,
    top: height,
    stroke: '#000',
    selectable: false
  });

  main.canvas.add(main.horizontalAlignment);
  main.canvas.renderAll();
};

function drawHorizontalCenterAlignment() {
  main.canvas.remove(main.horizontalCenterAlignment);
  main.horizontalCenterAlignment = new fabric.Line([0, main.canvas.height / 2, main.canvas.width, main.canvas.height / 2], {
    left: 0,
    top: main.canvas.height / 2,
    stroke: '#000',
    selectable: false
  });

  main.canvas.add(main.horizontalCenterAlignment);
  main.canvas.renderAll();
};

function drawVerticalCenterAlignment() {
  main.canvas.remove(main.verticalCenterAlignment);
  main.verticalCenterAlignment = new fabric.Line([main.canvas.width / 2, 0, main.canvas.width / 2, main.canvas.height], {
    left: main.canvas.width / 2,
    top: 0,
    stroke: '#000',
    selectable: false
  });

  main.canvas.add(main.verticalCenterAlignment);
  main.canvas.renderAll();
};

main.init(() => {
    let fonts = document.getElementById('fonts').value;
    const customFonts = fonts.split(',');

    let customizations = document.getElementById('customizations').value;
    const customTemplates = [];
    customizations = customizations.split(',');
    for(let i in customizations) {
      let item = customizations[i].split('\':\'');
      let text = item[0].slice(2, item[0].length);
      let value = item[1].slice(0, item[1].length - 2);
      customTemplates.push({ text, value });
    }

    let size = document.getElementById('sizes').value;
    size = size.slice(1, size.length - 1).split(',');
    const customSize = { width: size[0], height: size[1] };

    const customConfig = document.getElementById('config').value;

    return {
      fonts: customFonts,
      templates: customTemplates,
      size: customSize,
      config: customConfig
    };
  }, canvas => {
    window.onkeydown = e => {
      if(main.canvas.getActiveObject() && main.canvas.getActiveObject().type === 'textbox') {
        switch(e.keyCode) {
          case 37:
            main.canvas.getActiveObject().left = main.canvas.getActiveObject().left - 1;
            text.closeToolbar();
            break;
          case 39:
            main.canvas.getActiveObject().left = main.canvas.getActiveObject().left + 1;
            text.closeToolbar();
            break;
          case 38:
            main.canvas.getActiveObject().top = main.canvas.getActiveObject().top - 1;
            text.closeToolbar();
            break;
          case 40:
            main.canvas.getActiveObject().top = main.canvas.getActiveObject().top + 1;
            text.closeToolbar();
            break;
          default:
          break;
        }

        main.canvas.renderAll();
      }
    };

    canvas.on('text:changed', e => {
      const target = e.target;
      const start = target.selectionStart - 1;
      const text = target._text;
      const styles = target.getSelectionStyles(0, text.length);

      let prev = text[start - 1];
      prev = prev === '\n' ? '\\n' : prev;
      let current = text[start];
      current = current === '\n' ? '\\n' : current;
      let next = text[start + 1];
      next = next === '\n' ? '\\n' : next;

      if(prev === '\\n' && current === '\\n' && (next === '\\n' || next === undefined)) {
        console.log('just new line');
        target.setSelectionStyles(styles[start - 2], start - 1, start + 1);
        main.canvas.renderAll();
      }

      if((prev === '\\n' || prev === undefined) && current === '\\n' && next !== '\\n' && next !== undefined) {
        console.log('left side');
        target.setSelectionStyles(styles[start + 1], start, start + 1);
        main.canvas.renderAll();
      }

      if(prev !== '\\n' && current === '\\n' && (next === '\\n' || next === undefined)) {
        console.log('right side');
        target.setSelectionStyles(styles[start - 1], start + 1, start + 2);
        main.canvas.renderAll();
      }

      if(current !== '\\n' && Object.keys(target.followingStyles).length !== 0) {
        target.setSelectionStyles(target.followingStyles, start, start + 1);
        target.followingStyles = {};
        main.canvas.renderAll();
      }

      updateToolbar(e);
    });

    canvas.on('text:selection:changed', e => {
      e.target.followingStyles = { ...e.target.getSelectionStyles()[0] };
      updateToolbar(e);
    });

    canvas.on('text:editing:entered', e => {
      controll.cancelRemove();
    });

    canvas.on('text:editing:exited', e => {
      controll.remove();
    });

    canvas.on('object:selected', e => {
      if(e.target.get('type') === 'textbox') {
        text.openToolbar(e.target);
      }
    });

    canvas.on('selection:updated', e => {
      text.resetToolbar();
    });

    canvas.on('mouse:up', e => {
      if(e.target !== null && canvas.getActiveObject() && canvas.getActiveObject().get('type') === 'image') {
        main.saveConfig({
          background: {
            scale: {
              x: e.target.scaleX,
              y: e.target.scaleY
            },
            position: {
              left: e.target.aCoords.tl.x,
              top: e.target.aCoords.tl.y
            }
          }
        });
      }

      if(e.target !== null && canvas.getActiveObject() &&  canvas.getActiveObject().get('type') === 'textbox') {
        text.openToolbar(e.target);
        clearAllAlignment();
      } else {
        text.closeToolbar();
      }
    });

    canvas.on('object:modified', e => {
      let texts = canvas.getObjects();

      texts = texts.filter(item => item.get('type') === 'textbox');

      main.saveConfig({ texts });

      e.target.lastWidth = e.target.width;
    });

    canvas.on('object:scaling', e => {
      if(e.target !== null && canvas.getActiveObject() && canvas.getActiveObject().get('type') === 'image') {
        let threshold = 7;
        let w = e.target.getScaledWidth();
        let h = e.target.getScaledHeight();
        let snap = {
           top: 0,
           left: 0,
           bottom: main.canvas.height,
           right: main.canvas.width
        };
        let dist = {
          top: Math.abs(snap.top - e.target.top),
          left: Math.abs(snap.left - e.target.left),
          bottom: Math.abs(snap.bottom - e.target.top - h),
          right: Math.abs(snap.right - e.target.left - w)
        };
        let attrs = {
          scaleX: e.target.scaleX,
          scaleY: e.target.scaleY,
          top: e.target.top,
          left: e.target.left
        };

        switch(e.target.__corner) {
          case 'tl':
            if(dist.left < dist.top && dist.left < threshold) {
              attrs.scaleX = (w - (snap.left - e.target.left)) / e.target.width;
              attrs.scaleY = (attrs.scaleX / e.target.scaleX) * e.target.scaleY;
              attrs.top = e.target.top + (h - e.target.height * attrs.scaleY);
              attrs.left = snap.left;
            } else if (dist.top < threshold) {
              attrs.scaleY = (h - (snap.top - e.target.top)) / e.target.height;
              attrs.scaleX = (attrs.scaleY / e.target.scaleY) * e.target.scaleX;
              attrs.left = attrs.left + (w - e.target.width * attrs.scaleX);
              attrs.top = snap.top;
            }

            break;
          case 'tr':
             if(dist.right < dist.top && dist.right < threshold) {
              attrs.scaleX = (snap.right - e.target.left) / e.target.width;
              attrs.scaleY = (attrs.scaleX / e.target.scaleX) * e.target.scaleY;
              attrs.top = e.target.top + (h - e.target.height * attrs.scaleY);
             } else if (dist.top < threshold) {
              attrs.scaleY = (h - (snap.top - e.target.top)) / e.target.height;
              attrs.scaleX = (attrs.scaleY / e.target.scaleY) * e.target.scaleX;
              attrs.top = snap.top;
             }

             break;
           case 'bl':
            if(dist.left < dist.bottom && dist.left < threshold) {
             attrs.scaleX = (w - (snap.left - e.target.left)) / e.target.width;
             attrs.scaleY = (attrs.scaleX / e.target.scaleX) * e.target.scaleY;
             attrs.left = snap.left;
            } else if (dist.bottom < threshold) {
             attrs.scaleY = (snap.bottom - e.target.top) / e.target.height;
             attrs.scaleX = (attrs.scaleY / e.target.scaleY) * e.target.scaleX;
             attrs.left = attrs.left + (w - e.target.width * attrs.scaleX);
            }

            break;
          case 'br':
           if(dist.right < dist.bottom && dist.right < threshold) {
            attrs.scaleX = (snap.right - e.target.left) / e.target.width;
            attrs.scaleY = (attrs.scaleX / e.target.scaleX) * e.target.scaleY;
           } else if (dist.bottom < threshold) {
            attrs.scaleY = (snap.bottom - e.target.top) / e.target.height;
            attrs.scaleX = (attrs.scaleY / e.target.scaleY) * e.target.scaleX;
           }

           break;
          default:
            break;
        }

        e.target.set(attrs);
      }

      if(e.target !== null && canvas.getActiveObject() && canvas.getActiveObject().get('type') === 'textbox') {
        if(e.target.left < 0) {
          e.target.width = main.canvas.getActiveObject().left + main.canvas.getActiveObject().width;
          e.target.left = 0;
        }

        if(e.target.left + e.target.width > main.canvas.width) {
          e.target.width = main.canvas.width - main.canvas.getActiveObject().left;
        }

        if(e.target.top + e.target.height > main.canvas.height) {
          e.target.top = main.canvas.height - e.target.height;
        }
      }

      text.closeToolbar();
    });

    canvas.on('object:moving', e => {
      if(e.target !== null && canvas.getActiveObject() && canvas.getActiveObject().get('type') === 'image') {
        const activeObject = main.canvas.getActiveObject();

        if(activeObject.left < 7 && activeObject.left > 0) {
          activeObject.left = 0;
        }
        if(activeObject.top < 7 && activeObject.top > 0) {
          activeObject.top = 0;
        }
        if(main.canvas.width - activeObject.width * activeObject.scaleX - activeObject.left < 7 && activeObject.left < main.canvas.width - activeObject.width * activeObject.scaleX) {
          activeObject.left = main.canvas.width - activeObject.width * activeObject.scaleX;
        }
        if(main.canvas.height - activeObject.height * activeObject.scaleY - activeObject.top < 7 && activeObject.top < main.canvas.height - activeObject.height * activeObject.scaleY) {
          activeObject.top = main.canvas.height - activeObject.height * activeObject.scaleY;
        }
      }

      if(e.target !== null && canvas.getActiveObject() && canvas.getActiveObject().get('type') === 'textbox') {
        const activeObject = main.canvas.getActiveObject();

        if(activeObject.left < 7) {
          activeObject.left = 0;
        }
        if(activeObject.top < 7) {
          activeObject.top = 0;
        }
        if(main.canvas.width - activeObject.width * activeObject.scaleX - activeObject.left < 7) {
          activeObject.left =  main.canvas.width - activeObject.width * activeObject.scaleX;
        }
        if(main.canvas.height - activeObject.height * activeObject.scaleY - activeObject.top < 7) {
          activeObject.top = main.canvas.height - activeObject.height * activeObject.scaleY;
        }

        text.closeToolbar();

        text.updateLeftAligment(e.target);
        text.updateCenterAligment(e.target);
        text.updateRightAligment(e.target);
        text.updateHorizontalAligment(e.target);

        const texts = main.canvas.getObjects().filter(object => object.type === 'textbox');
        let snaped = null;
        let target = e.target.alignment;
        const center = {
          left: main.canvas.width / 2,
          top: main.canvas.height / 2
        };

        let offset = 0;
        switch(e.target.textAlign) {
          case 'left':
            offset = Math.max.apply(null, e.target.__lineWidths) / 2;
            break;
          case 'center':
            offset = e.target.width / 2;
            break;
          case 'right':
            offset = (e.target.left + e.target.width) - (e.target.left + Math.max.apply(null, e.target.__lineWidths)) + Math.max.apply(null, e.target.__lineWidths) / 2;
            break;
          default:
            break;
        }
        if(Math.abs(e.target.left + offset - center.left) > 0 && Math.abs(e.target.left + offset - center.left) < 5) {
          e.target.left = center.left - offset;
          drawVerticalCenterAlignment();
          return;
        } else {
          clearAllAlignment();
        }

        if(Math.abs((e.target.top + e.target.height / 2) - center.top) > 0 && Math.abs((e.target.top + e.target.height / 2) - center.top) < 5) {
          e.target.top = (center.top - e.target.height / 2) - 1;
          drawHorizontalCenterAlignment();
          return;
        } else {
          clearAllAlignment();
        }

        for(let i in texts) {
          snaped = texts[i];
          if(Math.abs(target.left - snaped.alignment.left) > 0 && Math.abs(target.left - snaped.alignment.left) < 5) {
            e.target.left = snaped.alignment.left - target.offsetLeft - 1;

            text.updateLeftAligment(snaped);
            drawLeftAlignment(snaped);
            return;
          } else {
            clearAllAlignment();
            continue;
          }
        }

        for(let i in texts) {
          snaped = texts[i];

          let snapedCenter = snaped.alignment.left + (snaped.alignment.right - snaped.alignment.left) / 2;
          let targetCenter = target.left + (target.right - target.left) / 2;

          let offset = 0;
          switch(e.target.textAlign) {
            case 'left':
              offset = Math.max.apply(null, e.target.__lineWidths) / 2;
              break;
            case 'center':
              offset = e.target.width / 2;
              break;
            case 'right':
              offset = (e.target.left + e.target.width) - (e.target.left + Math.max.apply(null, e.target.__lineWidths)) + Math.max.apply(null, e.target.__lineWidths) / 2;
              break;
            default:
              break;
          }
          if(Math.abs(snapedCenter - targetCenter) > 0 && Math.abs(snapedCenter - targetCenter) < 5) {
            e.target.left = snapedCenter - offset

            text.updateCenterAligment(snaped);
            drawCenterAlignment(e.target, snapedCenter);
            return;
          } else {
            clearAllAlignment();
            continue;
          }
        }

        for(let i in texts) {
          snaped = texts[i];

          if(Math.abs(target.right - snaped.alignment.right) > 0 && Math.abs(target.right - snaped.alignment.right) < 5) {
            e.target.left = snaped.alignment.right - target.offsetRight - 1;

            text.updateRightAligment(snaped);
            drawRightAlignment(snaped);
            return;
          } else {
            clearAllAlignment();
            continue;
          }
        }

        for(let i in text.objectTops) {
          if(Math.abs(e.target.top + e.target.__lineHeights[0] - text.objectTops[i]) > 0 && Math.abs(e.target.top + e.target.__lineHeights[0] - text.objectTops[i]) < 5) {
            e.target.top = text.objectTops[i] - e.target.__lineHeights[0];

            text.updateHorizontalAligment(e.target);
            drawHorizontalAlignment(text.objectTops[i]);
            return;
          } else {
            clearAllAlignment();
            continue;
          }
        }
      }
    });

    background.add(null);

    text.addAll();

    controll
      .blurAll()
      .upload()
      .remove()
      .save()
      .reset()
      .preview()
      .download()
      .preview()
      .addText()
      .setFontFamily()
      .setFontSize()
      .setFontHeight()
      .setFontWeight()
      .setFontAlign()
      .setFontColor()
      .setFontUnderline()
      .setFontUppercase()
      .setFontCamelCase()
      .addFontTemplate();
});
