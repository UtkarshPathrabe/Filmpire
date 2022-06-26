import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import { ExitToApp } from '@mui/icons-material';
import { userSelector } from '../../features/auth';
import { useGetListQuery } from '../../services/TMDB';
import { RatedCards } from '..';
import { SESSION_ID } from '../../constants';
import { logoutUser } from '../../utils';

const Profile = () => {
  const { user } = useSelector(userSelector);
  const { data: favoriteMovies, isFetching: isFetchingFavoriteMovies, refetch: refetchFavorites } = useGetListQuery({ listName: 'favorite/movies', accountId: user.id, sessionId: localStorage.getItem(SESSION_ID), page: 1 });
  const { data: watchlistMovies, isFetching: isFetchingWatchlistMovies, refetch: refetchWatchlisted } = useGetListQuery({ listName: 'watchlist/movies', accountId: user.id, sessionId: localStorage.getItem(SESSION_ID), page: 1 });

  useEffect(() => {
    refetchFavorites();
    refetchWatchlisted();
  }, []);

  const logout = () => {
    logoutUser();
  };

  if (isFetchingFavoriteMovies || isFetchingWatchlistMovies) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center">
        <CircularProgress size="8rem" />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" marginBottom="20px">
        <Typography variant="h4" gutterBottom>My Profile</Typography>
        <Button color="inherit" onClick={logout}>
          Logout &nbsp; <ExitToApp />
        </Button>
      </Box>
      { !favoriteMovies?.results?.length && !watchlistMovies?.results?.length
        ? <Typography>Add favourites or watchlist some movies to see them here!</Typography>
        : (
          <Box>
            <RatedCards title="Favorite Movies" data={favoriteMovies} />
            <RatedCards title="Watchlist" data={watchlistMovies} />
          </Box>
        ) }
    </Box>
  );
};

export default Profile;
