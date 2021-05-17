import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import ProTip from "./components/ProTip";
import Copyright from "./components/Copyright";
import { Container } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  containerPrincipal: {
    display: "flex",
		flexDirection: 'column',
		height: '100vh'
  },
}));

export default function Page({ children }) {
  const classes = useStyles();

  return (
    <Container maxWidth="lg" className={classes.containerPrincipal}>
      <Box my={12}>{children}</Box>
      <ProTip />
      <Copyright />
    </Container>
  );
}
