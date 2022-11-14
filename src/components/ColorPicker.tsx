import * as React from 'react';
import { useState } from 'react';
import { SketchPicker } from 'react-color';


const ROOT_STYLE = {
    color: {
      width: '36px',
      height: '14px',
      borderRadius: '2px'
    },
    swatch: {
      padding: '5px',
      background: '#fff',
      borderRadius: '1px',
      boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
      display: 'inline-block',
      cursor: 'pointer',
    },
    popover: {
      position: 'absolute' as 'absolute',
      zIndex: 2,
    },
    cover: {
      position: 'fixed' as 'fixed',
      top: '0px',
      right: '0px',
      bottom: '0px',
      left: '0px',
    }
};

// 'HelloProps' describes the shape of props.
// State is never set so we use the 'undefined' type.
const ColorPicker = (props: {
    onUpdate: (hexColor: string) => void,
    initialColor: string 
}) => {
    let [display, setDisplay] = useState<boolean>();
    let [color, setColor] = useState<string>(props.initialColor);

    let updatedColor = {
        ...ROOT_STYLE.color,
        background: `#${color}`
    };

    let styles = { ...ROOT_STYLE, updatedColor };

    return (
        <div>
            <div style={ styles.swatch } onClick={ () => setDisplay(!display) }>
            <div style={ styles.color } />
            </div>
            { display ? 
                <div style={ styles.popover }>
                    <div style={ styles.cover } onClick={ () => setDisplay(false) }/>
                    <SketchPicker 
                        color={(styles as any).color.background} 
                        disableAlpha={true} 
                        onChangeComplete = { (c: any) => setColor(c.hex.substring(1)) } 
                    />
                </div> : 
                null 
            }
        </div>);
}

export default ColorPicker;