import main from './main';

class Background {
  constructor() {

  };

  add(base64, cb) {
    if(base64 && !main.config.background.base64) {
      fabric.Image.fromURL(base64, img => {
        img.setControlsVisibility({
          ml: false,
          mt: false,
          mr: false,
          mb: false,
          mtr: false
        });
        img.scaleToWidth(main.canvas.width);
        main.canvas.add(img);
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

        document.getElementById('upload-wrapper').classList.add('hidden');

        return cb();
      });
    }

    if(!base64 && main.config.background.base64) {
      fabric.Image.fromURL(main.config.background.base64, img => {
        img.setControlsVisibility({
          ml: false,
          mt: false,
          mr: false,
          mb: false,
          mtr: false
        });
        img.scaleToWidth(main.canvas.width);
        img.set({
          hasRotatingPoint: false,
          left: main.config.background.position.left,
          top: main.config.background.position.top,
          scaleX: main.config.background.scale.x,
          scaleY: main.config.background.scale.y
        });
        main.canvas.add(img);

        document.getElementById('upload-wrapper').classList.add('hidden');

        return cb();
      });
    }
  };
};

const background = new Background();

export default background;
