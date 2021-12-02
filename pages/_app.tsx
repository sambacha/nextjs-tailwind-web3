/**
* @file Nextjs
* @copyright 2021
* @license Apache-2.0
*/
import { ThemeProvider } from 'next-themes';
import { darkTheme, globalCss, theme } from '../stitches.config';
import { AppProps } from 'next/app';


const globalStyles = globalCss({
  '*': {
    fontFamily: '$sans',
  },
  'html, body': {
    color: '$foreground',
    backgroundColor: '$background',
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  globalStyles();

  return (
    <ThemeProvider
      attribute="class"
      value={{
        // @note Run the .toString method to get the classnames of the stitches-theme
        light: theme.toString(),
        dark: darkTheme.toString(),
      }}
    >
      <Component {...pageProps} />
    </ThemeProvider>
  );
}


export default MyApp;
/** @exports MyApp */
