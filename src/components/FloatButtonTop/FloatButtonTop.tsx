import { forwardRef, memo } from 'react';
import { FloatButton, BackTopProps, FloatButtonRef } from 'antd';

const FloatButtonTop = forwardRef<FloatButtonRef, BackTopProps>((props, ref) => (
  <FloatButton.BackTop {...props} ref={ref} />
));

export default memo(FloatButtonTop);
