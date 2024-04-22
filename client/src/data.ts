export async function readBuilds() {
  const req = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem('token')}`,
    },
  };
  const res = await fetch('/api/builds', req);
  if (!res.ok) throw new Error(`Error loading builds ${res.status}`);
  return await res.json();
}

export async function readSingleClass(classId) {
  const res = await fetch(`/api/class/${classId}`);
  return await res.json();
}

export async function readSingleBuild(buildId) {
  const req = {
    method: 'GET',
  };
  const res = await fetch(`api/builds/${buildId}`, req);
  if (!res.ok) throw new Error(`fetch Error ${res.status}`);
  return await res.json();
}

export async function getClasses() {
  const res = await fetch('/api/classes');
  return await res.json();
}

export async function addBuild(build) {
  const req = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${sessionStorage.getItem('token')}`,
    },
    body: JSON.stringify(build),
  };
  const res = await fetch('/api/builds', req);

  if (!res.ok && res.status === 401) {
    alert('Please log in to save.');
  }
  if (!res.ok) {
    throw new Error(`fetch Error ${res.status}`);
  }

  return await res.json();
}

export async function updateBuild(build) {
  const req = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      // Authorization: `Bearer ${sessionStorage.getItem('token')}`,
    },
    body: JSON.stringify(build),
  };
  const res = await fetch(`/api/builds/${build.id}`, req);
  if (!res.ok) throw new Error(`fetch Error ${res.status}`);
  return await res.json();
}

export async function removeBuild(buildId) {
  const req = {
    method: 'DELETE',
    headers: {
      // Authorization: `Bearer ${sessionStorage.getItem('token')}`,
    },
  };
  const res = await fetch(`/api/builds/${buildId}`, req);
  if (!res.ok) throw new Error(`fetch Error ${res.status}`);
}
export function calculateHp(vigorLevel) {
  if (!vigorLevel) {
    return 0;
  }
  if (vigorLevel <= 25) {
    return Math.floor(300 + 500 * Math.pow((vigorLevel - 1) / 24, 1.5));
  }
  if (vigorLevel <= 40) {
    return Math.floor(800 + 650 * Math.pow((vigorLevel - 25) / 15, 1.1));
  }
  if (vigorLevel <= 60) {
    return Math.floor(
      1450 + 450 * (1 - Math.pow(1 - (vigorLevel - 40) / 20, 1.2))
    );
  }
  if (vigorLevel <= 99) {
    return Math.floor(
      1900 + 200 * (1 - Math.pow(1 - (vigorLevel - 60) / 39, 1.2))
    );
  }
}

export function calculateFp(mindLevel) {
  if (!mindLevel) {
    return 0;
  }
  if (mindLevel <= 15) {
    return Math.floor(50 + 45 * ((mindLevel - 1) / 14));
  }
  if (mindLevel <= 35) {
    return Math.floor(95 + 105 * ((mindLevel - 15) / 20));
  }
  if (mindLevel <= 60) {
    return Math.floor(
      200 + 150 * (1 - Math.pow(1 - (mindLevel - 35) / 25, 1.2))
    );
  }
  if (mindLevel <= 99) {
    return Math.floor(350 + 100 * ((mindLevel - 60) / 39));
  }
}

export function calculateStamina(enduranceLevel) {
  if (!enduranceLevel) {
    return 0;
  }
  if (enduranceLevel <= 15) {
    return Math.floor(80 + 25 * ((enduranceLevel - 1) / 14));
  }
  if (enduranceLevel <= 35) {
    return Math.floor(105 + 25 * ((enduranceLevel - 15) / 15));
  }
  if (enduranceLevel <= 60) {
    return Math.floor(130 + 25 * ((enduranceLevel - 30) / 20));
  }
  if (enduranceLevel <= 99) {
    return Math.floor(155 + 15 * ((enduranceLevel - 65) / 49));
  }
}
