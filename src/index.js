function setCanvas() {
  const pixelRatio = window.devicePixelRatio;
  const width = document.getElementsByClassName('wrapper')[0].offsetWidth * pixelRatio;
  const height = document.getElementsByClassName('wrapper')[0].offsetHeight * pixelRatio;
  const canvas = document.getElementById('canvas');

  canvas.width = width;
  canvas.height = height;
};

setCanvas();
window.addEventListener('resize', setCanvas);

var canvas = new fabric.Canvas('canvas');
var t1 = new fabric.Textbox('MyText', {
    width: 150,
    top: 5,
    left: 5,
    fontSize: 50,
    textAlign: 'center',
    // fixedWidth: 150
});

canvas.on('text:changed', function(opt) {
  var t1 = opt.target;
  if (t1.width > t1.fixedWidth) {
    t1.fontSize *= t1.fixedWidth / (t1.width + 1);
    t1.width = t1.fixedWidth;
  }
});

canvas.add(t1);

document.getElementById('image').addEventListener("change", function(e) {
   var file = e.target.files[0];
   var reader = new FileReader();
   reader.onload = function(f) {
      var data = f.target.result;
      fabric.Image.fromURL(data, function(img) {
         // add background image
         canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
            scaleX: canvas.width / img.width,
            scaleY: canvas.height / img.height
         });
      });
   };
   reader.readAsDataURL(file);
});

window.onclick = () => {
  console.log(canvas);
};
