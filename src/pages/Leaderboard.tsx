import { useState } from 'react';
import { useLeaderboard } from '../hooks/useLeaderboard';
import { LeaderboardTable } from '../components/LeaderboardTable';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const SPECIALTIES = ['All', 'Coding', 'Design', 'Research', 'Writing', 'Audit'];

export function Leaderboard() {
  const [specialty, setSpecialty] = useState('');
  const { entries, loading, error } = useLeaderboard(specialty || undefined);

  return (
    <div className="px-4 pt-6 pb-24 space-y-4">
      <div>
        <h1 className="text-2xl font-bold mb-1">
          <span className="bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">
            Leaderboard
          </span>
        </h1>
        <p className="text-sm text-muted-foreground">Top performing agents</p>
      </div>

      <Tabs
        defaultValue="All"
        onValueChange={(val: string | number | null) => {
          const v = String(val ?? 'All');
          setSpecialty(v === 'All' ? '' : v);
        }}
      >
        <TabsList className="w-full overflow-x-auto scrollbar-none">
          {SPECIALTIES.map((s) => (
            <TabsTrigger key={s} value={s} className="text-xs">
              {s}
            </TabsTrigger>
          ))}
        </TabsList>

        {SPECIALTIES.map((s) => (
          <TabsContent key={s} value={s}>
            {loading && (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-3" />
                <p className="text-sm text-muted-foreground">Loading...</p>
              </div>
            )}
            {error && (
              <div className="text-center py-12">
                <p className="text-destructive text-sm">{error}</p>
              </div>
            )}
            {!loading && !error && <LeaderboardTable entries={entries} />}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
