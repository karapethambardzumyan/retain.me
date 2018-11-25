import FontFaceObserver from 'fontfaceobserver';
import main from './main';
import background from './background';

import { FONTS, CONFIG, SIZES, MM_TO_PX } from './constants';

class Controll {
  constructor() {

  };

  upload() {
    document.getElementById('upload').onchange = e => {
      if(main.canvas.getObjects().length >= 4) {
        let file = e.target.files[0];
        let reader = new FileReader();

        reader.onload = f => {
          let base64 = f.target.result;

          background.add(base64, () => {
            main.drawInnerArea();
          });
        };

        reader.readAsDataURL(file);
      }
    };

    return this;
  };

  addText() {
    const fonts = [];

    for(let i in FONTS) {
      fonts.push(new FontFaceObserver(FONTS[i]).load());
    }

    Promise.all(fonts).then(res => {
      document.getElementById('add-text').onclick = e => {
        e.preventDefault();

        let text = new fabric.IText("Hello, World!", {
          fontSize: 70
        });

        main.canvas.add(text);
        main.canvas.setActiveObject(text);

        main.canvas.getActiveObject().set('fontFamily', 'DancingScript-Regular');
      };
    });

    return this;
  };

  remove() {
    document.getElementById('remove').onclick = e => {
      e.preventDefault();

      if(main.canvas.getActiveObject()) {
        main.canvas.remove(main.canvas.getActiveObject());
        main.saveConfig({
          background: CONFIG.background
        });
      }
    };

    return this;
  };

  save() {
    document.getElementById('save').onclick = e => {
      e.preventDefault();

      localStorage.setItem('config', JSON.stringify(main.config));

      alert('Canvas is saved');
    };

    return this;
  };

  reset() {
    document.getElementById('reset').onclick = e => {
      e.preventDefault();

      main.resetConfig();
      main.canvas.clear();

      localStorage.setItem('config', JSON.stringify(main.config));

      main.drawInnerArea();

      alert('Canvas is reseted');
    };

    return this;
  };

  download() {
    document.getElementById('download').onclick = e => {
      const innerCanvas = {
        width: main.canvas.width * 0.8,
        height: main.canvas.height * 0.8
      };

      const outerCanvas = {
        width: main.canvas.width,
        height: main.canvas.height
      };

      const offset = {
        left: (outerCanvas.width - innerCanvas.width) / 2,
        top: (outerCanvas.height - innerCanvas.height) / 2
      };

      const image = main.canvas.toDataURL({
        top: offset.top + 1,
        left: offset.left + 1,
        width: innerCanvas.width - 1,
        height: innerCanvas.height - 1
      });
      e.target.href = image;
    };

    return this;
  };

  preview() {
    document.getElementById('preview').onclick = e => {
      e.preventDefault();

      const innerCanvas = {
        width: main.canvas.width * 0.8,
        height: main.canvas.height * 0.8
      };

      const outerCanvas = {
        width: main.canvas.width,
        height: main.canvas.height
      };

      const offset = {
        left: (outerCanvas.width - innerCanvas.width) / 2,
        top: (outerCanvas.height - innerCanvas.height) / 2
      };

      const base64 = main.canvas.toDataURL({
        top: offset.top + 1,
        left: offset.left + 1,
        width: innerCanvas.width - 1,
        height: innerCanvas.height - 1
      });

      const img = document.createElement('img');

      img.setAttribute('src', base64);

      document.getElementById('preview-view').appendChild(img);
      document.getElementById('preview-view').classList.remove('hidden');
    };

    document.getElementById('preview-view').onclick = e => {
      if(e.target.nodeName !== 'IMG') {
        e.target.classList.add('hidden');
        e.target.innerHTML = '';
      }
    };

    return this;
  };

  size() {
    document.getElementById('size').onchange = e => {
      const size = parseInt(e.target.value);

      main.saveConfig({ size });

      main.canvas.setWidth(SIZES[size].width * 1.2 * MM_TO_PX);
      main.canvas.setHeight(SIZES[size].height * 1.2 * MM_TO_PX);

      main.drawInnerArea(true);
    };

    return this;
  };

  textAlign() {
    document.getElementById('text-align').onclick = e => {
      e.preventDefault();
    };

    return this;
  };

  textColor() {
    document.getElementById('text-color').onclick = e => {
      e.preventDefault();
    };

    return this;
  };

  textSize() {
    document.getElementById('text-size').onclick = e => {
      e.preventDefault();
    };

    return this;
  };

  textFont() {
    document.getElementById('text-font').onclick = e => {
      e.preventDefault();
    };

    return this;
  };
};

const controll = new Controll();

export default controll;
