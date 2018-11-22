import { fabric } from 'fabric';
import main from './main';

main.run(() => {
  const canvas = new fabric.Canvas('canvas');

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
});
