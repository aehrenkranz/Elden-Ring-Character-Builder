import { useState } from 'react';
import './App.css';
import { BuildForm } from './components/BuildForm';
import { RegistrationForm } from './components/RegistrationForm';
import { SignInForm } from './components/SignInForm';
import { NavBar } from './components/NavBar';
import { BuildList } from './components/BuildList';

export default function App() {
  const [page, setPage] = useState('builds');
  const [editing, setEditing] = useState<null | undefined | object>(null);

  function handleNavigate(page) {
    setPage(page);
    if (page === 'builds') {
      setEditing(undefined);
    } else if (page === 'sign-out') {
      sessionStorage.removeItem('token');
      setPage('sign-in');
    }
  }

  return (
    <>
      <NavBar onNavigate={handleNavigate} setEditing={setEditing} />
      {page === 'builds' && editing === undefined && (
        <BuildList onEdit={(build) => setEditing(build)} />
      )}
      {page === 'register' && <RegistrationForm />}
      {page === 'sign-in' && (
        <SignInForm onSignIn={() => handleNavigate('builds')} />
      )}
      {page === 'builds' && editing !== undefined && (
        <BuildForm build={editing} onCreate={() => setEditing(undefined)} />
      )}
    </>
  );
}
