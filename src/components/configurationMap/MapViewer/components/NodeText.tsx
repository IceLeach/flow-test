import { CustomComponent } from './types';

type NodeTextConfig = {
  label: string;
  fontSize: number;
  color: string;
  bold: boolean;
  italic: boolean;
  underline: boolean;
};

const NodeText: CustomComponent<NodeTextConfig> = (props) => {
  const { node } = props;
  const { config } = node.getData();
  const { label, fontSize, color, bold, italic, underline } = config;

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: fontSize ?? 14,
        color: color ?? '#fff',
        fontWeight: bold ? 'bold' : 'normal',
        fontStyle: italic ? 'italic' : 'normal',
        textDecoration: underline ? 'underline' : 'none',
      }}
    >
      {label}
    </div>
  );
}

export default NodeText;
