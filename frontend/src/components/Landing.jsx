import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { TrendingUp, BarChart3, Activity, DollarSign, Target, Zap, ArrowRight, Star, Globe, Users } from 'lucide-react';

const AnimatedCounter = ({ end, duration = 2000, suffix = "" }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime = null;
    const animate = (currentTime) => {
      if (startTime === null) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      setCount(Math.floor(progress * end));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [end, duration]);

  return <span>{count.toLocaleString()}{suffix}</span>;
};

const FeatureCard = ({ icon: Icon, title, description, delay = 0 }) => (
  <div 
    className="group bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-6 hover:bg-card/70 transition-all duration-500 hover:scale-105 hover:shadow-xl"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="relative">
      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors duration-300">
        <Icon className="w-6 h-6 text-primary group-hover:scale-110 transition-transform duration-300" />
      </div>
      <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors duration-300">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
    </div>
    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>
  </div>
);

const FloatingElement = ({ children, delay = 0, amplitude = 10 }) => (
  <div 
    className="floating-element"
    style={{
      animationDelay: `${delay}s`,
      '--amplitude': `${amplitude}px`
    }}
  >
    {children}
  </div>
);

const Landing = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setIsVisible(true);
    
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const features = [
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Real-time stock analysis with interactive charts and technical indicators for informed trading decisions.",
      delay: 100
    },
    {
      icon: TrendingUp,
      title: "AI Predictions",
      description: "Machine learning powered price forecasting to help you stay ahead of market trends.",
      delay: 200
    },
    {
      icon: Activity,
      title: "Live Market Data",
      description: "Access to real-time market data with instant updates and comprehensive stock information.",
      delay: 300
    },
    {
      icon: Target,
      title: "Portfolio Tracking",
      description: "Track your favorite stocks and build watchlists to monitor your investment opportunities.",
      delay: 400
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Optimized performance with instant data loading and smooth, responsive user interface.",
      delay: 500
    },
    {
      icon: Globe,
      title: "Global Markets",
      description: "Access stocks from major exchanges worldwide with comprehensive market coverage.",
      delay: 600
    }
  ];

  const stats = [
    { number: 5000, suffix: "+", label: "Stocks Tracked" },
    { number: 50000, suffix: "+", label: "Active Users" },
    { number: 99, suffix: "%", label: "Uptime" },
    { number: 24, suffix: "/7", label: "Support" }
  ];

  return (
    <>
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(var(--amplitude, -10px));
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 0.4;
          }
          50% {
            opacity: 0.8;
          }
        }

        @keyframes slideInScale {
          from {
            opacity: 0;
            transform: scale(0.8) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
        }

        .animate-fadeInDown {
          animation: fadeInDown 0.8s ease-out forwards;
        }

        .animate-fadeInLeft {
          animation: fadeInLeft 0.8s ease-out forwards;
        }

        .animate-fadeInRight {
          animation: fadeInRight 0.8s ease-out forwards;
        }

        .animate-slideInScale {
          animation: slideInScale 0.6s ease-out forwards;
        }

        .floating-element {
          animation: float 3s ease-in-out infinite;
        }

        .gradient-text {
          background: linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary)) 50%, hsl(var(--accent)) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .glassmorphism {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .glow-on-hover {
          position: relative;
          transition: all 0.3s ease;
        }

        .glow-on-hover:hover {
          box-shadow: 0 0 30px hsl(var(--primary) / 0.3);
        }

        .mouse-follower {
          position: fixed;
          width: 200px;
          height: 200px;
          background: radial-gradient(circle, hsl(var(--primary) / 0.1) 0%, transparent 70%);
          border-radius: 50%;
          pointer-events: none;
          transition: transform 0.1s ease;
          z-index: -1;
        }

        .grid-pattern {
          background-image: 
            linear-gradient(rgba(var(--primary-rgb), 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(var(--primary-rgb), 0.1) 1px, transparent 1px);
          background-size: 50px 50px;
        }
      `}</style>

      <div className="mouse-follower" style={{
        transform: `translate(${mousePosition.x - 100}px, ${mousePosition.y - 100}px)`
      }} />

      <div className="min-h-screen bg-background overflow-hidden relative">
        <div className="absolute inset-0 grid-pattern opacity-50"></div>
        
        <FloatingElement delay={0} amplitude={15}>
          <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl"></div>
        </FloatingElement>
        <FloatingElement delay={1} amplitude={20}>
          <div className="absolute top-40 right-20 w-32 h-32 bg-accent/10 rounded-full blur-xl"></div>
        </FloatingElement>
        <FloatingElement delay={2} amplitude={10}>
          <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-primary/5 rounded-full blur-xl"></div>
        </FloatingElement>

        <div className="relative z-10 min-h-screen flex flex-col">
          <header className={`p-6 ${isVisible ? 'animate-fadeInDown' : 'opacity-0'}`}>
            <nav className="flex justify-between items-center max-w-7xl mx-auto">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold gradient-text">StockDash</span>
              </div>
              <div className="flex items-center space-x-6">
                <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
                <a href="#stats" className="text-muted-foreground hover:text-foreground transition-colors">Stats</a>
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Login
                </button>
              </div>
            </nav>
          </header>

          <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
            <div className={`max-w-4xl mx-auto space-y-8 ${isVisible ? 'animate-fadeInUp' : 'opacity-0'}`}>
              <div className="space-y-4">
                <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                  <span className="gradient-text">Smart Trading</span>
                  <br />
                  <span className="text-foreground">Made Simple</span>
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  Harness the power of AI-driven analytics, real-time market data, and intuitive charts to make smarter investment decisions.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="group bg-primary text-primary-foreground px-8 py-4 rounded-xl text-lg font-semibold hover:bg-primary/90 transition-all duration-300 glow-on-hover flex items-center gap-2"
                >
                  Start Trading Now
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="glassmorphism px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white/10 transition-all duration-300">
                  Watch Demo
                </button>
              </div>

              <div className="flex items-center justify-center gap-8 mt-12">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-6 h-6 text-yellow-400 fill-current" />
                ))}
                <span className="text-muted-foreground ml-2">Trusted by 50,000+ traders</span>
              </div>
            </div>
          </main>

          <section id="stats" className="py-20 px-6">
            <div className={`max-w-6xl mx-auto ${isVisible ? 'animate-slideInScale' : 'opacity-0'}`} style={{ animationDelay: '0.5s' }}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                      <AnimatedCounter end={stat.number} suffix={stat.suffix} />
                    </div>
                    <div className="text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section id="features" className="py-20 px-6 bg-muted/30">
            <div className="max-w-7xl mx-auto">
              <div className={`text-center mb-16 ${isVisible ? 'animate-fadeInUp' : 'opacity-0'}`} style={{ animationDelay: '0.3s' }}>
                <h2 className="text-4xl md:text-5xl font-bold mb-4">
                  <span className="gradient-text">Powerful Features</span>
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Everything you need to make informed trading decisions in one comprehensive platform.
                </p>
              </div>

              <div className={`grid md:grid-cols-2 lg:grid-cols-3 gap-6 ${isVisible ? 'animate-fadeInUp' : 'opacity-0'}`} style={{ animationDelay: '0.6s' }}>
                {features.map((feature, index) => (
                  <FeatureCard key={index} {...feature} />
                ))}
              </div>
            </div>
          </section>

          <footer className="py-12 px-6 border-t border-border/50">
            <div className={`max-w-7xl mx-auto text-center ${isVisible ? 'animate-fadeInUp' : 'opacity-0'}`} style={{ animationDelay: '0.9s' }}>
              <div className="flex items-center justify-center space-x-2 mb-4">
                <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="text-lg font-semibold gradient-text">StockDash</span>
              </div>
              <p className="text-muted-foreground">
                © 2024 StockDash. Empowering traders with intelligent market insights.
              </p>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
};

export default Landing;