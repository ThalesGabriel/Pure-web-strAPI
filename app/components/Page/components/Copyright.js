import React from 'react';
import Typography from '@material-ui/core/Typography';
import MuiLink from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import SvgIcon from '@material-ui/core/SvgIcon';
import FavoriteIcon from '@material-ui/icons/Favorite';

function LightBulbIcon(props) {
  return (
    <SvgIcon {...props}>
      <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7zm2.85 11.1l-.85.6V16h-4v-2.3l-.85-.6C7.8 12.16 7 10.63 7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.63-.8 3.16-2.15 4.1z" />
    </SvgIcon>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(6, 0, 3),
    marginTop: 'auto',
    "@media screen and (min-width: 500px)": {
      display: 'flex',
      alignItems: 'center',
      justifyContent:'center'
    },
    "@media screen and (max-width: 500px)": {
      textAlign: 'center'
    }
  },
  lightBulb: {
    verticalAlign: 'middle',
    fill: theme.palette.primary.main,
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(1),
  },
}));

export default function Copyright() {
  const classes = useStyles();
  return (
    <Typography className={classes.root} color="textSecondary">
      Pure web strap app developed with 
      <FavoriteIcon className={classes.lightBulb} color="primary"/>
      for Trustly
    </Typography>
  );
}
