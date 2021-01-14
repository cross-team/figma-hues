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
        button.style.cssText = `background-color: hsl(${color.hsl.h}, 100%, 50%)`;

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
                        button.style.cssText = `background-color: hsl(${e}, 100%, 50%)`;
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
