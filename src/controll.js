import main from './main';
import background from './background';

import { SIZES, MM_TO_PX } from './constants';

class Controll {
  constructor() {

  };

  upload() {
    document.getElementById('upload').onchange = e => {
      if(main.canvas.getObjects().length === 1) {
        let file = e.target.files[0];
        let reader = new FileReader();

        reader.onload = f => {
          let data = f.target.result;

          background.add(data, () => {
            main.drawInnerArea();
          });
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
      const image = main.canvas.toDataURL();
      e.target.href = image;
    };

    return this;
  };

  preview() {
    return this;
  };

  size() {
    document.getElementById('size').onchange = e => {
      const size = parseInt(e.target.value);

      main.saveConfig({ size });

      main.canvas.setWidth(SIZES[size].width * MM_TO_PX);
      main.canvas.setHeight(SIZES[size].height * MM_TO_PX);

      main.drawInnerArea();
    };

    return this;
  };
};

const controll = new Controll();

export default controll;
