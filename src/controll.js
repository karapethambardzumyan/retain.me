import main from './main';
import background from './background';
import text from './text';

import { CONFIG, MM_TO_PX } from './constants';

class Controll {
  constructor() {

  };

  blurAll() {
    document.onclick = e => {
      if(e.target.nodeName !== 'CANVAS' && e.target.nodeName === 'DIV') {
        text.closeToolbar();
        main.canvas.discardActiveObject(main.canvas.getActiveObjects());
        main.canvas.renderAll();
      }
    }

    return this;
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

            e.target.value = '';
          });
        };

        reader.readAsDataURL(file);
      }
    };

    return this;
  };

  cancelRemove() {
    document.getElementById('remove').onclick = null;
    document.onkeyup = null;
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

    document.onkeyup = e => {
      if(e.keyCode === 46 && main.canvas.getActiveObject()) {
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
      }
    };

    return this;
  };

  save() {
    document.getElementById('save').onclick = e => {
      e.preventDefault();

      document.getElementById('config').value = JSON.stringify(main.config);
      document.getElementById('canvasForm').submit();
    };

    return this;
  };

  reset() {
    document.getElementById('reset').onclick = e => {
      e.preventDefault();

      text.closeToolbar();
      main.resetConfig();
      main.canvas.clear();

      main.drawInnerArea();

      alert('Canvas is reseted');
    };

    return this;
  };

  download() {
    document.getElementById('download').onclick = e => {
      main.innerCanvasBG.set({ opacity: 0 });

      const image = main.canvas.toDataURL({
        top: main.offset.top + 1,
        left: main.offset.left + 1,
        width: main.innerCanvas.width - 1,
        height: main.innerCanvas.height - 1
      });

      e.target.href = image;

      main.innerCanvasBG.set({ opacity: 1 });
      main.canvas.renderAll();
    };

    return this;
  };

  preview() {
    document.getElementById('preview').onclick = e => {
      e.preventDefault();

      main.innerCanvasBG.set({ opacity: 0 });

      const base64 = main.canvas.toDataURL({
        top: main.offset.top + 1,
        left: main.offset.left + 1,
        width: main.innerCanvas.width - 1,
        height: main.innerCanvas.height - 1
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

        main.innerCanvasBG.set({ opacity: 1 });
        main.canvas.renderAll();
      }
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

      text.setSize(e.target.value);
    };

    return this;
  };

  setFontHeight() {
    document.getElementById('font-height').onchange = e => {
      e.preventDefault();

      text.setHeight(e.target.value);
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
    const fontFamilyElement = document.getElementById('font-family');

    for(let i in main.fonts) {
      const font = document.createElement('option');
      font.value = main.fonts[i];
      font.innerHTML = main.fonts[i];
      fontFamilyElement.appendChild(font);
    }

    fontFamilyElement.onchange = e => {
      e.preventDefault();

      text.setFamily(e.target.value);
    };

    return this;
  };

  setFontColor() {
    document.getElementById('font-color').onchange = e => {
      e.preventDefault();

      document.getElementById('font-color-value').value = e.target.value;
      document.getElementById('font-color-preview').style.background = e.target.value;

      text.setColor(e.target.value);
    };

    document.getElementById('font-color-value').onkeyup = e => {
      document.getElementById('font-color').value = e.target.value;
      document.getElementById('font-color-preview').style.background = e.target.value;

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

  setFontUppercase() {
    document.getElementById('font-uppercase').onclick = e => {
      e.preventDefault();

      text.setUppercase();
    };

    return this;
  };

  setFontCamelCase() {
    document.getElementById('font-camelcase').onclick = e => {
      e.preventDefault();

      text.setCamelcase();
    };

    return this;
  };

  addFontTemplate() {
    const templateElement = document.getElementById('font-template');

    for(let i in main.templates) {
      const template = document.createElement('option');
      template.value = main.templates[i].value;
      template.innerHTML = main.templates[i].text;
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
