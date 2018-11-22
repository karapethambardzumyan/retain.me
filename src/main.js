import { fabric } from 'fabric';

const MM_TO_PX = 3.7795275591;

const config = {
  background: null,
  size: 0,
  text: []
};

// sizes in mm
const sizes = [
  { width: 136, height: 150 },
  { width: 140, height: 81 },
  { width: 200, height: 139 },
  { width: 100, height: 150 }
];

class Main {
  constructor() {
    this.config = this.initialConfig();
    this.canvas = null;
  };

  init() {
    this.canvas = new fabric.Canvas('canvas');

    this.canvas.setWidth(sizes[this.config.size].width * MM_TO_PX);
    this.canvas.setHeight(sizes[this.config.size].height * MM_TO_PX);

    this.canvas.on('mouse:up', e => {
      if(this.canvas.getActiveObject()) {
        this.config = {
          ...this.config,
          background: {
            ...this.config.background,
            scale: {
              x: e.target.scaleX,
              y: e.target.scaleY
            },
            coords: {
              top: e.target.aCoords.tl.y,
              left: e.target.aCoords.tl.x
            }
          }
        };
      }
    });

    if(this.config.background !== null) {
      fabric.Image.fromURL(this.config.background.base64, img => {
        img.scaleToWidth(this.canvas.width);
        img.set({
          left: this.config.background.coords.left,
          top: this.config.background.coords.top,
          scaleX: this.config.background.scale.x,
          scaleY: this.config.background.scale.y
        });
        this.canvas.add(img);
      });
    }

    return this;
  };

  upload() {
    document.getElementById('upload-background').onchange = e => {
      let file = e.target.files[0];
      let reader = new FileReader();

      if(this.canvas.getObjects().length === 0) {
        reader.onload = f => {
          let data = f.target.result;

          fabric.Image.fromURL(data, img => {
            img.scaleToWidth(this.canvas.width * 0.9);
            this.canvas.add(img);
            img.center();
            img.set({
              hasRotatingPoint: false
            });
            img.setControlsVisibility({
              ml: false,
              mt: false,
              mr: false,
              mb: false,
              mtr: false
            });

            this.config = {
              ...this.config,
              background: {
                scale: {
                  x: img.scaleX,
                  y: img.scaleY
                },
                coords: {
                  top: img.aCoords.tl.y,
                  left: img.aCoords.tl.x
                },
                base64: data
              }
            };
          });
        };

        reader.readAsDataURL(file);
      }
    };

    return this;
  };

  reset() {
    document.getElementById('reset').onclick = e => {
      this.config = config;
      this.canvas.clear();

      localStorage.setItem('config', JSON.stringify(config));

      alert('Reseted!');
    };

    return this;
  };

  save() {
    document.getElementById('save').onclick = e => {
      localStorage.setItem('config', JSON.stringify(this.config));

      alert('Saved!');
    };

    return this;
  };

  download() {
    document.getElementById('download').onclick = e => {
      const image = this.canvas.toDataURL();
      e.target.href = image;
    };
  };

  initialConfig() {
    if(localStorage.getItem('config') === null) {
      localStorage.setItem('config', JSON.stringify(config));
    }

    return JSON.parse(localStorage.getItem('config'));
  };
};

const main = new Main();

export default main;
