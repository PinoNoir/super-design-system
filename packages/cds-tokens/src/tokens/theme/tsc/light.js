const colorAliases = {
  white: '{color.white.value}',
  neutral5: '{color.neutral.5.value}',
  neutral10: '{color.neutral.10.value}',
  neutral20: '{color.neutral.20.value}',
  neutral30: '{color.neutral.30.value}',
  neutral40: '{color.neutral.40.value}',
  neutral50: '{color.neutral.50.value}',
  neutral60: '{color.neutral.60.value}',
  neutral70: '{color.neutral.70.value}',
  neutral80: '{color.neutral.80.value}',
  neutral90: '{color.neutral.90.value}',
  neutral100: '{color.neutral.100.value}',
  neutral120: '{color.neutral.120.value}',
  primary: '{color.cyan.70.value}',
  secondary: '{color.neutral.40.value}',
  tertiary: '{color.blue.50.value}',
  accent: '{color.purple.50.value}',
  disabled: '{color.neutral.30.value}',
  help: '{color.magenta.50.value}',
  info: '{color.blue.50.value}',
  success: '{color.green.50.value}',
  warning: '{color.yellow.70.value}',
  error: '{color.red.60.value}',
  base: '{color.neutral.100.value}',
  inverted: '{color.white.value}',
  background: '{color.neutral.5.value}',
  foreground: '{color.white.value}',
  component: '{color.white.value}',
};

const createColorSet = (colors) =>
  Object.entries(colors).reduce((acc, [key, value]) => {
    acc[key] = { value, type: 'color' };
    return acc;
  }, {});

