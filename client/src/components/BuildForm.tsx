import { Box, Button, Grid, Typography, Modal } from '@mui/material';
import { useEffect, useState } from 'react';
import {
  addBuild,
  readSingleClass,
  calculateFp,
  calculateHp,
  calculateStamina,
  updateBuild,
  removeBuild,
} from '../data';

type Stats = {
  vigor: number;
  mind: number;
  endurance: number;
  strength: number;
  dexterity: number;
  intelligence: number;
  faith: number;
  arcane: number;
};
export function BuildForm({ onCreate, build }) {
  const defaultStats = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  const [currentClass, setCurrentClass] = useState<Stats>();
  const [currentStats, setCurrentStats] = useState(defaultStats);
  const [isDeleting, setIsDeleting] = useState(false);
  useEffect(() => {
    async function load() {
      try {
        if (build) {
          await handleClassSelect(Number(build.classId));
          const statArr: number[] = [];
          for (const key in build) {
            if (
              key !== 'id' &&
              key !== 'classId' &&
              key !== 'buildName' &&
              key !== 'characterName'
            ) {
              statArr.push(build[key]);
            }
          }
          setCurrentStats(statArr);
        } else {
          await handleClassSelect(1);
        }
      } catch (err) {
        throw new Error(`Error  ${err}`);
      }
    }
    load();
  }, [build]);

  let level =
    currentStats.reduce((total, current) => {
      return total + current;
    }, 0) - 79;
  if (level < 0) {
    level = 0;
  }

  async function handleSubmit(event) {
    try {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const newBuild = Object.fromEntries(formData.entries());
      event.currentTarget.reset();
      if (build) {
        newBuild.id = build.id;
        await updateBuild(newBuild);
      } else {
        await addBuild(newBuild);
      }
      onCreate();
    } catch (err) {
      throw new Error(`Error submitting build ${err}`);
    }
  }

  async function handleDelete() {
    if (!build) throw new Error('Should not happen');
    try {
      await removeBuild(build.id);
      onCreate();
    } catch (err) {
      alert(`Error deleting entry: ${err}`);
    } finally {
      setIsDeleting(false);
    }
  }

  async function handleClassSelect(selection) {
    try {
      const res = await readSingleClass(selection);
      setCurrentClass(res);
      const statArr: number[] = [];
      for (const stat in res) {
        statArr.push(res[stat]);
      }
      setCurrentStats(statArr);
    } catch (err) {
      throw new Error(`Error selecting class ${err}`);
    }
  }

  function handleStatChange(event) {
    if (event.target.value > 99) {
      event.target.value = 99;
    }
    const newStats = currentStats.map((el, i) => {
      if (i + 1 === Number(event.target.id)) {
        return Number(event.target.value);
      } else {
        return el;
      }
    });
    setCurrentStats(newStats);
    event.target.value = Number(event.target.value);
  }

  return (
    <Grid
      justifyContent={'center'}
      container
      sx={{
        backgroundColor: 'rgba(0,0,0,.8)',
        padding: '1rem',
        minHeight: '100%',
      }}>
      <h1>ELDEN RING CHARACTER BUILDER</h1>

      <form onSubmit={handleSubmit}>
        <Box width={'100%'}>
          <input
            defaultValue={build?.buildName}
            name="build-name"
            id="build-name"
            required
            type="text"
            placeholder="BUILD NAME"></input>
        </Box>

        <Grid container width={'100%'}>
          <Box>
            <label>CHARACTER NAME</label>
          </Box>
          <input
            defaultValue={build?.characterName}
            name="character-name"
            id="character-name"
            required
            type="text"></input>
          <Grid item xs={12}>
            <label>CLASS NAME</label>
          </Grid>
          <Grid container xs={6} item>
            <select
              onChange={(e) => handleClassSelect(e.currentTarget.value)}
              required
              name="class-name"
              id="class-name">
              <option value={1}>Vagabond</option>
              <option value={2}>Warrior</option>
              <option value={3}>Hero</option>
              <option value={4}>Bandit</option>
              <option value={5}>Astrologer</option>
              <option value={6}>Prophet</option>
              <option value={7}>Samurai</option>
              <option value={8}>Prisoner</option>
              <option value={9}>Confessor</option>
              <option value={10}>Wretch</option>
            </select>
          </Grid>
          <Grid container xs={6} item justifyContent={'right'}>
            {build && (
              <Button
                sx={{
                  backgroundColor: 'rgba(0, 0, 0, 0.69)',
                  marginRight: '1rem',
                }}
                onClick={() => setIsDeleting(true)}
                color="error"
                variant="outlined">
                DELETE BUILD
              </Button>
            )}
            <Modal
              open={isDeleting}
              onClose={() => setIsDeleting(false)}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description">
              <Box
                sx={{
                  borderRadius: '4px',
                  position: 'absolute' as const,
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: 400,
                  color: 'white',
                  bgcolor: 'black',
                  border: '2px solid #000',
                  boxShadow: 24,
                  p: 4,
                }}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                  Are you sure you want to delete this build?
                </Typography>
                <Typography
                  id="modal-modal-description"
                  sx={{ mt: 2, textAlign: 'center' }}>
                  This action cannot be undone.
                </Typography>
                <Grid
                  container
                  sx={{ marginTop: '1rem' }}
                  justifyContent={'right'}>
                  <Button
                    sx={{
                      marginRight: '1rem',
                    }}
                    onClick={() => setIsDeleting(false)}
                    variant="contained">
                    CANCEL
                  </Button>
                  <Button
                    sx={{
                      backgroundColor: 'rgba(0, 0, 0, 0.69)',
                      marginRight: '1rem',
                    }}
                    onClick={() => handleDelete()}
                    color="error"
                    variant="outlined">
                    DELETE
                  </Button>
                </Grid>
              </Box>
            </Modal>
            <Button
              variant="outlined"
              color="error"
              size="medium"
              type="reset"
              sx={{
                backgroundColor: 'rgba(0, 0, 0, 0.69)',
                marginRight: '1rem',
                fontFamily: 'Oswald',
              }}>
              RESET
            </Button>
            <Button
              type="submit"
              size="medium"
              sx={{
                fontFamily: 'Oswald',
              }}
              variant="contained">
              SAVE
            </Button>
          </Grid>
        </Grid>

        <Grid
          container
          sx={{ marginTop: 2, backgroundColor: 'rgba(0,0,0,.6)' }}>
          <Grid container justifyContent={'center'} item xs={4}>
            <h3>STAT</h3>
            <Grid container flexDirection={'column'} alignContent={'center'}>
              <input
                className="stat-grid-r"
                type="text"
                readOnly
                defaultValue={'Vigor'}></input>
              <input
                className="stat-grid-r"
                type="text"
                readOnly
                defaultValue={'Mind'}></input>
              <input
                className="stat-grid-r"
                type="text"
                readOnly
                defaultValue={'Endurance'}></input>
              <input
                className="stat-grid-r"
                type="text"
                readOnly
                defaultValue={'Strength'}></input>
              <input
                className="stat-grid-r"
                type="text"
                readOnly
                defaultValue={'Dexterity'}></input>
              <input
                className="stat-grid-r"
                type="text"
                readOnly
                defaultValue={'Intelligence'}></input>
              <input
                className="stat-grid-r"
                type="text"
                readOnly
                defaultValue={'Faith'}></input>
              <input
                className="stat-grid-r"
                type="text"
                readOnly
                defaultValue={'Arcane'}></input>
            </Grid>
          </Grid>
          <Grid container justifyContent={'center'} item xs={4}>
            <h3>INITIAL</h3>
            <Grid container flexDirection={'column'} alignContent={'center'}>
              <input
                className="stat-grid-r"
                type="text"
                readOnly
                defaultValue={currentClass?.vigor}></input>
              <input
                className="stat-grid-r"
                type="text"
                readOnly
                defaultValue={currentClass?.mind}></input>
              <input
                className="stat-grid-r"
                type="text"
                readOnly
                defaultValue={currentClass?.endurance}></input>
              <input
                className="stat-grid-r"
                type="text"
                readOnly
                defaultValue={currentClass?.strength}></input>
              <input
                className="stat-grid-r"
                type="text"
                readOnly
                defaultValue={currentClass?.dexterity}></input>
              <input
                className="stat-grid-r"
                type="text"
                readOnly
                defaultValue={currentClass?.intelligence}></input>
              <input
                className="stat-grid-r"
                type="text"
                readOnly
                defaultValue={currentClass?.faith}></input>
              <input
                className="stat-grid-r"
                type="text"
                readOnly
                defaultValue={currentClass?.arcane}></input>
            </Grid>
          </Grid>
          <Grid container justifyContent={'center'} item xs={4}>
            <h3>VALUE</h3>
            <Grid container flexDirection={'column'} alignContent={'center'}>
              <input
                required
                name="vigor"
                className="stat-grid"
                id="1"
                type="number"
                min={1}
                max={99}
                value={currentStats[0]}
                onChange={(event) => {
                  handleStatChange(event);
                }}></input>
              <input
                required
                name="mind"
                id="2"
                className="stat-grid"
                type="number"
                min={1}
                max={99}
                value={currentStats[1]}
                onChange={(event) => {
                  handleStatChange(event);
                }}></input>
              <input
                required
                name="endurance"
                id="3"
                className="stat-grid"
                type="number"
                min={1}
                max={99}
                value={currentStats[2]}
                onChange={(event) => {
                  handleStatChange(event);
                }}></input>
              <input
                required
                name="strength"
                id="4"
                className="stat-grid"
                type="number"
                min={1}
                max={99}
                value={currentStats[3]}
                onChange={(event) => {
                  handleStatChange(event);
                }}></input>
              <input
                required
                name="dexterity"
                id="5"
                className="stat-grid"
                type="number"
                min={1}
                max={99}
                value={currentStats[4]}
                onChange={(event) => {
                  handleStatChange(event);
                }}></input>
              <input
                required
                name="intelligence"
                id="6"
                className="stat-grid"
                type="number"
                min={1}
                max={99}
                value={currentStats[5]}
                onChange={(event) => {
                  handleStatChange(event);
                }}></input>
              <input
                required
                name="faith"
                id="7"
                className="stat-grid"
                type="number"
                min={1}
                max={99}
                value={currentStats[6]}
                onChange={(event) => {
                  handleStatChange(event);
                }}></input>
              <input
                required
                name="arcane"
                id="8"
                className="stat-grid"
                type="number"
                min={1}
                max={99}
                value={currentStats[7]}
                onChange={(event) => {
                  handleStatChange(event);
                }}></input>
            </Grid>
          </Grid>
        </Grid>
      </form>

      <Grid container sx={{ marginTop: 2, backgroundColor: 'rgba(0,0,0,.6)' }}>
        <Grid container justifyContent={'center'}>
          <h3>CALCULATED STATS</h3>
        </Grid>
        <Grid xs={6} item container flexDirection={'column'}>
          <Box>
            <h4>LEVEL:</h4>
          </Box>
          <Box>
            <h4>HP:</h4>
          </Box>
          <Box>
            <h4>FP:</h4>
          </Box>
          <Box>
            <h4>STAMINA:</h4>
          </Box>
          <Box>
            <h4>DISCOVERY:</h4>
          </Box>
        </Grid>
        <Grid xs={6} item container flexDirection={'column'}>
          <Box>
            <h4>{level}</h4>
          </Box>
          <Box>
            <h4>{calculateHp(currentStats[0])}</h4>
          </Box>
          <Box>
            <h4>{calculateFp(currentStats[1])}</h4>
          </Box>
          <Box>
            <h4>{calculateStamina(currentStats[2])}</h4>
          </Box>
          <Box>
            <h4>{currentStats[7] + 100}</h4>
          </Box>
        </Grid>
      </Grid>
    </Grid>
  );
}
