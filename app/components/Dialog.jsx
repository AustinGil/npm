import React, { useEffect, useRef, useState } from 'react';
import { randomString } from '../utils.js';
import { Svg } from './index.js';

const KEYCODES = Object.freeze({
  TAB: 9,
  ENTER: 13,
  ESC: 27,
  SPACE: 32,
  PAGEUP: 33,
  PAGEDOWN: 34,
  END: 35,
  HOME: 36,
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
});
const FOCUSABLE = [
  'a[href]:not([tabindex^="-"])',
  'area[href]:not([tabindex^="-"])',
  'input:not([disabled]):not([type="hidden"]):not([aria-hidden]):not([tabindex^="-"])',
  'select:not([disabled]):not([aria-hidden]):not([tabindex^="-"])',
  'textarea:not([disabled]):not([aria-hidden]):not([tabindex^="-"])',
  'button:not([disabled]):not([aria-hidden]):not([tabindex^="-"]):not([tabindex^="-"])',
  'iframe:not([tabindex^="-"])',
  'object:not([tabindex^="-"])',
  'embed:not([tabindex^="-"])',
  '[contenteditable]:not([tabindex^="-"])',
  '[tabindex]:not([tabindex^="-"])',
];

/**
 * @type {React.FC<{
 * toggle: string | React.FC
 * }>}
 */
const Dialog = ({ toggle, id = '', children }) => {
  id = id || `id_${randomString(6)}`;

  const [isShowing, setShowing] = useState(false);
  const [activeEl, setActiveEl] = useState(/** @type {HTMLElement} */(null));

  const toggleRef = useRef(/** @type {HTMLElement} */(null));
  const contentRef = useRef(/** @type {HTMLElement} */(null));

  useEffect(() => {
    setShowing(document.location.hash === `#${id}`);
    window.addEventListener('keydown', onKeydown);
    return function cleanup() {
      document.removeEventListener('keydown', onKeydown);
    };
  }, []);

  function open() {
    setShowing(true);
  }
  function close() {
    setShowing(false);
  }
  useEffect(() => {
    if (isShowing) {
      setActiveEl(document.activeElement);
      window.location.hash = `#${id}`;
      contentRef.current.focus();
    } else {
      window.location.hash = '';
      activeEl ? activeEl.focus() : toggleRef.current.focus();
    }
    toggleRef.current.ariaExpanded = isShowing;
  }, [isShowing]);

  function onKeydown(event) {
    console.log(isShowing);
    if (event.keyCode === KEYCODES.ESC) {
      close();
      return;
    }
    if (event.keyCode === KEYCODES.TAB) {
      const content = contentRef.current;
      const focusable = Array.from(content.querySelectorAll(FOCUSABLE));
      if (!content.contains(document.activeElement)) {
        focusable[0].focus();
      } else {
        const focusedItemIndex = focusable.indexOf(document.activeElement);
        if (event.shiftKey && focusedItemIndex <= 0) {
          focusable.at(-1).focus();
        }
        if (!event.shiftKey && focusedItemIndex === focusable.length - 1) {
          focusable.at(0).focus();
        }
      }
    }
  }

  return (
    <>
      <a
        ref={toggleRef}
        href={`#${id}`}
        role="button"
        aria-haspopup="true"
        onClick={() => open('wtf')}
      >
        {toggle}
      </a>

      <div
        id={id}
        className="fixed inset-0 grid place-content-center bg-gray-900/60 invisible opacity-0 transition duration-200 target:visible target:opacity-100"
      >
        <a className="absolute inset-0" href="#" onClick={close}>
          <span className="visually-hidden">Close modal</span>
        </a>
        <div
          ref={contentRef}
          className="relative max-w-xl rounded p-6 bg-white"
          tabIndex="-1"
          role="dialog"
          aria-modal="true"
        >
          <a
            className="close absolute top-0 right-1 text-xl"
            href="#"
            onClick={close}
          >
            <Svg icon="cancel" label="Close modal" />
          </a>
          {children}
        </div>
      </div>
    </>
  );
};

export default Dialog;
