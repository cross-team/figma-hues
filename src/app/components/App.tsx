import * as React from 'react';
import {Button, Input, Label, Text} from 'react-figma-plugin-ds';
import '../styles/ui.css';
import 'react-figma-plugin-ds/figma-plugin-ds.css';

declare function require(path: string): any;

const App = ({}) => {
    var [hue, setHue] = React.useState();

    onmessage = event => {
        // console.log(event.data.pluginMessage);
    };

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
                    onChange={e => {
                        let newHue = e;
                        if (e > 360) {
                            newHue = e % 360;
                        } else if (e < 0) {
                            newHue = (e % 360) + 360;
                        }
                        console.log(newHue);
                        setHue(newHue);
                        let button = document.querySelector('button');
                        button.style.cssText = `background-color: hsl(${e}, 100%, 50%)`;
                    }}
                />
            </div>
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
