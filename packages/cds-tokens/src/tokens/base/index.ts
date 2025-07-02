// Import all token modules
import borders from './border';
import breakpoints from './breakpoints';
import colors from './color';
import opacity from './opacity';
import shadow from './shadow';
import size from './size';
import space from './space';
import transition from './transition';
import typography from './typography';
import zIndex from './zIndex';

// Export individual tokens
export { borders, breakpoints, colors, opacity, shadow, size, space, transition, typography, zIndex };

// Export default object containing all tokens
const tokens = {
  borders,
  breakpoints,
  colors,
  opacity,
  shadow,
  size,
  space,
  transition,
  typography,
  zIndex,
};

export default tokens;
