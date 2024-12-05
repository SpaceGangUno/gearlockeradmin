import React from 'react';
import { Wallet } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-indigo-600 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Wallet size={32} />
            <h1 className="text-2xl font-bold">Gear Locker Budget</h1>
          </div>
          <nav>
            <ul className="flex space-x-6">
              <li>
                <a href="#dashboard" className="hover:text-indigo-200">Dashboard</a>
              </li>
              <li>
                <a href="#budgets" className="hover:text-indigo-200">Budgets</a>
              </li>
              <li>
                <a href="#reports" className="hover:text-indigo-200">Reports</a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}