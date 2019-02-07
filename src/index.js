import './fabric';
import main from './main';
import controll from './controll';
import background from './background';
import text from './text';
import { getCoordsLeft, getCoordsTop } from './helpers';

function updateToolbar(e) {
  if(!e.target.isRTL) {
    const target = e.target;
    let start = target.selectionStart - 1;
    let end = target.selectionEnd - 1;
    const _text = target._text;
    const styles = target.getSelectionStyles(0, _text.length);

    let prev = _text[start - 1];
    prev = prev === '\n' ? '\\n' : prev;
    let current = _text[start];
    current = current === '\n' ? '\\n' : current;
    let next = _text[start + 1];
    next = next === '\n' ? '\\n' : next;

    if(current === '\\n' || prev === undefined || start !== end) {
      start = start + 1;
    }

    if(next === undefined) {
      start = start - 1;
    }

    if(next === '\\n' && start !== end) {
      start = start + 2;
    }

    text.updateToolbar(styles[start]);
  } else {
    const target = e.target;
    let start = target.selectionStart;
    const _text = target._text;
    const styles = target.getSelectionStyles(0, _text.length);

    text.updateToolbar(styles[start]);
  }

  document.getElementById('font-template').removeAttribute('disabled');
};

// top alignment helpers start
function clearTopAlignment() {
  main.canvas.remove(main.topAlignment);
  main.topAlignment = null;
};

function drawTopAlignment(top) {
  clearTopAlignment();

  main.topAlignment = new fabric.Line([0, top, main.canvas.width, top], {
    left: 0,
    top: top,
    stroke: '#000',
    selectable: false
  });
  main.canvas.add(main.topAlignment);
};
// top alignment helpers end

// bottom alignment helpers start
function clearBottomAlignment() {
  main.canvas.remove(main.bottomAlignment);
  main.bottomAlignment = null;
};

function drawBottomAlignment(top) {
  clearBottomAlignment();

  main.bottomAlignment = new fabric.Line([0, top, main.canvas.width, top], {
    left: 0,
    top: top,
    stroke: '#000',
    selectable: false
  });
  main.canvas.add(main.bottomAlignment);
};
// bottom alignment helpers end

// left alignment helpers start
function clearLeftAlignment() {
  main.canvas.remove(main.leftAlignment);
  main.leftAlignment = null;
};

function drawLeftAlignment(left) {
  clearLeftAlignment();

  main.leftAlignment = new fabric.Line([0, 0, 0, main.canvas.height], {
    left: left,
    top: 0,
    stroke: '#000',
    selectable: false
  });
  main.canvas.add(main.leftAlignment);
};
// left alignment helpers end

// center alignment helpers start
function clearCenterAlignment() {
  main.canvas.remove(main.centerAlignment);
  main.centerAlignment = null;
};

function drawCenterAlignment(left) {
  clearCenterAlignment();

  main.centerAlignment = new fabric.Line([0, 0, 0, main.canvas.height], {
    left: left,
    top: 0,
    stroke: '#000',
    selectable: false
  });
  main.canvas.add(main.centerAlignment);
};
// center alignment helpers end

// right alignment helpers start
function clearRightAlignment() {
  main.canvas.remove(main.rightAlignment);
  main.rightAlignment = null;
};

function drawRightAlignment(left) {
  clearRightAlignment();

  main.rightAlignment = new fabric.Line([0, 0, 0, main.canvas.height], {
    left: left,
    top: 0,
    stroke: '#000',
    selectable: false
  });
  main.canvas.add(main.rightAlignment);
};
// right alignment helpers end

// horizontal center alignment helpers start
function clearHorizontalCenterAlignment() {
  main.canvas.remove(main.horizontalCenterAlignment);
  main.horizontalCenterAlignment = null;
};

function drawHorizontalCenterAlignment() {
  clearHorizontalCenterAlignment();

  main.horizontalCenterAlignment = new fabric.Line([0, main.canvas.height / 2, main.canvas.width, main.canvas.height / 2], {
    left: 0,
    top: main.canvas.height / 2,
    stroke: '#000',
    selectable: false
  });
  main.canvas.add(main.horizontalCenterAlignment);
};
// horizontal center alignment helpers end

// vertical center alignment helpers start
function clearVerticalCenterAlignment() {
  main.canvas.remove(main.verticalCenterAlignment);
  main.verticalCenterAlignment = null;
};

function drawVerticalCenterAlignment() {
  clearVerticalCenterAlignment();

  main.verticalCenterAlignment = new fabric.Line([main.canvas.width / 2, 0, main.canvas.width / 2, main.canvas.height], {
    left: main.canvas.width / 2,
    top: 0,
    stroke: '#000',
    selectable: false
  });
  main.canvas.add(main.verticalCenterAlignment);
};
// vertical center alignment helpers end

// clear alignments start
function clearAlignments() {
  clearTopAlignment();
  clearBottomAlignment();
  clearLeftAlignment();
  clearCenterAlignment();
  clearRightAlignment();
  clearHorizontalCenterAlignment();
  clearVerticalCenterAlignment();
};
// clear alignments end

