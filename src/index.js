import main from './main';
import controll from './controll';
import background from './background';

main.init(canvas => {
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
  });

  canvas.on('object:scaling', e => {
    let threshold = 50;
    let w = e.target.getScaledWidth();
    let h = e.target.getScaledHeight();
    let snap = {
       top: Math.round(e.target.top / threshold) * threshold,
       left: Math.round(e.target.left / threshold) * threshold,
       bottom: Math.round((e.target.top + h) / threshold) * threshold,
       right: Math.round((e.target.left + w) / threshold) * threshold
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
      case 'ml':
        if(dist.left < threshold) {
          attrs.scaleX = (w - (snap.left - e.target.left)) / e.target.width;
          attrs.left = snap.left;
        }
        break;
      default:
        break;
    }

    e.target.set(attrs);
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
  });

  background.add(null, () => {
    main.drawInnerArea();
  });

  controll
    .upload()
    .remove()
    .save()
    .reset()
    .preview()
    .download()
    .preview()
    .size()
    .textAlign()
    .textColor()
    .textSize()
    .textFont();
});
