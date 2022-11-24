const SmallLabel = (props: { text: string }) => (
    <div>
        <span style={{
            fontFamily: 'Roboto, sans-serif',
            fontSize: '12px',
            lineHeight: '16px',
            pointerEvents: 'none',
            color: 'rgba(0, 0, 0, 0.3)'
        }}>
            {props.text}
        </span>
    </div>
);

export default SmallLabel;