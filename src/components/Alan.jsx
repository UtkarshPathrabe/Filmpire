import { useEffect, useContext } from 'react';
import alanBtn from '@alan-ai/alan-sdk-web';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { fetchToken, logoutUser } from '../utils';
import { ColorModeContext } from '../utils/ToggleColorMode';
import { selectGenreOrCategory, searchMovie } from '../features/currentGenreOrCategory';

const useAlan = () => {
  const { setMode } = useContext(ColorModeContext);
  const dispatch = useDispatch();
  const history = useHistory();
  useEffect(() => {
    alanBtn({
      key: process.env.REACT_APP_ALAN_AI_KEY,
      onCommand: ({ command, mode, genres, genreOrCategory, query }) => {
        if (command === 'chooseGenre') {
          const genreFound = genres.find((g) => (g.name.toLowerCase() === genreOrCategory.toLowerCase()));
          if (genreFound) {
            history.push('/');
            dispatch(selectGenreOrCategory(genreFound.id));
          } else {
            const category = genreOrCategory.startsWith('top') ? 'top_rated' : genreOrCategory;
            history.push('/');
            dispatch(selectGenreOrCategory(category));
          }
        } else if (command === 'changeMode') {
          setMode((mode === 'dark') ? 'dark' : 'light');
        } else if (command === 'login') {
          fetchToken();
        } else if (command === 'logout') {
          logoutUser();
        } else if (command === 'search') {
          dispatch(searchMovie(query));
        }
      },
    });
  }, []);
};

export default useAlan;
