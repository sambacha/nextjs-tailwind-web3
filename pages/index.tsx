import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { styled } from '../stitches.config';

const Page = styled('div', {
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
});

const ThemeSwitcher = styled('button', {
  border: 'none',
  color: '$background',
  backgroundColor: '$foreground',
  fontSize: '1.2em',
  padding: '.5em',
  borderRadius: '.5rem',
});

const ThemeChanger = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;
  return (
    <Page>
      <h1>Next Web3x + Stitches/Radix </h1>
      <ThemeSwitcher
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      >
        Change Theme
      </ThemeSwitcher>
      <br />
      <div>
        The current theme is: {theme}
        <button onClick={() => setTheme('light')}>Light Mode</button>
        <button onClick={() => setTheme('dark')}>Dark Mode</button>
      </div>
    </Page>
  );
};

export default ThemeChanger;
