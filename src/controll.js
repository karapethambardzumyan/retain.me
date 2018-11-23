import main from './main';
import background from './background';

import { SIZES, MM_TO_PX } from './constants';

class Controll {
  constructor() {

  };

  upload() {
    document.getElementById('upload').onchange = e => {
      if(main.canvas.getObjects().length === 4) {
        let file = e.target.files[0];
        let reader = new FileReader();

        reader.onload = f => {
          let data = f.target.result;

          background.add(data, () => {
            main.drawInnerArea();
          });
        };

        reader.onerror = err => {
          console.log(err);
        };

        reader.readAsDataURL(file);
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

      document.getElementById('upload-wrapper').classList.remove('hidden');

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
        e.target.innerHtml = '';
      }
    };

    return this;
  };

  size() {
    document.getElementById('size').onchange = e => {
      const size = parseInt(e.target.value);

      main.saveConfig({ size });

      main.canvas.setWidth(SIZES[size].width * MM_TO_PX);
      main.canvas.setHeight(SIZES[size].height * MM_TO_PX);

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
