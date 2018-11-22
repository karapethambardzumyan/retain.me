import { fabric } from 'fabric';
import main from './main';

const sizes = [
  { width: 500, height: 500 },
  { width: 400, height: 400 },
  { width: 300, height: 300 },
  { width: 200, height: 200 }
];

let a = null;

main.run((config) => {
  const canvas = new fabric.Canvas('canvas');

  if(config.canvas.background !== null) {
    fabric.Image.fromURL(config.canvas.background, function(img) {
      canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
        scaleX: canvas.width / img.width,
        scaleY: canvas.height / img.height
      });
    });
  }

  document.getElementById('upload-background').onchange = e => {
    let file = e.target.files[0];
    let reader = new FileReader();

    reader.onload = f => {
      let data = f.target.result;

      fabric.Image.fromURL(data, function(img) {
        canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
          scaleX: canvas.width / img.width,
          scaleY: canvas.height / img.height
        });
      });
    };

    reader.readAsDataURL(file);
  };

  document.getElementById('save').onclick = e => {
    const background = canvas.backgroundImage.getSrc();

    localStorage.setItem('config', JSON.stringify({
      canvas: {
        ...config.canvas,
        background: background
      }
    }));
  };
});
