import { makeStyles } from '@mui/styles';

export default makeStyles((theme) => ({
  root: {
    display: 'flex',
    height: '100%',
  },
  toolbar: {
    height: '70px',
  },
  content: {
    flexGrow: '1',
    padding: '2em',
    [theme.breakpoints.down('md')]: {
      padding: '2em 0.5em',
    },
    [theme.breakpoints.down('sm')]: {
      padding: '2em 0.25em',
    },
  },
}));
