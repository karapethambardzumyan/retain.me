import main from './main';

class Text {
  constructor() {

  };

  addAll() {
    fabric.util.enlivenObjects(main.config.texts, function(objects) {
      objects.forEach(o => {
        main.canvas.add(o);
        o.setControlsVisibility({
          tl: false,
          tr: false,
          bl: false,
          br: false,
          ml: false,
          mt: false,
          mr: false,
          mb: false,
          mtr: false
        });
      });
    });
  };

  add(text) {
    let textObject = new fabric.Text(text, {
      fontSize: 14,
      fontFamily: 'Arial'
    });

    textObject.setControlsVisibility({
      tl: false,
      tr: false,
      bl: false,
      br: false,
      ml: false,
      mt: false,
      mr: false,
      mb: false,
      mtr: false
    });

    main.canvas.add(textObject);
    main.canvas.setActiveObject(textObject);
    textObject.center();

    main.config.texts.push(textObject);
  };

  setSize(fontSize) {
    main.canvas.getActiveObject().set({ fontSize });
    main.canvas.renderAll();
    main.canvas.fire('object:modified', { target: main.canvas.getActiveObject() });
  };

  setFamily(fontFamily) {
    main.canvas.getActiveObject().set({ fontFamily });
    main.canvas.renderAll();
    main.canvas.fire('object:modified', { target: main.canvas.getActiveObject() });
  };

  setColor(color) {
    main.canvas.getActiveObject().setColor(color);
    main.canvas.renderAll();
    main.canvas.fire('object:modified', { target: main.canvas.getActiveObject() });
  };
};

const text = new Text();

export default text;
