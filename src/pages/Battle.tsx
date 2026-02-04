import { useState } from 'react';
import { motion } from 'framer-motion';
import { Swords, Users, Trophy, Clock, Shield, Zap, Play, Crown, IndianRupee } from 'lucide-react';
import ParticleBackground from '@/components/ParticleBackground';
import Navbar from '@/components/Navbar';
import GlowCard from '@/components/GlowCard';
import GlowButton from '@/components/GlowButton';
import GlowText from '@/components/GlowText';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const activeBattles = [
  {
    id: 1,
    title: 'Web App Siege',
    redTeam: { name: 'Crimson Hackers', score: 2450, members: 12 },
    blueTeam: { name: 'Azure Defenders', score: 2380, members: 12 },
    prize: 25000,
    entryFee: 50,
    timeLeft: '2:34:12',
    viewers: 1247,
    status: 'live',
  },
  {
    id: 2,
    title: 'Network Warfare',
    redTeam: { name: 'Red Storm', score: 1890, members: 8 },
    blueTeam: { name: 'Blue Shield', score: 1920, members: 8 },
    prize: 15000,
    entryFee: 50,
    timeLeft: '1:15:45',
    viewers: 856,
    status: 'live',
  },
];

const upcomingBattles = [
  {
    id: 3,
    title: 'CTF Championship',
    startTime: '2024-02-15 18:00',
    prize: 50000,
    entryFee: 100,
    maxParticipants: 50,
    registered: 38,
  },
  {
    id: 4,
    title: 'Malware Mayhem',
    startTime: '2024-02-16 20:00',
    prize: 30000,
    entryFee: 75,
    maxParticipants: 32,
    registered: 24,
  },
];

const Battle = () => {
  const [selectedTeam, setSelectedTeam] = useState<'red' | 'blue' | null>(null);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <ParticleBackground />
      <Navbar />

      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-destructive/10 border border-destructive/30 mb-4">
              <Swords className="w-4 h-4 text-destructive" />
              <span className="text-sm text-destructive font-medium">Live Battles</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <GlowText as="span" color="purple" animate={false}>Red</GlowText>
              {' vs '}
              <GlowText as="span" color="blue" animate={false}>Blue</GlowText>
              {' Battle Arena'}
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Join live cybersecurity battles, compete in teams, and win prizes. 
              Minimum entry fee: ₹50
            </p>
          </motion.div>

          {/* Active Battles */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
              Live Battles
            </h2>
            
            <div className="grid lg:grid-cols-2 gap-6">
              {activeBattles.map((battle, index) => (
                <motion.div
                  key={battle.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <GlowCard className="p-0 overflow-hidden" glowColor="purple">
                    {/* Battle Header */}
                    <div className="p-6 bg-gradient-to-r from-red-500/10 via-transparent to-blue-500/10">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Badge variant="destructive" className="animate-pulse">
                            <span className="flex items-center gap-1">
                              <Play className="w-3 h-3 fill-current" />
                              LIVE
                            </span>
                          </Badge>
                          <span className="text-muted-foreground text-sm">
                            {battle.viewers.toLocaleString()} watching
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span className="font-mono text-primary">{battle.timeLeft}</span>
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-bold mb-4">{battle.title}</h3>

                      {/* Teams vs */}
                      <div className="grid grid-cols-3 items-center gap-4">
                        {/* Red Team */}
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          onClick={() => setSelectedTeam('red')}
                          className={`p-4 rounded-xl cursor-pointer transition-all ${
                            selectedTeam === 'red' 
                              ? 'bg-red-500/20 border-2 border-red-500' 
                              : 'bg-red-500/10 border border-red-500/30 hover:border-red-500/60'
                          }`}
                        >
                          <div className="text-center">
                            <Shield className="w-8 h-8 text-red-500 mx-auto mb-2" />
                            <p className="font-semibold text-sm">{battle.redTeam.name}</p>
                            <p className="text-2xl font-bold text-red-500">{battle.redTeam.score}</p>
                            <p className="text-xs text-muted-foreground">
                              {battle.redTeam.members} members
                            </p>
                          </div>
                        </motion.div>

                        {/* VS */}
                        <div className="text-center">
                          <div className="relative">
                            <Swords className="w-12 h-12 mx-auto text-muted-foreground" />
                            <motion.div
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                              className="absolute inset-0 flex items-center justify-center"
                            >
                              <span className="text-2xl font-bold">VS</span>
                            </motion.div>
                          </div>
                        </div>

                        {/* Blue Team */}
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          onClick={() => setSelectedTeam('blue')}
                          className={`p-4 rounded-xl cursor-pointer transition-all ${
                            selectedTeam === 'blue' 
                              ? 'bg-blue-500/20 border-2 border-blue-500' 
                              : 'bg-blue-500/10 border border-blue-500/30 hover:border-blue-500/60'
                          }`}
                        >
                          <div className="text-center">
                            <Shield className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                            <p className="font-semibold text-sm">{battle.blueTeam.name}</p>
                            <p className="text-2xl font-bold text-blue-500">{battle.blueTeam.score}</p>
                            <p className="text-xs text-muted-foreground">
                              {battle.blueTeam.members} members
                            </p>
                          </div>
                        </motion.div>
                      </div>
                    </div>

                    {/* Battle Footer */}
                    <div className="p-6 border-t border-border flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        <div>
                          <p className="text-xs text-muted-foreground">Prize Pool</p>
                          <p className="text-lg font-bold text-yellow-500 flex items-center gap-1">
                            <Trophy className="w-4 h-4" />
                            ₹{battle.prize.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Entry Fee</p>
                          <p className="text-lg font-bold text-primary flex items-center gap-1">
                            <IndianRupee className="w-4 h-4" />
                            {battle.entryFee}
                          </p>
                        </div>
                      </div>
                      <GlowButton variant="primary">
                        Join Battle
                      </GlowButton>
                    </div>
                  </GlowCard>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Upcoming Battles */}
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Clock className="w-6 h-6 text-primary" />
              Upcoming Battles
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {upcomingBattles.map((battle, index) => (
                <motion.div
                  key={battle.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <GlowCard glowColor="cyan">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">{battle.title}</h3>
                        <p className="text-sm text-muted-foreground">{battle.startTime}</p>
                      </div>
                      <Badge variant="outline" className="border-primary text-primary">
                        Upcoming
                      </Badge>
                    </div>
                    
                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Registered</span>
                        <span>{battle.registered}/{battle.maxParticipants}</span>
                      </div>
                      <Progress value={(battle.registered / battle.maxParticipants) * 100} className="h-2" />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground">Prize</p>
                          <p className="font-bold text-yellow-500">₹{battle.prize.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Entry</p>
                          <p className="font-bold text-primary">₹{battle.entryFee}</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Register
                      </Button>
                    </div>
                  </GlowCard>
                </motion.div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Battle;
