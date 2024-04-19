import { useState, useEffect } from 'react';
import { getClasses } from '../data';

import { Grid, Button, List } from '@mui/material';
export function BuildList() {
  const [builds, setBuilds] = useState<any[]>([]);
  const [error, setError] = useState<unknown>();

  useEffect(() => {
    async function load() {
      try {
        const classes = await getClasses();
        setBuilds(classes);
      } catch (err) {
        setError(err);
      }
    }
    load();
  }, []);
  if (error) {
    console.log(error);
  }
  return (
    <Grid container>
      <Grid
        container
        sx={{ p: 2, backgroundColor: 'rgba(0,0,0,.5)' }}
        direction="column">
        <Grid container>
          <List>
            {builds.map((build) => {
              const x: any = [];
              for (const key in build) {
                x.push(<span>{build[key]}, </span>);
              }
              return <li>{x}</li>;
            })}
          </List>
        </Grid>
        <Grid container justifyContent={'center'}>
          <Button
            variant="contained"
            sx={{
              '&': {
                minWidth: {
                  xs: 10,
                  md: 40,
                },
                width: {
                  xs: 50,
                  md: 70,
                },
              },
              fontFamily: 'Oswald',
              textTransform: 'capitalize',
            }}>
            test
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
}
