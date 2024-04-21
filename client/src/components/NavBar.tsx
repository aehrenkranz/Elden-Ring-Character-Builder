import { Grid, Button } from '@mui/material';

export function NavBar({ onNavigate, setEditing }) {
  return (
    <Grid
      container
      justifyContent={'right'}
      sx={{
        backgroundColor: 'black',
      }}>
      {!sessionStorage.getItem('token') && (
        <>
          <Button
            size="large"
            onClick={() => {
              onNavigate('builds');
              setEditing(null);
            }}
            sx={{ fontFamily: 'Oswald', color: 'white' }}>
            NEW BUILD
          </Button>
          <Button
            size="large"
            onClick={() => onNavigate('sign-in')}
            sx={{ fontFamily: 'Oswald', color: 'white' }}>
            SIGN IN
          </Button>
          <Button
            size="large"
            onClick={() => onNavigate('register')}
            sx={{ fontFamily: 'Oswald', color: 'white' }}>
            REGISTER
          </Button>
        </>
      )}
      {sessionStorage.getItem('token') && (
        <>
          <Button
            size="large"
            onClick={() => {
              onNavigate('builds');
              setEditing(null);
            }}
            sx={{ fontFamily: 'Oswald', color: 'white' }}>
            NEW BUILD
          </Button>
          <Button size="large" sx={{ fontFamily: 'Oswald', color: 'white' }}>
            BUILDS
          </Button>
          <Button
            size="large"
            onClick={() => onNavigate('sign-out')}
            sx={{ fontFamily: 'Oswald', color: 'white' }}>
            SIGN OUT
          </Button>
        </>
      )}
    </Grid>
  );
}
