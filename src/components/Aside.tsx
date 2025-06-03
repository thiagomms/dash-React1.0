import React from 'react';

interface AsideProps {
  title: string;
  children: React.ReactNode;
}

const Aside: React.FC<AsideProps> = ({ title, children }) => (
  <aside className="w-full md:w-80 bg-white rounded-xl shadow-lg p-6 mb-6 md:mb-0">
    <h2 className="text-lg font-bold mb-4">{title}</h2>
    {children}
  </aside>
);

export default Aside; 