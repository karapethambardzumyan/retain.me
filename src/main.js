import { fabric } from 'fabric';

const config = {
  background: null,
  size: 0,
  text: []
};

const sizes = [
  { width: 500, height: 500 },
  { width: 400, height: 400 },
  { width: 300, height: 300 },
  { width: 200, height: 200 }
];

class Main {
  constructor() {
    this.config = this.initialConfig();
    this.canvas = null;
  };

  init() {
    this.canvas = new fabric.Canvas('canvas');

    this.canvas.setWidth(sizes[this.config.size].width);
    this.canvas.setHeight(sizes[this.config.size].height);

    if(this.config.background !== null) {
      fabric.Image.fromURL(this.config.background, img => {
        this.canvas.setBackgroundImage(img, this.canvas.renderAll.bind(this.canvas), {
          scaleX: this.canvas.width / img.width,
          scaleY: this.canvas.height / img.height
        });
      });
    }

    return this;
  };

  uploadBackground() {
    document.getElementById('upload-background').onchange = e => {
      let file = e.target.files[0];
      let reader = new FileReader();

      reader.onload = f => {
        let data = f.target.result;

        console.log('Background is finished uploading');
        fabric.Image.fromURL(data, img => {
          this.canvas.setBackgroundImage(img, this.canvas.renderAll.bind(this.canvas), {
            scaleX: this.canvas.width / img.width,
            scaleY: this.canvas.height / img.height
          });
        });
      };

      console.log('Background is started uploading');
      reader.readAsDataURL(file);
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
      if(this.canvas.backgroundImage === null) {
        return alert('There is nothing to be saved!');
      } else {
        const background = this.canvas.backgroundImage.getSrc();

        localStorage.setItem('config', JSON.stringify({
          ...this.config,
          background
        }));

        alert('State is saved!');
      }
    };

    return this;
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
