import { View } from 'react-native';

// ‹ or › drawn from a rotated corner, so it sits exactly in the middle (text arrows sit low in most fonts).
export default function Chevron({ direction = 'left', color, size = 12, thickness = 3 }) {
  const shift = size * 0.2; // the arrow's tip pulls the shape off-centre; nudge it back
  return (
    <View
      style={{
        width: size,
        height: size,
        borderLeftWidth: thickness,
        borderBottomWidth: thickness,
        borderColor: color,
        transform: [{ translateX: direction === 'left' ? shift : -shift }, { rotate: direction === 'left' ? '45deg' : '-135deg' }],
      }}
    />
  );
}
