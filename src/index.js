import main from './main';
import controll from './controll';
import background from './background';
import text from './text';

main.init(canvas => {
  canvas.on('text:changed', e => {
    const innerCanvas = {
      width: main.canvas.width * 0.8,
      height: main.canvas.height * 0.8
    };

    const outerCanvas = {
      width: main.canvas.width,
      height: main.canvas.height
    };

    const offset = {
      left: (outerCanvas.width - innerCanvas.width) / 2,
      top: (outerCanvas.height - innerCanvas.height) / 2
    };

    console.log(offset.left + e.target.width, offset.left + innerCanvas.width);
  });

  canvas.on('text:selection:changed', e => {
    document.getElementById('font-template').removeAttribute('disabled');
    text.updateToolbar(e.target.getSelectionStyles()[0] || e.target.getSelectionStyles(e.target.selectionStart - 1)[0] || {});
  });

  canvas.on('object:selected', e => {
    text.openToolbar(e.target);
  });

  canvas.on('selection:updated', e => {
    text.resetToolbar();
    text.openToolbar(e.target);
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

    if(e.target === null) {
      text.closeToolbar();
    } else if(e.target !== null && canvas.getActiveObject() &&  canvas.getActiveObject().get('type') === 'textbox') {
      text.openToolbar(e.target);
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
      const innerCanvas = {
        width: main.canvas.width * 0.8,
        height: main.canvas.height * 0.8
      };

      const outerCanvas = {
        width: main.canvas.width,
        height: main.canvas.height
      };

      const offset = {
        left: (outerCanvas.width - innerCanvas.width) / 2,
        top: (outerCanvas.height - innerCanvas.height) / 2
      };

      let threshold = 14;
      let w = e.target.getScaledWidth();
      let h = e.target.getScaledHeight();
      let snap = {
         top: offset.top,
         left: offset.left,
         bottom: offset.top + innerCanvas.height,
         right: offset.left + innerCanvas.width
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
      const innerCanvas = {
        width: main.canvas.width * 0.8,
        height: main.canvas.height * 0.8
      };

      const outerCanvas = {
        width: main.canvas.width,
        height: main.canvas.height
      };

      const offset = {
        left: (outerCanvas.width - innerCanvas.width) / 2,
        top: (outerCanvas.height - innerCanvas.height) / 2
      };

      if(e.target.left < offset.left) {
        e.target.width = main.canvas.getActiveObject().left + main.canvas.getActiveObject().width - offset.left;
        e.target.left = offset.left;
      }

      if(e.target.left + e.target.width > offset.left + innerCanvas.width) {
        e.target.width = innerCanvas.width - main.canvas.getActiveObject().left + offset.left;
      }

      if(e.target.top + e.target.height > innerCanvas.height + offset.top) {
        e.target.top = innerCanvas.height + offset.top - e.target.height;
      }
    }

    text.closeToolbar();
  });

  canvas.on('object:moving', e => {
    if(e.target !== null && canvas.getActiveObject() && canvas.getActiveObject().get('type') === 'image') {
      const innerCanvas = {
        width: main.canvas.width * 0.8,
        height: main.canvas.height * 0.8
      };

      const outerCanvas = {
        width: main.canvas.width,
        height: main.canvas.height
      };

      const offset = {
        left: (outerCanvas.width - innerCanvas.width) / 2,
        top: (outerCanvas.height - innerCanvas.height) / 2
      };

      const activeObject = main.canvas.getActiveObject();

      if(activeObject.left - offset.left < 14 && activeObject.left > offset.left) {
        activeObject.left = offset.left;
      }
      if(activeObject.top - offset.top < 14 && activeObject.top > offset.top) {
        activeObject.top = offset.top;
      }
      if(offset.left + innerCanvas.width - activeObject.width * activeObject.scaleX - activeObject.left < 14 && activeObject.left < offset.left + innerCanvas.width - activeObject.width * activeObject.scaleX) {
        activeObject.left = offset.left + innerCanvas.width - activeObject.width * activeObject.scaleX;
      }
      if(offset.top + innerCanvas.height - activeObject.height * activeObject.scaleY - activeObject.top < 14 && activeObject.top < offset.top + innerCanvas.height - activeObject.height * activeObject.scaleY) {
        activeObject.top = offset.top + innerCanvas.height - activeObject.height * activeObject.scaleY;
      }
    }

    if(e.target !== null && canvas.getActiveObject() && canvas.getActiveObject().get('type') === 'textbox') {
      const innerCanvas = {
        width: main.canvas.width * 0.8,
        height: main.canvas.height * 0.8
      };

      const outerCanvas = {
        width: main.canvas.width,
        height: main.canvas.height
      };

      const offset = {
        left: (outerCanvas.width - innerCanvas.width) / 2,
        top: (outerCanvas.height - innerCanvas.height) / 2
      };

      const activeObject = main.canvas.getActiveObject();

      if(activeObject.left - offset.left < 14) {
        activeObject.left = offset.left;
      }
      if(activeObject.top - offset.top < 14) {
        activeObject.top = offset.top;
      }
      if(offset.left + innerCanvas.width - activeObject.width * activeObject.scaleX - activeObject.left < 14) {
        activeObject.left = offset.left + innerCanvas.width - activeObject.width * activeObject.scaleX;
      }
      if(offset.top + innerCanvas.height - activeObject.height * activeObject.scaleY - activeObject.top < 14) {
        activeObject.top = offset.top + innerCanvas.height - activeObject.height * activeObject.scaleY;
      }
    }

    text.closeToolbar();
  });

  background.add(null, () => {
    main.drawInnerArea();
  });

  text.addAll();

  controll
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
    .setFontWeight()
    .setFontAlign()
    .setFontColor()
    .setFontUnderline()
    .addFontTemplate();
});
