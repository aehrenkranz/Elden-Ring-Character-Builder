export async function readBuilds() {
  const req = {
    method: 'GET',
    headers: {
      // Authorization: `Bearer ${sessionStorage.getItem('token')}`,
    },
  };
  const res = await fetch('/api/builds', req);
  if (!res.ok) throw new Error(`fetch Error ${res.status}`);
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
      // Authorization: `Bearer ${sessionStorage.getItem('token')}`,
    },
    body: JSON.stringify(build),
  };
  const res = await fetch('/api/builds', req);
  if (!res.ok) throw new Error(`fetch Error ${res.status}`);
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
