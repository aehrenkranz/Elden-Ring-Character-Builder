import { useState, useEffect } from 'react';
import { readBuilds } from '../data';

import { Grid, List } from '@mui/material';
export function BuildList({ onEdit }) {
  const [builds, setBuilds] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const builds = await readBuilds();
        setBuilds(builds);
      } catch (err) {
        alert(`Error loading builds ${err}`);
      }
    }
    load();
  }, []);

  return (
    <Grid
      container
      sx={{ p: 2, backgroundColor: 'rgba(0,0,0,.8)', minHeight: '100%' }}
      direction="column">
      <h1>ELDEN RING CHARACTER BUILDER</h1>
      <Grid container sx={{ marginTop: '2rem' }}>
        <List>
          {builds.map((build) => {
            return (
              <li key={build.id}>
                <h3
                  onClick={() => onEdit(build)}
                  style={{
                    marginTop: '1rem',
                  }}>{`BUILD NAME: ${build.buildName}`}</h3>
                <span>{`CHARACTER NAME: ${build.characterName}`}</span>
              </li>
            );
          })}
        </List>
      </Grid>
      <Grid container justifyContent={'center'}></Grid>
    </Grid>
  );
}
