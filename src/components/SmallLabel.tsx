import * as React from 'react';


export interface SmallLabelProps { 
    Text: string
}


// defines a calendar event
export class SmallLabel extends React.Component<SmallLabelProps, undefined> {
    render() {
        return (
            <div>
                <span style={{
                    fontFamily: 'Roboto, sans-serif',
                    fontSize: '12px',
                    lineHeight: '16px',
                    pointerEvents: 'none',
                    color: 'rgba(0, 0, 0, 0.3)'
                }}>
                    {this.props.Text}
                </span>
            </div>
        );
    }
}