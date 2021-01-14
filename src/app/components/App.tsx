import * as React from 'react';
import {Button, Input, Label, Text} from 'react-figma-plugin-ds';
import {HuePicker} from 'react-color';
import '../styles/ui.css';
import 'react-figma-plugin-ds/figma-plugin-ds.css';

declare function require(path: string): any;

const App = ({}) => {
    var [hue, setHue] = React.useState(0);

    onmessage = event => {
        // console.log(event.data.pluginMessage);
    };

    function handleSlider(color, event) {
        console.log(color, event);
        let button = document.querySelector('button');
        button.style.cssText = `background-color: hsl(${color.hsl.h}, 100%, 50%); color: ${getCorrectTextColor(
            HSLToHex(color.hsl.h, 100, 50)
        )};`;

        let input = document.querySelector('input');
        input.value = `${Math.round(color.hsl.h)}`;
        setHue(Math.round(color.hsl.h));
    }

    return (
        <div id="root">
            <div>
                <Label className="" size="" weight="">
                    Hue
                </Label>
                <Input
                    type="number"
                    name="hue"
                    id="hue"
                    defaultValue={0}
                    onChange={e => {
                        let newHue = e;
                        if (e > 360) {
                            newHue = e % 360;
                        } else if (e < 0) {
                            newHue = (e % 360) + 360;
                        }
                        setHue(+newHue);
                        let button = document.querySelector('button');
                        button.style.cssText = `background-color: hsl(${e}, 100%, 50%); color: ${getCorrectTextColor(
                            HSLToHex(newHue, 100, 50)
                        )};`;
                    }}
                />
            </div>

            <HuePicker color={{h: hue, s: 1, l: 0.5}} onChange={handleSlider} />

            <Button
                onClick={() => {
                    parent.postMessage({pluginMessage: {type: 'apply', hue}}, '*');
                }}
            >
                Apply Hue
            </Button>
        </div>
    );
};

export default App;

function getCorrectTextColor(hex) {
    /*
    From this W3C document: http://www.webmasterworld.com/r.cgi?f=88&d=9769&url=http://www.w3.org/TR/AERT#color-contrast
    
    Color brightness is determined by the following formula: 
    ((Red value X 299) + (Green value X 587) + (Blue value X 114)) / 1000

I know this could be more compact, but I think this is easier to read/explain.
    
    */

    let threshold = 130; /* about half of 256. Lower threshold equals more dark text on dark background  */

    let hRed = hexToR(hex);
    let hGreen = hexToG(hex);
    let hBlue = hexToB(hex);

    function hexToR(h) {
        return parseInt(cutHex(h).substring(0, 2), 16);
    }
    function hexToG(h) {
        return parseInt(cutHex(h).substring(2, 4), 16);
    }
    function hexToB(h) {
        return parseInt(cutHex(h).substring(4, 6), 16);
    }
    function cutHex(h) {
        return h.charAt(0) == '#' ? h.substring(1, 7) : h;
    }

    let cBrightness = (hRed * 299 + hGreen * 587 + hBlue * 114) / 1000;
    if (cBrightness > threshold) {
        return '#000000';
    } else {
        return '#ffffff';
    }
}

function HSLToHex(h, s, l) {
    s /= 100;
    l /= 100;

    let c = (1 - Math.abs(2 * l - 1)) * s,
        x = c * (1 - Math.abs(((h / 60) % 2) - 1)),
        m = l - c / 2,
        r: any = 0,
        g: any = 0,
        b: any = 0;

    if (0 <= h && h < 60) {
        r = c;
        g = x;
        b = 0;
    } else if (60 <= h && h < 120) {
        r = x;
        g = c;
        b = 0;
    } else if (120 <= h && h < 180) {
        r = 0;
        g = c;
        b = x;
    } else if (180 <= h && h < 240) {
        r = 0;
        g = x;
        b = c;
    } else if (240 <= h && h < 300) {
        r = x;
        g = 0;
        b = c;
    } else if (300 <= h && h < 360) {
        r = c;
        g = 0;
        b = x;
    }
    // Having obtained RGB, convert channels to hex
    r = Math.round((r + m) * 255).toString(16);
    g = Math.round((g + m) * 255).toString(16);
    b = Math.round((b + m) * 255).toString(16);

    // Prepend 0s, if necessary
    if (r.length == 1) r = '0' + r;
    if (g.length == 1) g = '0' + g;
    if (b.length == 1) b = '0' + b;

    return '#' + r + g + b;
}
