import React from 'react';
import { Box, Typography, Card, CardContent, CardMedia } from '@mui/material';
import { Link } from 'react-router-dom';

import useStyles from './styles';
import { TMDB_IMAGE_PATH } from '../../constants';

const FeaturedMovie = ({ movie }) => {
  const classes = useStyles();
  if (!movie) return null;
  return (
    <Box component={Link} to={`/movies/${movie.id}`} className={classes.featuredCardContainer}>
      <Card className={classes.card} classes={{ root: classes.cardRoot }}>
        <CardMedia
          media="picture"
          alt={movie?.title}
          image={`${TMDB_IMAGE_PATH}/original/${movie?.backdrop_path}`}
          title={movie?.title}
          className={classes.cardMedia}
        />
        <Box padding="20px">
          <CardContent className={classes.cardContent} classes={{ root: classes.cardContentRoot }}>
            <Typography variant="h5" gutterBottom>{movie?.title}</Typography>
            <Typography variant="body2">{movie?.overview}</Typography>
          </CardContent>
        </Box>
      </Card>
    </Box>
  );
};

export default FeaturedMovie;
