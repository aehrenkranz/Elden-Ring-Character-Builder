// import { useState } from 'react';

import './App.css';
import { BuildForm } from './components/BuildForm';

export default function App() {
  // const [page, setPage] = useState('builds');
  // const [editing, setEditing] = useState<any>();

  // function handleNavigate(page) {
  //   setPage(page);
  //   if (page === 'builds') {
  //     setEditing(undefined);
  //   } else if (page === 'signOut') {
  //     sessionStorage.removeItem('token');
  //     setPage('sign-in');
  //   }
  // }

  return (
    <>
      <BuildForm />
    </>
  );
}
