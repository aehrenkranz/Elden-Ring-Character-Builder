import { Grid, Button } from '@mui/material';

export function SignInForm({ onSignIn }) {
  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const formData = new FormData(event.currentTarget);
      const userData = Object.fromEntries(formData.entries());
      event.currentTarget.reset();
      const req = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      };
      const res = await fetch('/api/auth/sign-in', req);
      if (!res.ok) {
        throw new Error(`fetch Error ${res.status}`);
      }
      const tokenObj = await res.json();
      sessionStorage.setItem('token', tokenObj.token);

      onSignIn();
    } catch (err) {
      alert(`Error signing in: ${err}`);
    }
  }

  return (
    <Grid
      container
      justifyContent={'center'}
      sx={{
        backgroundColor: 'rgba(0,0,0,.8)',
        padding: '1rem',
        height: '100%',
      }}>
      <Grid
        container
        justifyContent={'center'}
        item
        xs={12}
        sx={{ maxHeight: '20%' }}>
        <h1>ELDEN RING CHARACTER BUILDER</h1>
      </Grid>

      <Grid container item xs={6} md={4}>
        <form onSubmit={handleSubmit}>
          <h2>SIGN IN</h2>
          <Grid container item sx={{ marginTop: '1rem' }}>
            <label>USERNAME</label>
            <input id="username" required type="text" name="username"></input>
            <label>PASSWORD</label>
            <input
              id="password"
              required
              type="password"
              name="password"></input>

            <Grid container justifyContent={'center'}>
              <Button
                type="submit"
                sx={{
                  fontFamily: 'Oswald',
                }}
                variant="contained">
                SIGN IN
              </Button>
            </Grid>
          </Grid>
        </form>
      </Grid>
    </Grid>
  );
}
