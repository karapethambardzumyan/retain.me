import main from './main';

class Background {
  constructor() {

  };

  add(base64, cb) {
    const objects = main.canvas.getObjects();

    for(let i in objects) {
      if(objects[i].get('type') === 'image') {
        main.canvas.remove(objects[i]);
      }
    }

    if(base64) {
      fabric.Image.fromURL(base64, img => {
        const canvasRatio = main.canvas.width / main.canvas.height;
        const imgRatio = img.width / img.height;

        img.setControlsVisibility({
          ml: false,
          mt: false,
          mr: false,
          mb: false,
          mtr: false
        });

        if(canvasRatio > imgRatio) {
          img.scaleToHeight(main.canvas.height * 0.8);
        } else {
          img.scaleToWidth(main.canvas.width * 0.8);
        }

        main.canvas.add(img);
        main.canvas.setActiveObject(img);
        img.center();

        main.saveConfig({
          background: {
            base64,
            scale: {
              x: img.scaleX,
              y: img.scaleY
            },
            position: {
              left: img.aCoords.tl.x,
              top: img.aCoords.tl.y
            }
          }
        });

        return cb();
      });
    }

    if(!base64 && main.config.background.base64) {
      fabric.Image.fromURL(main.config.background.base64, img => {
        const canvasRatio = main.canvas.width / main.canvas.height;
        const imgRatio = img.width / img.height;

        // img.setControlsVisibility({
        //   ml: false,
        //   mt: false,
        //   mr: false,
        //   mb: false,
        //   mtr: false
        // });

        if(canvasRatio > imgRatio) {
          img.scaleToHeight(main.canvas.height * 0.8);
        } else {
          img.scaleToWidth(main.canvas.width * 0.8);
        }

        img.set({
          hasRotatingPoint: false,
          left: main.config.background.position.left,
          top: main.config.background.position.top,
          scaleX: main.config.background.scale.x,
          scaleY: main.config.background.scale.y
        });
        main.canvas.add(img);
        main.canvas.setActiveObject(img);

        return cb();
      });
    }
  };
};

const background = new Background();

export default background;
