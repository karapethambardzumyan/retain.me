import main from './main';
import { TEXT_TOOLBAR } from './constants';

class Text {
  constructor() {

  };

  parseStyles(text, start) {
    const activeObject = main.canvas.getActiveObject();
    const lines = text.split('\n').map(line => line.length);
    const selectionLine = text.substr(0, start).split('\n').length - 1;
    const previousIndexesLength = lines.reduce((accumulator, currentValue, index) => index < selectionLine ? accumulator + currentValue : accumulator, 0);
    const selectionStart = start - previousIndexesLength - selectionLine;

    // console.log(activeObject.styles, selectionLine);

    if(activeObject.styles[selectionLine]) {
      // document.getElementById('font-family').value = activeObject.styles[selectionLine][selectionStart].fontFamily || TEXT_TOOLBAR.fontFamily;
      // document.getElementById('font-size').value = activeObject.styles[selectionLine][selectionStart].fontSize || TEXT_TOOLBAR.fontSize;
      // document.getElementById('font-weight').value = activeObject.styles[selectionLine][selectionStart].fontWeight || TEXT_TOOLBAR.fontWeight;
      // document.getElementById('font-align').value = activeObject.styles[selectionLine][selectionStart].textAlign || TEXT_TOOLBAR.fontAlign;
      // document.getElementById('font-color').value = activeObject.styles[selectionLine][selectionStart].fill || TEXT_TOOLBAR.fontColor;
      // document.getElementById('font-size-value').innerHTML = activeObject.styles[selectionLine][selectionStart].fontSize ? activeObject.styles[selectionLine][selectionStart].fontSize + 'px' : TEXT_TOOLBAR.fontSize + 'px';
      // document.getElementById('font-color-value').innerHTML = activeObject.styles[selectionLine][selectionStart].fill || TEXT_TOOLBAR.fontColor;
    }
  };

  constructNewStyles(textLines, styles) {
    let obj = {};

    for(let i = 0; i < textLines.length; i++){
      obj[i] = [];
      const line = textLines[i];
      for(let j = 0; j < line.length; j++) {
        if(styles[i] && styles[i][j]) {
          obj[i].push({
            sym: line[j],
            style: styles[i][j]
          })
        } else {
          obj[i].push({
            sym: line[j],
            style: undefined
          })
        }
      }
    }

    return obj;
  }

  openToolbar(target) {
    const textToolbar = document.getElementById('text-toolbar');

    this.resetToolbar();
    this.parseStyles(target.text, 0);

    // console.log(main.canvas.getActiveObject());
    const activeEl = main.canvas.getActiveObject();
    const newStyles = this.constructNewStyles(activeEl.textLines, activeEl.styles);
    console.log(newStyles, 'newStyles');
console.log(activeEl);
    textToolbar.classList.remove('hidden');
    textToolbar.style.top = `${ target.top - textToolbar.offsetHeight - 14 }px`;
    textToolbar.style.left = `${ target.left + ((main.canvas.getActiveObject().width - textToolbar.offsetWidth) / 2) }px`;

    document.getElementById('text').value = target.text;

    activeEl.on('selection:modifed', e => {
      console.log(e);
    });
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
    document.getElementById('font-size-value').innerHTML = TEXT_TOOLBAR.fontSize + 'px';
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
        o.set({ editable: true });
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
      editable: true,
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
