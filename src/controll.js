import main from './main';
import background from './background';
import text from './text';

import { CONFIG, SIZES, MM_TO_PX } from './constants';

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
            text.closeToolbar();
            main.drawInnerArea();
          });
        };

        reader.readAsDataURL(file);
      }
    };

    return this;
  };

  remove() {
    document.getElementById('remove').onclick = e => {
      e.preventDefault();

      if(main.canvas.getActiveObject() && main.canvas.getActiveObject().get('type') === 'image') {
        text.closeToolbar();
        main.canvas.remove(main.canvas.getActiveObject());
        main.saveConfig({ background: CONFIG.background });
      } else if(main.canvas.getActiveObject() && main.canvas.getActiveObject().get('type') === 'textbox') {
        text.closeToolbar();
        main.canvas.remove(main.canvas.getActiveObject());
        main.saveConfig({ texts: CONFIG.texts });
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

      const img = document.createElyourement('img');

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

  addText() {
    document.getElementById('add-text').onclick = e => {
      e.preventDefault();

      text.resetToolbar();
      text.add('Enter your text');
    };

    return this;
  };

  setFontSize() {
    document.getElementById('font-size').onchange = e => {
      e.preventDefault();

      const selection = {
        start: document.getElementById('text').selectionStart,
        end: document.getElementById('text').selectionEnd
      };

      document.getElementById('font-size-value').innerHTML = `${ e.target.value }px`;

      text.setSize(e.target.value, selection);
    };

    return this;
  };

  setFontWeight() {
    document.getElementById('font-weight').onchange = e => {
      e.preventDefault();

      const selection = {
        start: document.getElementById('text').selectionStart,
        end: document.getElementById('text').selectionEnd
      };

      text.setWeight(e.target.value, selection);
    };

    return this;
  };

  setFontAlign() {
    document.getElementById('font-align').onchange = e => {
      e.preventDefault();

      const selection = {
        start: document.getElementById('text').selectionStart,
        end: document.getElementById('text').selectionEnd
      };

      text.setAlign(e.target.value, selection);
    };

    return this;
  };

  setFontFamily() {
    document.getElementById('font-family').onchange = e => {
      e.preventDefault();

      const selection = {
        start: document.getElementById('text').selectionStart,
        end: document.getElementById('text').selectionEnd
      };

      text.setFamily(e.target.value, selection);
    };

    return this;
  };

  setFontColor() {
    document.getElementById('font-color').onchange = e => {
      e.preventDefault();

      const selection = {
        start: document.getElementById('text').selectionStart,
        end: document.getElementById('text').selectionEnd
      };

      document.getElementById('font-color-value').innerHTML = `${ e.target.value }`;

      text.setColor(e.target.value, selection);
    };

    return this;
  };

  setText() {
    document.onselect = e => {
      text.parseStyles(e.target.value, e.target.selectionStart);
    }

    document.getElementById('text').onkeyup = e => {
      console.log(e.target.selectionStart);
      text.setText(e.target.value);
    };

    return this;
  };
};

const controll = new Controll();

export default controll;