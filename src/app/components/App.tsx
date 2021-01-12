import * as React from 'react';
import {Button, Input, Label, Text} from 'react-figma-plugin-ds';
import '../styles/ui.css';
import 'react-figma-plugin-ds/figma-plugin-ds.css';

declare function require(path: string): any;

const App = ({}) => {
    var [hue, setHue] = React.useState('');
    var [current, setCurrent] = React.useState('None');

    onmessage = event => {
        console.log(event.data.pluginMessage);
    };

    // call launchControllerFunctions('message1') to launch the message1 command in src/plugin/controller.ts
    function launchControllerFunctions(messageType) {
        parent.postMessage({pluginMessage: {type: messageType}}, '*');
    }

    return (
        <div id="root">
            <Text>Currently Selected Hue: {current}</Text>
            <div>
                <Label className="" size="" weight="">
                    Hue
                </Label>
                <Input
                    type="number"
                    name="hue"
                    id="hue"
                    onChange={e => {
                        setHue(e);
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
