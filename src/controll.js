import main from './main';
import background from './background';
import text from './text';

import { TEMPLATES, CONFIG, SIZES, MM_TO_PX } from './constants';

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

      text.closeToolbar();
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

      document.getElementById('font-size-value').innerHTML = `${ e.target.value }px`;

      text.setSize(e.target.value);
    };

    return this;
  };

  setFontWeight() {
    document.getElementById('font-weight').onchange = e => {
      e.preventDefault();

      text.setWeight(e.target.value);
    };

    return this;
  };

  setFontAlign() {
    document.getElementById('font-align-left').onclick = e => {
      document.getElementById('font-align-center').classList.remove('active');
      document.getElementById('font-align-right').classList.remove('active');
      e.target.classList.add('active');
      text.setAlign('left');
    };

    document.getElementById('font-align-center').onclick = e => {
      document.getElementById('font-align-left').classList.remove('active');
      document.getElementById('font-align-right').classList.remove('active');
      e.target.classList.add('active');
      text.setAlign('center');
    };

    document.getElementById('font-align-right').onclick = e => {
      document.getElementById('font-align-left').classList.remove('active');
      document.getElementById('font-align-center').classList.remove('active');
      e.target.classList.add('active');
      text.setAlign('right');
    };

    return this;
  };

  setFontFamily() {
    document.getElementById('font-family').onchange = e => {
      e.preventDefault();

      text.setFamily(e.target.value);
    };

    return this;
  };

  setFontColor() {
    document.getElementById('font-color').onchange = e => {
      e.preventDefault();

      document.getElementById('font-color-value').value = e.target.value;

      text.setColor(e.target.value);
    };

    document.getElementById('font-color-value').onkeyup = e => {
      document.getElementById('font-color').value = e.target.value;

      text.setColor(e.target.value);
    };

    return this;
  };

  setFontUnderline() {
    document.getElementById('font-underline').onclick = e => {
      e.preventDefault();

      const underline = !!e.target.classList.contains('active');

      if(underline) {
        e.target.classList.remove('active');
      } else {
        e.target.classList.add('active');
      }

      text.setUnderline(underline);
    };

    return this;
  };

  addFontTemplate() {
    const templateElement = document.getElementById('font-template');

    for(let i in TEMPLATES) {
      const template = document.createElement('option');
      template.value = TEMPLATES[i].value;
      template.innerHTML = TEMPLATES[i].text;
      templateElement.appendChild(template);
    }

    templateElement.onchange = e => {
      e.preventDefault();

      text.addTemplate(e.target.value, e.target);

      e.target.value = '';
    };

    return this;
  };
};

const controll = new Controll();

export default controll;
