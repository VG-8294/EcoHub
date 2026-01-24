import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';
import {
  ShoppingBag,
  Trophy,
  Ticket,
  TreePine,
  Leaf,
  Package,
  Coffee,
  ShoppingCart,
} from 'lucide-react';

const products = [
  {
    id: 'workshop-zero-waste',
    name: 'Zero Waste Living Workshop',
    description: 'Learn practical tips for reducing waste in your daily life.',
    points: 200,
    icon: Ticket,
    category: 'workshop',
    stock: 15,
  },
  {
    id: 'workshop-urban-garden',
    name: 'Urban Gardening Masterclass',
    description: 'Start your own balcony or indoor garden with expert guidance.',
    points: 250,
    icon: Ticket,
    category: 'workshop',
    stock: 10,
  },
  {
    id: 'workshop-composting',
    name: 'Home Composting 101',
    description: 'Turn your kitchen scraps into rich garden soil.',
    points: 150,
    icon: Ticket,
    category: 'workshop',
    stock: 20,
  },
  {
    id: 'product-bamboo-kit',
    name: 'Bamboo Essentials Kit',
    description:
      'Toothbrush, cutlery set, and straw made from sustainable bamboo.',
    points: 100,
    icon: Package,
    category: 'product',
    stock: 50,
  },
  {
    id: 'product-reusable-bags',
    name: 'Organic Cotton Bag Set',
    description: 'Set of 5 reusable produce and shopping bags.',
    points: 80,
    icon: ShoppingBag,
    category: 'product',
    stock: 100,
  },
  {
    id: 'product-coffee-cup',
    name: 'Insulated Coffee Cup',
    description:
      'Keep your drinks hot or cold with this eco-friendly tumbler.',
    points: 120,
    icon: Coffee,
    category: 'product',
    stock: 75,
  },
  {
    id: 'product-tree-planting',
    name: 'Plant a Tree Certificate',
    description:
      'We plant a tree in your name through our reforestation partners.',
    points: 50,
    icon: TreePine,
    category: 'product',
    stock: 999,
  },
  {
    id: 'product-seed-kit',
    name: 'Herb Seed Starter Kit',
    description:
      'Everything you need to grow basil, mint, and parsley at home.',
    points: 75,
    icon: Leaf,
    category: 'product',
    stock: 60,
  },
];

const Shop = () => {
  const { isAuthenticated, user, spendPoints } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [filter, setFilter] = useState('all');
  const [purchasedItems, setPurchasedItems] = useState([]);

  if (!isAuthenticated) {
    navigate('/auth');
    return null;
  }

  const userPoints = user?.points || 0;

  const filteredProducts = products.filter((product) => {
    if (filter === 'all') return true;
    return product.category === filter;
  });

  const handlePurchase = (product) => {
    if (userPoints < product.points) {
      toast({
        title: 'Not enough points',
        description: `You need ${
          product.points - userPoints
        } more points for this item.`,
        variant: 'destructive',
      });
      return;
    }

    const success = spendPoints(product.points);

    if (success) {
      setPurchasedItems([...purchasedItems, product.id]);
      toast({
        title: 'Purchase Successful!',
        description: `You redeemed: ${product.name}`,
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent border-2 border-foreground mb-4">
              <ShoppingCart className="h-5 w-5" />
              <span className="font-bold uppercase text-sm tracking-wider">
                Rewards Shop
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Redeem Your Points
            </h1>

            <p className="text-muted-foreground mb-6">
              Exchange your hard-earned points for sustainable products and
              workshops
            </p>

            {/* Points Balance */}
            <div className="inline-flex items-center gap-3 px-6 py-4 bg-primary text-primary-foreground border-2 border-foreground shadow-md">
              <Trophy className="h-6 w-6" />
              <div className="text-left">
                <div className="text-sm uppercase tracking-wider opacity-80">
                  Your Balance
                </div>
                <div className="text-2xl font-bold">
                  {userPoints} Points
                </div>
              </div>
            </div>
          </div>

          {/* Filter */}
          <div className="flex justify-center gap-2 mb-8">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              All
            </Button>
            <Button
              variant={filter === 'workshop' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('workshop')}
            >
              <Ticket className="h-4 w-4 mr-2" />
              Workshops
            </Button>
            <Button
              variant={filter === 'product' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('product')}
            >
              <Package className="h-4 w-4 mr-2" />
              Products
            </Button>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const canAfford = userPoints >= product.points;
              const isPurchased = purchasedItems.includes(product.id);

              return (
                <div
                  key={product.id}
                  className={`bg-card border-2 border-foreground p-6 transition-all duration-200 ${
                    canAfford && !isPurchased
                      ? 'hover:shadow-lg hover:-translate-x-1 hover:-translate-y-1'
                      : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`w-14 h-14 ${
                        product.category === 'workshop'
                          ? 'bg-accent'
                          : 'bg-secondary'
                      } border-2 border-foreground flex items-center justify-center`}
                    >
                      <product.icon className="h-7 w-7" />
                    </div>

                    <span className="text-xs uppercase tracking-wider text-muted-foreground border-2 border-foreground px-2 py-1">
                      {product.category}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold mb-2">{product.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Trophy className="h-4 w-4 text-accent" />
                      <span className="font-bold text-lg">
                        {product.points} pts
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {product.stock} left
                    </span>
                  </div>

                  {isPurchased ? (
                    <Button variant="outline" className="w-full" disabled>
                      Purchased ✓
                    </Button>
                  ) : (
                    <Button
                      variant={canAfford ? 'hero' : 'outline'}
                      className="w-full"
                      onClick={() => handlePurchase(product)}
                      disabled={!canAfford}
                    >
                      {canAfford
                        ? 'Redeem'
                        : `Need ${product.points - userPoints} more pts`}
                    </Button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Empty State */}
          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                No items in this category
              </p>
            </div>
          )}

          {/* Earn More CTA */}
          <div className="mt-12 bg-secondary border-2 border-foreground p-6 text-center">
            <h3 className="text-xl font-bold mb-2">Need more points?</h3>
            <p className="text-muted-foreground mb-4">
              Complete daily challenges to earn points and unlock more rewards!
            </p>
            <Button variant="default" onClick={() => navigate('/challenges')}>
              View Challenges
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Shop;