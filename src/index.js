var canvas = new fabric.Canvas('canvas');
var t1 = new fabric.Textbox('MyText', {
    width: 150,
    top: 5,
    left: 5,
    fontSize: 50,
    textAlign: 'center',
    fixedWidth: 150
});

canvas.on('text:changed', function(opt) {
  var t1 = opt.target;
  if (t1.width > t1.fixedWidth) {
    t1.fontSize *= t1.fixedWidth / (t1.width + 1);
    t1.width = t1.fixedWidth;
  }
});



canvas.add(t1);
