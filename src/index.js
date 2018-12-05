import main from './main';
import controll from './controll';
import background from './background';
import text from './text';

function updateToolbar(e) {
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

  document.getElementById('font-template').removeAttribute('disabled');
};

function clearLeftAlignment() {
  main.canvas.remove(main.leftAlignment);
  main.leftAlignment = null;
};

function clearCenterAlignment() {
  main.canvas.remove(main.centerAlignment);
  main.centerAlignment = null;
};

function clearRightAlignment() {
  main.canvas.remove(main.rightAlignment);
  main.rightAlignment = null;
};

function clearHorizontalAlignment() {
  main.canvas.remove(main.horizontalAlignment);
  main.horizontalAlignment = null;
};

function clearHorizontalCenterAlignment() {
  main.canvas.remove(main.horizontalCenterAlignment);
  main.horizontalCenterAlignment = null;
};

function clearVerticalCenterAlignment() {
  main.canvas.remove(main.verticalCenterAlignment);
  main.verticalCenterAlignment = null;
};

function clearAllAlignment() {
  clearLeftAlignment();
  clearCenterAlignment();
  clearRightAlignment();
  clearHorizontalAlignment();
  clearHorizontalCenterAlignment();
  clearVerticalCenterAlignment();
};

function drawLeftAlignment(target) {
  let { left, __lineWidths, width } = target;
  let textWidth = Math.max.apply(null, __lineWidths);
  let offsetLeft = left + textWidth;

  main.canvas.remove(main.leftAlignment);
  main.leftAlignment = new fabric.Line([offsetLeft, main.offset.top, offsetLeft, main.offset.top + main.innerCanvas.height], {
    left: target.alignment.left,
    top: main.offset.top,
    stroke: '#000',
    selectable: false
  });

  main.canvas.add(main.leftAlignment);
  main.canvas.renderAll();
};

function drawCenterAlignment(target, qqq) {
  let { left, __lineWidths, width } = target;
  let textWidth = Math.max.apply(null, __lineWidths);
  let offsetLeft = left + textWidth;

  main.canvas.remove(main.centerAlignment);
  main.centerAlignment = new fabric.Line([qqq, main.offset.top, qqq, main.offset.top + main.innerCanvas.height], {
    left: qqq,
    top: main.offset.top,
    stroke: '#000',
    selectable: false
  });

  main.canvas.add(main.centerAlignment);
  main.canvas.renderAll();
};

function drawRightAlignment(target) {
  let { left, __lineWidths, width } = target;
  let textWidth = Math.max.apply(null, __lineWidths);
  let offsetLeft = left + textWidth;

  main.canvas.remove(main.rightAlignment);
  main.rightAlignment = new fabric.Line([offsetLeft, main.offset.top, offsetLeft, main.offset.top + main.innerCanvas.height], {
    left: target.alignment.right,
    top: main.offset.top,
    stroke: '#000',
    selectable: false
  });

  main.canvas.add(main.rightAlignment);
  main.canvas.renderAll();
};

function drawHorizontalAlignment(height) {
  main.canvas.remove(main.horizontalAlignment);
  main.horizontalAlignment = new fabric.Line([main.offset.left, 0, main.offset.left + main.innerCanvas.width, 0], {
    left: main.offset.left,
    top: height,
    stroke: '#000',
    selectable: false
  });

  main.canvas.add(main.horizontalAlignment);
  main.canvas.renderAll();
};

function drawHorizontalCenterAlignment() {
  main.canvas.remove(main.horizontalCenterAlignment);
  main.horizontalCenterAlignment = new fabric.Line([main.offset.left, main.offset.top + main.innerCanvas.height / 2, main.offset.left + main.innerCanvas.width, main.offset.top + main.innerCanvas.height / 2], {
    left: main.offset.left,
    top: main.offset.top + main.innerCanvas.height / 2,
    stroke: '#000',
    selectable: false
  });

  main.canvas.add(main.horizontalCenterAlignment);
  main.canvas.renderAll();
};

