import FontFaceObserver from 'fontfaceobserver';
import { fabric } from 'fabric';

import { CONFIG, SIZES, MM_TO_PX } from './constants';

class Main {
  constructor() {
    this.config = this.initialConfig();
    this.canvas = null;
  };

  init(initialCb, cb) {
    this.fonts = initialCb().fonts;
    this.templates = initialCb().templates;

    const fonts = [];

    for(let i in this.fonts) {
      fonts.push(new FontFaceObserver(this.fonts[i]).load());
    }

    Promise.all(fonts).then(res => {
      this.canvas = new fabric.Canvas('canvas', { preserveObjectStacking: true });
      this.canvas.setWidth((SIZES[this.config.size].width * MM_TO_PX) + (10 * MM_TO_PX));
      this.canvas.setHeight((SIZES[this.config.size].height * MM_TO_PX) + (10 * MM_TO_PX));
      this.canvas.selection = false;
      this.innerCanvas = {
        width: SIZES[this.config.size].width * MM_TO_PX,
        height: SIZES[this.config.size].height * MM_TO_PX
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
      document.getElementById('canvas-wrapper').style.width = `${ (SIZES[this.config.size].width * MM_TO_PX) + (10 * MM_TO_PX) }px`;
      document.getElementById('canvas-wrapper').style.height = `${ (SIZES[this.config.size].height * MM_TO_PX) + (10 * MM_TO_PX) }px`;
      document.getElementById('size').selectedIndex = this.config.size;

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
