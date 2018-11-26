import main from './main';

class Text {
  constructor() {

  };

  openToolbar(target) {
    const textToolbar = document.getElementById('text-toolbar');

    textToolbar.classList.remove('hidden');

    textToolbar.style.top = `${ target.top - textToolbar.offsetHeight - 14 }px`;
    textToolbar.style.left = `${ target.left }px`;

    document.getElementById('text').value = target.text;
  };

  closeToolbar() {
    const textToolbar = document.getElementById('text-toolbar');

    textToolbar.classList.add('hidden');
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
          mt: false,
          mb: false,
          mtr: false
        });
        o.set({ editable: false });
      });
    });
  };

  add(text) {
    let textObject = new fabric.Textbox(text, {
      fontSize: 14,
      fontFamily: 'Arial',
      editable: false,
      width: 400
    });

    textObject.setControlsVisibility({
      tl: false,
      tr: false,
      bl: false,
      br: false,
      mt: false,
      mb: false,
      mtr: false
    });

    main.canvas.add(textObject);
    main.canvas.setActiveObject(textObject);
    textObject.center();

    this.openToolbar(textObject);

    main.config.texts.push(textObject);
  };

  setFamily(fontFamily, selection) {
    if(selection.start === selection.end) {
      main.canvas.getActiveObject().setSelectionStyles({ fontFamily }, 0, selection.end);
    } else {
      main.canvas.getActiveObject().setSelectionStyles({ fontFamily }, selection.start, selection.end);
    }
    main.canvas.getActiveObject().setCoords();
    main.canvas.renderAll();
    main.canvas.fire('object:modified', { target: main.canvas.getActiveObject() });
  };

  setSize(fontSize, selection) {
    if(selection.start === selection.end) {
      main.canvas.getActiveObject().setSelectionStyles({ fontSize }, 0, selection.end);
    } else {
      main.canvas.getActiveObject().setSelectionStyles({ fontSize }, selection.start, selection.end);
    }
    main.canvas.getActiveObject().setCoords();
    main.canvas.renderAll();
    main.canvas.fire('object:modified', { target: main.canvas.getActiveObject() });
  };

  setWeight(fontWeight, selection) {
    if(selection.start === selection.end) {
      main.canvas.getActiveObject().setSelectionStyles({ fontWeight }, 0, selection.end);
    } else {
      main.canvas.getActiveObject().setSelectionStyles({ fontWeight }, selection.start, selection.end);
    }
    main.canvas.getActiveObject().setCoords();
    main.canvas.renderAll();
    main.canvas.fire('object:modified', { target: main.canvas.getActiveObject() });
  };

  setAlign(textAlign, selection) {
    main.canvas.getActiveObject().set({ textAlign });
    main.canvas.getActiveObject().setCoords();
    main.canvas.renderAll();
    main.canvas.fire('object:modified', { target: main.canvas.getActiveObject() });
  };

  setColor(color, selection) {
    if(selection.start === selection.end) {
      main.canvas.getActiveObject().setSelectionStyles({ fill: color }, 0, selection.end);
    } else {
      main.canvas.getActiveObject().setSelectionStyles({ fill: color }, selection.start, selection.end);
    }
    main.canvas.getActiveObject().setCoords();
    main.canvas.renderAll();
    main.canvas.fire('object:modified', { target: main.canvas.getActiveObject() });
  };

  setText(textValue) {
    main.canvas.getActiveObject().set({ text: textValue });
    main.canvas.renderAll();
    main.canvas.fire('object:modified', { target: main.canvas.getActiveObject() });
  };
};

const text = new Text();

export default text;
