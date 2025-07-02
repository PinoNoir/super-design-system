const zIndex = {
  'z-index': {
    toast: {
      value: '9000',
      category: 'z-index',
      comment: 'Highest level - for notifications and alerts',
    },
    modal: {
      value: '8000',
      category: 'z-index',
      comment: 'High level - for modal dialogs and overlays',
    },
    mask: {
      value: '6000',
      category: 'z-index',
      comment: 'Modal backdrop level',
    },
    navbar: {
      value: '6000',
      category: 'z-index',
      comment: 'Main nav element',
    },
    popover: {
      value: '5000',
      category: 'z-index',
      comment: 'Tooltips, popovers, and dropdowns',
    },
    menu: {
      value: '2000',
      category: 'z-index',
      comment: 'Dropdown menus and context menus',
    },
    header: {
      value: '1000',
      category: 'z-index',
      comment: 'Fixed headers and toolbars',
    },
    'data-grid': {
      value: '999',
      category: 'z-index',
      comment: 'Data grid headers and frozen columns',
    },
    content: {
      value: '0',
      category: 'z-index',
      comment: 'Base content level',
    },
    negative: {
      value: '-1',
      category: 'z-index',
      comment: 'Elements that should appear behind base content',
    },
  },
};

export default zIndex;
