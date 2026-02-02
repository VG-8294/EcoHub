import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUser } from '@/contexts/UserContext';
import { Leaf, Mail, Lock, User, ArrowLeft, Phone, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [dob, setDob] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, signup, isAuthenticated } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect if already authenticated
  if (isAuthenticated) {
    navigate('/');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let success;

      if (isLogin) {
        success = await login(email, password);
      } else {
        // Validate signup fields
        if (!name || !email || !password || !mobileNumber || !dob) {
          toast({
            title: 'Missing Fields',
            description: 'Please fill in all fields.',
            variant: 'destructive',
          });
          setLoading(false);
          return;
        }
        success = await signup(name, email, password, mobileNumber, dob);
      }

      if (success) {
        toast({
          title: isLogin ? 'Welcome back!' : 'Account created!',
          description: isLogin
            ? 'Good to see you again, eco-warrior.'
            : 'You earned 50 bonus points for joining!',
        });
        navigate('/');
      } else {
        toast({
          title: 'Error',
          description: 'Please check your credentials and try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="p-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary text-primary-foreground border-2 border-foreground mb-4 shadow-md">
              <Leaf className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold">EcoHub</h1>
            <p className="text-muted-foreground mt-2">
              {isLogin
                ? 'Welcome back, eco-warrior!'
                : 'Join the green revolution'}
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-card border-2 border-foreground p-6 shadow-lg">
            <div className="flex mb-6">
              <button
                type="button"
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-3 text-center font-bold uppercase text-sm tracking-wider border-2 border-foreground transition-all ${
                  isLogin
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground'
                }`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-3 text-center font-bold uppercase text-sm tracking-wider border-2 border-l-0 border-foreground transition-all ${
                  !isLogin
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground'
                }`}
              >
                Sign Up
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label className="font-bold uppercase text-sm tracking-wider">
                    Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10 h-12 border-2 border-foreground"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label className="font-bold uppercase text-sm tracking-wider">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12 border-2 border-foreground"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="font-bold uppercase text-sm tracking-wider">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 h-12 border-2 border-foreground"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              {!isLogin && (
                <>
                  <div className="space-y-2">
                    <Label className="font-bold uppercase text-sm tracking-wider">
                      Mobile Number
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                        className="pl-10 h-12 border-2 border-foreground"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="font-bold uppercase text-sm tracking-wider">
                      Date of Birth
                    </Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        type="date"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        className="pl-10 h-12 border-2 border-foreground"
                        required
                      />
                    </div>
                  </div>
                </>
              )}

              <Button
                type="submit"
                variant="hero"
                className="w-full"
                disabled={loading}
              >
                {loading
                  ? 'Please wait...'
                  : isLogin
                  ? 'Login'
                  : 'Create Account'}
              </Button>
            </form>

            {!isLogin && (
              <p className="mt-4 text-center text-sm text-muted-foreground">
                🎁 Get <span className="font-bold text-accent">50 bonus points</span>{' '}
                when you sign up!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;