import React from 'react';
import { Link } from '@remix-run/react';
/**
 * @type {React.FC<{
 * label: string,
 * to: string,
 * type?: 'button' | 'submit',
 * isPlain: boolean
 * }>}
 */
const Btn = ({
  href,
  to,
  type = 'button',
  className = '',
  isPlain,
  children,
  ...attrs
}) => {
  let tag;
  if (href) {
    tag = 'a';
    attrs.href = href;
  } else if (to) {
    tag = Link;
    attrs.to = to;
  } else {
    tag = 'button';
    attrs.type = type;
  }

  const classes = [className];

  if (!isPlain) {
    classes.push('btn');
  }

  attrs.className = classes.filter(Boolean).join(' ');

  return React.createElement(tag, attrs, children);
};

export default Btn;