main.init(() => {
    let fonts = document.getElementById('fonts').value;
    const customFonts = fonts.length > 0 ? fonts.split(',') : [];

    let customizations = document.getElementById('customizations').value;
    const customTemplates = [];
    customizations = customizations.split(',');
    for(let i in customizations) {
      let item = customizations[i].split('\':\'');
      let text = item[0].slice(2, item[0].length);
      let value = item[1].slice(0, item[1].length - 2);
      customTemplates.push({ text, value });
    }

    let size = document.getElementById('sizes').value;
    size = size.slice(1, size.length - 1).split(',');
    const customSize = { width: size[0], height: size[1] };

    const customConfig = document.getElementById('config').value;

    return {
      fonts: customFonts,
      templates: customTemplates,
      size: customSize,
      config: customConfig
    };
  }, canvas => {
    window.onkeydown = e => {
      if(main.canvas.getActiveObject() && main.canvas.getActiveObject().type === 'textbox') {
        switch(e.keyCode) {
          case 37:
            main.canvas.getActiveObject().left = main.canvas.getActiveObject().left - 1;
            text.closeToolbar();
            break;
          case 39:
            main.canvas.getActiveObject().left = main.canvas.getActiveObject().left + 1;
            text.closeToolbar();
            break;
          case 38:
            main.canvas.getActiveObject().top = main.canvas.getActiveObject().top - 1;
            text.closeToolbar();
            break;
          case 40:
            main.canvas.getActiveObject().top = main.canvas.getActiveObject().top + 1;
            text.closeToolbar();
            break;
          default:
          break;
        }

        main.canvas.renderAll();
      }
    };

    canvas.on('text:changed', e => {
      if(!e.target.isRTL) {
        const target = e.target;
        const start = target.selectionStart - 1;
        const text = target._text;
        const styles = target.getSelectionStyles(0, text.length);

        let prev = text[start - 1];
        prev = prev === '\n' ? '\\n' : prev;
        let current = text[start];
        current = current === '\n' ? '\\n' : current;
        let next = text[start + 1];
        next = next === '\n' ? '\\n' : next;

        if(prev === '\\n' && current === '\\n' && (next === '\\n' || next === undefined)) {
          console.log('just new line');
          target.setSelectionStyles(styles[start - 2], start - 1, start + 1);
          main.canvas.renderAll();
        }

        if((prev === '\\n' || prev === undefined) && current === '\\n' && next !== '\\n' && next !== undefined) {
          console.log('left side');
          target.setSelectionStyles(styles[start + 1], start, start + 1);
          main.canvas.renderAll();
        }

        if(prev !== '\\n' && current === '\\n' && (next === '\\n' || next === undefined)) {
          console.log('right side');
          target.setSelectionStyles(styles[start - 1], start + 1, start + 2);
          main.canvas.renderAll();
        }

        if(current !== '\\n' && Object.keys(target.followingStyles).length !== 0) {
          target.setSelectionStyles(target.followingStyles, start, start + 1);
          target.followingStyles = {};
          main.canvas.renderAll();
        }
      } else {
        if(e.target.lb === 'left') {
          let pos = e.target.get2DCursorLocation(e.target.selectionStart);
          e.target.styles[pos.lineIndex] = { [pos.charIndex]: e.target.lastLineStyle };
          e.target.lb = 'left-first-time';
          e.target.lastLineStyle = null;
        }

        e.target.setSelectionStyles(e.target.followingStyles, e.target.selectionStart, e.target.selectionStart+1);
      }

      updateToolbar(e);
    });

    canvas.on('text:selection:changed', e => {
      e.target.followingStyles = { ...e.target.getSelectionStyles()[0] };
      updateToolbar(e);
    });

    canvas.on('text:editing:entered', e => {
      controll.cancelRemove();
    });

    canvas.on('text:editing:exited', e => {
      controll.remove();
    });

    canvas.on('object:selected', e => {
      if(e.target.get('type') === 'textbox') {
        document.querySelector('#rtl').classList.remove('rtl-enabled');
        e.target.isRTL && document.querySelector('#rtl').classList.add('rtl-enabled');
        text.openToolbar(e.target);
      }
    });

    canvas.on('selection:updated', e => {
      text.resetToolbar();
    });

    canvas.on('mouse:up', e => {
      (e.target && e.target.coords) && (e.target.coords = null);

      if(e.target !== null && canvas.getActiveObject() && canvas.getActiveObject().get('type') === 'image') {
        main.saveConfig({
          background: {
            scale: {
              x: e.target.scaleX,
              y: e.target.scaleY
            },
            position: {
              left: e.target.aCoords.tl.x,
              top: e.target.aCoords.tl.y
            }
          }
        });
      }

      if(e.target !== null && canvas.getActiveObject() &&  canvas.getActiveObject().get('type') === 'textbox') {
        text.openToolbar(e.target);
        clearAlignments();
      } else {
        text.closeToolbar();
      }
    });

    canvas.on('object:modified', e => {
      let texts = canvas.getObjects();

      texts = texts.filter(item => item.get('type') === 'textbox');

      main.saveConfig({ texts });
    });

    canvas.on('object:scaling', e => {
      if(e.target !== null && canvas.getActiveObject() && canvas.getActiveObject().get('type') === 'image') {
        let threshold = 7;
        let w = e.target.getScaledWidth();
        let h = e.target.getScaledHeight();
        let snap = {
           top: 0,
           left: 0,
           bottom: main.canvas.height,
           right: main.canvas.width
        };
        let dist = {
          top: Math.abs(snap.top - e.target.top),
          left: Math.abs(snap.left - e.target.left),
          bottom: Math.abs(snap.bottom - e.target.top - h),
          right: Math.abs(snap.right - e.target.left - w)
        };
        let attrs = {
          scaleX: e.target.scaleX,
          scaleY: e.target.scaleY,
          top: e.target.top,
          left: e.target.left
        };

        switch(e.target.__corner) {
          case 'tl':
            if(dist.left < dist.top && dist.left < threshold) {
              attrs.scaleX = (w - (snap.left - e.target.left)) / e.target.width;
              attrs.scaleY = (attrs.scaleX / e.target.scaleX) * e.target.scaleY;
              attrs.top = e.target.top + (h - e.target.height * attrs.scaleY);
              attrs.left = snap.left;
            } else if (dist.top < threshold) {
              attrs.scaleY = (h - (snap.top - e.target.top)) / e.target.height;
              attrs.scaleX = (attrs.scaleY / e.target.scaleY) * e.target.scaleX;
              attrs.left = attrs.left + (w - e.target.width * attrs.scaleX);
              attrs.top = snap.top;
            }

            break;
          case 'tr':
             if(dist.right < dist.top && dist.right < threshold) {
              attrs.scaleX = (snap.right - e.target.left) / e.target.width;
              attrs.scaleY = (attrs.scaleX / e.target.scaleX) * e.target.scaleY;
              attrs.top = e.target.top + (h - e.target.height * attrs.scaleY);
             } else if (dist.top < threshold) {
              attrs.scaleY = (h - (snap.top - e.target.top)) / e.target.height;
              attrs.scaleX = (attrs.scaleY / e.target.scaleY) * e.target.scaleX;
              attrs.top = snap.top;
             }

             break;
           case 'bl':
            if(dist.left < dist.bottom && dist.left < threshold) {
             attrs.scaleX = (w - (snap.left - e.target.left)) / e.target.width;
             attrs.scaleY = (attrs.scaleX / e.target.scaleX) * e.target.scaleY;
             attrs.left = snap.left;
            } else if (dist.bottom < threshold) {
             attrs.scaleY = (snap.bottom - e.target.top) / e.target.height;
             attrs.scaleX = (attrs.scaleY / e.target.scaleY) * e.target.scaleX;
             attrs.left = attrs.left + (w - e.target.width * attrs.scaleX);
            }

            break;
          case 'br':
           if(dist.right < dist.bottom && dist.right < threshold) {
            attrs.scaleX = (snap.right - e.target.left) / e.target.width;
            attrs.scaleY = (attrs.scaleX / e.target.scaleX) * e.target.scaleY;
           } else if (dist.bottom < threshold) {
            attrs.scaleY = (snap.bottom - e.target.top) / e.target.height;
            attrs.scaleX = (attrs.scaleY / e.target.scaleY) * e.target.scaleX;
           }

           break;
          default:
            break;
        }

        e.target.set(attrs);
      }

      if(e.target !== null && canvas.getActiveObject() && canvas.getActiveObject().get('type') === 'textbox') {
        const target = e.target;
        const coords = target.calcCoords();

        if(!target.coords) {
          target.coords = coords;
        }

        // left start
        {
          if(coords.bl.x < 0 && (target.angle > 0 && target.angle < 90)) {
            target.leftScale = true;
            console.log('left, bl');
            const blX = 0;
            const blY = target.coords.br.y - Math.tan(target.angle * Math.PI / 180) * target.coords.br.x;
            const width = Math.sqrt((target.coords.tr.x - blX) ** 2 + (target.coords.tr.y - blY) ** 2) - 1.5;

            target.set('width', width);
            target.setPositionByOrigin({ x: blX, y: blY }, 'left', 'bottom');
            target.setCoords();

            return;
          }
          else if(coords.br.x < 0 && (target.angle > 90 && target.angle < 180)) {
            target.leftScale = true;
            console.log('left, br');
            const brX = 0;
            const brY = target.coords.bl.y - Math.tan(target.angle * Math.PI / 180) * target.coords.bl.x;
            const width = Math.sqrt((target.coords.tl.x - brX) ** 2 + (target.coords.tl.y - brY) ** 2) - 1.5;

            target.set('width', width);
            target.setPositionByOrigin({ x: brX, y: brY }, 'right', 'bottom');
            target.setCoords();

            return;
          }
          else if(coords.tr.x < 0 && (target.angle >= 180 && target.angle < 270)) {
            target.leftScale = true;
            console.log('left, tr');
            const trX = 0;
            const trY = target.coords.tl.y - Math.tan(target.angle * Math.PI / 180) * target.coords.tl.x;
            const width = Math.sqrt((target.coords.bl.x - trX) ** 2 + (target.coords.bl.y - trY) ** 2) - 1.5;

            target.set('width', width);
            target.setPositionByOrigin({ x: trX, y: trY }, 'right', 'top');
            target.setCoords();

            return;
          }
          else if(coords.tl.x < 0 && (target.angle === 0 || target.angle === 360 ||target.angle > 270 && target.angle < 360)) {
            target.leftScale = true;
            console.log('left, tl');
            const tlX = 0;
            const tlY = target.coords.tr.y - Math.tan(target.angle * Math.PI / 180) * target.coords.tr.x;
            const width = Math.sqrt((target.coords.br.x - tlX) ** 2 + (target.coords.br.y - tlY) ** 2) - 1.5;

            target.set('width', width);
            target.setPositionByOrigin({ x: tlX, y: tlY }, 'left', 'top');
            target.setCoords();

            return;
          } else {
            target.leftScale = true;
          }
        }
        // left end

        // top start
        {
          if(coords.tl.y < 0 && (target.angle > 0 && target.angle <= 90)) {
            target.topScale = true;
            console.log('top, tl');
            const tlX = (target.coords.tr.x - target.coords.br.x) + (target.coords.br.x - target.coords.tr.y / Math.tan(target.angle * Math.PI / 180));
            const tlY = 0;
            const width = Math.sqrt((target.coords.br.x - tlX) ** 2 + (target.coords.br.y - tlY) ** 2) - 2;

            target.set('width', width);
            target.setPositionByOrigin({ x: tlX, y: tlY }, 'left', 'top');
            target.setCoords();

            return;
          }
          else if(coords.bl.y < 0 && (target.angle > 90 && target.angle <= 180)) {
            target.topScale = true;
            console.log('top, bl');
            const blX = (target.coords.br.x - target.coords.tr.x) + (target.coords.tr.x - target.coords.br.y / Math.tan(target.angle * Math.PI / 180));
            const blY = 0;
            const width = Math.sqrt((target.coords.tr.x - blX) ** 2 + (target.coords.tr.y - blY) ** 2) - 2;

            target.set('width', width);
            target.setPositionByOrigin({ x: blX, y: blY }, 'left', 'bottom');
            target.setCoords();

            return;
          }
          else if(coords.br.y < 0 && (target.angle > 180 && target.angle <= 270)) {
            target.topScale = true;
            console.log('top, br');
            const brX = (target.coords.br.x - target.coords.tr.x) + (target.coords.tr.x - target.coords.br.y / Math.tan(target.angle * Math.PI / 180));
            const brY = 0;
            const width = Math.sqrt((target.coords.tl.x - brX) ** 2 + (target.coords.tl.y - brY) ** 2) - 2;

            target.set('width', width);
            target.setPositionByOrigin({ x: brX, y: brY }, 'right', 'bottom');
            target.setCoords();

            return;
          }
          else if(coords.tr.y < 0 && (target.angle > 270 && target.angle <= 360)) {
            target.topScale = true;
            console.log('top, tr');
            const trX = (target.coords.tl.x - target.coords.bl.x) + (target.coords.bl.x - target.coords.tl.y / Math.tan(target.angle * Math.PI / 180));
            const trY = 0;
            const width = Math.sqrt((target.coords.bl.x - trX) ** 2 + (target.coords.bl.y - trY) ** 2) - 2;

            target.set('width', width);
            target.setPositionByOrigin({ x: trX, y: trY }, 'right', 'top');
            target.setCoords();

            return;
          } else {
            target.topScale = false;
          }
        }
        // top end

        // right start
        {
          if(coords.tr.x > target.canvas.width && (target.angle === 0 || target.angle === 360 || target.angle > 0 && target.angle < 90)) {
            target.rightScale = true;
            console.log('right, tr');
            const trX = target.canvas.width;
            const trY = (target.canvas.width - target.coords.tl.x) * Math.tan(target.angle * Math.PI / 180) + target.coords.tl.y;
            const width = Math.sqrt((target.coords.tl.x - trX) ** 2 + (target.coords.tl.y - trY) ** 2) - 1;

            target.set('width', width);
            target.setPositionByOrigin({ x: trX, y: trY }, 'right', 'top');
            target.setCoords();

            return;
          }
          else if(coords.tl.x > target.canvas.width && (target.angle > 90 && target.angle <= 180)) {
            target.rightScale = true;
            console.log('right, tl');
            const tlX = target.canvas.width;
            const tlY = (target.canvas.width - target.coords.tr.x) * Math.tan(target.angle * Math.PI / 180) + target.coords.tr.y;
            const width = Math.sqrt((target.coords.tr.x - tlX) ** 2 + (target.coords.tr.y - tlY) ** 2) - 1;

            target.set('width', width);
            target.setPositionByOrigin({ x: tlX, y: tlY }, 'left', 'top');
            target.setCoords();

            return;
          }
          else if(coords.bl.x > target.canvas.width && (target.angle > 180 && target.angle < 270)) {
            target.rightScale = true;
            console.log('right, bl');
            const blX = target.canvas.width;
            const blY = (target.canvas.width - target.coords.br.x) * Math.tan(target.angle * Math.PI / 180) + target.coords.br.y;
            const width = Math.sqrt((target.coords.br.x - blX) ** 2 + (target.coords.br.y - blY) ** 2) - 1;

            target.set('width', width);
            target.setPositionByOrigin({ x: blX, y: blY }, 'left', 'bottom');
            target.setCoords();

            return;
          }
          else if(coords.br.x > target.canvas.width && (target.angle > 270 && target.angle < 360)) {
            target.rightScale = true;
            console.log('right, br');
            const brX = target.canvas.width;
            const brY = (target.canvas.width - target.coords.bl.x) * Math.tan(target.angle * Math.PI / 180) + target.coords.bl.y;
            const width = Math.sqrt((target.coords.bl.x - brX) ** 2 + (target.coords.bl.y - brY) ** 2) - 1;

            target.set('width', width);
            target.setPositionByOrigin({ x: brX, y: brY }, 'right', 'bottom');
            target.setCoords();

            return;
          } else {
            target.rightScale = false;
          }
        }
        // right end

        // bottom start
        {
          if(coords.br.y > target.canvas.height && (target.angle > 0 && target.angle <= 90)) {
            target.bottomScale = true;
            console.log('bottom, br');
            const brX = coords.bl.x - (coords.bl.y - target.canvas.height) / Math.tan(target.angle * Math.PI / 180);
            const brY = target.canvas.height;
            const width = Math.sqrt((target.coords.bl.x - brX) ** 2 + (target.coords.bl.y - brY) ** 2) - 1;

            target.set('width', width);
            target.setPositionByOrigin({ x: brX, y: brY }, 'right', 'bottom');
            target.setCoords();

            return;
          }
          else if(coords.tr.y > target.canvas.height && (target.angle > 90 && target.angle <= 180)) {
            target.bottomScale = true;
            console.log('bottom, tr');
            const trX = coords.tl.x - (coords.tl.y - target.canvas.height) / Math.tan(target.angle * Math.PI / 180);
            const trY = target.canvas.height;
            const width = Math.sqrt((target.coords.tl.x - trX) ** 2 + (target.coords.tl.y - trY) ** 2) - 1;

            target.set('width', width);
            target.setPositionByOrigin({ x: trX, y: trY }, 'right', 'top');
            target.setCoords();

            return;
          }
          else if(coords.tl.y > target.canvas.height && (target.angle > 180 && target.angle <= 270)) {
            target.bottomScale = true;
            console.log('bottom, tl');
            const tlX = coords.tr.x - (coords.tr.y - target.canvas.height) / Math.tan(target.angle * Math.PI / 180);
            const tlY = target.canvas.height;
            const width = Math.sqrt((target.coords.tr.x - tlX) ** 2 + (target.coords.tr.y - tlY) ** 2) - 1;

            target.set('width', width);
            target.setPositionByOrigin({ x: tlX, y: tlY }, 'left', 'top');
            target.setCoords();

            return;
          }
          else if(coords.bl.y > target.canvas.height && (target.angle >= 270 && target.angle < 360)) {
            target.bottomScale = true;
            console.log('bottom, bl');
            const blX = coords.br.x - (coords.br.y - target.canvas.height) / Math.tan(target.angle * Math.PI / 180);
            const blY = target.canvas.height;
            const width = Math.sqrt((target.coords.br.x - blX) ** 2 + (target.coords.br.y - blY) ** 2) - 1;

            target.set('width', width);
            target.setPositionByOrigin({ x: blX, y: blY }, 'left', 'bottom');
            target.setCoords();

            return;
          } else {
            target.bottomScale = false;
          }
        }
        // bottom end

        target.coords = null;
      }

      text.closeToolbar();
    });

    canvas.on('object:rotating', e => {
      const target = e.target;

      if(target.angle > 80 && target.angle < 90) {
        target._setOriginToCenter();
        target.set('angle', 90).setCoords();
        target._resetOrigin();
        target.canvas.renderAll();
      }

      if(target.angle > 170 && target.angle < 180) {
        target._setOriginToCenter();
        target.set('angle', 180).setCoords();
        target._resetOrigin();
        target.canvas.renderAll();
      }

      if(target.angle > 260 && target.angle < 270) {
        target._setOriginToCenter();
        target.set('angle', 270).setCoords();
        target._resetOrigin();
        target.canvas.renderAll();
      }

      if(target.angle > 350 && target.angle < 360) {
        target._setOriginToCenter();
        target.set('angle', 360).setCoords();
        target._resetOrigin();
        target.canvas.renderAll();
      }
    });

    canvas.on('object:moving', e => {
      if(e.target !== null && canvas.getActiveObject() && canvas.getActiveObject().get('type') === 'image') {
        const activeObject = main.canvas.getActiveObject();

        if(activeObject.left < 7 && activeObject.left > 0) {
          activeObject.left = 0;
        }
        if(activeObject.top < 7 && activeObject.top > 0) {
          activeObject.top = 0;
        }
        if(main.canvas.width - activeObject.width * activeObject.scaleX - activeObject.left < 7 && activeObject.left < main.canvas.width - activeObject.width * activeObject.scaleX) {
          activeObject.left = main.canvas.width - activeObject.width * activeObject.scaleX;
        }
        if(main.canvas.height - activeObject.height * activeObject.scaleY - activeObject.top < 7 && activeObject.top < main.canvas.height - activeObject.height * activeObject.scaleY) {
          activeObject.top = main.canvas.height - activeObject.height * activeObject.scaleY;
        }
      }

      if(e.target !== null && canvas.getActiveObject() && canvas.getActiveObject().get('type') === 'textbox') {
        const target = e.target;

        target.topScale = false;
        target.bottomScale = false;
        target.leftScale = false;
        target.rightScale = false;

        clearAlignments();

        // textboxes moving start
        {
          const coordsLeft = getCoordsLeft(target);
          const coordsTop = getCoordsTop(target);
          if(coordsLeft.x < 7) {
            target.setPositionByOriginX({ x: 0, y: coordsLeft.y }, coordsLeft.originX, coordsLeft.originY);
          }
          if(coordsTop.y < 7) {
            target.setPositionByOriginY({ x: coordsTop.x, y: 0 }, coordsTop.originX, coordsTop.originY);
          }
          if((main.canvas.width - (coordsLeft.ox - coordsLeft.x)) - coordsLeft.x < 7) {
            target.setPositionByOriginX({ x: (main.canvas.width - (coordsLeft.ox - coordsLeft.x)), y: coordsLeft.y }, coordsLeft.originX, coordsLeft.originY);
          }
          if((main.canvas.height - (coordsTop.oy - coordsTop.y)) - coordsTop.y < 7) {
            target.setPositionByOriginY({ x: coordsTop.x, y: (main.canvas.height - (coordsTop.oy - coordsTop.y)) }, coordsTop.originX, coordsTop.originY);
          }
          text.closeToolbar();
        }
        // textboxes moving end

        // top alignment start
        {
          const texts = target.canvas.getObjects().filter(object => object.type === 'textbox');
          const currentText = target;
          const currentTextCoords = getCoordsTop(currentText);
          const currentTextWidth = currentText.width;
          const currentTextMaxLineWidth = Math.max.apply(null, currentText.__lineWidths);
          let currentTextLeftOffset = 0;
          // for left aligned text
          ((currentText.angle === 90) && currentText.textAlign === 'left') && (currentTextLeftOffset = 0);
          ((currentText.angle === 270) && currentText.textAlign === 'left') && (currentTextLeftOffset = currentTextWidth - currentTextMaxLineWidth);
          // for center aligned text
          ((currentText.angle === 90) && currentText.textAlign === 'center') && (currentTextLeftOffset = (currentTextWidth - currentTextMaxLineWidth) / 2);
          ((currentText.angle === 270) && currentText.textAlign === 'center') && (currentTextLeftOffset = (currentTextWidth - currentTextMaxLineWidth) / 2);
          // for right aligned text
          ((currentText.angle === 90) && currentText.textAlign === 'right') && (currentTextLeftOffset = currentTextWidth - currentTextMaxLineWidth);
          ((currentText.angle === 270) && currentText.textAlign === 'right') && (currentTextLeftOffset = 0);

          currentTextCoords.y = currentTextCoords.y + currentTextLeftOffset;

          if(currentText.angle === 0 || currentText.angle === 90 || currentText.angle === 180 || currentText.angle === 270 || currentText.angle === 360) {
            for(let i in texts) {
              const targetText = texts[i];
              const targetTextCoords = getCoordsLeft(targetText);
              const targetTextWidth = targetText.width;
              const targetTextMaxLineWidth = Math.max.apply(null, targetText.__lineWidths);
              let targetTextLeftOffset = 0;
              // for left aligned text
              ((targetText.angle === 90) && targetText.textAlign === 'left') && (targetTextLeftOffset = 0);
              ((targetText.angle === 270) && targetText.textAlign === 'left') && (targetTextLeftOffset = targetTextWidth - targetTextMaxLineWidth);
              // for center aligned text
              ((targetText.angle === 90) && targetText.textAlign === 'center') && (targetTextLeftOffset = (targetTextWidth - targetTextMaxLineWidth) / 2);
              ((targetText.angle === 270) && targetText.textAlign === 'center') && (targetTextLeftOffset = (targetTextWidth - targetTextMaxLineWidth) / 2);
              // for right aligned text
              ((targetText.angle === 90) && targetText.textAlign === 'right') && (targetTextLeftOffset = targetTextWidth - targetTextMaxLineWidth);
              ((targetText.angle === 270) && targetText.textAlign === 'right') && (targetTextLeftOffset = 0);

              targetTextCoords.y = targetTextCoords.y + targetTextLeftOffset;

              if(targetText.angle === 0 || targetText.angle === 90 || targetText.angle === 180 || targetText.angle === 270 || targetText.angle === 360) {
                if(Math.abs(currentTextCoords.y - targetTextCoords.y) > 0 && Math.abs(currentTextCoords.y - targetTextCoords.y) < 5) {
                  currentText.setPositionByOriginY({ x: currentTextCoords.x, y: targetTextCoords.y - currentTextLeftOffset }, currentTextCoords.originX, currentTextCoords.originY);
                  drawTopAlignment(targetTextCoords.y);
                }
              }
            }
          }
        }
        // top alignment end

        // bottom alignment start
        {
          const texts = target.canvas.getObjects().filter(object => object.type === 'textbox');
          const currentText = target;
          const currentTextCoords = getCoordsTop(currentText);
          const currentTextWidth = currentText.width;
          const currentTextMaxLineWidth = Math.max.apply(null, currentText.__lineWidths);
          let currentTextLeftOffset = 0;
          // for left aligned text
          ((currentText.angle === 90) && currentText.textAlign === 'left') && (currentTextLeftOffset = currentTextWidth - currentTextMaxLineWidth);
          ((currentText.angle === 270) && currentText.textAlign === 'left') && (currentTextLeftOffset = 0);
          // for center aligned text
          ((currentText.angle === 90) && currentText.textAlign === 'center') && (currentTextLeftOffset = (currentTextWidth - currentTextMaxLineWidth) / 2);
          ((currentText.angle === 270) && currentText.textAlign === 'center') && (currentTextLeftOffset = (currentTextWidth - currentTextMaxLineWidth) / 2);
          // for right aligned text
          ((currentText.angle === 90) && currentText.textAlign === 'right') && (currentTextLeftOffset = 0);
          ((currentText.angle === 270) && currentText.textAlign === 'right') && (currentTextLeftOffset = currentTextWidth - currentTextMaxLineWidth);

          currentTextCoords.oy = currentTextCoords.oy - currentTextLeftOffset;

          if(currentText.angle === 0 || currentText.angle === 90 || currentText.angle === 180 || currentText.angle === 270 || currentText.angle === 360) {
            for(let i in texts) {
              const targetText = texts[i];
              const targetTextCoords = getCoordsLeft(targetText);
              const targetTextWidth = targetText.width;
              const targetTextMaxLineWidth = Math.max.apply(null, targetText.__lineWidths);
              let targetTextLeftOffset = 0;
              // for left aligned text
              ((targetText.angle === 90) && targetText.textAlign === 'left') && (targetTextLeftOffset = targetTextWidth - targetTextMaxLineWidth);
              ((targetText.angle === 270) && targetText.textAlign === 'left') && (targetTextLeftOffset = 0);
              // for center aligned text
              ((targetText.angle === 90) && targetText.textAlign === 'center') && (targetTextLeftOffset = (targetTextWidth - targetTextMaxLineWidth) / 2);
              ((targetText.angle === 270) && targetText.textAlign === 'center') && (targetTextLeftOffset = (targetTextWidth - targetTextMaxLineWidth) / 2);
              // for right aligned text
              ((targetText.angle === 90) && targetText.textAlign === 'right') && (targetTextLeftOffset = 0);
              ((targetText.angle === 270) && targetText.textAlign === 'right') && (targetTextLeftOffset = targetTextWidth - targetTextMaxLineWidth);

              targetTextCoords.oy = targetTextCoords.oy - targetTextLeftOffset;

              if(targetText.angle === 0 || targetText.angle === 90 || targetText.angle === 180 || targetText.angle === 270 || targetText.angle === 360) {
                if(Math.abs(currentTextCoords.oy - targetTextCoords.oy) > 0 && Math.abs(currentTextCoords.oy - targetTextCoords.oy) < 5) {
                  currentText.setPositionByOriginY({ x: currentTextCoords.x, y: targetTextCoords.oy -   (currentTextCoords.oy - currentTextCoords.y) }, currentTextCoords.originX, currentTextCoords.originY);
                  drawBottomAlignment(targetTextCoords.oy);
                }
              }
            }
          }
        }
        // bottom alignment end

        // left alignment start
        {
          const texts = target.canvas.getObjects().filter(object => object.type === 'textbox');
          const currentText = target;
          const currentTextCoords = getCoordsLeft(currentText);
          const currentTextWidth = currentText.width;
          const currentTextMaxLineWidth = Math.max.apply(null, currentText.__lineWidths);
          let currentTextLeftOffset;
          // for left aligned text
          ((currentText.angle === 0 || currentText.angle === 360) && currentText.textAlign === 'left') && (currentTextLeftOffset = 0);
          ((currentText.angle === 90 || currentText.angle === 270) && currentText.textAlign === 'left') && (currentTextLeftOffset = 0);
          (currentText.angle === 180 && currentText.textAlign === 'left') && (currentTextLeftOffset = currentTextWidth - currentTextMaxLineWidth);
          // for center aligned text
          ((currentText.angle === 0 || currentText.angle === 360) && currentText.textAlign === 'center') && (currentTextLeftOffset = (currentTextWidth - currentTextMaxLineWidth) / 2);
          ((currentText.angle === 90 || currentText.angle === 270) && currentText.textAlign === 'center') && (currentTextLeftOffset = 0);
          (currentText.angle === 180 && currentText.textAlign === 'center') && (currentTextLeftOffset = (currentTextWidth - currentTextMaxLineWidth) / 2);
          // for right aligned text
          ((currentText.angle === 0 || currentText.angle === 360) && currentText.textAlign === 'right') && (currentTextLeftOffset = currentTextWidth - currentTextMaxLineWidth);
          ((currentText.angle === 90 || currentText.angle === 270) && currentText.textAlign === 'right') && (currentTextLeftOffset = 0);
          (currentText.angle === 180 && currentText.textAlign === 'right') && (currentTextLeftOffset = 0);

          currentTextCoords.x = currentTextCoords.x + currentTextLeftOffset;

          if(currentText.angle === 0 || currentText.angle === 90 || currentText.angle === 180 || currentText.angle === 270 || currentText.angle === 360) {
            for(let i in texts) {
              const targetText = texts[i];
              const targetTextCoords = getCoordsLeft(targetText);
              const targetTextWidth = targetText.width;
              const targetTextMaxLineWidth = Math.max.apply(null, targetText.__lineWidths);
              let targetTextLeftOffset;
              // for left aligned text
              ((targetText.angle === 0 || targetText.angle === 360) && targetText.textAlign === 'left') && (targetTextLeftOffset = 0);
              ((targetText.angle === 90 || targetText.angle === 270) && targetText.textAlign === 'left') && (targetTextLeftOffset = 0);
              (targetText.angle === 180 && targetText.textAlign === 'left') && (targetTextLeftOffset = targetTextWidth - targetTextMaxLineWidth);
              // for center aligned text
              ((targetText.angle === 0 || targetText.angle === 360) && targetText.textAlign === 'center') && (targetTextLeftOffset = (targetTextWidth - targetTextMaxLineWidth) / 2);
              ((targetText.angle === 90 || targetText.angle === 270) && targetText.textAlign === 'center') && (targetTextLeftOffset = 0);
              (targetText.angle === 180 && targetText.textAlign === 'center') && (targetTextLeftOffset = (targetTextWidth - targetTextMaxLineWidth) / 2);
              // for right aligned text
              ((targetText.angle === 0 || targetText.angle === 360) && targetText.textAlign === 'right') && (targetTextLeftOffset = targetTextWidth - targetTextMaxLineWidth);
              ((targetText.angle === 90 || targetText.angle === 270) && targetText.textAlign === 'right') && (targetTextLeftOffset = 0);
              (targetText.angle === 180 && targetText.textAlign === 'right') && (targetTextLeftOffset = 0);

              targetTextCoords.x = targetTextCoords.x + targetTextLeftOffset;

              if(targetText.angle === 0 || targetText.angle === 90 || targetText.angle === 180 || targetText.angle === 270 || targetText.angle === 360) {
                if(Math.abs(currentTextCoords.x - targetTextCoords.x) > 0 && Math.abs(currentTextCoords.x - targetTextCoords.x) < 5) {
                  currentText.setPositionByOriginX({ x: targetTextCoords.x - currentTextLeftOffset, y: currentTextCoords.y }, currentTextCoords.originX, currentTextCoords.originY);
                  drawLeftAlignment(targetTextCoords.x);
                }
              }
            }
          }
        }
        // left alignment end

        // center alignment start
        {
          const texts = target.canvas.getObjects().filter(object => object.type === 'textbox');
          const currentText = target;
          const currentTextCoords = getCoordsLeft(currentText);
          const currentTextWidth = currentText.width;
          const currentTextMaxLineWidth = Math.max.apply(null, currentText.__lineWidths);
          let currentTextLeftOffset;
          // for left aligned text
          ((currentText.angle === 0 || currentText.angle === 360) && currentText.textAlign === 'left') && (currentTextLeftOffset = currentTextMaxLineWidth / 2);
          ((currentText.angle === 90 || currentText.angle === 270) && currentText.textAlign === 'left') && (currentTextLeftOffset = currentText.height / 2);
          (currentText.angle === 180 && currentText.textAlign === 'left') && (currentTextLeftOffset = (currentTextWidth - currentTextMaxLineWidth) + (currentTextMaxLineWidth / 2));
          // for center aligned text
          ((currentText.angle === 0 || currentText.angle === 360) && currentText.textAlign === 'center') && (currentTextLeftOffset = (currentTextMaxLineWidth / 2) + ((currentTextWidth - currentTextMaxLineWidth) / 2));
          ((currentText.angle === 90 || currentText.angle === 270) && currentText.textAlign === 'center') && (currentTextLeftOffset = currentText.height / 2);
          (currentText.angle === 180 && currentText.textAlign === 'center') && (currentTextLeftOffset = (currentTextMaxLineWidth / 2) + ((currentTextWidth - currentTextMaxLineWidth) / 2));
          // for right aligned text
          ((currentText.angle === 0 || currentText.angle === 360) && currentText.textAlign === 'right') && (currentTextLeftOffset = (currentTextWidth - currentTextMaxLineWidth) + (currentTextMaxLineWidth / 2));
          ((currentText.angle === 90 || currentText.angle === 270) && currentText.textAlign === 'right') && (currentTextLeftOffset = currentText.height / 2);
          (currentText.angle === 180 && currentText.textAlign === 'right') && (currentTextLeftOffset = currentTextMaxLineWidth / 2);

          currentTextCoords.x = currentTextCoords.x + currentTextLeftOffset;

          if(currentText.angle === 0 || currentText.angle === 90 || currentText.angle === 180 || currentText.angle === 270 || currentText.angle === 360) {
            for(let i in texts) {
              const targetText = texts[i];
              const targetTextCoords = getCoordsLeft(targetText);
              const targetTextWidth = targetText.width;
              const targetTextMaxLineWidth = Math.max.apply(null, targetText.__lineWidths);
              let targetTextLeftOffset;
              // for left aligned text
              ((targetText.angle === 0 || targetText.angle === 360) && targetText.textAlign === 'left') && (targetTextLeftOffset = targetTextMaxLineWidth / 2);
              ((targetText.angle === 90 || targetText.angle === 270) && targetText.textAlign === 'left') && (targetTextLeftOffset = targetText.height / 2);
              (targetText.angle === 180 && targetText.textAlign === 'left') && (targetTextLeftOffset = (targetTextWidth - targetTextMaxLineWidth) + (targetTextMaxLineWidth / 2));
              // for center aligned text
              ((targetText.angle === 0 || targetText.angle === 360) && targetText.textAlign === 'center') && (targetTextLeftOffset = (targetTextMaxLineWidth / 2) + ((targetTextWidth - targetTextMaxLineWidth) / 2));
              ((targetText.angle === 90 || targetText.angle === 270) && targetText.textAlign === 'center') && (targetTextLeftOffset = targetText.height / 2);
              (targetText.angle === 180 && targetText.textAlign === 'center') && (targetTextLeftOffset = (targetTextMaxLineWidth / 2) + ((targetTextWidth - targetTextMaxLineWidth) / 2));
              // for right aligned text
              ((targetText.angle === 0 || targetText.angle === 360) && targetText.textAlign === 'right') && (targetTextLeftOffset = (targetTextWidth - targetTextMaxLineWidth) + (targetTextMaxLineWidth / 2));
              ((targetText.angle === 90 || targetText.angle === 270) && targetText.textAlign === 'right') && (targetTextLeftOffset = targetText.height / 2);
              (targetText.angle === 180 && targetText.textAlign === 'right') && (targetTextLeftOffset = targetTextMaxLineWidth / 2);

              targetTextCoords.x = targetTextCoords.x + targetTextLeftOffset;

              if(targetText.angle === 0 || targetText.angle === 90 || targetText.angle === 180 || targetText.angle === 270 || targetText.angle === 360) {
                if(Math.abs(currentTextCoords.x - targetTextCoords.x) > 0 && Math.abs(currentTextCoords.x - targetTextCoords.x) < 5) {
                  currentText.setPositionByOriginX({ x: targetTextCoords.x - currentTextLeftOffset, y: currentTextCoords.y }, currentTextCoords.originX, currentTextCoords.originY);
                  drawCenterAlignment(targetTextCoords.x);
                }
              }
            }
          }
        }
        // center alignment end

        // right alignment start
        {
          const texts = target.canvas.getObjects().filter(object => object.type === 'textbox');
          const currentText = target;
          const currentTextCoords = getCoordsLeft(currentText);
          const currentTextWidth = currentText.width;
          const currentTextMaxLineWidth = Math.max.apply(null, currentText.__lineWidths);
          let currentTextLeftOffset;
          // for left aligned text
          ((currentText.angle === 0 || currentText.angle === 360) && currentText.textAlign === 'left') && (currentTextLeftOffset = currentTextMaxLineWidth);
          ((currentText.angle === 90 || currentText.angle === 270) && currentText.textAlign === 'left') && (currentTextLeftOffset = currentText.height);
          (currentText.angle === 180 && currentText.textAlign === 'left') && (currentTextLeftOffset = currentTextWidth);
          // for center aligned text
          ((currentText.angle === 0 || currentText.angle === 360) && currentText.textAlign === 'center') && (currentTextLeftOffset = currentTextMaxLineWidth + ((currentTextWidth - currentTextMaxLineWidth) / 2));
          ((currentText.angle === 90 || currentText.angle === 270) && currentText.textAlign === 'center') && (currentTextLeftOffset = currentText.height);
          (currentText.angle === 180 && currentText.textAlign === 'center') && (currentTextLeftOffset = currentTextMaxLineWidth + ((currentTextWidth - currentTextMaxLineWidth) / 2));
          // for right aligned text
          ((currentText.angle === 0 || currentText.angle === 360) && currentText.textAlign === 'right') && (currentTextLeftOffset = currentTextWidth);
          ((currentText.angle === 90 || currentText.angle === 270) && currentText.textAlign === 'right') && (currentTextLeftOffset = currentText.height);
          (currentText.angle === 180 && currentText.textAlign === 'right') && (currentTextLeftOffset = currentTextMaxLineWidth);

          currentTextCoords.x = currentTextCoords.x + currentTextLeftOffset;

          if(currentText.angle === 0 || currentText.angle === 90 || currentText.angle === 180 || currentText.angle === 270 || currentText.angle === 360) {
            for(let i in texts) {
              const targetText = texts[i];
              const targetTextCoords = getCoordsLeft(targetText);
              const targetTextWidth = targetText.width;
              const targetTextMaxLineWidth = Math.max.apply(null, targetText.__lineWidths);
              let targetTextLeftOffset;
              // for left aligned text
              ((targetText.angle === 0 || targetText.angle === 360) && targetText.textAlign === 'left') && (targetTextLeftOffset = targetTextMaxLineWidth);
              ((targetText.angle === 90 || targetText.angle === 270) && targetText.textAlign === 'left') && (targetTextLeftOffset = targetText.height);
              (targetText.angle === 180 && targetText.textAlign === 'left') && (targetTextLeftOffset = targetTextWidth);
              // for center aligned text
              ((targetText.angle === 0 || targetText.angle === 360) && targetText.textAlign === 'center') && (targetTextLeftOffset = targetTextMaxLineWidth + ((targetTextWidth - targetTextMaxLineWidth) / 2));
              ((targetText.angle === 90 || targetText.angle === 270) && targetText.textAlign === 'center') && (targetTextLeftOffset = targetText.height);
              (targetText.angle === 180 && targetText.textAlign === 'center') && (targetTextLeftOffset = targetTextMaxLineWidth + ((targetTextWidth - targetTextMaxLineWidth) / 2));
              // for right aligned text
              ((targetText.angle === 0 || targetText.angle === 360) && targetText.textAlign === 'right') && (targetTextLeftOffset = targetTextWidth);
              ((targetText.angle === 90 || targetText.angle === 270) && targetText.textAlign === 'right') && (targetTextLeftOffset = targetText.height);
              (targetText.angle === 180 && targetText.textAlign === 'right') && (targetTextLeftOffset = targetTextMaxLineWidth);

              targetTextCoords.x = targetTextCoords.x + targetTextLeftOffset;

              if(targetText.angle === 0 || targetText.angle === 90 || targetText.angle === 180 || targetText.angle === 270 || targetText.angle === 360) {
                if(Math.abs(currentTextCoords.x - targetTextCoords.x) > 0 && Math.abs(currentTextCoords.x - targetTextCoords.x) < 5) {
                  currentText.setPositionByOriginX({ x: targetTextCoords.x - currentTextLeftOffset, y: currentTextCoords.y }, currentTextCoords.originX, currentTextCoords.originY);
                  drawRightAlignment(targetTextCoords.x);
                }
              }
            }
          }
        }
        // right alignment end

        // horizontal and vertical center alignments start
        {
          const currentText = target;
          const currentTextCoords = currentText.calcCoords();
          const canvasCenterX = currentText.canvas.width / 2;
          const canvasCenterY = currentText.canvas.height / 2;
          const currentTextWidth = currentText.width;
          const currentTextMaxLineWidth = Math.max.apply(null, currentText.__lineWidths);
          let coords;
          let x;
          let y;

          coords = {
            tl: fabric.util.rotatePoint(new fabric.Point(currentTextCoords.tl.x, currentTextCoords.tl.y), currentText.getCenterPoint(), fabric.util.degreesToRadians(360 - currentText.angle)),
            tr: fabric.util.rotatePoint(new fabric.Point(currentTextCoords.tr.x, currentTextCoords.tr.y), currentText.getCenterPoint(), fabric.util.degreesToRadians(360 - currentText.angle)),
            bl: fabric.util.rotatePoint(new fabric.Point(currentTextCoords.bl.x, currentTextCoords.bl.y), currentText.getCenterPoint(), fabric.util.degreesToRadians(360 - currentText.angle)),
            br: fabric.util.rotatePoint(new fabric.Point(currentTextCoords.br.x, currentTextCoords.br.y), currentText.getCenterPoint(), fabric.util.degreesToRadians(360 - currentText.angle))
          };
          switch(currentText.textAlign) {
            case 'left':
              coords.tr.x = coords.tr.x - (currentTextWidth - currentTextMaxLineWidth);
              coords.br.x = coords.br.x - (currentTextWidth - currentTextMaxLineWidth);
              break;
            case 'center':
              break;
            case 'right':
              coords.tl.x = coords.tl.x + (currentTextWidth - currentTextMaxLineWidth);
              coords.bl.x = coords.bl.x + (currentTextWidth - currentTextMaxLineWidth);
              break;
            default:
              break;
          }
          coords = {
            tl: fabric.util.rotatePoint(new fabric.Point(coords.tl.x, coords.tl.y), currentText.getCenterPoint(), fabric.util.degreesToRadians(currentText.angle)),
            tr: fabric.util.rotatePoint(new fabric.Point(coords.tr.x, coords.tr.y), currentText.getCenterPoint(), fabric.util.degreesToRadians(currentText.angle)),
            bl: fabric.util.rotatePoint(new fabric.Point(coords.bl.x, coords.bl.y), currentText.getCenterPoint(), fabric.util.degreesToRadians(currentText.angle)),
            br: fabric.util.rotatePoint(new fabric.Point(coords.br.x, coords.br.y), currentText.getCenterPoint(), fabric.util.degreesToRadians(currentText.angle))
          };
          x = (coords.tl.x + coords.tr.x + coords.bl.x + coords.br.x) / 4;
          y = (coords.tl.y + coords.tr.y + coords.bl.y + coords.br.y) / 4;

          if(Math.abs(canvasCenterY - y) > 0 && Math.abs(canvasCenterY - y) < 5) {
            (currentText.textAlign === 'left') && (currentText.top = canvasCenterY - (coords.br.y - coords.tl.y) / 2);
            (currentText.textAlign === 'center') && (currentText.top = canvasCenterY - (coords.br.y - coords.tl.y) / 2);
            (currentText.textAlign === 'right') && (currentText.top = canvasCenterY + ((currentTextCoords.tl.y - coords.br.y) + (coords.br.y - coords.tl.y) / 2));
            drawHorizontalCenterAlignment();
          }
          if(Math.abs(canvasCenterX - x) > 0 && Math.abs(canvasCenterX - x) < 5) {
            (currentText.textAlign === 'left') && (currentText.left = canvasCenterX - (coords.br.x - coords.tl.x) / 2);
            (currentText.textAlign === 'center') && (currentText.left = canvasCenterX - (coords.br.x - coords.tl.x) / 2);
            (currentText.textAlign === 'right') && (currentText.left = canvasCenterX + ((currentTextCoords.tl.x - coords.br.x) + (coords.br.x - coords.tl.x) / 2));
            drawVerticalCenterAlignment();
          }
        }
        // horizontal and vertical center alignments end
      }
    });

    background.add(null);

    text.addAll();

    controll
      .blurAll()
      .upload()
      .remove()
      .save()
      .reset()
      .preview()
      .download()
      .preview()
      .addText()
      .setFontFamily()
      .setFontSize()
      .setFontHeight()
      .setFontWeight()
      .setFontAlign()
      .setFontColor()
      .setFontUnderline()
      .setFontUppercase()
      .setFontCamelCase()
      .addFontTemplate()
      .switchRTL();
});
