import { fabric } from 'fabric';

const MM_TO_PX = 3.7795275591;

const config = {
  background: null,
  size: 0
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

  initialConfig() {
    if(localStorage.getItem('config') === null) {
      localStorage.setItem('config', JSON.stringify(config));
    }

    return JSON.parse(localStorage.getItem('config'));
  };

  saveConfig(config) {
    this.config = {
      ...this.config,
      background: {
        ...this.config.background,
        ...config.background
      }
    };
  };

  resetConfig() {
    this.config = config;
  };

  disableImageControlls(img) {
    img.set({ hasRotatingPoint: false });
    img.setControlsVisibility({
      ml: false,
      mt: false,
      mr: false,
      mb: false,
      mtr: false
    });
  };

  init() {
    this.canvas = new fabric.Canvas('canvas');

    this.canvas.setWidth(sizes[this.config.size].width * MM_TO_PX);
    this.canvas.setHeight(sizes[this.config.size].height * MM_TO_PX);

    this.canvas.on('mouse:up', e => {
      if(e.target !== null && this.canvas.getActiveObject() && this.canvas.getActiveObject().get('type') === 'image') {
        this.saveConfig({
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

    if(this.config.background !== null) {
      fabric.Image.fromURL(this.config.background.base64, img => {
        this.canvas.add(img);

        this.disableImageControlls(img);
        img.scaleToWidth(this.canvas.width);
        img.set({
          left: this.config.background.position.left,
          top: this.config.background.position.top,
          scaleX: this.config.background.scale.x,
          scaleY: this.config.background.scale.y
        });

        document.getElementById('upload-wrapper').classList.add('hidden');
      });
    }

    return this;
  };

  upload() {
    document.getElementById('upload').onchange = e => {
      let file = e.target.files[0];
      let reader = new FileReader();

      if(this.canvas.getObjects().length === 0) {
        reader.onload = f => {
          let data = f.target.result;

          fabric.Image.fromURL(data, img => {
            this.canvas.add(img);

            this.disableImageControlls(img);
            img.scaleToWidth(this.canvas.width * 0.9);
            img.center();

            this.saveConfig({
              background: {
                base64: data,
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
          });
        };

        reader.readAsDataURL(file);
      }
    };

    return this;
  };

  reset() {
    document.getElementById('reset').onclick = e => {
      e.preventDefault();

      this.resetConfig();
      this.canvas.clear();

      localStorage.setItem('config', JSON.stringify(config));

      document.getElementById('upload-wrapper').classList.remove('hidden');

      alert('Canvas is reseted');
    };

    return this;
  };

  save() {
    document.getElementById('save').onclick = e => {
      e.preventDefault();

      localStorage.setItem('config', JSON.stringify(this.config));

      alert('Canvas is saved');
    };

    return this;
  };

  download() {
    document.getElementById('download').onclick = e => {
      const image = this.canvas.toDataURL();
      e.target.href = image;
    };
  };
};

const main = new Main();

export default main;
