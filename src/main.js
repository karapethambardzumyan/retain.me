import FontFaceObserver from 'fontfaceobserver';
import { fabric } from 'fabric';

import { CONFIG, MM_TO_PX } from './constants';

class Main {
  constructor() {
    this.canvas = null;
  };

  init(initialCb, cb) {
    const cbResult = initialCb();

    this.fonts = cbResult.fonts;
    this.templates = cbResult.templates;
    this.size = cbResult.size;
    this.config = cbResult.config;

    if(this.config.trim()) {
      this.config = JSON.parse(this.config);
    } else {
      this.config = this.initialConfig();
    }

    const fonts = [];

    for(let i in this.fonts) {
      fonts.push(new FontFaceObserver(this.fonts[i]).load());
    }

    Promise.all(fonts).then(res => {
      this.canvas = new fabric.Canvas('canvas', { preserveObjectStacking: true });
      this.canvas.setWidth(this.size.width * MM_TO_PX);
      this.canvas.setHeight(this.size.height * MM_TO_PX);
      this.canvas.selection = false;
      this.innerCanvas = {
        width: this.size.width * MM_TO_PX,
        height: this.size.height * MM_TO_PX
      };
      this.outerCanvas = {
        width: this.canvas.width,
        height: this.canvas.height
      };
      this.offset = {
        left: (this.outerCanvas.width - this.innerCanvas.width) / 2,
        top: (this.outerCanvas.height - this.innerCanvas.height) / 2
      };

      document.getElementById('canvas-wrapper').style.border = '10px solid rgb(190, 75, 90)';
      document.getElementById('canvas-wrapper').style.width = `${ this.size.width * MM_TO_PX }px`;
      document.getElementById('canvas-wrapper').style.height = `${ this.size.height * MM_TO_PX }px`;

      return cb(this.canvas);
    });
  };

  initialConfig() {
    return CONFIG;
  };

  saveConfig(config) {
    this.config = {
      ...this.config,
      ...config,
      background: {
        ...this.config.background,
        ...config.background
      }
    };
  };

  resetConfig() {
    this.config = CONFIG;
  };
};

const main = new Main();

export default main;
