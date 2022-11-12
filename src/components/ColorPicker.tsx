import * as React from 'react';
import { SketchPicker, SketchPickerProps, Color } from 'react-color';

export interface ColorPickerProps { onUpdate: (hexColor: string) => void, initialColor: string }
export interface ColorPickerState { displayColorPicker: boolean }

// 'HelloProps' describes the shape of props.
// State is never set so we use the 'undefined' type.
export class ColorPicker extends React.Component<ColorPickerProps, ColorPickerState> {

    constructor(props : ColorPickerProps){
        super(props);
        // set initial state
        this.state = {
            displayColorPicker: false
        };
    }

    handleClick = () => {
        this.setState({ displayColorPicker: !this.state.displayColorPicker })
    };
    
    handleClose = () => {
        this.setState({ displayColorPicker: false })
    };

    render() {
        //const color = 

        const styles = {
              color: {
                width: '36px',
                height: '14px',
                borderRadius: '2px',
                background: `#${this.props.initialColor}`,
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

        const onChange = (c) => {
            this.props.onUpdate(c.hex.substring(1));
        }

        return (
        <div>
            <div style={ styles.swatch } onClick={ this.handleClick }>
            <div style={ styles.color } />
            </div>
            { this.state.displayColorPicker ? 
                <div style={ styles.popover }>
                    <div style={ styles.cover } onClick={ this.handleClose }/>
                    <SketchPicker color={styles.color.background} disableAlpha={true} onChangeComplete = { onChange } />
                </div> : 
                null 
            }
        </div>);
    }
}