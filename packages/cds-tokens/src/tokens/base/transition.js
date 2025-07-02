export const transition = {
  transition: {
    time: {
      default: {
        value: 'all 300ms cubic-bezier(0.420, 0.000, 0.580, 1.000)',
        comment: 'Default easing for general transitions',
      },
      fast: {
        value: 'all 150ms cubic-bezier(0.420, 0.000, 0.580, 1.000)',
        comment: 'Quick transitions for subtle interactions',
      },
      slow: {
        value: 'all 450ms cubic-bezier(0.420, 0.000, 0.580, 1.000)',
        comment: 'Slower transitions for emphasis',
      },
    },
    property: {
      transform: {
        value: 'transform 300ms cubic-bezier(0.420, 0.000, 0.580, 1.000)',
        comment: 'Specific to transform animations',
      },
      opacity: {
        value: 'opacity 200ms ease-in-out',
        comment: 'Smooth fade transitions',
      },
      color: {
        value: 'color 200ms ease-in-out',
        comment: 'Color changes like hover states',
      },
      background: {
        value: 'background-color 200ms ease-in-out',
        comment: 'Background color transitions',
      },
      shadow: {
        value: 'box-shadow 200ms ease-in-out',
        comment: 'Shadow transitions for depth changes',
      },
      border: {
        value: 'border-color 200ms ease-in-out',
        comment: 'Border color transitions',
      },
    },
    easing: {
      easeInOut: {
        value: 'cubic-bezier(0.420, 0.000, 0.580, 1.000)',
        comment: 'Smooth acceleration and deceleration',
      },
      easeOut: {
        value: 'cubic-bezier(0.000, 0.000, 0.580, 1.000)',
        comment: 'Gentle deceleration',
      },
      easeIn: {
        value: 'cubic-bezier(0.420, 0.000, 1.000, 1.000)',
        comment: 'Gentle acceleration',
      },
      sharp: {
        value: 'cubic-bezier(0.420, 0.000, 0.580, 0.000)',
        comment: 'Quick, snappy transitions',
      },
      bounce: {
        value: 'cubic-bezier(0.680, -0.550, 0.265, 1.550)',
        comment: 'Bouncy, playful transitions',
      },
    },
    composite: {
      buttonHover: {
        value: 'background-color 200ms ease-in-out, color 200ms ease-in-out, transform 150ms ease-out',
        comment: 'Combined transition for button hover states',
      },
      cardHover: {
        value: 'transform 200ms ease-out, box-shadow 200ms ease-out',
        comment: 'Combined transition for card hover effects',
      },
      modalEnter: {
        value: 'opacity 300ms ease-out, transform 300ms cubic-bezier(0.000, 0.000, 0.580, 1.000)',
        comment: 'Smooth modal entrance animation',
      },
      modalExit: {
        value: 'opacity 200ms ease-in, transform 200ms cubic-bezier(0.420, 0.000, 1.000, 1.000)',
        comment: 'Quick modal exit animation',
      },
    },
  },
};

export default transition;
