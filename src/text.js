import main from './main';
import { TEXT_TOOLBAR } from './constants';

const getLine = (text, selectionStart) => {
  return text.substr(0, selectionStart).split('\n').length - 1;
};

class Text {
  constructor() {

  };

  parseStyles(text, start) {
    const activeObject = main.canvas.getActiveObject();
    const lines = text.split('\n').map(line => line.length);
    const selectionLine = text.substr(0, start).split('\n').length - 1;
    const previousIndexesLength = lines.reduce((accumulator, currentValue, index) => index < selectionLine ? accumulator + currentValue : accumulator, 0);
    const selectionStart = start - previousIndexesLength - selectionLine;



    if(activeObject.styles[selectionLine]) {
      console.log(activeObject.styles[selectionLine][selectionStart]);
    }
  };

  openToolbar(target) {
    const textToolbar = document.getElementById('text-toolbar');

    this.resetToolbar();

    textToolbar.classList.remove('hidden');
    textToolbar.style.top = `${ target.top - textToolbar.offsetHeight - 14 }px`;
    textToolbar.style.left = `${ target.left + ((main.canvas.getActiveObject().width - textToolbar.offsetWidth) / 2) }px`;

    document.getElementById('text').value = target.text;
  };

  closeToolbar() {
    const textToolbar = document.getElementById('text-toolbar');

    textToolbar.classList.add('hidden');
  };

  resetToolbar() {
    document.getElementById('font-family').value = TEXT_TOOLBAR.fontFamily;
    document.getElementById('font-size').value = TEXT_TOOLBAR.fontSize;
    document.getElementById('font-weight').value = TEXT_TOOLBAR.fontWeight;
    document.getElementById('font-align').value = TEXT_TOOLBAR.fontAlign;
    document.getElementById('font-color').value = TEXT_TOOLBAR.fontColor;
    document.getElementById('font-size-value').innerHTML = TEXT_TOOLBAR.fontSize;
    document.getElementById('font-color-value').innerHTML = TEXT_TOOLBAR.fontColor;
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
      fontSize: TEXT_TOOLBAR.fontSize,
      fontFamily: TEXT_TOOLBAR.fontFamily,
      fontWeight: TEXT_TOOLBAR.fontWeight,
      alignText: TEXT_TOOLBAR.fontAlign,
      fill: TEXT_TOOLBAR.fontColor,
      text: TEXT_TOOLBAR.text,
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
    main.canvas.renderAll();
    main.canvas.getActiveObject().setCoords();
    main.canvas.fire('object:modified', { target: main.canvas.getActiveObject() });
  };

  setSize(fontSize, selection) {
    if(selection.start === selection.end) {
      main.canvas.getActiveObject().setSelectionStyles({ fontSize }, 0, selection.end);
    } else {
      main.canvas.getActiveObject().setSelectionStyles({ fontSize }, selection.start, selection.end);
    }
    main.canvas.renderAll();
    main.canvas.getActiveObject().setCoords();
    main.canvas.fire('object:modified', { target: main.canvas.getActiveObject() });
  };

  setWeight(fontWeight, selection) {
    if(selection.start === selection.end) {
      main.canvas.getActiveObject().setSelectionStyles({ fontWeight }, 0, selection.end);
    } else {
      main.canvas.getActiveObject().setSelectionStyles({ fontWeight }, selection.start, selection.end);
    }
    main.canvas.renderAll();
    main.canvas.getActiveObject().setCoords();
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
    main.canvas.renderAll();
    main.canvas.getActiveObject().setCoords();
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
