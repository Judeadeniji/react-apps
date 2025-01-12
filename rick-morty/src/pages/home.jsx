import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Database, AtomIcon } from 'lucide-react';
import PropTypes from 'prop-types';

const Portal = () => (
  <div className="absolute w-48 h-48 transition-all duration-[10s] [animation-direction:forwards] hover:scale-[4]">
    <div className="w-full h-full rounded-full bg-gradient-to-r from-green-500/40 to-cyan-500/40 blur-xl" />
    <div className="absolute inset-2 rounded-full bg-gradient-to-r from-green-400 to-cyan-400 blur-md animate-pulse" />
    <div className="absolute inset-4 rounded-full bg-gradient-to-r from-green-300 to-cyan-300 blur-sm" />
  </div>
);

const FloatingCard = ({ children, className }) => (
  <div className={`relative group hover:scale-105 transition-all duration-500 ${className}`}>
    <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-cyan-500 rounded-xl blur opacity-25 group-hover:opacity-100 transition-opacity duration-500" />
    <div className="relative bg-black/80 backdrop-blur-xl rounded-xl p-6 border border-white/10">
      {children}
    </div>
  </div>
);

FloatingCard.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

const Header = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-black/80 backdrop-blur-xl' : 'bg-transparent'
    }`}>
      <nav className="container mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center gap-12">
          <h1 className="text-3xl font-bold">
            <span className="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
              RMDB
            </span>
          </h1>
          <div className="hidden md:flex gap-8">
            {['Characters', 'Episodes', 'Dimensions'].map((item) => (
              <button key={item} className="text-white/70 hover:text-green-400 transition-colors relative group">
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-400 group-hover:w-full transition-all duration-300" />
              </button>
            ))}
          </div>
        </div>
        <button 
          onClick={() => navigate("/all")}
          className="relative group px-6 py-2.5 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-cyan-400 rounded-lg opacity-70 group-hover:opacity-100 transition-opacity" />
          <div className="absolute inset-[1px] bg-black rounded-lg" />
          <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400 font-medium">
            Enter Portal
          </span>
        </button>
      </nav>
    </header>
  );
};

const Home = () => {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState(null);

  const stats = [
    { icon: <Database className="w-6 h-6" />, value: '800+', label: 'Characters' },
    { icon: <Sparkles className="w-6 h-6" />, value: '51', label: 'Episodes' },
    { icon: <AtomIcon className="w-6 h-6" />, value: '∞', label: 'Dimensions' },
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <Header />
      
      {/* Hero Section */}
      <main className="relative pt-20">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 -left-24 w-96 h-96 bg-green-500/30 rounded-full blur-3xl animate-blob" />
          <div className="absolute top-40 -right-24 w-96 h-96 bg-cyan-500/30 rounded-full blur-3xl animate-blob animation-delay-2000" />
          <div className="absolute -bottom-32 left-1/2 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-blob animation-delay-4000" />
        </div>

        <div className="container mx-auto px-4 relative">
          <div className="flex flex-col lg:flex-row py-20 gap-12">
            
            {/* Left Column */}
            <div className="flex-1 text-center lg:text-left relative">
              <h1 className="text-6xl md:text-7xl font-bold leading-tight">
                The Ultimate
                <span className="block bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
                  Rick & Morty
                </span>
                Database
              </h1>
              <p className="mt-6 text-xl text-white/70">
                Your portal to every character, dimension, and adventure in the multiverse.
              </p>

            </div>
            
            {/* Right Column - Interactive Portal */}
            <div className="flex-1 flex-col items-center justify-center relative">
              <div className="relative z-10 aspect-square">
                              
              {/* Stats */}
              <div className="mt-12 grid grid-cols-3 gap-6">
                {stats.map((stat, index) => (
                  <FloatingCard key={index} className="text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="text-green-400">{stat.icon}</div>
                      <div className="text-3xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
                        {stat.value}
                      </div>
                      <div className="text-sm text-white/70">{stat.label}</div>
                    </div>
                  </FloatingCard>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="mt-12 flex flex-wrap gap-6 justify-center lg:justify-start">
                <button
                  onClick={() => navigate("/all")}
                  className="group relative px-8 py-3 overflow-hidden rounded-lg"
                  onMouseEnter={() => setHoveredCard('explore')}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-cyan-400 animate-gradient-x" />
                  <div className="absolute inset-[1px] bg-black rounded-lg transition-colors group-hover:bg-black/50" />
                  <span className="relative font-medium text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-green-400 group-hover:to-cyan-400">
                    Explore Now
                  </span>
                  {hoveredCard === 'explore' && (
                    <Portal />
                  )}
                </button>
                <button 
                  className="px-8 py-3 rounded-lg border border-white/10 hover:border-green-400/50 transition-colors"
                  onMouseEnter={() => setHoveredCard('learn')}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  Learn More
                </button>
              </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home