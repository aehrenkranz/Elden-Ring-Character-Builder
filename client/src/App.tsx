// import { useState } from 'react';
import { BuildList } from './components/BuildList';
import './App.css';

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
      {' '}
      <BuildList />
    </>
  );
}
