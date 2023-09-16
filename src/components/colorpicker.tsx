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
  title?: string,
  initialColor: string
}) => {
  let [display, setDisplay] = useState<boolean>();
  let { onUpdate, initialColor } = props;
  let updatedColor = {
    ...ROOT_STYLE.color,
    background: `#${initialColor}`
  };

  let styles = { ...ROOT_STYLE, color: updatedColor };

  return (
    <div>
      <div>
        {props.title &&
          <span style={{
            fontFamily: 'Roboto, sans-serif',
            fontSize: '12px',
            lineHeight: '16px',
            pointerEvents: 'none'
          }}>
            {props.title}
          </span>}
      </div>
      <div style={styles.swatch} onClick={() => setDisplay(!display)}>
        <div style={styles.color} /></div>
      {display ?
        <div style={styles.popover}>
          <div style={styles.cover} onClick={() => setDisplay(false)} />
          <SketchPicker
            color={initialColor}
            disableAlpha={true}
            onChangeComplete={(c: any) => {
              let colorStr = c.hex.substring(1);
              onUpdate(colorStr);
            }}
          />
        </div> :
        null
      }
    </div>);
}

export default ColorPicker;