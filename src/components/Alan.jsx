import { useEffect, useContext } from 'react';
import alanBtn from '@alan-ai/alan-sdk-web';

import { fetchToken, logoutUser } from '../utils';
import { ColorModeContext } from '../utils/ToggleColorMode';

const useAlan = () => {
  const { setMode } = useContext(ColorModeContext);
  useEffect(() => {
    alanBtn({
      key: process.env.REACT_APP_ALAN_AI_KEY,
      onCommand: ({ command, mode }) => {
        if (command === 'changeMode') {
          if (mode === 'dark') {
            setMode('dark');
          } else {
            setMode('light');
          }
        } else if (command === 'login') {
          fetchToken();
        } else if (command === 'logout') {
          logoutUser();
        }
      },
    });
  }, []);
};

export default useAlan;
