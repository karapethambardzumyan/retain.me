import main from './main';
import controll from './controll';
import background from './background';
import text from './text';

main.init(canvas => {
  canvas.on('selection:created', e => {
    text.openToolbar(e.target);
  });

  canvas.on('selection:cleared', e => {
    text.closeToolbar();
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
    } else if(e.target !== null && canvas.getActiveObject() && canvas.getActiveObject().get('type') === 'text') {
      text.openToolbar(e.target);
    }
  });

  canvas.on('object:modified', e => {
    let texts = canvas.getObjects();

    texts = texts.filter(item => item.get('type') === 'text');

    main.saveConfig({ texts });
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
    .addText();
});