function drawVerticalCenterAlignment() {
  main.canvas.remove(main.verticalCenterAlignment);
  main.verticalCenterAlignment = new fabric.Line([main.offset.left + main.innerCanvas.width / 2, main.offset.top, main.offset.left + main.innerCanvas.width / 2, main.offset.top + main.innerCanvas.height], {
    left: main.offset.left + main.innerCanvas.width / 2,
    top: main.offset.top,
    stroke: '#000',
    selectable: false
  });

  main.canvas.add(main.verticalCenterAlignment);
  main.canvas.renderAll();
};

main.init(() => {
    const customFonts = [
      'DancingScript-Regular',
      'IndieFlower',
      'JosefinSans-Regular',
      'Niramit-Regular',
      'Pacifico-Regular',
      'Ranga-Regular',
      'ShadowsIntoLight'
    ];
    const customTemplates = [
      { text: 'Order - Currency', value: '<~o:Currency~>' },
      { text: 'Order - Total Price', value: '<~o:TotalPrice~>' },
      { text: 'Order - Subtotal Price', value: '<~o:SubTotalPrice~>' },
      { text: 'Order - Total Shipping Price', value: '<~o:TotalShippingPrice~>' },
      { text: 'Order - Total Tax', value: '<~o:TotalTax~>' },
      { text: 'Order - Language', value: '<~o:Language~>' },
      { text: 'Order - Document Barcode', value: '<~o:DocumentBarcode~>' },

      { text: 'BillingAddress - First Name', value: '<~ba:FirstName~>' },
      { text: 'BillingAddress - Last Name', value: '<~ba:LastName~>' },
      { text: 'BillingAddress - Address 1', value: '<~ba:Address1~>' },
      { text: 'BillingAddress - Address 2', value: '<~ba:Address2~>' },
      { text: 'BillingAddress - Address 3', value: '<~ba:Address3~>' },
      { text: 'BillingAddress - Address 4', value: '<~ba:Address4~>' },
      { text: 'BillingAddress - City', value: '<~ba:City~>' },
      { text: 'BillingAddress - Zip/Postal Code', value: '<~ba:Zip_PostalCode~>' },
      { text: 'BillingAddress - Phone', value: '<~ba:Phone~>' },
      { text: 'BillingAddress - Country Code', value: '<~ba:CountryCode~>' },

      { text: 'Customer - Title', value: '<~c:Title~>' },
      { text: 'Customer - Email', value: '<~c:Email~>' },
      { text: 'Customer - FirstName', value: '<~c:FirstName~>' },
      { text: 'Customer - Last Name', value: '<~c:LastName~>' },
      { text: 'Customer - Phone', value: '<~c:Phone~>' },
      { text: 'Customer - Is New', value: '<~c:IsNew~>' },

      { text: 'Shipment - Title', value: '<~s:Title~>' },
      { text: 'Shipment - First Name', value: '<~s:FirstName~>' },
      { text: 'Shipment - Last Name', value: '<~s:Last Name~>' },
      { text: 'Shipment - Is Gift', value: '<~s:IsGift~>' },
      { text: 'Shipment - Gift Message', value: '<~s:GiftMessage~>' },
      { text: 'Shipment - Address 1', value: '<~s:Address1~>' },
      { text: 'Shipment - Address 2', value: '<~s:Address2~>' },
      { text: 'Shipment - Address 3', value: '<~s:Address3~>' },
      { text: 'Shipment - Address 4', value: '<~s:Address4~>' },
      { text: 'Shipment - City', value: '<~s:City~>' },
      { text: 'Shipment - Zip/Postal Code', value: '<~s:Zip_PostalCode~>' },
      { text: 'Shipment - Phone', value: '<~s:Phone~>' },
      { text: 'Shipment - Country Code', value: '<~s:CountryCode~>' },

      { text: 'OrderOffer - Offer Type', value: '<~oo:OfferType~>' },
      { text: 'OrderOffer - Offer Code', value: '<~oo:OfferCode~>' },
      { text: 'OrderOffer - Offer Url', value: '<~oo:OfferUrl~>' },
      { text: 'OrderOffer - Offer Discount', value: '<~oo:OfferDiscount~>' },
      { text: 'OrderOffer - Offer Min Spend', value: '<~oo:OfferMinSpend~>' },
      { text: 'OrderOffer - Offer Expiry Date', value: '<~oo:OfferExpiryDate~>' }
    ];
    const customSize = { width: 136, height: 150 };
    const customConfig = ``;

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
        text.openToolbar(e.target);
      }
    });

    canvas.on('selection:updated', e => {
      text.resetToolbar();
    });

    canvas.on('mouse:up', e => {
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
        clearAllAlignment();
      } else {
        text.closeToolbar();
      }
    });

    canvas.on('object:modified', e => {
      let texts = canvas.getObjects();

      texts = texts.filter(item => item.get('type') === 'textbox');

      main.saveConfig({ texts });

      e.target.lastWidth = e.target.width;
    });

    canvas.on('object:scaling', e => {
      if(e.target !== null && canvas.getActiveObject() && canvas.getActiveObject().get('type') === 'image') {
        let threshold = 7;
        let w = e.target.getScaledWidth();
        let h = e.target.getScaledHeight();
        let snap = {
           top: main.offset.top,
           left: main.offset.left,
           bottom: main.offset.top + main.innerCanvas.height,
           right: main.offset.left + main.innerCanvas.width
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
        if(e.target.left < main.offset.left) {
          e.target.width = main.canvas.getActiveObject().left + main.canvas.getActiveObject().width - main.offset.left;
          e.target.left = main.offset.left;
        }

        if(e.target.left + e.target.width > main.offset.left + main.innerCanvas.width) {
          e.target.width = main.innerCanvas.width - main.canvas.getActiveObject().left + main.offset.left;
        }

        if(e.target.top + e.target.height > main.innerCanvas.height + main.offset.top) {
          e.target.top = main.innerCanvas.height + main.offset.top - e.target.height;
        }
      }

      text.closeToolbar();
    });

    canvas.on('object:moving', e => {
      if(e.target !== null && canvas.getActiveObject() && canvas.getActiveObject().get('type') === 'image') {
        const activeObject = main.canvas.getActiveObject();

        if(activeObject.left - main.offset.left < 7 && activeObject.left > main.offset.left) {
          activeObject.left = main.offset.left;
        }
        if(activeObject.top - main.offset.top < 7 && activeObject.top > main.offset.top) {
          activeObject.top = main.offset.top;
        }
        if(main.offset.left + main.innerCanvas.width - activeObject.width * activeObject.scaleX - activeObject.left < 7 && activeObject.left < main.offset.left + main.innerCanvas.width - activeObject.width * activeObject.scaleX) {
          activeObject.left = main.offset.left + main.innerCanvas.width - activeObject.width * activeObject.scaleX;
        }
        if(main.offset.top + main.innerCanvas.height - activeObject.height * activeObject.scaleY - activeObject.top < 7 && activeObject.top < main.offset.top + main.innerCanvas.height - activeObject.height * activeObject.scaleY) {
          activeObject.top = main.offset.top + main.innerCanvas.height - activeObject.height * activeObject.scaleY;
        }
      }

      if(e.target !== null && canvas.getActiveObject() && canvas.getActiveObject().get('type') === 'textbox') {
        const activeObject = main.canvas.getActiveObject();

        if(activeObject.left - main.offset.left < 7) {
          activeObject.left = main.offset.left;
        }
        if(activeObject.top - main.offset.top < 7) {
          activeObject.top = main.offset.top;
        }
        if(main.offset.left + main.innerCanvas.width - activeObject.width * activeObject.scaleX - activeObject.left < 7) {
          activeObject.left = main.offset.left + main.innerCanvas.width - activeObject.width * activeObject.scaleX;
        }
        if(main.offset.top + main.innerCanvas.height - activeObject.height * activeObject.scaleY - activeObject.top < 7) {
          activeObject.top = main.offset.top + main.innerCanvas.height - activeObject.height * activeObject.scaleY;
        }

        text.closeToolbar();

        text.updateLeftAligment(e.target);
        text.updateCenterAligment(e.target);
        text.updateRightAligment(e.target);
        text.updateHorizontalAligment(e.target);

        const texts = main.canvas.getObjects().filter(object => object.type === 'textbox');
        let snaped = null;
        let target = e.target.alignment;
        const center = {
          left: main.offset.left + main.innerCanvas.width / 2,
          top: main.offset.top + main.innerCanvas.height / 2
        };

        let offset = 0;
        switch(e.target.textAlign) {
          case 'left':
            offset = Math.max.apply(null, e.target.__lineWidths) / 2;
            break;
          case 'center':
            offset = e.target.width / 2;
            break;
          case 'right':
            offset = (e.target.left + e.target.width) - (e.target.left + Math.max.apply(null, e.target.__lineWidths)) + Math.max.apply(null, e.target.__lineWidths) / 2;
            break;
          default:
            break;
        }
        if(Math.abs(e.target.left + offset - center.left) > 0 && Math.abs(e.target.left + offset - center.left) < 5) {
          e.target.left = center.left - offset;
          drawVerticalCenterAlignment();
          return;
        } else {
          clearAllAlignment();
        }

        if(Math.abs((e.target.top + e.target.height / 2) - center.top) > 0 && Math.abs((e.target.top + e.target.height / 2) - center.top) < 5) {
          e.target.top = (center.top - e.target.height / 2) - 1;
          drawHorizontalCenterAlignment();
          return;
        } else {
          clearAllAlignment();
        }

        for(let i in texts) {
          snaped = texts[i];
          if(Math.abs(target.left - snaped.alignment.left) > 0 && Math.abs(target.left - snaped.alignment.left) < 5) {
            e.target.left = snaped.alignment.left - target.offsetLeft - 1;

            text.updateLeftAligment(snaped);
            drawLeftAlignment(snaped);
            return;
          } else {
            clearAllAlignment();
            continue;
          }
        }

        for(let i in texts) {
          snaped = texts[i];

          let snapedCenter = snaped.alignment.left + (snaped.alignment.right - snaped.alignment.left) / 2;
          let targetCenter = target.left + (target.right - target.left) / 2;

          let offset = 0;
          switch(e.target.textAlign) {
            case 'left':
              offset = Math.max.apply(null, e.target.__lineWidths) / 2;
              break;
            case 'center':
              offset = e.target.width / 2;
              break;
            case 'right':
              offset = (e.target.left + e.target.width) - (e.target.left + Math.max.apply(null, e.target.__lineWidths)) + Math.max.apply(null, e.target.__lineWidths) / 2;
              break;
            default:
              break;
          }
          if(Math.abs(snapedCenter - targetCenter) > 0 && Math.abs(snapedCenter - targetCenter) < 5) {
            e.target.left = snapedCenter - offset

            text.updateCenterAligment(snaped);
            drawCenterAlignment(e.target, snapedCenter);
            return;
          } else {
            clearAllAlignment();
            continue;
          }
        }

        for(let i in texts) {
          snaped = texts[i];

          if(Math.abs(target.right - snaped.alignment.right) > 0 && Math.abs(target.right - snaped.alignment.right) < 5) {
            e.target.left = snaped.alignment.right - target.offsetRight - 1;

            text.updateRightAligment(snaped);
            drawRightAlignment(snaped);
            return;
          } else {
            clearAllAlignment();
            continue;
          }
        }

        for(let i in text.objectTops) {
          if(Math.abs(e.target.top + e.target.__lineHeights[0] - text.objectTops[i]) > 0 && Math.abs(e.target.top + e.target.__lineHeights[0] - text.objectTops[i]) < 5) {
            e.target.top = text.objectTops[i] - e.target.__lineHeights[0];

            text.updateHorizontalAligment(e.target);
            drawHorizontalAlignment(text.objectTops[i]);
            return;
          } else {
            clearAllAlignment();
            continue;
          }
        }
      }
    });

    background.add(null, () => {
      main.drawInnerArea();
    });

    text.addAll();

    // enable or disable any functionality adding or removing one of following methods
    controll
      .blurAll()
      .upload()
      .remove()
      .save()
      .reset()
      .preview()
      .download()
      .preview()
      .size()
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
      .addFontTemplate();
});
