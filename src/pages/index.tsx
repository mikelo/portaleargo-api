// src/pages/index.tsx
import { GetServerSideProps } from 'next';
import { useState } from 'react';

type PageProps = {
  data: any;
};

export const getServerSideProps: GetServerSideProps<PageProps> = async () => {
  const { Client } = await import('../Client');
  
  const client = new Client({ debug: true });
  await client.login();
  const data = await client.getCompiti();
  
  return {
    props: { data }
  };
};

export default function Page({ data }: PageProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggle = (date: string) => {
    setExpanded(prev => ({ ...prev, [date]: !prev[date] }));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Compiti</h1>
      {Object.entries(data).map(([date, items]) => (
        <div key={date} className="mb-2 border rounded">
          <button 
            onClick={() => toggle(date)}
            className="w-full text-left p-3 hover:bg-gray-100"
          >
            {date} {expanded[date] ? '▼' : '▶'}
          </button>
          {expanded[date] && (
            <div className="p-3 border-t">
              <pre className="whitespace-pre-wrap">{JSON.stringify(items, null, 2)}</pre>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}