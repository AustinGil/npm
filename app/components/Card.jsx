import React from 'react';
import { Link } from '@remix-run/react';
import { Svg } from './index.js';
import { getPetTypeSvgHref } from '../utils.js'

/**
 * @type {React.FC<{
 * title?: string,
 * to?: string,
 * thumb?: string,
 * thumbAlt?: string,
 * type?: string,
 * }>}
 */
const Card = ({
  title = '',
  to = '',
  thumb = '',
  thumbAlt,
  type = '',
  className,
  children,
  ...attrs
}) => {
  if (thumb && thumbAlt === undefined) console.warn('thumbAlt is required');

  return (
    <div
      className={[
        'card relative overflow-hidden rounded-2 bg-white shadow transition-all hover:shadow-lg focus-within:shadow-lg hover:scale-105 focus-within:scale-105',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...attrs}
    >
      <div className="aspect-square">
        {thumb && (
          <img
            src={thumb}
            alt={thumbAlt}
            loading="lazy"
            className="w-full h-full object-cover rounded-t"
          />
        )}
        {!thumb && type && (
          <Svg label="Avatar" href={getPetTypeSvgHref(type)} className="p-4" />
        )}
      </div>

      <div className="p-2">
        {title && (
          <h3 className="text-2xl">
            {to && (
              <Link
                to={to}
                className="static text-secondary before:absolute before:inset-0"
              >
                {title}
              </Link>
            )}
            {!to && title}
          </h3>
        )}
        {children}
      </div>
    </div>
  );
};

export default Card;
