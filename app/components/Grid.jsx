import React from 'react';

/**
 * @type {React.FC<{
 * items: Array,
 * }>}
 */
const Grid = ({ items = [], className, ...attrs }) => {
  return (
    <>
      {items.length < 1 && (
        <p className={["text-xl text-center", className].filter(Boolean).join(' ')}>Nothing to see here.</p>
      )}
      {items.length > 0 && (
        <>
          <ul
            className={[
              'grid sm:grid-cols-2 md:grid-cols-3 gap-4',
              className,
            ]
              .filter(Boolean)
              .join(' ')}
            {...attrs}
          >
            {items.map((item, index) => (
              <li key={item.id || index}>{item}</li>
            ))}
          </ul>
        </>
      )}
    </>
  );
};

export default Grid;
