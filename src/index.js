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

  background.add(null, () => {
    main.drawInnerArea();
  });

  controll
    .upload()
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
