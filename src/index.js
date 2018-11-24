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
