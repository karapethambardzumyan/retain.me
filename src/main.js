import { fabric } from 'fabric';

import { CONFIG, SIZES, MM_TO_PX } from './constants';

class Main {
  constructor() {
    this.config = this.initialConfig();
    this.canvas = null;
  };

  init(cb) {
    this.canvas = new fabric.Canvas('canvas', {
      preserveObjectStacking: true
    });

    this.canvas.setWidth(SIZES[this.config.size].width * MM_TO_PX);
    this.canvas.setHeight(SIZES[this.config.size].height * MM_TO_PX);

    document.getElementById('size').selectedIndex = this.config.size;

    this.drawInnerArea();

    return cb(this.canvas);
  };

  drawInnerArea() {
    let isInnerAreaCreated = false;

    for(let i in this.canvas.getObjects()) {
      if(this.canvas.getObjects()[i].type === 'innerArea') {
        isInnerAreaCreated = true;
      }
    }

    if(!isInnerAreaCreated) {
      // this.canvas.add(new fabric.Rect({
      //   width: this.canvas.width - 60,
      //   height: this.canvas.height - 60,
      //   left: 30,
      //   top: 30,
      //   fill: 'rgba(0,0,0,0)',
      //   strokeWidth: 1,
      //   stroke: '#000',
      //   selectable: false,
      //   type: 'innerArea'
      // }));

      const innerCanvas = {
        width: this.canvas.width * 0.8,
        height: this.canvas.height * 0.8
      };

      const outerCanvas = {
        width: this.canvas.width,
        height: this.canvas.height
      };

      const offset = {
        left: (outerCanvas.width - innerCanvas.width) / 2,
        top: (outerCanvas.height - innerCanvas.height) / 2
      };

      this.canvas.add(new fabric.Line([offset.left, offset.top, offset.left + innerCanvas.width, offset.top], {
        strokeDashArray: [5, 10],
        stroke: 'black',
        selectable: false,
        type: 'innerArea'
      }));

      this.canvas.add(new fabric.Line([offset.left, offset.top + innerCanvas.height, offset.left + innerCanvas.width, offset.top + innerCanvas.height], {
        strokeDashArray: [5, 10],
        stroke: 'black',
        selectable: false,
        type: 'innerArea'
      }));

      this.canvas.add(new fabric.Line([offset.left, offset.top, offset.left, offset.top + innerCanvas.height], {
        strokeDashArray: [5, 10],
        stroke: 'black',
        selectable: false,
        type: 'innerArea'
      }));

      this.canvas.add(new fabric.Line([offset.left + innerCanvas.width, offset.top, offset.left + innerCanvas.width, offset.top + innerCanvas.height], {
        strokeDashArray: [5, 10],
        stroke: 'black',
        selectable: false,
        type: 'innerArea'
      }));
    }

    for(let i in this.canvas.getObjects()) {
      if(this.canvas.getObjects()[i].type !== 'innerArea') {
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
