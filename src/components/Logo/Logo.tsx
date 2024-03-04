import Link from 'antd/es/typography/Link';
import { ReactComponent as LogoImported } from 'asserts/icons/logo-full.svg';

const Logo = (): JSX.Element => (
  <Link href="/">
    <LogoImported className="custom-link-svg" />
  </Link>
);

export default Logo;
