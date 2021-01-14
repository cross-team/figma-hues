figma.showUI(__html__, {
    height: 200,
    width: 200,
});

figma.loadFontAsync({family: 'Roboto', style: 'Regular'});

figma.ui.postMessage(figma.currentPage.selection);

figma.on('selectionchange', () => {
    let paintNodes = figma.currentPage.selection.map(node => {
        if (node.type !== 'SLICE' && node.type !== 'GROUP') {
            return node.fills;
        }
    });
    figma.ui.postMessage(paintNodes);
});

figma.ui.onmessage = msg => {
    switch (msg.type) {
        case 'apply':
            figma.currentPage.selection.forEach(node => {
                if (node.type !== 'SLICE' && node.type !== 'GROUP') {
                    if (typeof node.fills === 'object') {
                        let oldFills = clone(node.fills);
                        let newFills = [];
                        oldFills.forEach(paint => {
                            if (paint.type === 'SOLID') {
                                paint.color = applyHue(paint.color.r, paint.color.g, paint.color.b, msg.hue);
                                newFills.push(paint);
                            } else if (paint.type.startsWith('GRADIENT')) {
                                let newStops = paint.gradientStops.map(stop => {
                                    let newColor = applyHue(stop.color.r, stop.color.g, stop.color.b, msg.hue);
                                    stop.color = {
                                        r: newColor.r,
                                        g: newColor.g,
                                        b: newColor.b,
                                        a: stop.color.a,
                                    };
                                    return stop;
                                });
                                paint.gradientStops = newStops;
                                newFills.push(paint);
                            } else {
                                newFills.push(paint);
                            }
                        });
                        node.fills = newFills;
                    }
                }
            });
            break;
        default:
            break;
    }

    // figma.closePlugin();
    // Uncomment the line above if you want the plugin to close after running a single message call
};

function applyHue(r, g, b, hue) {
    let hsl = rgbToHsl(r, g, b);
    let color = hslToRgb(hue / 360, hsl.s, hsl.l);
    return color;
}

/**
 * Converts an RGB color value to HSL. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes r, g, and b are contained in the set [0, 1] and
 * returns h, s, and l in the set [0, 1].
 *
 * @param   Number  r       The red color value
 * @param   Number  g       The green color value
 * @param   Number  b       The blue color value
 * @return  Array           The HSL representation
 */
function rgbToHsl(r, g, b) {
    var max = Math.max(r, g, b),
        min = Math.min(r, g, b);
    var h,
        s,
        l = (max + min) / 2;

    if (max == min) {
        h = s = 0; // achromatic
    } else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }

        h /= 6;
    }

    return {h, s, l};
}

/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 1].
 *
 * @param   Number  h       The hue
 * @param   Number  s       The saturation
 * @param   Number  l       The lightness
 * @return  Array           The RGB representation
 */
function hslToRgb(h, s, l) {
    var r, g, b;

    if (s == 0) {
        r = g = b = l; // achromatic
    } else {
        function hue2rgb(p, q, t) {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;

        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }

    return {r, g, b};
}

function clone(val) {
    return JSON.parse(JSON.stringify(val));
}
