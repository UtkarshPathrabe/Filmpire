import React from 'react';
import { Typography, Box } from '@mui/material';

import { Movie } from '..';

const RatedCards = ({ title, data }) => (
  <Box>
    <Typography variant="h4" gutterBottom sx={{ textAlign: { xs: 'center', sm: 'center', md: 'left' } }}>{title}</Typography>
    <Box display="flex" flexWrap="wrap" sx={{ justifyContent: { xs: 'center', sm: 'center', md: 'space-between', lg: 'flex-start' } }} marginBottom="20px">
      {data?.results?.map((movie, i) => (<Movie key={movie.id} movie={movie} i={i} />))}
    </Box>
  </Box>
);

export default RatedCards;
