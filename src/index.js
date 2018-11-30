import main from './main';
import controll from './controll';
import background from './background';
import text from './text';

main.init(canvas => {
  canvas.on('text:changed', e => {
    // this part should be remembered, solution
    // const info = {
    //   unwrappedTextLines: target._unwrappedTextLines,
    //   lineWidths: target.__lineWidths,
    //   lineHeights: target.__lineHeights,
    //   textAlign: target.textAlign,
    //   styleMap: target._styleMap,
    //   textLines: target._textLines
    // };
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
  });

  canvas.on('text:selection:changed', e => {
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

    if(current === '\\n' || prev === undefined) {
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
         top: main.offset.top,
         left: main.offset.left,
         bottom: main.offset.top + main.innerCanvas.height,
         right: main.offset.left + main.innerCanvas.width
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
      if(e.target.left < main.offset.left) {
        e.target.width = main.canvas.getActiveObject().left + main.canvas.getActiveObject().width - main.offset.left;
        e.target.left = main.offset.left;
      }

      if(e.target.left + e.target.width > main.offset.left + main.innerCanvas.width) {
        e.target.width = main.innerCanvas.width - main.canvas.getActiveObject().left + main.offset.left;
      }

      if(e.target.top + e.target.height > main.innerCanvas.height + main.offset.top) {
        e.target.top = main.innerCanvas.height + main.offset.top - e.target.height;
      }
    }

    text.closeToolbar();
  });

  canvas.on('object:moving', e => {
    if(e.target !== null && canvas.getActiveObject() && canvas.getActiveObject().get('type') === 'image') {
      const activeObject = main.canvas.getActiveObject();

      if(activeObject.left - main.offset.left < 7 && activeObject.left > main.offset.left) {
        activeObject.left = main.offset.left;
      }
      if(activeObject.top - main.offset.top < 7 && activeObject.top > main.offset.top) {
        activeObject.top = main.offset.top;
      }
      if(main.offset.left + main.innerCanvas.width - activeObject.width * activeObject.scaleX - activeObject.left < 7 && activeObject.left < main.offset.left + main.innerCanvas.width - activeObject.width * activeObject.scaleX) {
        activeObject.left = main.offset.left + main.innerCanvas.width - activeObject.width * activeObject.scaleX;
      }
      if(main.offset.top + main.innerCanvas.height - activeObject.height * activeObject.scaleY - activeObject.top < 7 && activeObject.top < main.offset.top + main.innerCanvas.height - activeObject.height * activeObject.scaleY) {
        activeObject.top = main.offset.top + main.innerCanvas.height - activeObject.height * activeObject.scaleY;
      }
    }

    if(e.target !== null && canvas.getActiveObject() && canvas.getActiveObject().get('type') === 'textbox') {
      const activeObject = main.canvas.getActiveObject();

      if(activeObject.left - main.offset.left < 7) {
        activeObject.left = main.offset.left;
      }
      if(activeObject.top - main.offset.top < 7) {
        activeObject.top = main.offset.top;
      }
      if(main.offset.left + main.innerCanvas.width - activeObject.width * activeObject.scaleX - activeObject.left < 7) {
        activeObject.left = main.offset.left + main.innerCanvas.width - activeObject.width * activeObject.scaleX;
      }
      if(main.offset.top + main.innerCanvas.height - activeObject.height * activeObject.scaleY - activeObject.top < 7) {
        activeObject.top = main.offset.top + main.innerCanvas.height - activeObject.height * activeObject.scaleY;
      }
    }

    text.closeToolbar();
  });

  background.add(null, () => {
    main.drawInnerArea();
  });

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
    .size()
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
