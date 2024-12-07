'use client';

import { useState, useEffect } from 'react';
import { signOut } from 'next-auth/react';

export default function ProfileComponent({ user }) {
  const [repositories, setRepositories] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    fetchRepositories();
  }, []);

  const fetchRepositories = async () => {
    const res = await fetch('/api/repositories');
    const data = await res.json();
    setRepositories(data);
  };

  const fetchIssues = async (repoName) => {
    const res = await fetch(`/api/issues/${repoName}`);
    const data = await res.json();
    setIssues(data);
    setSelectedRepo(repoName);
  };

  return (
    <div>
      <h1>Welcome, {user.name}!</h1>
      <button onClick={() => signOut()}>Sign out</button>
      
      <h2>Your Repositories:</h2>
      <ul>
        {repositories.map((repo) => (
          <li key={repo.id}>
            {repo.name} 
            <button onClick={() => fetchIssues(repo.name)}>View Issues</button>
          </li>
        ))}
      </ul>

      {selectedRepo && (
        <div>
          <h2>Issues for {selectedRepo}:</h2>
          <ul>
            {issues.map((issue) => (
              <li key={issue.id}>{issue.title}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}