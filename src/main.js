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

    localStorage.setItem('config', JSON.stringify(this.config));

    const fonts = [];

    for(let i in this.fonts) {
      fonts.push(new FontFaceObserver(this.fonts[i]).load());
    }

    Promise.all(fonts).then(res => {
      this.canvas = new fabric.Canvas('canvas', { preserveObjectStacking: true });
      this.canvas.setWidth((this.size.width * MM_TO_PX) + (10 * MM_TO_PX));
      this.canvas.setHeight((this.size.height * MM_TO_PX) + (10 * MM_TO_PX));
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

      document.getElementById('canvas-wrapper').style.background = 'rgb(190, 75, 90)';
      document.getElementById('canvas-wrapper').style.width = `${ (this.size.width * MM_TO_PX) + (10 * MM_TO_PX) }px`;
      document.getElementById('canvas-wrapper').style.height = `${ (this.size.height * MM_TO_PX) + (10 * MM_TO_PX) }px`;

      this.drawInnerArea();

      return cb(this.canvas);
    });
  };

  drawInnerArea(sizeChanged) {
    let isInnerAreaCreated = false;

    if(sizeChanged) {
      const arr = this.canvas.getObjects();

      for(let i in arr) {
        if(arr[i].type === 'innerArea') {
          this.canvas.remove(arr[i]);
        }
      }

      isInnerAreaCreated = false;
    } else {
      for(let i in this.canvas.getObjects()) {
        if(this.canvas.getObjects()[i].type === 'innerArea') {
          isInnerAreaCreated = true;
        }
      }
    }

    if(!isInnerAreaCreated) {
      this.canvas.add(new fabric.Line([this.offset.left, this.offset.top, this.offset.left + this.innerCanvas.width, this.offset.top], {
        stroke: 'black',
        hoverCursor: 'default',
        selectable: false,
        type: 'innerArea'
      }));

      this.canvas.add(new fabric.Line([this.offset.left, this.offset.top + this.innerCanvas.height, this.offset.left + this.innerCanvas.width, this.offset.top + this.innerCanvas.height], {
        stroke: 'black',
        hoverCursor: 'default',
        selectable: false,
        type: 'innerArea'
      }));

      this.canvas.add(new fabric.Line([this.offset.left, this.offset.top, this.offset.left, this.offset.top + this.innerCanvas.height], {
        stroke: 'black',
        hoverCursor: 'default',
        selectable: false,
        type: 'innerArea'
      }));

      this.canvas.add(new fabric.Line([this.offset.left + this.innerCanvas.width, this.offset.top, this.offset.left + this.innerCanvas.width, this.offset.top + this.innerCanvas.height], {
        stroke: 'black',
        hoverCursor: 'default',
        selectable: false,
        type: 'innerArea'
      }));

      this.innerCanvasBG = new fabric.Rect({
        left: this.offset.left,
        top: this.offset.top,
        fill: '#fff',
        width: this.innerCanvas.width,
        height: this.innerCanvas.height,
        hoverCursor: 'default',
        selectable: false,
        type: 'innerCanvas'
      });
      this.canvas.add(this.innerCanvasBG);
    }

    for(let i in this.canvas.getObjects()) {
      if(this.canvas.getObjects()[i].type !== 'innerArea' && this.canvas.getObjects()[i].type !== 'innerCanvas') {
        this.canvas.moveTo(this.canvas.getObjects()[i], 0);
      }
    }

    for(let i in this.canvas.getObjects()) {
      if(this.canvas.getObjects()[i].type === 'innerCanvas') {
        this.canvas.moveTo(this.canvas.getObjects()[i], 0);
      }
    }
  };

  initialConfig() {
    if(localStorage.getItem('config') === null) {
      localStorage.setItem('config', JSON.stringify(CONFIG));
    }

    return JSON.parse(localStorage.getItem('config'));
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
