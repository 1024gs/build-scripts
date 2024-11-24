var bootstrap = (function (exports, $, Popper) {
  'use strict';

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v4.6.2): button.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */


  /**
   * Constants
   */

  const NAME$4 = 'button';
  const VERSION$4 = '4.6.2';
  const DATA_KEY$4 = 'bs.button';
  const EVENT_KEY$4 = ".".concat(DATA_KEY$4);
  const DATA_API_KEY$4 = '.data-api';
  const JQUERY_NO_CONFLICT$4 = $.fn[NAME$4];
  const CLASS_NAME_ACTIVE$1 = 'active';
  const CLASS_NAME_BUTTON = 'btn';
  const CLASS_NAME_FOCUS = 'focus';
  const EVENT_CLICK_DATA_API$4 = "click".concat(EVENT_KEY$4).concat(DATA_API_KEY$4);
  const EVENT_FOCUS_BLUR_DATA_API = "focus".concat(EVENT_KEY$4).concat(DATA_API_KEY$4, " ") + "blur".concat(EVENT_KEY$4).concat(DATA_API_KEY$4);
  const EVENT_LOAD_DATA_API = "load".concat(EVENT_KEY$4).concat(DATA_API_KEY$4);
  const SELECTOR_DATA_TOGGLE_CARROT = '[data-toggle^="button"]';
  const SELECTOR_DATA_TOGGLES = '[data-toggle="buttons"]';
  const SELECTOR_DATA_TOGGLE$4 = '[data-toggle="button"]';
  const SELECTOR_DATA_TOGGLES_BUTTONS = '[data-toggle="buttons"] .btn';
  const SELECTOR_INPUT = 'input:not([type="hidden"])';
  const SELECTOR_ACTIVE$1 = '.active';
  const SELECTOR_BUTTON = '.btn';

  /**
   * Class definition
   */

  class Button {
    constructor(element) {
      this._element = element;
      this.shouldAvoidTriggerChange = false;
    }

    // Getters
    static get VERSION() {
      return VERSION$4;
    }

    // Public
    toggle() {
      let triggerChangeEvent = true;
      let addAriaPressed = true;
      const rootElement = $(this._element).closest(SELECTOR_DATA_TOGGLES)[0];
      if (rootElement) {
        const input = this._element.querySelector(SELECTOR_INPUT);
        if (input) {
          if (input.type === 'radio') {
            if (input.checked && this._element.classList.contains(CLASS_NAME_ACTIVE$1)) {
              triggerChangeEvent = false;
            } else {
              const activeElement = rootElement.querySelector(SELECTOR_ACTIVE$1);
              if (activeElement) {
                $(activeElement).removeClass(CLASS_NAME_ACTIVE$1);
              }
            }
          }
          if (triggerChangeEvent) {
            // if it's not a radio button or checkbox don't add a pointless/invalid checked property to the input
            if (input.type === 'checkbox' || input.type === 'radio') {
              input.checked = !this._element.classList.contains(CLASS_NAME_ACTIVE$1);
            }
            if (!this.shouldAvoidTriggerChange) {
              $(input).trigger('change');
            }
          }
          input.focus();
          addAriaPressed = false;
        }
      }
      if (!(this._element.hasAttribute('disabled') || this._element.classList.contains('disabled'))) {
        if (addAriaPressed) {
          this._element.setAttribute('aria-pressed', !this._element.classList.contains(CLASS_NAME_ACTIVE$1));
        }
        if (triggerChangeEvent) {
          $(this._element).toggleClass(CLASS_NAME_ACTIVE$1);
        }
      }
    }
    dispose() {
      $.removeData(this._element, DATA_KEY$4);
      this._element = null;
    }

    // Static
    static _jQueryInterface(config, avoidTriggerChange) {
      return this.each(function () {
        const $element = $(this);
        let data = $element.data(DATA_KEY$4);
        if (!data) {
          data = new Button(this);
          $element.data(DATA_KEY$4, data);
        }
        data.shouldAvoidTriggerChange = avoidTriggerChange;
        if (config === 'toggle') {
          data[config]();
        }
      });
    }
  }

  /**
   * Data API implementation
   */

  $(document).on(EVENT_CLICK_DATA_API$4, SELECTOR_DATA_TOGGLE_CARROT, event => {
    let button = event.target;
    const initialButton = button;
    if (!$(button).hasClass(CLASS_NAME_BUTTON)) {
      button = $(button).closest(SELECTOR_BUTTON)[0];
    }
    if (!button || button.hasAttribute('disabled') || button.classList.contains('disabled')) {
      event.preventDefault(); // work around Firefox bug #1540995
    } else {
      const inputBtn = button.querySelector(SELECTOR_INPUT);
      if (inputBtn && (inputBtn.hasAttribute('disabled') || inputBtn.classList.contains('disabled'))) {
        event.preventDefault(); // work around Firefox bug #1540995
        return;
      }
      if (initialButton.tagName === 'INPUT' || button.tagName !== 'LABEL') {
        Button._jQueryInterface.call($(button), 'toggle', initialButton.tagName === 'INPUT');
      }
    }
  }).on(EVENT_FOCUS_BLUR_DATA_API, SELECTOR_DATA_TOGGLE_CARROT, event => {
    const button = $(event.target).closest(SELECTOR_BUTTON)[0];
    $(button).toggleClass(CLASS_NAME_FOCUS, /^focus(in)?$/.test(event.type));
  });
  $(window).on(EVENT_LOAD_DATA_API, () => {
    // ensure correct active class is set to match the controls' actual values/states

    // find all checkboxes/readio buttons inside data-toggle groups
    let buttons = [].slice.call(document.querySelectorAll(SELECTOR_DATA_TOGGLES_BUTTONS));
    for (let i = 0, len = buttons.length; i < len; i++) {
      const button = buttons[i];
      const input = button.querySelector(SELECTOR_INPUT);
      if (input.checked || input.hasAttribute('checked')) {
        button.classList.add(CLASS_NAME_ACTIVE$1);
      } else {
        button.classList.remove(CLASS_NAME_ACTIVE$1);
      }
    }

    // find all button toggles
    buttons = [].slice.call(document.querySelectorAll(SELECTOR_DATA_TOGGLE$4));
    for (let i = 0, len = buttons.length; i < len; i++) {
      const button = buttons[i];
      if (button.getAttribute('aria-pressed') === 'true') {
        button.classList.add(CLASS_NAME_ACTIVE$1);
      } else {
        button.classList.remove(CLASS_NAME_ACTIVE$1);
      }
    }
  });

  /**
   * jQuery
   */

  $.fn[NAME$4] = Button._jQueryInterface;
  $.fn[NAME$4].Constructor = Button;
  $.fn[NAME$4].noConflict = () => {
    $.fn[NAME$4] = JQUERY_NO_CONFLICT$4;
    return Button._jQueryInterface;
  };

  function _defineProperty(e, r, t) {
    return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
      value: t,
      enumerable: !0,
      configurable: !0,
      writable: !0
    }) : e[r] = t, e;
  }
  function ownKeys(e, r) {
    var t = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
      var o = Object.getOwnPropertySymbols(e);
      r && (o = o.filter(function (r) {
        return Object.getOwnPropertyDescriptor(e, r).enumerable;
      })), t.push.apply(t, o);
    }
    return t;
  }
  function _objectSpread2(e) {
    for (var r = 1; r < arguments.length; r++) {
      var t = null != arguments[r] ? arguments[r] : {};
      r % 2 ? ownKeys(Object(t), !0).forEach(function (r) {
        _defineProperty(e, r, t[r]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) {
        Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
      });
    }
    return e;
  }
  function _toPrimitive(t, r) {
    if ("object" != typeof t || !t) return t;
    var e = t[Symbol.toPrimitive];
    if (void 0 !== e) {
      var i = e.call(t, r || "default");
      if ("object" != typeof i) return i;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === r ? String : Number)(t);
  }
  function _toPropertyKey(t) {
    var i = _toPrimitive(t, "string");
    return "symbol" == typeof i ? i : i + "";
  }

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v4.6.2): util.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */


  /**
   * Private TransitionEnd Helpers
   */

  const TRANSITION_END = 'transitionend';
  const MAX_UID = 1000000;
  const MILLISECONDS_MULTIPLIER = 1000;

  // Shoutout AngusCroll (https://goo.gl/pxwQGp)
  function toType(obj) {
    if (obj === null || typeof obj === 'undefined') {
      return "".concat(obj);
    }
    return {}.toString.call(obj).match(/\s([a-z]+)/i)[1].toLowerCase();
  }
  function getSpecialTransitionEndEvent() {
    return {
      bindType: TRANSITION_END,
      delegateType: TRANSITION_END,
      handle(event) {
        if ($(event.target).is(this)) {
          return event.handleObj.handler.apply(this, arguments); // eslint-disable-line prefer-rest-params
        }
        return undefined;
      }
    };
  }
  function transitionEndEmulator(duration) {
    let called = false;
    $(this).one(Util.TRANSITION_END, () => {
      called = true;
    });
    setTimeout(() => {
      if (!called) {
        Util.triggerTransitionEnd(this);
      }
    }, duration);
    return this;
  }
  function setTransitionEndSupport() {
    $.fn.emulateTransitionEnd = transitionEndEmulator;
    $.event.special[Util.TRANSITION_END] = getSpecialTransitionEndEvent();
  }

  /**
   * Public Util API
   */

  const Util = {
    TRANSITION_END: 'bsTransitionEnd',
    getUID(prefix) {
      do {
        // eslint-disable-next-line no-bitwise
        prefix += ~~(Math.random() * MAX_UID); // "~~" acts like a faster Math.floor() here
      } while (document.getElementById(prefix));
      return prefix;
    },
    getSelectorFromElement(element) {
      let selector = element.getAttribute('data-target');
      if (!selector || selector === '#') {
        const hrefAttr = element.getAttribute('href');
        selector = hrefAttr && hrefAttr !== '#' ? hrefAttr.trim() : '';
      }
      try {
        return document.querySelector(selector) ? selector : null;
      } catch (_) {
        return null;
      }
    },
    getTransitionDurationFromElement(element) {
      if (!element) {
        return 0;
      }

      // Get transition-duration of the element
      let transitionDuration = $(element).css('transition-duration');
      let transitionDelay = $(element).css('transition-delay');
      const floatTransitionDuration = parseFloat(transitionDuration);
      const floatTransitionDelay = parseFloat(transitionDelay);

      // Return 0 if element or transition duration is not found
      if (!floatTransitionDuration && !floatTransitionDelay) {
        return 0;
      }

      // If multiple durations are defined, take the first
      transitionDuration = transitionDuration.split(',')[0];
      transitionDelay = transitionDelay.split(',')[0];
      return (parseFloat(transitionDuration) + parseFloat(transitionDelay)) * MILLISECONDS_MULTIPLIER;
    },
    reflow(element) {
      return element.offsetHeight;
    },
    triggerTransitionEnd(element) {
      $(element).trigger(TRANSITION_END);
    },
    supportsTransitionEnd() {
      return Boolean(TRANSITION_END);
    },
    isElement(obj) {
      return (obj[0] || obj).nodeType;
    },
    typeCheckConfig(componentName, config, configTypes) {
      for (const property in configTypes) {
        if (Object.prototype.hasOwnProperty.call(configTypes, property)) {
          const expectedTypes = configTypes[property];
          const value = config[property];
          const valueType = value && Util.isElement(value) ? 'element' : toType(value);
          if (!new RegExp(expectedTypes).test(valueType)) {
            throw new Error("".concat(componentName.toUpperCase(), ": ") + "Option \"".concat(property, "\" provided type \"").concat(valueType, "\" ") + "but expected type \"".concat(expectedTypes, "\"."));
          }
        }
      }
    },
    findShadowRoot(element) {
      if (!document.documentElement.attachShadow) {
        return null;
      }

      // Can find the shadow root otherwise it'll return the document
      if (typeof element.getRootNode === 'function') {
        const root = element.getRootNode();
        return root instanceof ShadowRoot ? root : null;
      }
      if (element instanceof ShadowRoot) {
        return element;
      }

      // when we don't find a shadow root
      if (!element.parentNode) {
        return null;
      }
      return Util.findShadowRoot(element.parentNode);
    },
    jQueryDetection() {
      if (typeof $ === 'undefined') {
        throw new TypeError('Bootstrap\'s JavaScript requires jQuery. jQuery must be included before Bootstrap\'s JavaScript.');
      }
      const version = $.fn.jquery.split(' ')[0].split('.');
      const minMajor = 1;
      const ltMajor = 2;
      const minMinor = 9;
      const minPatch = 1;
      const maxMajor = 4;
      if (version[0] < ltMajor && version[1] < minMinor || version[0] === minMajor && version[1] === minMinor && version[2] < minPatch || version[0] >= maxMajor) {
        throw new Error('Bootstrap\'s JavaScript requires at least jQuery v1.9.1 but less than v4.0.0');
      }
    }
  };
  Util.jQueryDetection();
  setTransitionEndSupport();

  /**
   * Constants
   */

  const NAME$3 = 'collapse';
  const VERSION$3 = '4.6.2';
  const DATA_KEY$3 = 'bs.collapse';
  const EVENT_KEY$3 = ".".concat(DATA_KEY$3);
  const DATA_API_KEY$3 = '.data-api';
  const JQUERY_NO_CONFLICT$3 = $.fn[NAME$3];
  const CLASS_NAME_SHOW$3 = 'show';
  const CLASS_NAME_COLLAPSE = 'collapse';
  const CLASS_NAME_COLLAPSING = 'collapsing';
  const CLASS_NAME_COLLAPSED = 'collapsed';
  const DIMENSION_WIDTH = 'width';
  const DIMENSION_HEIGHT = 'height';
  const EVENT_SHOW$3 = "show".concat(EVENT_KEY$3);
  const EVENT_SHOWN$3 = "shown".concat(EVENT_KEY$3);
  const EVENT_HIDE$3 = "hide".concat(EVENT_KEY$3);
  const EVENT_HIDDEN$3 = "hidden".concat(EVENT_KEY$3);
  const EVENT_CLICK_DATA_API$3 = "click".concat(EVENT_KEY$3).concat(DATA_API_KEY$3);
  const SELECTOR_ACTIVES = '.show, .collapsing';
  const SELECTOR_DATA_TOGGLE$3 = '[data-toggle="collapse"]';
  const Default$2 = {
    toggle: true,
    parent: ''
  };
  const DefaultType$2 = {
    toggle: 'boolean',
    parent: '(string|element)'
  };

  /**
   * Class definition
   */

  class Collapse {
    constructor(element, config) {
      this._isTransitioning = false;
      this._element = element;
      this._config = this._getConfig(config);
      this._triggerArray = [].slice.call(document.querySelectorAll("[data-toggle=\"collapse\"][href=\"#".concat(element.id, "\"],") + "[data-toggle=\"collapse\"][data-target=\"#".concat(element.id, "\"]")));
      const toggleList = [].slice.call(document.querySelectorAll(SELECTOR_DATA_TOGGLE$3));
      for (let i = 0, len = toggleList.length; i < len; i++) {
        const elem = toggleList[i];
        const selector = Util.getSelectorFromElement(elem);
        const filterElement = [].slice.call(document.querySelectorAll(selector)).filter(foundElem => foundElem === element);
        if (selector !== null && filterElement.length > 0) {
          this._selector = selector;
          this._triggerArray.push(elem);
        }
      }
      this._parent = this._config.parent ? this._getParent() : null;
      if (!this._config.parent) {
        this._addAriaAndCollapsedClass(this._element, this._triggerArray);
      }
      if (this._config.toggle) {
        this.toggle();
      }
    }

    // Getters
    static get VERSION() {
      return VERSION$3;
    }
    static get Default() {
      return Default$2;
    }

    // Public
    toggle() {
      if ($(this._element).hasClass(CLASS_NAME_SHOW$3)) {
        this.hide();
      } else {
        this.show();
      }
    }
    show() {
      if (this._isTransitioning || $(this._element).hasClass(CLASS_NAME_SHOW$3)) {
        return;
      }
      let actives;
      let activesData;
      if (this._parent) {
        actives = [].slice.call(this._parent.querySelectorAll(SELECTOR_ACTIVES)).filter(elem => {
          if (typeof this._config.parent === 'string') {
            return elem.getAttribute('data-parent') === this._config.parent;
          }
          return elem.classList.contains(CLASS_NAME_COLLAPSE);
        });
        if (actives.length === 0) {
          actives = null;
        }
      }
      if (actives) {
        activesData = $(actives).not(this._selector).data(DATA_KEY$3);
        if (activesData && activesData._isTransitioning) {
          return;
        }
      }
      const startEvent = $.Event(EVENT_SHOW$3);
      $(this._element).trigger(startEvent);
      if (startEvent.isDefaultPrevented()) {
        return;
      }
      if (actives) {
        Collapse._jQueryInterface.call($(actives).not(this._selector), 'hide');
        if (!activesData) {
          $(actives).data(DATA_KEY$3, null);
        }
      }
      const dimension = this._getDimension();
      $(this._element).removeClass(CLASS_NAME_COLLAPSE).addClass(CLASS_NAME_COLLAPSING);
      this._element.style[dimension] = 0;
      if (this._triggerArray.length) {
        $(this._triggerArray).removeClass(CLASS_NAME_COLLAPSED).attr('aria-expanded', true);
      }
      this.setTransitioning(true);
      const complete = () => {
        $(this._element).removeClass(CLASS_NAME_COLLAPSING).addClass("".concat(CLASS_NAME_COLLAPSE, " ").concat(CLASS_NAME_SHOW$3));
        this._element.style[dimension] = '';
        this.setTransitioning(false);
        $(this._element).trigger(EVENT_SHOWN$3);
      };
      const capitalizedDimension = dimension[0].toUpperCase() + dimension.slice(1);
      const scrollSize = "scroll".concat(capitalizedDimension);
      const transitionDuration = Util.getTransitionDurationFromElement(this._element);
      $(this._element).one(Util.TRANSITION_END, complete).emulateTransitionEnd(transitionDuration);
      this._element.style[dimension] = "".concat(this._element[scrollSize], "px");
    }
    hide() {
      if (this._isTransitioning || !$(this._element).hasClass(CLASS_NAME_SHOW$3)) {
        return;
      }
      const startEvent = $.Event(EVENT_HIDE$3);
      $(this._element).trigger(startEvent);
      if (startEvent.isDefaultPrevented()) {
        return;
      }
      const dimension = this._getDimension();
      this._element.style[dimension] = "".concat(this._element.getBoundingClientRect()[dimension], "px");
      Util.reflow(this._element);
      $(this._element).addClass(CLASS_NAME_COLLAPSING).removeClass("".concat(CLASS_NAME_COLLAPSE, " ").concat(CLASS_NAME_SHOW$3));
      const triggerArrayLength = this._triggerArray.length;
      if (triggerArrayLength > 0) {
        for (let i = 0; i < triggerArrayLength; i++) {
          const trigger = this._triggerArray[i];
          const selector = Util.getSelectorFromElement(trigger);
          if (selector !== null) {
            const $elem = $([].slice.call(document.querySelectorAll(selector)));
            if (!$elem.hasClass(CLASS_NAME_SHOW$3)) {
              $(trigger).addClass(CLASS_NAME_COLLAPSED).attr('aria-expanded', false);
            }
          }
        }
      }
      this.setTransitioning(true);
      const complete = () => {
        this.setTransitioning(false);
        $(this._element).removeClass(CLASS_NAME_COLLAPSING).addClass(CLASS_NAME_COLLAPSE).trigger(EVENT_HIDDEN$3);
      };
      this._element.style[dimension] = '';
      const transitionDuration = Util.getTransitionDurationFromElement(this._element);
      $(this._element).one(Util.TRANSITION_END, complete).emulateTransitionEnd(transitionDuration);
    }
    setTransitioning(isTransitioning) {
      this._isTransitioning = isTransitioning;
    }
    dispose() {
      $.removeData(this._element, DATA_KEY$3);
      this._config = null;
      this._parent = null;
      this._element = null;
      this._triggerArray = null;
      this._isTransitioning = null;
    }

    // Private
    _getConfig(config) {
      config = _objectSpread2(_objectSpread2({}, Default$2), config);
      config.toggle = Boolean(config.toggle); // Coerce string values
      Util.typeCheckConfig(NAME$3, config, DefaultType$2);
      return config;
    }
    _getDimension() {
      const hasWidth = $(this._element).hasClass(DIMENSION_WIDTH);
      return hasWidth ? DIMENSION_WIDTH : DIMENSION_HEIGHT;
    }
    _getParent() {
      let parent;
      if (Util.isElement(this._config.parent)) {
        parent = this._config.parent;

        // It's a jQuery object
        if (typeof this._config.parent.jquery !== 'undefined') {
          parent = this._config.parent[0];
        }
      } else {
        parent = document.querySelector(this._config.parent);
      }
      const selector = "[data-toggle=\"collapse\"][data-parent=\"".concat(this._config.parent, "\"]");
      const children = [].slice.call(parent.querySelectorAll(selector));
      $(children).each((i, element) => {
        this._addAriaAndCollapsedClass(Collapse._getTargetFromElement(element), [element]);
      });
      return parent;
    }
    _addAriaAndCollapsedClass(element, triggerArray) {
      const isOpen = $(element).hasClass(CLASS_NAME_SHOW$3);
      if (triggerArray.length) {
        $(triggerArray).toggleClass(CLASS_NAME_COLLAPSED, !isOpen).attr('aria-expanded', isOpen);
      }
    }

    // Static
    static _getTargetFromElement(element) {
      const selector = Util.getSelectorFromElement(element);
      return selector ? document.querySelector(selector) : null;
    }
    static _jQueryInterface(config) {
      return this.each(function () {
        const $element = $(this);
        let data = $element.data(DATA_KEY$3);
        const _config = _objectSpread2(_objectSpread2(_objectSpread2({}, Default$2), $element.data()), typeof config === 'object' && config ? config : {});
        if (!data && _config.toggle && typeof config === 'string' && /show|hide/.test(config)) {
          _config.toggle = false;
        }
        if (!data) {
          data = new Collapse(this, _config);
          $element.data(DATA_KEY$3, data);
        }
        if (typeof config === 'string') {
          if (typeof data[config] === 'undefined') {
            throw new TypeError("No method named \"".concat(config, "\""));
          }
          data[config]();
        }
      });
    }
  }

  /**
   * Data API implementation
   */

  $(document).on(EVENT_CLICK_DATA_API$3, SELECTOR_DATA_TOGGLE$3, function (event) {
    // preventDefault only for <a> elements (which change the URL) not inside the collapsible element
    if (event.currentTarget.tagName === 'A') {
      event.preventDefault();
    }
    const $trigger = $(this);
    const selector = Util.getSelectorFromElement(this);
    const selectors = [].slice.call(document.querySelectorAll(selector));
    $(selectors).each(function () {
      const $target = $(this);
      const data = $target.data(DATA_KEY$3);
      const config = data ? 'toggle' : $trigger.data();
      Collapse._jQueryInterface.call($target, config);
    });
  });

  /**
   * jQuery
   */

  $.fn[NAME$3] = Collapse._jQueryInterface;
  $.fn[NAME$3].Constructor = Collapse;
  $.fn[NAME$3].noConflict = () => {
    $.fn[NAME$3] = JQUERY_NO_CONFLICT$3;
    return Collapse._jQueryInterface;
  };

  /**
   * Constants
   */

  const NAME$2 = 'dropdown';
  const VERSION$2 = '4.6.2';
  const DATA_KEY$2 = 'bs.dropdown';
  const EVENT_KEY$2 = ".".concat(DATA_KEY$2);
  const DATA_API_KEY$2 = '.data-api';
  const JQUERY_NO_CONFLICT$2 = $.fn[NAME$2];
  const ESCAPE_KEYCODE$1 = 27; // KeyboardEvent.which value for Escape (Esc) key
  const SPACE_KEYCODE = 32; // KeyboardEvent.which value for space key
  const TAB_KEYCODE = 9; // KeyboardEvent.which value for tab key
  const ARROW_UP_KEYCODE = 38; // KeyboardEvent.which value for up arrow key
  const ARROW_DOWN_KEYCODE = 40; // KeyboardEvent.which value for down arrow key
  const RIGHT_MOUSE_BUTTON_WHICH = 3; // MouseEvent.which value for the right button (assuming a right-handed mouse)
  const REGEXP_KEYDOWN = new RegExp("".concat(ARROW_UP_KEYCODE, "|").concat(ARROW_DOWN_KEYCODE, "|").concat(ESCAPE_KEYCODE$1));
  const CLASS_NAME_DISABLED$1 = 'disabled';
  const CLASS_NAME_SHOW$2 = 'show';
  const CLASS_NAME_DROPUP = 'dropup';
  const CLASS_NAME_DROPRIGHT = 'dropright';
  const CLASS_NAME_DROPLEFT = 'dropleft';
  const CLASS_NAME_MENURIGHT = 'dropdown-menu-right';
  const CLASS_NAME_POSITION_STATIC = 'position-static';
  const EVENT_HIDE$2 = "hide".concat(EVENT_KEY$2);
  const EVENT_HIDDEN$2 = "hidden".concat(EVENT_KEY$2);
  const EVENT_SHOW$2 = "show".concat(EVENT_KEY$2);
  const EVENT_SHOWN$2 = "shown".concat(EVENT_KEY$2);
  const EVENT_CLICK = "click".concat(EVENT_KEY$2);
  const EVENT_CLICK_DATA_API$2 = "click".concat(EVENT_KEY$2).concat(DATA_API_KEY$2);
  const EVENT_KEYDOWN_DATA_API = "keydown".concat(EVENT_KEY$2).concat(DATA_API_KEY$2);
  const EVENT_KEYUP_DATA_API = "keyup".concat(EVENT_KEY$2).concat(DATA_API_KEY$2);
  const SELECTOR_DATA_TOGGLE$2 = '[data-toggle="dropdown"]';
  const SELECTOR_FORM_CHILD = '.dropdown form';
  const SELECTOR_MENU = '.dropdown-menu';
  const SELECTOR_NAVBAR_NAV = '.navbar-nav';
  const SELECTOR_VISIBLE_ITEMS = '.dropdown-menu .dropdown-item:not(.disabled):not(:disabled)';
  const PLACEMENT_TOP = 'top-start';
  const PLACEMENT_TOPEND = 'top-end';
  const PLACEMENT_BOTTOM = 'bottom-start';
  const PLACEMENT_BOTTOMEND = 'bottom-end';
  const PLACEMENT_RIGHT = 'right-start';
  const PLACEMENT_LEFT = 'left-start';
  const Default$1 = {
    offset: 0,
    flip: true,
    boundary: 'scrollParent',
    reference: 'toggle',
    display: 'dynamic',
    popperConfig: null
  };
  const DefaultType$1 = {
    offset: '(number|string|function)',
    flip: 'boolean',
    boundary: '(string|element)',
    reference: '(string|element)',
    display: 'string',
    popperConfig: '(null|object)'
  };

  /**
   * Class definition
   */

  class Dropdown {
    constructor(element, config) {
      this._element = element;
      this._popper = null;
      this._config = this._getConfig(config);
      this._menu = this._getMenuElement();
      this._inNavbar = this._detectNavbar();
      this._addEventListeners();
    }

    // Getters
    static get VERSION() {
      return VERSION$2;
    }
    static get Default() {
      return Default$1;
    }
    static get DefaultType() {
      return DefaultType$1;
    }

    // Public
    toggle() {
      if (this._element.disabled || $(this._element).hasClass(CLASS_NAME_DISABLED$1)) {
        return;
      }
      const isActive = $(this._menu).hasClass(CLASS_NAME_SHOW$2);
      Dropdown._clearMenus();
      if (isActive) {
        return;
      }
      this.show(true);
    }
    show() {
      let usePopper = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      if (this._element.disabled || $(this._element).hasClass(CLASS_NAME_DISABLED$1) || $(this._menu).hasClass(CLASS_NAME_SHOW$2)) {
        return;
      }
      const relatedTarget = {
        relatedTarget: this._element
      };
      const showEvent = $.Event(EVENT_SHOW$2, relatedTarget);
      const parent = Dropdown._getParentFromElement(this._element);
      $(parent).trigger(showEvent);
      if (showEvent.isDefaultPrevented()) {
        return;
      }

      // Totally disable Popper for Dropdowns in Navbar
      if (!this._inNavbar && usePopper) {
        // Check for Popper dependency
        if (typeof Popper === 'undefined') {
          throw new TypeError('Bootstrap\'s dropdowns require Popper (https://popper.js.org)');
        }
        let referenceElement = this._element;
        if (this._config.reference === 'parent') {
          referenceElement = parent;
        } else if (Util.isElement(this._config.reference)) {
          referenceElement = this._config.reference;

          // Check if it's jQuery element
          if (typeof this._config.reference.jquery !== 'undefined') {
            referenceElement = this._config.reference[0];
          }
        }

        // If boundary is not `scrollParent`, then set position to `static`
        // to allow the menu to "escape" the scroll parent's boundaries
        // https://github.com/twbs/bootstrap/issues/24251
        if (this._config.boundary !== 'scrollParent') {
          $(parent).addClass(CLASS_NAME_POSITION_STATIC);
        }
        this._popper = new Popper(referenceElement, this._menu, this._getPopperConfig());
      }

      // If this is a touch-enabled device we add extra
      // empty mouseover listeners to the body's immediate children;
      // only needed because of broken event delegation on iOS
      // https://www.quirksmode.org/blog/archives/2014/02/mouse_event_bub.html
      if ('ontouchstart' in document.documentElement && $(parent).closest(SELECTOR_NAVBAR_NAV).length === 0) {
        $(document.body).children().on('mouseover', null, $.noop);
      }
      this._element.focus();
      this._element.setAttribute('aria-expanded', true);
      $(this._menu).toggleClass(CLASS_NAME_SHOW$2);
      $(parent).toggleClass(CLASS_NAME_SHOW$2).trigger($.Event(EVENT_SHOWN$2, relatedTarget));
    }
    hide() {
      if (this._element.disabled || $(this._element).hasClass(CLASS_NAME_DISABLED$1) || !$(this._menu).hasClass(CLASS_NAME_SHOW$2)) {
        return;
      }
      const relatedTarget = {
        relatedTarget: this._element
      };
      const hideEvent = $.Event(EVENT_HIDE$2, relatedTarget);
      const parent = Dropdown._getParentFromElement(this._element);
      $(parent).trigger(hideEvent);
      if (hideEvent.isDefaultPrevented()) {
        return;
      }
      if (this._popper) {
        this._popper.destroy();
      }
      $(this._menu).toggleClass(CLASS_NAME_SHOW$2);
      $(parent).toggleClass(CLASS_NAME_SHOW$2).trigger($.Event(EVENT_HIDDEN$2, relatedTarget));
    }
    dispose() {
      $.removeData(this._element, DATA_KEY$2);
      $(this._element).off(EVENT_KEY$2);
      this._element = null;
      this._menu = null;
      if (this._popper !== null) {
        this._popper.destroy();
        this._popper = null;
      }
    }
    update() {
      this._inNavbar = this._detectNavbar();
      if (this._popper !== null) {
        this._popper.scheduleUpdate();
      }
    }

    // Private
    _addEventListeners() {
      $(this._element).on(EVENT_CLICK, event => {
        event.preventDefault();
        event.stopPropagation();
        this.toggle();
      });
    }
    _getConfig(config) {
      config = _objectSpread2(_objectSpread2(_objectSpread2({}, this.constructor.Default), $(this._element).data()), config);
      Util.typeCheckConfig(NAME$2, config, this.constructor.DefaultType);
      return config;
    }
    _getMenuElement() {
      if (!this._menu) {
        const parent = Dropdown._getParentFromElement(this._element);
        if (parent) {
          this._menu = parent.querySelector(SELECTOR_MENU);
        }
      }
      return this._menu;
    }
    _getPlacement() {
      const $parentDropdown = $(this._element.parentNode);
      let placement = PLACEMENT_BOTTOM;

      // Handle dropup
      if ($parentDropdown.hasClass(CLASS_NAME_DROPUP)) {
        placement = $(this._menu).hasClass(CLASS_NAME_MENURIGHT) ? PLACEMENT_TOPEND : PLACEMENT_TOP;
      } else if ($parentDropdown.hasClass(CLASS_NAME_DROPRIGHT)) {
        placement = PLACEMENT_RIGHT;
      } else if ($parentDropdown.hasClass(CLASS_NAME_DROPLEFT)) {
        placement = PLACEMENT_LEFT;
      } else if ($(this._menu).hasClass(CLASS_NAME_MENURIGHT)) {
        placement = PLACEMENT_BOTTOMEND;
      }
      return placement;
    }
    _detectNavbar() {
      return $(this._element).closest('.navbar').length > 0;
    }
    _getOffset() {
      const offset = {};
      if (typeof this._config.offset === 'function') {
        offset.fn = data => {
          data.offsets = _objectSpread2(_objectSpread2({}, data.offsets), this._config.offset(data.offsets, this._element));
          return data;
        };
      } else {
        offset.offset = this._config.offset;
      }
      return offset;
    }
    _getPopperConfig() {
      const popperConfig = {
        placement: this._getPlacement(),
        modifiers: {
          offset: this._getOffset(),
          flip: {
            enabled: this._config.flip
          },
          preventOverflow: {
            boundariesElement: this._config.boundary
          }
        }
      };

      // Disable Popper if we have a static display
      if (this._config.display === 'static') {
        popperConfig.modifiers.applyStyle = {
          enabled: false
        };
      }
      return _objectSpread2(_objectSpread2({}, popperConfig), this._config.popperConfig);
    }

    // Static
    static _jQueryInterface(config) {
      return this.each(function () {
        let data = $(this).data(DATA_KEY$2);
        const _config = typeof config === 'object' ? config : null;
        if (!data) {
          data = new Dropdown(this, _config);
          $(this).data(DATA_KEY$2, data);
        }
        if (typeof config === 'string') {
          if (typeof data[config] === 'undefined') {
            throw new TypeError("No method named \"".concat(config, "\""));
          }
          data[config]();
        }
      });
    }
    static _clearMenus(event) {
      if (event && (event.which === RIGHT_MOUSE_BUTTON_WHICH || event.type === 'keyup' && event.which !== TAB_KEYCODE)) {
        return;
      }
      const toggles = [].slice.call(document.querySelectorAll(SELECTOR_DATA_TOGGLE$2));
      for (let i = 0, len = toggles.length; i < len; i++) {
        const parent = Dropdown._getParentFromElement(toggles[i]);
        const context = $(toggles[i]).data(DATA_KEY$2);
        const relatedTarget = {
          relatedTarget: toggles[i]
        };
        if (event && event.type === 'click') {
          relatedTarget.clickEvent = event;
        }
        if (!context) {
          continue;
        }
        const dropdownMenu = context._menu;
        if (!$(parent).hasClass(CLASS_NAME_SHOW$2)) {
          continue;
        }
        if (event && (event.type === 'click' && /input|textarea/i.test(event.target.tagName) || event.type === 'keyup' && event.which === TAB_KEYCODE) && $.contains(parent, event.target)) {
          continue;
        }
        const hideEvent = $.Event(EVENT_HIDE$2, relatedTarget);
        $(parent).trigger(hideEvent);
        if (hideEvent.isDefaultPrevented()) {
          continue;
        }

        // If this is a touch-enabled device we remove the extra
        // empty mouseover listeners we added for iOS support
        if ('ontouchstart' in document.documentElement) {
          $(document.body).children().off('mouseover', null, $.noop);
        }
        toggles[i].setAttribute('aria-expanded', 'false');
        if (context._popper) {
          context._popper.destroy();
        }
        $(dropdownMenu).removeClass(CLASS_NAME_SHOW$2);
        $(parent).removeClass(CLASS_NAME_SHOW$2).trigger($.Event(EVENT_HIDDEN$2, relatedTarget));
      }
    }
    static _getParentFromElement(element) {
      let parent;
      const selector = Util.getSelectorFromElement(element);
      if (selector) {
        parent = document.querySelector(selector);
      }
      return parent || element.parentNode;
    }

    // eslint-disable-next-line complexity
    static _dataApiKeydownHandler(event) {
      // If not input/textarea:
      //  - And not a key in REGEXP_KEYDOWN => not a dropdown command
      // If input/textarea:
      //  - If space key => not a dropdown command
      //  - If key is other than escape
      //    - If key is not up or down => not a dropdown command
      //    - If trigger inside the menu => not a dropdown command
      if (/input|textarea/i.test(event.target.tagName) ? event.which === SPACE_KEYCODE || event.which !== ESCAPE_KEYCODE$1 && (event.which !== ARROW_DOWN_KEYCODE && event.which !== ARROW_UP_KEYCODE || $(event.target).closest(SELECTOR_MENU).length) : !REGEXP_KEYDOWN.test(event.which)) {
        return;
      }
      if (this.disabled || $(this).hasClass(CLASS_NAME_DISABLED$1)) {
        return;
      }
      const parent = Dropdown._getParentFromElement(this);
      const isActive = $(parent).hasClass(CLASS_NAME_SHOW$2);
      if (!isActive && event.which === ESCAPE_KEYCODE$1) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      if (!isActive || event.which === ESCAPE_KEYCODE$1 || event.which === SPACE_KEYCODE) {
        if (event.which === ESCAPE_KEYCODE$1) {
          $(parent.querySelector(SELECTOR_DATA_TOGGLE$2)).trigger('focus');
        }
        $(this).trigger('click');
        return;
      }
      const items = [].slice.call(parent.querySelectorAll(SELECTOR_VISIBLE_ITEMS)).filter(item => $(item).is(':visible'));
      if (items.length === 0) {
        return;
      }
      let index = items.indexOf(event.target);
      if (event.which === ARROW_UP_KEYCODE && index > 0) {
        // Up
        index--;
      }
      if (event.which === ARROW_DOWN_KEYCODE && index < items.length - 1) {
        // Down
        index++;
      }
      if (index < 0) {
        index = 0;
      }
      items[index].focus();
    }
  }

  /**
   * Data API implementation
   */

  $(document).on(EVENT_KEYDOWN_DATA_API, SELECTOR_DATA_TOGGLE$2, Dropdown._dataApiKeydownHandler).on(EVENT_KEYDOWN_DATA_API, SELECTOR_MENU, Dropdown._dataApiKeydownHandler).on("".concat(EVENT_CLICK_DATA_API$2, " ").concat(EVENT_KEYUP_DATA_API), Dropdown._clearMenus).on(EVENT_CLICK_DATA_API$2, SELECTOR_DATA_TOGGLE$2, function (event) {
    event.preventDefault();
    event.stopPropagation();
    Dropdown._jQueryInterface.call($(this), 'toggle');
  }).on(EVENT_CLICK_DATA_API$2, SELECTOR_FORM_CHILD, e => {
    e.stopPropagation();
  });

  /**
   * jQuery
   */

  $.fn[NAME$2] = Dropdown._jQueryInterface;
  $.fn[NAME$2].Constructor = Dropdown;
  $.fn[NAME$2].noConflict = () => {
    $.fn[NAME$2] = JQUERY_NO_CONFLICT$2;
    return Dropdown._jQueryInterface;
  };

  /**
   * Constants
   */

  const NAME$1 = 'modal';
  const VERSION$1 = '4.6.2';
  const DATA_KEY$1 = 'bs.modal';
  const EVENT_KEY$1 = ".".concat(DATA_KEY$1);
  const DATA_API_KEY$1 = '.data-api';
  const JQUERY_NO_CONFLICT$1 = $.fn[NAME$1];
  const ESCAPE_KEYCODE = 27; // KeyboardEvent.which value for Escape (Esc) key

  const CLASS_NAME_SCROLLABLE = 'modal-dialog-scrollable';
  const CLASS_NAME_SCROLLBAR_MEASURER = 'modal-scrollbar-measure';
  const CLASS_NAME_BACKDROP = 'modal-backdrop';
  const CLASS_NAME_OPEN = 'modal-open';
  const CLASS_NAME_FADE$1 = 'fade';
  const CLASS_NAME_SHOW$1 = 'show';
  const CLASS_NAME_STATIC = 'modal-static';
  const EVENT_HIDE$1 = "hide".concat(EVENT_KEY$1);
  const EVENT_HIDE_PREVENTED = "hidePrevented".concat(EVENT_KEY$1);
  const EVENT_HIDDEN$1 = "hidden".concat(EVENT_KEY$1);
  const EVENT_SHOW$1 = "show".concat(EVENT_KEY$1);
  const EVENT_SHOWN$1 = "shown".concat(EVENT_KEY$1);
  const EVENT_FOCUSIN = "focusin".concat(EVENT_KEY$1);
  const EVENT_RESIZE = "resize".concat(EVENT_KEY$1);
  const EVENT_CLICK_DISMISS = "click.dismiss".concat(EVENT_KEY$1);
  const EVENT_KEYDOWN_DISMISS = "keydown.dismiss".concat(EVENT_KEY$1);
  const EVENT_MOUSEUP_DISMISS = "mouseup.dismiss".concat(EVENT_KEY$1);
  const EVENT_MOUSEDOWN_DISMISS = "mousedown.dismiss".concat(EVENT_KEY$1);
  const EVENT_CLICK_DATA_API$1 = "click".concat(EVENT_KEY$1).concat(DATA_API_KEY$1);
  const SELECTOR_DIALOG = '.modal-dialog';
  const SELECTOR_MODAL_BODY = '.modal-body';
  const SELECTOR_DATA_TOGGLE$1 = '[data-toggle="modal"]';
  const SELECTOR_DATA_DISMISS = '[data-dismiss="modal"]';
  const SELECTOR_FIXED_CONTENT = '.fixed-top, .fixed-bottom, .is-fixed, .sticky-top';
  const SELECTOR_STICKY_CONTENT = '.sticky-top';
  const Default = {
    backdrop: true,
    keyboard: true,
    focus: true,
    show: true
  };
  const DefaultType = {
    backdrop: '(boolean|string)',
    keyboard: 'boolean',
    focus: 'boolean',
    show: 'boolean'
  };

  /**
   * Class definition
   */

  class Modal {
    constructor(element, config) {
      this._config = this._getConfig(config);
      this._element = element;
      this._dialog = element.querySelector(SELECTOR_DIALOG);
      this._backdrop = null;
      this._isShown = false;
      this._isBodyOverflowing = false;
      this._ignoreBackdropClick = false;
      this._isTransitioning = false;
      this._scrollbarWidth = 0;
    }

    // Getters
    static get VERSION() {
      return VERSION$1;
    }
    static get Default() {
      return Default;
    }

    // Public
    toggle(relatedTarget) {
      return this._isShown ? this.hide() : this.show(relatedTarget);
    }
    show(relatedTarget) {
      if (this._isShown || this._isTransitioning) {
        return;
      }
      const showEvent = $.Event(EVENT_SHOW$1, {
        relatedTarget
      });
      $(this._element).trigger(showEvent);
      if (showEvent.isDefaultPrevented()) {
        return;
      }
      this._isShown = true;
      if ($(this._element).hasClass(CLASS_NAME_FADE$1)) {
        this._isTransitioning = true;
      }
      this._checkScrollbar();
      this._setScrollbar();
      this._adjustDialog();
      this._setEscapeEvent();
      this._setResizeEvent();
      $(this._element).on(EVENT_CLICK_DISMISS, SELECTOR_DATA_DISMISS, event => this.hide(event));
      $(this._dialog).on(EVENT_MOUSEDOWN_DISMISS, () => {
        $(this._element).one(EVENT_MOUSEUP_DISMISS, event => {
          if ($(event.target).is(this._element)) {
            this._ignoreBackdropClick = true;
          }
        });
      });
      this._showBackdrop(() => this._showElement(relatedTarget));
    }
    hide(event) {
      if (event) {
        event.preventDefault();
      }
      if (!this._isShown || this._isTransitioning) {
        return;
      }
      const hideEvent = $.Event(EVENT_HIDE$1);
      $(this._element).trigger(hideEvent);
      if (!this._isShown || hideEvent.isDefaultPrevented()) {
        return;
      }
      this._isShown = false;
      const transition = $(this._element).hasClass(CLASS_NAME_FADE$1);
      if (transition) {
        this._isTransitioning = true;
      }
      this._setEscapeEvent();
      this._setResizeEvent();
      $(document).off(EVENT_FOCUSIN);
      $(this._element).removeClass(CLASS_NAME_SHOW$1);
      $(this._element).off(EVENT_CLICK_DISMISS);
      $(this._dialog).off(EVENT_MOUSEDOWN_DISMISS);
      if (transition) {
        const transitionDuration = Util.getTransitionDurationFromElement(this._element);
        $(this._element).one(Util.TRANSITION_END, event => this._hideModal(event)).emulateTransitionEnd(transitionDuration);
      } else {
        this._hideModal();
      }
    }
    dispose() {
      [window, this._element, this._dialog].forEach(htmlElement => $(htmlElement).off(EVENT_KEY$1));

      /**
       * `document` has 2 events `EVENT_FOCUSIN` and `EVENT_CLICK_DATA_API`
       * Do not move `document` in `htmlElements` array
       * It will remove `EVENT_CLICK_DATA_API` event that should remain
       */
      $(document).off(EVENT_FOCUSIN);
      $.removeData(this._element, DATA_KEY$1);
      this._config = null;
      this._element = null;
      this._dialog = null;
      this._backdrop = null;
      this._isShown = null;
      this._isBodyOverflowing = null;
      this._ignoreBackdropClick = null;
      this._isTransitioning = null;
      this._scrollbarWidth = null;
    }
    handleUpdate() {
      this._adjustDialog();
    }

    // Private
    _getConfig(config) {
      config = _objectSpread2(_objectSpread2({}, Default), config);
      Util.typeCheckConfig(NAME$1, config, DefaultType);
      return config;
    }
    _triggerBackdropTransition() {
      const hideEventPrevented = $.Event(EVENT_HIDE_PREVENTED);
      $(this._element).trigger(hideEventPrevented);
      if (hideEventPrevented.isDefaultPrevented()) {
        return;
      }
      const isModalOverflowing = this._element.scrollHeight > document.documentElement.clientHeight;
      if (!isModalOverflowing) {
        this._element.style.overflowY = 'hidden';
      }
      this._element.classList.add(CLASS_NAME_STATIC);
      const modalTransitionDuration = Util.getTransitionDurationFromElement(this._dialog);
      $(this._element).off(Util.TRANSITION_END);
      $(this._element).one(Util.TRANSITION_END, () => {
        this._element.classList.remove(CLASS_NAME_STATIC);
        if (!isModalOverflowing) {
          $(this._element).one(Util.TRANSITION_END, () => {
            this._element.style.overflowY = '';
          }).emulateTransitionEnd(this._element, modalTransitionDuration);
        }
      }).emulateTransitionEnd(modalTransitionDuration);
      this._element.focus();
    }
    _showElement(relatedTarget) {
      const transition = $(this._element).hasClass(CLASS_NAME_FADE$1);
      const modalBody = this._dialog ? this._dialog.querySelector(SELECTOR_MODAL_BODY) : null;
      if (!this._element.parentNode || this._element.parentNode.nodeType !== Node.ELEMENT_NODE) {
        // Don't move modal's DOM position
        document.body.appendChild(this._element);
      }
      this._element.style.display = 'block';
      this._element.removeAttribute('aria-hidden');
      this._element.setAttribute('aria-modal', true);
      this._element.setAttribute('role', 'dialog');
      if ($(this._dialog).hasClass(CLASS_NAME_SCROLLABLE) && modalBody) {
        modalBody.scrollTop = 0;
      } else {
        this._element.scrollTop = 0;
      }
      if (transition) {
        Util.reflow(this._element);
      }
      $(this._element).addClass(CLASS_NAME_SHOW$1);
      if (this._config.focus) {
        this._enforceFocus();
      }
      const shownEvent = $.Event(EVENT_SHOWN$1, {
        relatedTarget
      });
      const transitionComplete = () => {
        if (this._config.focus) {
          this._element.focus();
        }
        this._isTransitioning = false;
        $(this._element).trigger(shownEvent);
      };
      if (transition) {
        const transitionDuration = Util.getTransitionDurationFromElement(this._dialog);
        $(this._dialog).one(Util.TRANSITION_END, transitionComplete).emulateTransitionEnd(transitionDuration);
      } else {
        transitionComplete();
      }
    }
    _enforceFocus() {
      $(document).off(EVENT_FOCUSIN) // Guard against infinite focus loop
      .on(EVENT_FOCUSIN, event => {
        if (document !== event.target && this._element !== event.target && $(this._element).has(event.target).length === 0) {
          this._element.focus();
        }
      });
    }
    _setEscapeEvent() {
      if (this._isShown) {
        $(this._element).on(EVENT_KEYDOWN_DISMISS, event => {
          if (this._config.keyboard && event.which === ESCAPE_KEYCODE) {
            event.preventDefault();
            this.hide();
          } else if (!this._config.keyboard && event.which === ESCAPE_KEYCODE) {
            this._triggerBackdropTransition();
          }
        });
      } else if (!this._isShown) {
        $(this._element).off(EVENT_KEYDOWN_DISMISS);
      }
    }
    _setResizeEvent() {
      if (this._isShown) {
        $(window).on(EVENT_RESIZE, event => this.handleUpdate(event));
      } else {
        $(window).off(EVENT_RESIZE);
      }
    }
    _hideModal() {
      this._element.style.display = 'none';
      this._element.setAttribute('aria-hidden', true);
      this._element.removeAttribute('aria-modal');
      this._element.removeAttribute('role');
      this._isTransitioning = false;
      this._showBackdrop(() => {
        $(document.body).removeClass(CLASS_NAME_OPEN);
        this._resetAdjustments();
        this._resetScrollbar();
        $(this._element).trigger(EVENT_HIDDEN$1);
      });
    }
    _removeBackdrop() {
      if (this._backdrop) {
        $(this._backdrop).remove();
        this._backdrop = null;
      }
    }
    _showBackdrop(callback) {
      const animate = $(this._element).hasClass(CLASS_NAME_FADE$1) ? CLASS_NAME_FADE$1 : '';
      if (this._isShown && this._config.backdrop) {
        this._backdrop = document.createElement('div');
        this._backdrop.className = CLASS_NAME_BACKDROP;
        if (animate) {
          this._backdrop.classList.add(animate);
        }
        $(this._backdrop).appendTo(document.body);
        $(this._element).on(EVENT_CLICK_DISMISS, event => {
          if (this._ignoreBackdropClick) {
            this._ignoreBackdropClick = false;
            return;
          }
          if (event.target !== event.currentTarget) {
            return;
          }
          if (this._config.backdrop === 'static') {
            this._triggerBackdropTransition();
          } else {
            this.hide();
          }
        });
        if (animate) {
          Util.reflow(this._backdrop);
        }
        $(this._backdrop).addClass(CLASS_NAME_SHOW$1);
        if (!callback) {
          return;
        }
        if (!animate) {
          callback();
          return;
        }
        const backdropTransitionDuration = Util.getTransitionDurationFromElement(this._backdrop);
        $(this._backdrop).one(Util.TRANSITION_END, callback).emulateTransitionEnd(backdropTransitionDuration);
      } else if (!this._isShown && this._backdrop) {
        $(this._backdrop).removeClass(CLASS_NAME_SHOW$1);
        const callbackRemove = () => {
          this._removeBackdrop();
          if (callback) {
            callback();
          }
        };
        if ($(this._element).hasClass(CLASS_NAME_FADE$1)) {
          const backdropTransitionDuration = Util.getTransitionDurationFromElement(this._backdrop);
          $(this._backdrop).one(Util.TRANSITION_END, callbackRemove).emulateTransitionEnd(backdropTransitionDuration);
        } else {
          callbackRemove();
        }
      } else if (callback) {
        callback();
      }
    }

    // ----------------------------------------------------------------------
    // the following methods are used to handle overflowing modals
    // todo (fat): these should probably be refactored out of modal.js
    // ----------------------------------------------------------------------

    _adjustDialog() {
      const isModalOverflowing = this._element.scrollHeight > document.documentElement.clientHeight;
      if (!this._isBodyOverflowing && isModalOverflowing) {
        this._element.style.paddingLeft = "".concat(this._scrollbarWidth, "px");
      }
      if (this._isBodyOverflowing && !isModalOverflowing) {
        this._element.style.paddingRight = "".concat(this._scrollbarWidth, "px");
      }
    }
    _resetAdjustments() {
      this._element.style.paddingLeft = '';
      this._element.style.paddingRight = '';
    }
    _checkScrollbar() {
      const rect = document.body.getBoundingClientRect();
      this._isBodyOverflowing = Math.round(rect.left + rect.right) < window.innerWidth;
      this._scrollbarWidth = this._getScrollbarWidth();
    }
    _setScrollbar() {
      if (this._isBodyOverflowing) {
        // Note: DOMNode.style.paddingRight returns the actual value or '' if not set
        //   while $(DOMNode).css('padding-right') returns the calculated value or 0 if not set
        const fixedContent = [].slice.call(document.querySelectorAll(SELECTOR_FIXED_CONTENT));
        const stickyContent = [].slice.call(document.querySelectorAll(SELECTOR_STICKY_CONTENT));

        // Adjust fixed content padding
        $(fixedContent).each((index, element) => {
          const actualPadding = element.style.paddingRight;
          const calculatedPadding = $(element).css('padding-right');
          $(element).data('padding-right', actualPadding).css('padding-right', "".concat(parseFloat(calculatedPadding) + this._scrollbarWidth, "px"));
        });

        // Adjust sticky content margin
        $(stickyContent).each((index, element) => {
          const actualMargin = element.style.marginRight;
          const calculatedMargin = $(element).css('margin-right');
          $(element).data('margin-right', actualMargin).css('margin-right', "".concat(parseFloat(calculatedMargin) - this._scrollbarWidth, "px"));
        });

        // Adjust body padding
        const actualPadding = document.body.style.paddingRight;
        const calculatedPadding = $(document.body).css('padding-right');
        $(document.body).data('padding-right', actualPadding).css('padding-right', "".concat(parseFloat(calculatedPadding) + this._scrollbarWidth, "px"));
      }
      $(document.body).addClass(CLASS_NAME_OPEN);
    }
    _resetScrollbar() {
      // Restore fixed content padding
      const fixedContent = [].slice.call(document.querySelectorAll(SELECTOR_FIXED_CONTENT));
      $(fixedContent).each((index, element) => {
        const padding = $(element).data('padding-right');
        $(element).removeData('padding-right');
        element.style.paddingRight = padding ? padding : '';
      });

      // Restore sticky content
      const elements = [].slice.call(document.querySelectorAll("".concat(SELECTOR_STICKY_CONTENT)));
      $(elements).each((index, element) => {
        const margin = $(element).data('margin-right');
        if (typeof margin !== 'undefined') {
          $(element).css('margin-right', margin).removeData('margin-right');
        }
      });

      // Restore body padding
      const padding = $(document.body).data('padding-right');
      $(document.body).removeData('padding-right');
      document.body.style.paddingRight = padding ? padding : '';
    }
    _getScrollbarWidth() {
      // thx d.walsh
      const scrollDiv = document.createElement('div');
      scrollDiv.className = CLASS_NAME_SCROLLBAR_MEASURER;
      document.body.appendChild(scrollDiv);
      const scrollbarWidth = scrollDiv.getBoundingClientRect().width - scrollDiv.clientWidth;
      document.body.removeChild(scrollDiv);
      return scrollbarWidth;
    }

    // Static
    static _jQueryInterface(config, relatedTarget) {
      return this.each(function () {
        let data = $(this).data(DATA_KEY$1);
        const _config = _objectSpread2(_objectSpread2(_objectSpread2({}, Default), $(this).data()), typeof config === 'object' && config ? config : {});
        if (!data) {
          data = new Modal(this, _config);
          $(this).data(DATA_KEY$1, data);
        }
        if (typeof config === 'string') {
          if (typeof data[config] === 'undefined') {
            throw new TypeError("No method named \"".concat(config, "\""));
          }
          data[config](relatedTarget);
        } else if (_config.show) {
          data.show(relatedTarget);
        }
      });
    }
  }

  /**
   * Data API implementation
   */

  $(document).on(EVENT_CLICK_DATA_API$1, SELECTOR_DATA_TOGGLE$1, function (event) {
    let target;
    const selector = Util.getSelectorFromElement(this);
    if (selector) {
      target = document.querySelector(selector);
    }
    const config = $(target).data(DATA_KEY$1) ? 'toggle' : _objectSpread2(_objectSpread2({}, $(target).data()), $(this).data());
    if (this.tagName === 'A' || this.tagName === 'AREA') {
      event.preventDefault();
    }
    const $target = $(target).one(EVENT_SHOW$1, showEvent => {
      if (showEvent.isDefaultPrevented()) {
        // Only register focus restorer if modal will actually get shown
        return;
      }
      $target.one(EVENT_HIDDEN$1, () => {
        if ($(this).is(':visible')) {
          this.focus();
        }
      });
    });
    Modal._jQueryInterface.call($(target), config, this);
  });

  /**
   * jQuery
   */

  $.fn[NAME$1] = Modal._jQueryInterface;
  $.fn[NAME$1].Constructor = Modal;
  $.fn[NAME$1].noConflict = () => {
    $.fn[NAME$1] = JQUERY_NO_CONFLICT$1;
    return Modal._jQueryInterface;
  };

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v4.6.2): tab.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */


  /**
   * Constants
   */

  const NAME = 'tab';
  const VERSION = '4.6.2';
  const DATA_KEY = 'bs.tab';
  const EVENT_KEY = ".".concat(DATA_KEY);
  const DATA_API_KEY = '.data-api';
  const JQUERY_NO_CONFLICT = $.fn[NAME];
  const CLASS_NAME_DROPDOWN_MENU = 'dropdown-menu';
  const CLASS_NAME_ACTIVE = 'active';
  const CLASS_NAME_DISABLED = 'disabled';
  const CLASS_NAME_FADE = 'fade';
  const CLASS_NAME_SHOW = 'show';
  const EVENT_HIDE = "hide".concat(EVENT_KEY);
  const EVENT_HIDDEN = "hidden".concat(EVENT_KEY);
  const EVENT_SHOW = "show".concat(EVENT_KEY);
  const EVENT_SHOWN = "shown".concat(EVENT_KEY);
  const EVENT_CLICK_DATA_API = "click".concat(EVENT_KEY).concat(DATA_API_KEY);
  const SELECTOR_DROPDOWN = '.dropdown';
  const SELECTOR_NAV_LIST_GROUP = '.nav, .list-group';
  const SELECTOR_ACTIVE = '.active';
  const SELECTOR_ACTIVE_UL = '> li > .active';
  const SELECTOR_DATA_TOGGLE = '[data-toggle="tab"], [data-toggle="pill"], [data-toggle="list"]';
  const SELECTOR_DROPDOWN_TOGGLE = '.dropdown-toggle';
  const SELECTOR_DROPDOWN_ACTIVE_CHILD = '> .dropdown-menu .active';

  /**
   * Class definition
   */

  class Tab {
    constructor(element) {
      this._element = element;
    }

    // Getters
    static get VERSION() {
      return VERSION;
    }

    // Public
    show() {
      if (this._element.parentNode && this._element.parentNode.nodeType === Node.ELEMENT_NODE && $(this._element).hasClass(CLASS_NAME_ACTIVE) || $(this._element).hasClass(CLASS_NAME_DISABLED) || this._element.hasAttribute('disabled')) {
        return;
      }
      let target;
      let previous;
      const listElement = $(this._element).closest(SELECTOR_NAV_LIST_GROUP)[0];
      const selector = Util.getSelectorFromElement(this._element);
      if (listElement) {
        const itemSelector = listElement.nodeName === 'UL' || listElement.nodeName === 'OL' ? SELECTOR_ACTIVE_UL : SELECTOR_ACTIVE;
        previous = $.makeArray($(listElement).find(itemSelector));
        previous = previous[previous.length - 1];
      }
      const hideEvent = $.Event(EVENT_HIDE, {
        relatedTarget: this._element
      });
      const showEvent = $.Event(EVENT_SHOW, {
        relatedTarget: previous
      });
      if (previous) {
        $(previous).trigger(hideEvent);
      }
      $(this._element).trigger(showEvent);
      if (showEvent.isDefaultPrevented() || hideEvent.isDefaultPrevented()) {
        return;
      }
      if (selector) {
        target = document.querySelector(selector);
      }
      this._activate(this._element, listElement);
      const complete = () => {
        const hiddenEvent = $.Event(EVENT_HIDDEN, {
          relatedTarget: this._element
        });
        const shownEvent = $.Event(EVENT_SHOWN, {
          relatedTarget: previous
        });
        $(previous).trigger(hiddenEvent);
        $(this._element).trigger(shownEvent);
      };
      if (target) {
        this._activate(target, target.parentNode, complete);
      } else {
        complete();
      }
    }
    dispose() {
      $.removeData(this._element, DATA_KEY);
      this._element = null;
    }

    // Private
    _activate(element, container, callback) {
      const activeElements = container && (container.nodeName === 'UL' || container.nodeName === 'OL') ? $(container).find(SELECTOR_ACTIVE_UL) : $(container).children(SELECTOR_ACTIVE);
      const active = activeElements[0];
      const isTransitioning = callback && active && $(active).hasClass(CLASS_NAME_FADE);
      const complete = () => this._transitionComplete(element, active, callback);
      if (active && isTransitioning) {
        const transitionDuration = Util.getTransitionDurationFromElement(active);
        $(active).removeClass(CLASS_NAME_SHOW).one(Util.TRANSITION_END, complete).emulateTransitionEnd(transitionDuration);
      } else {
        complete();
      }
    }
    _transitionComplete(element, active, callback) {
      if (active) {
        $(active).removeClass(CLASS_NAME_ACTIVE);
        const dropdownChild = $(active.parentNode).find(SELECTOR_DROPDOWN_ACTIVE_CHILD)[0];
        if (dropdownChild) {
          $(dropdownChild).removeClass(CLASS_NAME_ACTIVE);
        }
        if (active.getAttribute('role') === 'tab') {
          active.setAttribute('aria-selected', false);
        }
      }
      $(element).addClass(CLASS_NAME_ACTIVE);
      if (element.getAttribute('role') === 'tab') {
        element.setAttribute('aria-selected', true);
      }
      Util.reflow(element);
      if (element.classList.contains(CLASS_NAME_FADE)) {
        element.classList.add(CLASS_NAME_SHOW);
      }
      let parent = element.parentNode;
      if (parent && parent.nodeName === 'LI') {
        parent = parent.parentNode;
      }
      if (parent && $(parent).hasClass(CLASS_NAME_DROPDOWN_MENU)) {
        const dropdownElement = $(element).closest(SELECTOR_DROPDOWN)[0];
        if (dropdownElement) {
          const dropdownToggleList = [].slice.call(dropdownElement.querySelectorAll(SELECTOR_DROPDOWN_TOGGLE));
          $(dropdownToggleList).addClass(CLASS_NAME_ACTIVE);
        }
        element.setAttribute('aria-expanded', true);
      }
      if (callback) {
        callback();
      }
    }

    // Static
    static _jQueryInterface(config) {
      return this.each(function () {
        const $this = $(this);
        let data = $this.data(DATA_KEY);
        if (!data) {
          data = new Tab(this);
          $this.data(DATA_KEY, data);
        }
        if (typeof config === 'string') {
          if (typeof data[config] === 'undefined') {
            throw new TypeError("No method named \"".concat(config, "\""));
          }
          data[config]();
        }
      });
    }
  }

  /**
   * Data API implementation
   */

  $(document).on(EVENT_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function (event) {
    event.preventDefault();
    Tab._jQueryInterface.call($(this), 'show');
  });

  /**
   * jQuery
   */

  $.fn[NAME] = Tab._jQueryInterface;
  $.fn[NAME].Constructor = Tab;
  $.fn[NAME].noConflict = () => {
    $.fn[NAME] = JQUERY_NO_CONFLICT;
    return Tab._jQueryInterface;
  };

  exports.Button = Button;
  exports.Collapse = Collapse;
  exports.Dropdown = Dropdown;
  exports.Modal = Modal;
  exports.Tab = Tab;
  exports.Util = Util;

  return exports;

})({}, jQuery, Popper);
