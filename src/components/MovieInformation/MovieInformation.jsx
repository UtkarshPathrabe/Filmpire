import React, { useEffect, useState } from 'react';
import { Modal, Typography, Button, ButtonGroup, Grid, Box, CircularProgress, Rating } from '@mui/material';
import { Movie as MovieIcon, Theaters, Language, PlusOne, Favorite, FavoriteBorderOutlined, Remove, ArrowBack } from '@mui/icons-material';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

import { selectGenreOrCategory } from '../../features/currentGenreOrCategory';
import genreIcons from '../../assets/genres';
import { MovieList } from '..';
import { useGetMovieQuery, useGetRecommendationsQuery, useGetListQuery } from '../../services/TMDB';
import useStyles from './styles';
import { userSelector } from '../../features/auth';
import { SESSION_ID, TMDB_API_BASE_URL, TMDB_IMAGE_PATH } from '../../constants';

const getMovieTrailerVideoKey = (videosList) => {
  if (videosList && videosList.length > 0) {
    const trailers = videosList.filter(({ type, official }) => type.toLowerCase() === 'trailer' && official);
    return (trailers.length > 0) ? trailers.at(-1).key : videosList.at(-1).key;
  }
  return null;
};

const MovieInformation = () => {
  const { user, isAuthenticated } = useSelector(userSelector);
  const { id } = useParams();
  const [open, setOpen] = useState(false);
  const [isMovieFavorited, setIsMovieFavorited] = useState(false);
  const [isMovieWatchlisted, setIsMovieWatchlisted] = useState(false);
  const classes = useStyles();
  const dispatch = useDispatch();
  const { data, isFetching, error } = useGetMovieQuery(id);
  const { data: favoriteMovies, refetch: refetchFavorites } = useGetListQuery({ listName: 'favorite/movies', accountId: user.id, sessionId: localStorage.getItem(SESSION_ID), page: 1 });
  const { data: watchlistMovies, refetch: refetchWatchlisted } = useGetListQuery({ listName: 'watchlist/movies', accountId: user.id, sessionId: localStorage.getItem(SESSION_ID), page: 1 });
  const { data: recommendations, isFetching: isFetchingRecommendations } = useGetRecommendationsQuery({ list: '/recommendations', movie_id: id });

  useEffect(() => {
    if (isAuthenticated) {
      refetchFavorites();
      refetchWatchlisted();
    }
  }, []);

  useEffect(() => {
    setIsMovieFavorited(!!(favoriteMovies?.results?.find((movie) => movie?.id === data?.id)));
  }, [favoriteMovies, data]);

  useEffect(() => {
    setIsMovieWatchlisted(!!(watchlistMovies?.results?.find((movie) => movie?.id === data?.id)));
  }, [watchlistMovies, data]);

  const addToFavourites = async () => {
    await axios.post(
      `${TMDB_API_BASE_URL}/account/${user.id}/favorite?api_key=${process.env.REACT_APP_TMDB_KEY}&session_id=${localStorage.getItem(SESSION_ID)}`,
      {
        media_type: 'movie',
        media_id: id,
        favorite: !isMovieFavorited,
      },
    );
    setIsMovieFavorited((prev) => !prev);
  };

  const addToWatchlist = async () => {
    await axios.post(
      `${TMDB_API_BASE_URL}/account/${user.id}/watchlist?api_key=${process.env.REACT_APP_TMDB_KEY}&session_id=${localStorage.getItem(SESSION_ID)}`,
      {
        media_type: 'movie',
        media_id: id,
        watchlist: !isMovieWatchlisted,
      },
    );
    setIsMovieWatchlisted((prev) => !prev);
  };

  if (isFetching) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center">
        <CircularProgress size="8rem" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center">
        <Link to="/">Something has gone wrong - Go back</Link>
      </Box>
    );
  }

  const movieTrailerVideoKey = getMovieTrailerVideoKey(data?.videos?.results);

  return (
    <Grid container className={classes.containerSpaceAround}>
      <Grid item sm={12} lg={4} style={{ display: 'flex', marginBottom: '30px' }}>
        <img className={classes.poster} src={`${TMDB_IMAGE_PATH}/w500/${data?.poster_path}`} alt={data?.title} />
      </Grid>
      <Grid item container direction="column" lg={7}>
        <Typography variant="h3" align="center" gutterBottom>{data?.title} ({data.release_date.split('-')[0]})</Typography>
        <Typography variant="h5" align="center" gutterBottom>{data?.tagline}</Typography>
        <Grid item className={classes.containerSpaceAround}>
          <Box display="flex" align="center">
            <Rating readOnly value={data.vote_average / 2} />
            <Typography variant="subtitle1" gutterBottom style={{ marginLeft: '10px' }}>{data?.vote_average} / 10</Typography>
          </Box>
          <Typography variant="h6" align="center" gutterBottom>
            {data?.runtime} min | Language: {`${data?.spoken_languages[0]?.english_name}`}
          </Typography>
        </Grid>
        <Grid item className={classes.genresContainer}>
          {data?.genres?.map((genre) => (
            <Link className={classes.links} to="/" onClick={() => dispatch(selectGenreOrCategory(genre?.id))} key={genre?.name}>
              <img src={genreIcons[genre?.name.toLowerCase()]} className={classes.genreImage} height={30} />
              <Typography color="textPrimary" variant="subtitle1">{genre?.name}</Typography>
            </Link>
          ))}
        </Grid>
        <Typography variant="h5" gutterBottom style={{ marginTop: '10px' }}>Overview</Typography>
        <Typography style={{ marginBottom: '2rem' }}>{data?.overview}</Typography>
        <Typography variant="h5" gutterBottom>Top Cast</Typography>
        <Grid item container spacing={2} justifyContent="flex-start">
          {data?.credits?.cast?.map((character, i) => (
            character?.profile_path && (
            <Grid key={i} item xs={4} md={2} component={Link} to={`/actors/${character?.id}`} style={{ textDecoration: 'none' }}>
              <img className={classes.castImage} src={`${TMDB_IMAGE_PATH}/w500/${character?.profile_path}`} alt={character?.name} />
              <Typography color="textPrimary">{character?.name}</Typography>
              <Typography color="textSecondary">{character?.character?.split('/')[0]}</Typography>
            </Grid>
            )
          )).slice(0, 6)}
        </Grid>
        <Grid item container style={{ marginTop: '2rem' }}>
          <div className={classes.buttonsContainer}>
            <Grid item xs={12} sm={6} className={classes.buttonsContainer}>
              <ButtonGroup size="medium" variant="outlined">
                <Button target="_blank" rel="noopener noreferrer" href={data?.homepage} endIcon={<Language />}>Website</Button>
                <Button target="_blank" rel="noopener noreferrer" href={`https://www.imdb.com/title/${data?.imdb_id}`} endIcon={<MovieIcon />}>IMDB</Button>
                <Button disabled={!movieTrailerVideoKey} onClick={() => setOpen(true)} endIcon={<Theaters />}>Trailer</Button>
              </ButtonGroup>
            </Grid>
            <Grid item xs={12} sm={6} className={classes.buttonsContainer}>
              <ButtonGroup size="medium" variant="outlined">
                <Button disabled={!isAuthenticated} onClick={addToFavourites} endIcon={isMovieFavorited ? <FavoriteBorderOutlined /> : <Favorite />}>
                  {isMovieFavorited ? 'Unfavorite' : 'Favorite'}
                </Button>
                <Button disabled={!isAuthenticated} onClick={addToWatchlist} endIcon={isMovieWatchlisted ? <Remove /> : <PlusOne />}>
                  Watchlist
                </Button>
                <Button endIcon={<ArrowBack />} sx={{ borderColor: 'primary.main' }}>
                  <Typography component={Link} to="/" color="inherit" variant="subtitle1" style={{ textDecoration: 'none' }}>Back</Typography>
                </Button>
              </ButtonGroup>
            </Grid>
          </div>
        </Grid>
      </Grid>
      <Box marginTop="5rem" width="100%">
        <Typography variant="h3" gutterBottom align="center">You might also like</Typography>
        { isFetchingRecommendations ? (
          <Box display="flex" justifyContent="center" alignItems="center">
            <CircularProgress size="4rem" />
          </Box>
        ) : (<></>) }
        { recommendations
          ? <MovieList movies={recommendations} numberOfMovies={12} />
          : <Box>Sorry! Nothing was found.</Box> }
      </Box>
      <Modal closeAfterTransition className={classes.modal} open={open} onClose={() => setOpen(false)}>
        {movieTrailerVideoKey && (
          <iframe
            autoPlay
            className={classes.video}
            frameBorder="0"
            title="Trailer"
            src={`https://www.youtube.com/embed/${movieTrailerVideoKey}`}
            allow="autoplay"
          />
        )}
      </Modal>
    </Grid>
  );
};

export default MovieInformation;
