import { ReactNode } from 'react';

type LabelProps = {
  props: {
    children: [
      {
        props: {
          children: {
            props: {
              children: ReactNode;
            };
          };
        };
      },
      {
        props: {
          children: ReactNode;
        };
      },
    ];
  };
};

export { type LabelProps };
