'use client'; // Ensure this file is treated as a client component

import { JSX, useState } from 'react';

export default function SinglePageApp() {
  // Define the sections and their keys
  type SectionKeys = 'home' | 'income' | 'expenses' | 'settings';
  const [activeSection, setActiveSection] = useState<SectionKeys>('home'); // State to track the active section

  // Content for each section
  const sections: Record<SectionKeys, JSX.Element> = {
    home: <p>Welcome to the Home section. This is the main content area.</p>,
    income: <p>Track your income here. Add, edit, or view your income records.</p>,
    expenses: <p>Manage your expenses here. Add, edit, or view your expense records.</p>,
    settings: <p>Adjust your application settings here.</p>,
  };

  return (
    <div>
      {/* Sidebar */}
      <nav className="sidebar">
        <ul className="nav">
          <li className="nav-item">
            <button
              className={`nav-link ${activeSection === 'home' ? 'active' : ''}`}
              onClick={() => setActiveSection('home')}
            >
              Home
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeSection === 'income' ? 'active' : ''}`}
              onClick={() => setActiveSection('income')}
            >
              Income
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeSection === 'expenses' ? 'active' : ''}`}
              onClick={() => setActiveSection('expenses')}
            >
              Expenses
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeSection === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveSection('settings')}
            >
              Settings
            </button>
          </li>
        </ul>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        <h1>{activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}</h1>
        {sections[activeSection]}
      </main>
    </div>
  );
}