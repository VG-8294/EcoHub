import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Navbar } from "@/components/Navbar.jsx";
import { useUser } from '@/contexts/UserContext';
import { Leaf, Calculator, Trophy, ShoppingBag, ArrowRight, Globe, Users, TreePine } from 'lucide-react';

const Index = () => {
  const { isAuthenticated } = useUser();

  const features = [
    {
      icon: Calculator,
      title: 'Carbon Calculator',
      description: 'Track your carbon footprint and discover ways to reduce your environmental impact.',
    },
    {
      icon: Trophy,
      title: 'Daily Challenges',
      description: 'Complete eco-friendly tasks to earn reward points while building sustainable habits.',
    },
    {
      icon: ShoppingBag,
      title: 'Rewards Shop',
      description: 'Redeem your points for workshop passes and sustainable products.',
    },
  ];

  const stats = [
    { icon: Globe, value: '12.4 tons', label: 'Average CO₂ per person/year' },
    { icon: Users, value: '50K+', label: 'Active eco-warriors' },
    { icon: TreePine, value: '1M+', label: 'Trees worth of CO₂ saved' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent border-2 border-foreground mb-8">
              <Leaf className="h-5 w-5" />
              <span className="font-bold uppercase text-sm tracking-wider">Join the Green Revolution</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Track Your Impact.
              <br />
              <span className="text-primary">Save The Planet.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Calculate your carbon footprint, complete daily eco-challenges, and earn rewards 
              for making sustainable choices. Every action counts.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={isAuthenticated ? '/calculator' : '/auth'}>
                <Button variant="hero" size="lg" className="w-full sm:w-auto">
                  {isAuthenticated ? 'Calculate Footprint' : 'Start Your Journey'}
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link to={isAuthenticated ? '/challenges' : '/auth'}>
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  View Challenges
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-secondary border-y-2 border-foreground">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary text-primary-foreground border-2 border-foreground mb-4 shadow-md">
                  <stat.icon className="h-8 w-8" />
                </div>
                <div className="text-3xl md:text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-muted-foreground uppercase text-sm tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our platform makes sustainability fun and rewarding. Here's how you can make a difference.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-card border-2 border-foreground p-6 shadow-md hover:shadow-lg hover:translate-x-[-4px] hover:translate-y-[-4px] transition-all duration-200"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 bg-accent border-2 border-foreground mb-4">
                  <feature.icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground border-y-2 border-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Make a Difference?</h2>
          <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Join thousands of eco-conscious individuals who are taking action against climate change.
          </p>
          <Link to={isAuthenticated ? '/challenges' : '/auth'}>
            <Button variant="accent" size="lg">
              {isAuthenticated ? 'View Today\'s Challenges' : 'Join EcoHub Today'}
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t-2 border-foreground">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Leaf className="h-5 w-5 text-primary" />
              <span className="font-bold">EcoHub</span>
            </div>
            <p className="text-muted-foreground text-sm">
              © 2024 EcoHub. Making sustainability accessible.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
