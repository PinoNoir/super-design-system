const globals = {
  color: {
    transparent: {
      value: 'transparent',
      category: 'color',
    },
    white: {
      value: '#FFF',
      category: 'color',
    },
    lightGray: {
      value: '#F3F5FB',
      category: 'color',
    },
    black: {
      value: '#000',
      category: 'color',
    },
    orange: {
      value: '#FD7250',
      category: 'color',
      comment: "Stretto's secondary brand accent color used in the logo and customer facing websites",
    },
    slate: {
      value: '#26353b',
      category: 'color',
      comment: "Stretto's primary brand color used in the logo and customer facing websites",
    },
    neutral: {
      120: {
        value: '#1c272b',
        category: 'color',
      },
      110: {
        value: '#212e35',
        category: 'color',
        comment: "Stretto's primary brand color used in the logo and customer facing websites",
      },
      100: {
        value: '#26353b',
        category: 'color',
        comment: "Stretto's primary brand color used in the logo and customer facing websites",
      },
      90: {
        value: '#3b494f',
        category: 'color',
      },
      80: {
        value: '#515d63',
        category: 'color',
      },
      70: {
        value: '#667177',
        category: 'color',
      },
      60: {
        value: '#7b858b',
        category: 'color',
      },
      50: {
        value: '#91999e',
        category: 'color',
      },
      40: {
        value: '#a6adb2',
        category: 'color',
      },
      30: {
        value: '#bbc1c6',
        category: 'color',
      },
      20: {
        value: '#d1d5da',
        category: 'color',
      },
      10: {
        value: '#e6e9ee',
        category: 'color',
      },
      5: {
        value: '#f0f3f8',
        category: 'color',
      },
    },
    teal: {
      100: {
        value: '#014e4c',
        category: 'color',
      },
      90: {
        value: '#015d5b',
        category: 'color',
      },
      80: {
        value: '#016d6a',
        category: 'color',
      },
      70: {
        value: '#027c79',
        category: 'color',
      },
      60: {
        value: '#028c88',
        category: 'color',
        comment: 'BCC Celeste - primary color used for buttons, sidenav links and icons.',
      },
      50: {
        value: '#029b97',
        category: 'color',
      },
      40: {
        value: '#4eb9b6',
        category: 'color',
      },
      30: {
        value: '#67c3c1',
        category: 'color',
      },
      20: {
        value: '#b3e1e0',
        category: 'color',
      },
      10: {
        value: '#e6f5f5',
        category: 'color',
      },
    },
    cyan: {
      100: {
        value: '#003a4c',
        category: 'color',
      },
      90: {
        value: '#004154',
        category: 'color',
      },
      80: {
        value: '#00627f',
        category: 'color',
      },
      70: {
        value: '#0082a9',
        category: 'color',
      },
      60: {
        value: '#0093be',
        category: 'color',
      },
      50: {
        value: '#00a3d3',
        category: 'color',
      },
      40: {
        value: '#33b5dc',
        category: 'color',
      },
      30: {
        value: '#66c8e5',
        category: 'color',
      },
      20: {
        value: '#99daed',
        category: 'color',
      },
      10: {
        value: '#e6f6fb',
        category: 'color',
      },
    },
    purple: {
      100: {
        value: '#301533',
        category: 'color',
      },
      90: {
        value: '#3a193d',
        category: 'color',
      },
      80: {
        value: '#431d47',
        category: 'color',
      },
      70: {
        value: '#4d2152',
        category: 'color',
      },
      60: {
        value: '#56255c',
        category: 'color',
      },
      50: {
        value: '#602966',
        category: 'color',
        comment: 'BCC Wonka - accent color used on the top border color for CNC modals and help content',
      },
      40: {
        value: '#906994',
        category: 'color',
      },
      30: {
        value: '#a07fa3',
        category: 'color',
      },
      20: {
        value: '#cfbfd1',
        category: 'color',
      },
      10: {
        value: '#efeaf0',
        category: 'color',
      },
    },
    magenta: {
      100: {
        value: '#43092d',
        category: 'color',
      },
      90: {
        value: '#5a0c3c',
        category: 'color',
      },
      80: {
        value: '#700f4b',
        category: 'color',
      },
      70: {
        value: '#87125a',
        category: 'color',
      },
      60: {
        value: '#9d1569',
        category: 'color',
      },
      50: {
        value: '#b21876',
        category: 'color',
        comment: "BCC 80's Hair - accent color used for in app user guides and help content",
      },
      40: {
        value: '#dd54a8',
        category: 'color',
      },
      30: {
        value: '#e582bf',
        category: 'color',
      },
      20: {
        value: '#f5a9d8',
        category: 'color',
      },
      10: {
        value: '#f7d4ea',
        category: 'color',
      },
    },
    blue: {
      100: {
        value: '#153d5c',
        category: 'color',
      },
      90: {
        value: '#19496e',
        category: 'color',
      },
      80: {
        value: '#1d5580',
        category: 'color',
      },
      70: {
        value: '#226292',
        category: 'color',
      },
      60: {
        value: '#266ea5',
        category: 'color',
      },
      50: {
        value: '#2a7ab7',
        category: 'color',
        comment: 'BCC Skydiver - accent color used for tertiary buttons and text links',
      },
      40: {
        value: '#6aa2cd',
        category: 'color',
      },
      30: {
        value: '#7fafd4',
        category: 'color',
      },
      20: {
        value: '#bfd7e9',
        category: 'color',
      },
      10: {
        value: '#eaf2f8',
        category: 'color',
        comment: 'Background color used for info alert components.',
      },
    },
    green: {
      100: {
        value: '#083a1c',
        category: 'color',
      },
      90: {
        value: '#0a4c25',
        category: 'color',
      },
      80: {
        value: '#0d5e2d',
        category: 'color',
      },
      70: {
        value: '#11793a',
        category: 'color',
      },
      60: {
        value: '#128741',
        category: 'color',
      },
      50: {
        value: '#16a550',
        category: 'color',
        comment: 'BCC Success - accent color used for success states and messaging',
      },
      40: {
        value: '#45c97a',
        category: 'color',
      },
      30: {
        value: '#88ddaa',
        category: 'color',
      },
      20: {
        value: '#b0e8c6',
        category: 'color',
      },
      10: {
        value: '#d7f4e3',
        category: 'color',
        comment: 'Background color used for success alert components.',
      },
    },
    yellow: {
      100: {
        value: '#765510',
        category: 'color',
        comment: 'BCC Warning - accent color used for warning message text',
      },
      90: {
        value: '#8d6613',
        category: 'color',
      },
      80: {
        value: '#a57716',
        category: 'color',
      },
      70: {
        value: '#bc881a',
        category: 'color',
      },
      60: {
        value: '#d4991d',
        category: 'color',
      },
      50: {
        value: '#ebaa20',
        category: 'color',
        comment: 'BCC Notifications - accent color used for pill/badge notifications',
      },
      40: {
        value: '#f1c463',
        category: 'color',
      },
      30: {
        value: '#f3cc79',
        category: 'color',
      },
      20: {
        value: '#f9e6bc',
        category: 'color',
      },
      10: {
        value: '#fdf7e9',
        category: 'color',
        comment: 'Background color used for warning alert components.',
      },
    },
    red: {
      100: {
        value: '#71121d',
        category: 'color',
      },
      90: {
        value: '#871522',
        category: 'color',
      },
      80: {
        value: '#9e1928',
        category: 'color',
      },
      70: {
        value: '#b41c2e',
        category: 'color',
      },
      60: {
        value: '#cb2033',
        category: 'color',
      },
      50: {
        value: '#e12339',
        category: 'color',
        comment: 'BCC Error - accent color used for error buttons and error messaging',
      },
      40: {
        value: '#ea6574',
        category: 'color',
      },
      30: {
        value: '#ed7b88',
        category: 'color',
      },
      20: {
        value: '#f6bdc4',
        category: 'color',
      },
      10: {
        value: '#fce9eb',
        category: 'color',
        comment: 'Background color used for error alert components.',
      },
    },
    overlay: {
      90: {
        value: 'hsla(0, 0%, 0%, 0.9)',
        category: 'color',
      },
      80: {
        value: 'hsla(0, 0%, 0%, 0.8)',
        category: 'color',
      },
      70: {
        value: 'hsla(0, 0%, 0%, 0.7)',
        category: 'color',
      },
      60: {
        value: 'hsla(0, 0%, 0%, 0.6)',
        category: 'color',
      },
      50: {
        value: 'hsla(0, 0%, 0%, 0.5)',
        category: 'color',
      },
      40: {
        value: 'hsla(0, 0%, 0%, 0.4)',
        category: 'color',
      },
      30: {
        value: 'hsla(0, 0%, 0%, 0.3)',
        category: 'color',
      },
      20: {
        value: 'hsla(0, 0%, 0%, 0.2)',
        category: 'color',
      },
      10: {
        value: 'hsla(0, 0%, 0%, 0.1)',
        category: 'color',
      },
    },
  },
};

export default globals;