const colors = {
  theme: {
    color: createColorSet(colorAliases),
    background: createColorSet({
      base: colorAliases.background,
      inverted: colorAliases.inverted,
      component: colorAliases.component,
      help: colorAliases.help,
      accent: colorAliases.accent,
      disabled: colorAliases.disabled,
      info: colorAliases.info,
      success: colorAliases.success,
      warning: colorAliases.warning,
      error: colorAliases.error,
    }),
    border: createColorSet({
      base: colorAliases.neutral20,
      inverted: colorAliases.neutral80,
      info: colorAliases.info,
      success: colorAliases.success,
      warning: colorAliases.warning,
      error: colorAliases.error,
    }),
    icon: createColorSet({
      base: colorAliases.base,
      inverted: colorAliases.inverted,
      help: colorAliases.help,
      info: colorAliases.info,
      success: colorAliases.success,
      warning: colorAliases.warning,
      error: colorAliases.error,
      disabled: colorAliases.disabled,
    }),
    text: createColorSet({
      base: colorAliases.base,
      inverted: colorAliases.inverted,
      muted: colorAliases.neutral70,
      success: colorAliases.success,
      warning: colorAliases.warning,
      error: colorAliases.error,
      disabled: colorAliases.disabled,
    }),
    avatar: {
      background: { value: colorAliases.neutral20, type: 'color' },
      text: { value: colorAliases.neutral100, type: 'color' },
    },
    chip: {
      backgroundColor: { value: colorAliases.neutral20, type: 'color' },
      textColor: { value: colorAliases.base, type: 'color' },
      textWeight: { value: '{font.weight.medium}', type: 'font' },
      borderColor: { value: colorAliases.neutral40, type: 'color' },
      borderWidth: { value: '{border.width.1}', type: 'size' },
      borderRadius: { value: '{border.radius.round}', type: 'radii' },
      height: { value: '{size.24}', type: 'size' },
      variant: {
        base: {
          backgroundColor: { value: colorAliases.neutral10, type: 'color' },
          textColor: { value: colorAliases.base, type: 'color' },
          borderColor: { value: colorAliases.neutral40, type: 'color' },
          hover: {
            backgroundColor: { value: colorAliases.neutral20, type: 'color' },
            textColor: { value: colorAliases.base, type: 'color' },
            iconColor: { value: colorAliases.base, type: 'color' },
          },
          disabled: {
            backgroundColor: { value: colorAliases.neutral30, type: 'color' },
            textColor: { value: colorAliases.neutral50, type: 'color' },
            borderColor: { value: colorAliases.neutral30, type: 'color' },
          },
          active: {
            backgroundColor: { value: colorAliases.neutral40, type: 'color' },
            textColor: { value: colorAliases.base, type: 'color' },
            borderColor: { value: colorAliases.neutral40, type: 'color' },
            iconColor: { value: colorAliases.base, type: 'color' },
          },
        },
        primary: {
          backgroundColor: { value: '{color.cyan.70.value}', type: 'color' },
          textColor: { value: colorAliases.white, type: 'color' },
          borderColor: { value: '{color.cyan.70.value}', type: 'color' },
          hover: {
            backgroundColor: { value: '{color.cyan.90.value}', type: 'color' },
            textColor: { value: colorAliases.white, type: 'color' },
            iconColor: { value: colorAliases.white, type: 'color' },
          },
          disabled: {
            backgroundColor: { value: colorAliases.neutral30, type: 'color' },
            textColor: { value: colorAliases.neutral50, type: 'color' },
            borderColor: { value: colorAliases.neutral30, type: 'color' },
          },
          active: {
            backgroundColor: { value: '{color.cyan.70.value}', type: 'color' },
            textColor: { value: colorAliases.white, type: 'color' },
            borderColor: { value: '{color.cyan.70.value}', type: 'color' },
            iconColor: { value: colorAliases.white, type: 'color' },
          },
        },
        outline: {
          backgroundColor: { value: '{color.transparent.value}', type: 'color' },
          textColor: { value: '{color.cyan.70.value}', type: 'color' },
          borderColor: { value: colorAliases.primary, type: 'color' },
          iconColor: { value: '{color.cyan.70.value}', type: 'color' },
          hover: {
            backgroundColor: { value: '{color.cyan.90.value}', type: 'color' },
            textColor: { value: colorAliases.white, type: 'color' },
            iconColor: { value: colorAliases.white, type: 'color' },
          },
          disabled: {
            backgroundColor: { value: colorAliases.neutral30, type: 'color' },
            textColor: { value: colorAliases.neutral50, type: 'color' },
            borderColor: { value: colorAliases.neutral30, type: 'color' },
          },
          active: {
            backgroundColor: { value: '{color.cyan.70.value}', type: 'color' },
            textColor: { value: colorAliases.white, type: 'color' },
            borderColor: { value: '{color.cyan.70.value}', type: 'color' },
            iconColor: { value: colorAliases.white, type: 'color' },
          },
        },
      },
    },
    table: {
      header: {
        backgroundColor: { value: colorAliases.neutral100, type: 'color' },
        textColor: { value: colorAliases.white, type: 'color' },
      },
      row: {
        backgroundColor: { value: colorAliases.white, type: 'color' },
        textColor: { value: colorAliases.base, type: 'color' },
        hover: {
          backgroundColor: { value: '{color.cyan.20.value}', type: 'color' },
          textColor: { value: colorAliases.base, type: 'color' },
        },
        selected: {
          backgroundColor: { value: '{color.cyan.20.value}', type: 'color' },
          textColor: { value: '{color.cyan.80.value}', type: 'color' },
        },
        disabled: {
          textColor: { value: colorAliases.neutral30, type: 'color' },
        },
      },
    },
    dialog: {
      background: { value: colorAliases.white, type: 'color' },
      textColor: { value: colorAliases.base, type: 'color' },
      borderColor: { value: colorAliases.neutral20, type: 'color' },
      borderWidth: { value: '{border.width.0}', type: 'size' },
      borderRadius: { value: '{border.radius.4}', type: 'radii' },
      boxShadow: { value: '{shadow.bottom.24}', type: 'shadow' },
    },
    tooltip: {
      background: { value: colorAliases.base, type: 'color' },
      text: { value: colorAliases.inverted, type: 'color' },
    },
    navbar: {
      background: { value: colorAliases.white, type: 'color' },
      bottomBorder: { value: colorAliases.neutral20, type: 'color' },
      hoverBorder: { value: colorAliases.base, type: 'color' },
      text: { value: colorAliases.base, type: 'color' },
    },
    sidebar: {
      title: {
        textColor: { value: colorAliases.neutral80, type: 'color' },
      },
    },
    panel: {
      background: { value: colorAliases.white, type: 'color' },
      text: { value: colorAliases.base, type: 'color' },
      borderColor: { value: colorAliases.neutral20, type: 'color' },
      borderWidth: { value: '{border.width.0}', type: 'size' },
      topBorder: { value: colorAliases.base, type: 'color' },
      borderRadius: { value: '{border.radius.4}', type: 'radii' },
      boxShadow: { value: '{shadow.bottom.2}', type: 'shadow' },
    },
    card: {
      background: { value: colorAliases.white, type: 'color' },
      text: { value: colorAliases.base, type: 'color' },
      topBorder: { value: colorAliases.neutral100, type: 'color' },
      border: { value: colorAliases.neutral20, type: 'color' },
    },
    button: {
      // Base button properties
      fontWeight: { value: '500', type: 'font' },
      border: {
        width: { value: '1px', type: 'size' },
        radius: { value: '4px', type: 'radii' },
      },
      focus: {
        outline: {
          width: { value: '2px', type: 'size' },
          offset: { value: '2px', type: 'size' },
        },
      },
      filled: {
        primary: {
          text: { value: colorAliases.white, type: 'color' },
          icon: { value: colorAliases.white, type: 'color' },
          bg: { value: '{color.cyan.80.value}', type: 'color' },
          border: { value: colorAliases.primary, type: 'color' },
          hover: {
            text: { value: colorAliases.white, type: 'color' },
            icon: { value: colorAliases.white, type: 'color' },
            bg: { value: '{color.cyan.90.value}', type: 'color' },
          },
          focus: {
            outline: { value: '{color.cyan.20.value}', type: 'color' },
          },
        },
        secondary: {
          text: { value: colorAliases.neutral100, type: 'color' },
          icon: { value: colorAliases.neutral100, type: 'color' },
          bg: { value: colorAliases.neutral20, type: 'color' },
          border: { value: colorAliases.neutral50, type: 'color' },
          hover: {
            text: { value: colorAliases.neutral100, type: 'color' },
            icon: { value: colorAliases.neutral100, type: 'color' },
            bg: { value: colorAliases.neutral40, type: 'color' },
          },
          focus: {
            outline: { value: colorAliases.neutral20, type: 'color' },
          },
        },
        tertiary: {
          text: { value: colorAliases.white, type: 'color' },
          icon: { value: colorAliases.white, type: 'color' },
          bg: { value: colorAliases.tertiary, type: 'color' },
          border: { value: colorAliases.tertiary, type: 'color' },
          hover: {
            text: { value: colorAliases.white, type: 'color' },
            icon: { value: colorAliases.white, type: 'color' },
            bg: { value: '{color.blue.90.value}', type: 'color' },
          },
          focus: {
            outline: { value: '{color.blue.20.value}', type: 'color' },
          },
        },
        accent: {
          text: { value: colorAliases.white, type: 'color' },
          icon: { value: colorAliases.white, type: 'color' },
          bg: { value: colorAliases.accent, type: 'color' },
          border: { value: colorAliases.accent, type: 'color' },
          hover: {
            text: { value: colorAliases.white, type: 'color' },
            icon: { value: colorAliases.white, type: 'color' },
            bg: { value: '{color.magenta.90.value}', type: 'color' },
          },
          focus: {
            outline: { value: '{color.magenta.20.value}', type: 'color' },
          },
        },
        danger: {
          text: { value: colorAliases.white, type: 'color' },
          icon: { value: colorAliases.white, type: 'color' },
          bg: { value: colorAliases.error, type: 'color' },
          border: { value: colorAliases.error, type: 'color' },
          hover: {
            text: { value: colorAliases.white, type: 'color' },
            icon: { value: colorAliases.white, type: 'color' },
            bg: { value: '{color.red.90.value}', type: 'color' },
          },
          focus: {
            outline: { value: '{color.red.20.value}', type: 'color' },
          },
        },
      },
      outline: {
        primary: {
          text: { value: colorAliases.primary, type: 'color' },
          icon: { value: colorAliases.primary, type: 'color' },
          bg: { value: colorAliases.transparent, type: 'color' },
          border: { value: colorAliases.primary, type: 'color' },
          hover: {
            text: { value: colorAliases.white, type: 'color' },
            icon: { value: colorAliases.white, type: 'color' },
            bg: { value: '{color.cyan.90.value}', type: 'color' },
          },
          focus: {
            outline: { value: '{color.cyan.20.value}', type: 'color' },
          },
        },
        secondary: {
          text: { value: colorAliases.neutral100, type: 'color' },
          icon: { value: colorAliases.neutral100, type: 'color' },
          bg: { value: colorAliases.transparent, type: 'color' },
          border: { value: colorAliases.neutral50, type: 'color' },
          hover: {
            text: { value: colorAliases.neutral100, type: 'color' },
            icon: { value: colorAliases.neutral100, type: 'color' },
            bg: { value: colorAliases.neutral40, type: 'color' },
          },
          focus: {
            outline: { value: colorAliases.neutral20, type: 'color' },
          },
        },
        tertiary: {
          text: { value: colorAliases.tertiary, type: 'color' },
          icon: { value: colorAliases.tertiary, type: 'color' },
          bg: { value: colorAliases.transparent, type: 'color' },
          border: { value: colorAliases.tertiary, type: 'color' },
          hover: {
            text: { value: colorAliases.white, type: 'color' },
            icon: { value: colorAliases.white, type: 'color' },
            bg: { value: colorAliases.tertiary, type: 'color' },
          },
          focus: {
            outline: { value: '{color.blue.20.value}', type: 'color' },
          },
        },
        accent: {
          text: { value: colorAliases.accent, type: 'color' },
          icon: { value: colorAliases.accent, type: 'color' },
          bg: { value: colorAliases.transparent, type: 'color' },
          border: { value: colorAliases.accent, type: 'color' },
          hover: {
            text: { value: colorAliases.white, type: 'color' },
            icon: { value: colorAliases.white, type: 'color' },
            bg: { value: colorAliases.accent, type: 'color' },
          },
          focus: {
            outline: { value: '{color.magenta.20.value}', type: 'color' },
          },
        },
        danger: {
          text: { value: colorAliases.error, type: 'color' },
          icon: { value: colorAliases.error, type: 'color' },
          bg: { value: colorAliases.transparent, type: 'color' },
          border: { value: colorAliases.error, type: 'color' },
          hover: {
            text: { value: colorAliases.white, type: 'color' },
            icon: { value: colorAliases.white, type: 'color' },
            bg: { value: colorAliases.error, type: 'color' },
          },
          focus: {
            outline: { value: '{color.red.20.value}', type: 'color' },
          },
        },
      },
      none: {
        primary: {
          text: { value: colorAliases.primary, type: 'color' },
          icon: { value: colorAliases.primary, type: 'color' },
          bg: { value: colorAliases.transparent, type: 'color' },
          border: { value: colorAliases.transparent, type: 'color' },
          hover: {
            text: { value: colorAliases.white, type: 'color' },
            icon: { value: colorAliases.white, type: 'color' },
            bg: { value: '{color.cyan.90.value}', type: 'color' },
          },
          focus: {
            outline: { value: '{color.cyan.20.value}', type: 'color' },
          },
        },
        secondary: {
          text: { value: colorAliases.neutral100, type: 'color' },
          icon: { value: colorAliases.neutral100, type: 'color' },
          bg: { value: colorAliases.transparent, type: 'color' },
          border: { value: colorAliases.neutral50, type: 'color' },
          hover: {
            text: { value: colorAliases.neutral100, type: 'color' },
            icon: { value: colorAliases.transparent, type: 'color' },
            bg: { value: colorAliases.neutral40, type: 'color' },
          },
          focus: {
            outline: { value: colorAliases.neutral20, type: 'color' },
          },
        },
        tertiary: {
          text: { value: colorAliases.tertiary, type: 'color' },
          icon: { value: colorAliases.tertiary, type: 'color' },
          bg: { value: colorAliases.transparent, type: 'color' },
          border: { value: colorAliases.transparent, type: 'color' },
          hover: {
            text: { value: colorAliases.white, type: 'color' },
            icon: { value: colorAliases.white, type: 'color' },
            bg: { value: colorAliases.tertiary, type: 'color' },
          },
          focus: {
            outline: { value: '{color.blue.20.value}', type: 'color' },
          },
        },
        accent: {
          text: { value: colorAliases.accent, type: 'color' },
          icon: { value: colorAliases.accent, type: 'color' },
          bg: { value: colorAliases.transparent, type: 'color' },
          border: { value: colorAliases.transparent, type: 'color' },
          hover: {
            text: { value: colorAliases.white, type: 'color' },
            icon: { value: colorAliases.white, type: 'color' },
            bg: { value: colorAliases.accent, type: 'color' },
          },
          focus: {
            outline: { value: '{color.magenta.20.value}', type: 'color' },
          },
        },
        danger: {
          text: { value: colorAliases.error, type: 'color' },
          icon: { value: colorAliases.error, type: 'color' },
          bg: { value: colorAliases.transparent, type: 'color' },
          border: { value: colorAliases.transparent, type: 'color' },
          hover: {
            text: { value: colorAliases.white, type: 'color' },
            icon: { value: colorAliases.white, type: 'color' },
            bg: { value: colorAliases.error, type: 'color' },
          },
          focus: {
            outline: { value: '{color.red.20.value}', type: 'color' },
          },
        },
      },
    },
    dropdown: {
      menu: {
        text: { value: colorAliases.base, type: 'color' },
        icon: { value: colorAliases.base, type: 'color' },
        bg: { value: colorAliases.white, type: 'color' },
        border: { value: colorAliases.neutral20, type: 'color' },
        boxShadow: { value: '{shadow.bottom.4}', type: 'shadow' },
        borderWidth: { value: '{border.width.0}', type: 'size' },
        borderRadius: { value: '{border.radius.4}', type: 'radii' },
      },
      item: {
        text: { value: colorAliases.base, type: 'color' },
        icon: { value: colorAliases.base, type: 'color' },
        bg: { value: colorAliases.white, type: 'color' },
        border: { value: colorAliases.neutral20, type: 'color' },
        borderWidth: { value: '{border.width.0}', type: 'size' },
        borderRadius: { value: '{border.radius.4}', type: 'radii' },
        hover: {
          text: { value: colorAliases.neutral120, type: 'color' },
          icon: { value: colorAliases.neutral120, type: 'color' },
          bg: { value: colorAliases.neutral10, type: 'color' },
        },
        focus: {
          outline: { value: colorAliases.neutral30, type: 'color' },
        },
      },
    },
    select: {
      label: {
        fontColor: { value: colorAliases.base, type: 'color' },
        disabledColor: { value: colorAliases.disabled, type: 'color' },
        fontSize: { value: '{font.size.body}', type: 'size' },
        fontWeight: { value: '{font.weight.bold}', type: 'weight' },
      },
      trigger: {
        height: { value: '{size.32}', type: 'size' },
        borderRadius: { value: '{border.radius.4}', type: 'radii' },
        background: { value: colorAliases.white, type: 'color' },
        borderColor: { value: colorAliases.neutral60, type: 'color' },
        selectedBorderColor: { value: '{color.cyan.70.value}', type: 'color' },
        fontColor: { value: colorAliases.neutral100, type: 'color' },
        iconColor: { value: colorAliases.neutral100, type: 'color' },
        disabledColor: { value: colorAliases.neutral30, type: 'color' },
        focusColor: { value: '{color.cyan.20.value}', type: 'color' },
        focusBorderColor: { value: '{color.cyan.70.value}', type: 'color' },
      },
      item: {
        padding: { value: '{space.16}', type: 'size' },
        fontSize: { value: '{font.size.body}', type: 'size' },
        fontWeight: { value: '{font.weight.regular}', type: 'weight' },
        fontColor: { value: colorAliases.neutral100, type: 'color' },
        background: { value: colorAliases.white, type: 'color' },
        disabledColor: { value: colorAliases.neutral30, type: 'color' },
        hover: {
          background: { value: colorAliases.neutral20, type: 'color' },
        },
        focus: {
          background: { value: colorAliases.neutral20, type: 'color' },
        },
        selected: {
          background: { value: '{color.cyan.10.value}', type: 'color' },
          textColor: { value: '{color.cyan.70.value}', type: 'color' },
          iconColor: { value: '{color.cyan.70.value}', type: 'color' },
        },
      },
      inputValue: {
        color: { value: colorAliases.neutral100, type: 'color' },
      },
      menu: {
        background: { value: colorAliases.white, type: 'color' },
        borderColor: { value: '{color.transparent}', type: 'color' },
        borderRadius: { value: '{border.radius.4}', type: 'radii' },
        borderWidth: { value: '{border.width.1}', type: 'size' },
        boxShadow: { value: '{shadow.bottom.4}', type: 'shadow' },
      },
    },
    checkbox: {
      background: { value: colorAliases.white, type: 'color' },
      borderColor: { value: colorAliases.neutral60, type: 'color' },
      borderWidth: { value: '{border.width.1}', type: 'size' },
      borderRadius: { value: '{border.radius.4}', type: 'radii' },
      checked: {
        background: { value: '{color.blue.50.value}', type: 'color' },
        borderColor: { value: '{color.blue.70.value}', type: 'color' },
        checkmarkColor: { value: colorAliases.white, type: 'color' },
        focusColor: { value: '{color.blue.20.value}', type: 'color' },
      },
      disabled: {
        textColor: { value: colorAliases.neutral60, type: 'color' },
        background: { value: colorAliases.neutral30, type: 'color' },
        borderColor: { value: colorAliases.neutral30, type: 'color' },
        checkmarkColor: { value: colorAliases.neutral30, type: 'color' },
      },
    },
    input: {
      label: {
        textColor: { value: colorAliases.base, type: 'color' },
        disabledColor: { value: colorAliases.disabled, type: 'color' },
        fontSize: { value: '{font.size.body}', type: 'size' },
        fontWeight: { value: '{font.weight.bold}', type: 'weight' },
      },
      helper: {
        textColor: { value: colorAliases.base, type: 'color' },
      },
      backgroundColor: { value: colorAliases.component, type: 'color' },
      borderColor: { value: colorAliases.neutral60, type: 'color' },
      borderWidth: { value: '{border.width.1}', type: 'size' },
      borderRadius: { value: '{border.radius.4}', type: 'radii' },
      textColor: { value: colorAliases.neutral100, type: 'color' },
      placeholderColor: { value: colorAliases.neutral60, type: 'color' },
      height: { value: '{size.32}', type: 'size' },
      disabled: {
        textColor: { value: colorAliases.neutral50, type: 'color' },
        backgroundColor: { value: colorAliases.neutral30, type: 'color' },
        borderColor: { value: colorAliases.neutral30, type: 'color' },
      },
      focus: {
        borderColor: { value: colorAliases.primary, type: 'color' },
        boxShadowColor: { value: '{color.cyan.20.value}', type: 'color' },
      },
      error: {
        textColor: { value: colorAliases.error, type: 'color' },
        backgroundColor: { value: '{color.red.10.value}', type: 'color' },
        borderColor: { value: colorAliases.error, type: 'color' },
        boxShadowColor: { value: '{color.red.20.value}', type: 'color' },
      },
      success: {
        textColor: { value: '{color.green.70.value}', type: 'color' },
        backgroundColor: { value: '{color.green.10.value}', type: 'color' },
        borderColor: { value: colorAliases.success, type: 'color' },
        boxShadowColor: { value: '{color.green.20.value}', type: 'color' },
      },
      warning: {
        textColor: { value: '{color.yellow.90.value}', type: 'color' },
        backgroundColor: { value: '{color.yellow.10.value}', type: 'color' },
        borderColor: { value: colorAliases.warning, type: 'color' },
        boxShadowColor: { value: '{color.yellow.20.value}', type: 'color' },
      },
    },
  },
};

export default colors;
