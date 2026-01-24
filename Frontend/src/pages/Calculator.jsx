import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';
import {
  Car,
  Home,
  Utensils,
  ShoppingCart,
  Plane,
  ArrowRight,
  Leaf,
} from 'lucide-react';

const Calculator = () => {
  const { isAuthenticated, setCarbonFootprint, addPoints, user } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [values, setValues] = useState({
    transport: 50,
    home: 50,
    food: 50,
    shopping: 50,
    travel: 50,
  });

  const [result, setResult] = useState(null);
  const [calculated, setCalculated] = useState(false);

  if (!isAuthenticated) {
    navigate('/auth');
    return null;
  }

  const categories = [
    { id: 'transport', label: 'Daily Transport', icon: Car, description: 'Car usage, public transport' },
    { id: 'home', label: 'Home Energy', icon: Home, description: 'Electricity, heating, cooling' },
    { id: 'food', label: 'Food & Diet', icon: Utensils, description: 'Meat consumption, food waste' },
    { id: 'shopping', label: 'Shopping', icon: ShoppingCart, description: 'Clothing, electronics, goods' },
    { id: 'travel', label: 'Air Travel', icon: Plane, description: 'Flights per year' },
  ];

  const calculateFootprint = () => {
    const transportCO2 = values.transport * 0.04;
    const homeCO2 = values.home * 0.06;
    const foodCO2 = values.food * 0.05;
    const shoppingCO2 = values.shopping * 0.03;
    const travelCO2 = values.travel * 0.08;

    const total =
      transportCO2 + homeCO2 + foodCO2 + shoppingCO2 + travelCO2;

    const rounded = Math.round(total * 10) / 10;

    setResult(rounded);
    setCalculated(true);
    setCarbonFootprint(rounded);

    if (!user?.carbonFootprint) {
      addPoints(25);
      toast({
        title: '+25 Points Earned!',
        description:
          'You calculated your carbon footprint for the first time.',
      });
    }
  };

  const getFootprintLevel = (footprint) => {
    if (footprint < 6) return { level: 'Low', color: 'bg-primary' };
    if (footprint < 12) return { level: 'Average', color: 'bg-accent' };
    return { level: 'High', color: 'bg-destructive' };
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent border-2 border-foreground mb-4">
              <Leaf className="h-5 w-5" />
              <span className="font-bold uppercase text-sm tracking-wider">
                Carbon Calculator
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Calculate Your Carbon Footprint
            </h1>
            <p className="text-muted-foreground">
              Adjust the sliders to estimate your annual carbon emissions
            </p>
          </div>

          {/* Calculator */}
          <div className="bg-card border-2 border-foreground p-6 shadow-lg mb-8">
            <div className="space-y-8">
              {categories.map((category) => (
                <div key={category.id} className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-secondary border-2 border-foreground flex items-center justify-center">
                      <category.icon className="h-6 w-6" />
                    </div>

                    <div className="flex-1">
                      <Label className="font-bold text-base">
                        {category.label}
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        {category.description}
                      </p>
                    </div>

                    <div className="text-right font-mono font-bold text-lg w-16">
                      {values[category.id]}%
                    </div>
                  </div>

                  <Slider
                    value={[values[category.id]]}
                    onValueChange={(value) =>
                      setValues({ ...values, [category.id]: value[0] })
                    }
                    max={100}
                    step={5}
                    className="py-2"
                  />

                  <div className="flex justify-between text-xs text-muted-foreground uppercase tracking-wider">
                    <span>Low</span>
                    <span>Average</span>
                    <span>High</span>
                  </div>
                </div>
              ))}
            </div>

            <Button
              variant="hero"
              className="w-full mt-8"
              onClick={calculateFootprint}
            >
              Calculate My Footprint
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>

          {/* Result */}
          {calculated && result !== null && (
            <div className="bg-card border-2 border-foreground p-6 shadow-lg">
              <h2 className="text-xl font-bold mb-6 text-center">
                Your Carbon Footprint
              </h2>

              <div className="text-center mb-6">
                <div
                  className={`inline-flex items-center justify-center w-32 h-32 ${
                    getFootprintLevel(result).color
                  } text-primary-foreground border-2 border-foreground`}
                >
                  <div>
                    <div className="text-4xl font-bold">{result}</div>
                    <div className="text-sm uppercase tracking-wider">
                      tons/year
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center mb-6">
                <span
                  className={`inline-block px-4 py-2 border-2 border-foreground font-bold uppercase text-sm tracking-wider ${
                    getFootprintLevel(result).color
                  } text-primary-foreground`}
                >
                  {getFootprintLevel(result).level} Impact
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center text-sm">
                <div className="p-4 bg-secondary border-2 border-foreground">
                  <div className="font-bold mb-1">Global Average</div>
                  <div className="text-muted-foreground">4.7 tons/year</div>
                </div>
                <div className="p-4 bg-secondary border-2 border-foreground">
                  <div className="font-bold mb-1">US Average</div>
                  <div className="text-muted-foreground">15.5 tons/year</div>
                </div>
                <div className="p-4 bg-secondary border-2 border-foreground">
                  <div className="font-bold mb-1">Target</div>
                  <div className="text-muted-foreground">2 tons/year</div>
                </div>
              </div>

              <div className="mt-6 text-center">
                <Button
                  variant="outline"
                  onClick={() => navigate('/challenges')}
                >
                  Take on Challenges to Reduce Your Footprint
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Calculator;