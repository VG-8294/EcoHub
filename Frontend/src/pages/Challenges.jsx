import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';
import {
  Trophy,
  Check,
  Clock,
  Bike,
  Leaf,
  Droplets,
  Lightbulb,
  ShoppingBag,
  Recycle,
  TreePine,
  Coffee,
} from 'lucide-react';

const challenges = [
  {
    id: 'bike-commute',
    title: 'Bike to Work',
    description: 'Use a bicycle instead of driving for your commute today.',
    points: 30,
    icon: Bike,
    category: 'Transport',
    difficulty: 'medium',
  },
  {
    id: 'meatless-meal',
    title: 'Meatless Meal',
    description: 'Have at least one plant-based meal today.',
    points: 15,
    icon: Leaf,
    category: 'Food',
    difficulty: 'easy',
  },
  {
    id: 'water-save',
    title: 'Water Conservation',
    description: 'Take a 5-minute shower instead of a bath.',
    points: 10,
    icon: Droplets,
    category: 'Home',
    difficulty: 'easy',
  },
  {
    id: 'lights-off',
    title: 'Energy Saver',
    description: 'Turn off all unnecessary lights and unplug devices.',
    points: 20,
    icon: Lightbulb,
    category: 'Home',
    difficulty: 'easy',
  },
  {
    id: 'reusable-bag',
    title: 'Plastic-Free Shopping',
    description: 'Use reusable bags for all your shopping today.',
    points: 15,
    icon: ShoppingBag,
    category: 'Shopping',
    difficulty: 'easy',
  },
  {
    id: 'recycle-sort',
    title: 'Recycling Hero',
    description: 'Properly sort and recycle all your waste today.',
    points: 25,
    icon: Recycle,
    category: 'Waste',
    difficulty: 'medium',
  },
  {
    id: 'plant-tree',
    title: 'Plant Something',
    description: 'Plant a tree, flower, or start a small garden.',
    points: 50,
    icon: TreePine,
    category: 'Nature',
    difficulty: 'hard',
  },
  {
    id: 'reusable-cup',
    title: 'BYOC (Bring Your Own Cup)',
    description: 'Bring a reusable cup for your coffee or drinks.',
    points: 10,
    icon: Coffee,
    category: 'Shopping',
    difficulty: 'easy',
  },
];

const Challenges = () => {
  const { isAuthenticated, user, addPoints, completeChallenge } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [filter, setFilter] = useState('all');

  if (!isAuthenticated) {
    navigate('/auth');
    return null;
  }

  const completedIds = user?.completedChallenges || [];

  const filteredChallenges = challenges.filter((challenge) => {
    if (filter === 'completed') return completedIds.includes(challenge.id);
    if (filter === 'available') return !completedIds.includes(challenge.id);
    return true;
  });

  const handleComplete = (challenge) => {
    if (completedIds.includes(challenge.id)) return;

    completeChallenge(challenge.id);
    addPoints(challenge.points);

    toast({
      title: `+${challenge.points} Points Earned!`,
      description: `You completed: ${challenge.title}`,
    });
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-primary';
      case 'medium':
        return 'bg-accent';
      case 'hard':
        return 'bg-destructive';
      default:
        return 'bg-secondary';
    }
  };

  const totalPoints = challenges.reduce((sum, c) => sum + c.points, 0);
  const earnedPoints = challenges
    .filter((c) => completedIds.includes(c.id))
    .reduce((sum, c) => sum + c.points, 0);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent border-2 border-foreground mb-4">
              <Trophy className="h-5 w-5" />
              <span className="font-bold uppercase text-sm tracking-wider">
                Daily Challenges
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Complete Eco-Challenges
            </h1>

            <p className="text-muted-foreground mb-6">
              Earn points by completing sustainable actions every day
            </p>

            {/* Progress */}
            <div className="inline-flex items-center gap-4 px-6 py-3 bg-card border-2 border-foreground">
              <div className="text-left">
                <div className="text-sm text-muted-foreground uppercase tracking-wider">
                  Progress
                </div>
                <div className="font-bold text-lg">
                  {completedIds.length}/{challenges.length} Completed
                </div>
              </div>

              <div className="w-px h-10 bg-border" />

              <div className="text-left">
                <div className="text-sm text-muted-foreground uppercase tracking-wider">
                  Earned
                </div>
                <div className="font-bold text-lg">
                  {earnedPoints}/{totalPoints} pts
                </div>
              </div>
            </div>
          </div>

          {/* Filter */}
          <div className="flex justify-center gap-2 mb-8">
            {['all', 'available', 'completed'].map((f) => (
              <Button
                key={f}
                variant={filter === f ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter(f)}
                className="capitalize"
              >
                {f}
              </Button>
            ))}
          </div>

          {/* Challenges Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredChallenges.map((challenge) => {
              const isCompleted = completedIds.includes(challenge.id);

              return (
                <div
                  key={challenge.id}
                  className={`bg-card border-2 border-foreground p-6 transition-all duration-200 ${
                    isCompleted
                      ? 'opacity-75'
                      : 'hover:shadow-lg hover:-translate-x-1 hover:-translate-y-1'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`w-12 h-12 ${
                        isCompleted ? 'bg-primary' : 'bg-secondary'
                      } border-2 border-foreground flex items-center justify-center`}
                    >
                      {isCompleted ? (
                        <Check className="h-6 w-6 text-primary-foreground" />
                      ) : (
                        <challenge.icon className="h-6 w-6" />
                      )}
                    </div>

                    <span
                      className={`px-2 py-1 text-xs uppercase tracking-wider font-bold border-2 border-foreground ${getDifficultyColor(
                        challenge.difficulty
                      )}`}
                    >
                      {challenge.difficulty}
                    </span>
                  </div>

                  <div className="mb-4">
                    <span className="text-xs uppercase tracking-wider text-muted-foreground">
                      {challenge.category}
                    </span>
                    <h3 className="text-lg font-bold">{challenge.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {challenge.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Trophy className="h-4 w-4 text-accent" />
                      <span className="font-bold">{challenge.points} pts</span>
                    </div>

                    {isCompleted ? (
                      <span className="text-sm text-primary font-bold uppercase tracking-wider">
                        Completed
                      </span>
                    ) : (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleComplete(challenge)}
                      >
                        Complete
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {filteredChallenges.length === 0 && (
            <div className="text-center py-12">
              <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                No challenges in this category
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Challenges;