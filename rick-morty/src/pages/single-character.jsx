import PropTypes from 'prop-types';
import React from 'react';
import { useParams, Link } from "react-router-dom";
import { For, Show } from "rc-extended/components";
import { useFetch } from "rc-extended/use";
import { ArrowLeft, Loader2 } from 'lucide-react';

const FloatingCard = ({ children, className }) => (
  <div className={`relative rounded-xl group hover:scale-105 transition-all duration-500 ${className}`}>
    <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-cyan-500 rounded-xl blur opacity-25 group-hover:opacity-100 transition-opacity duration-500" />
    <div className="relative h-full bg-black/80 backdrop-blur-xl rounded-xl border border-white/10">
      {children}
    </div>
  </div>
);

FloatingCard.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

function Header({ name }) {
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-black/80 backdrop-blur-xl border-b border-white/10' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link 
          to="/all" 
          className="relative group px-4 py-2 overflow-hidden rounded-lg flex items-center gap-2"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-cyan-400 rounded-lg opacity-70 group-hover:opacity-100 transition-opacity" />
          <div className="absolute inset-[1px] bg-black rounded-lg" />
          <ArrowLeft className="relative w-4 h-4 text-green-400" />
          <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400 font-medium">
            Back
          </span>
        </Link>
        
        <h1 className="text-xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
          {name}
        </h1>
        
        <div className="w-20" /> {/* Spacer for balance */}
      </div>
    </header>
  );
}

Header.propTypes = {
  name: PropTypes.string.isRequired,
};


function CharacterAttribute({ label, value, isStatus }) {
  return (
    <FloatingCard className="overflow-hidden">
      <div className="p-4 rounded-md">
        <h2 className="text-sm uppercase tracking-wider text-green-400 mb-1">{label}</h2>
        <div className="flex items-center gap-2">
          <p className="text-white text-lg font-medium">
            {value?.name || value}
          </p>
          {isStatus && value === "Alive" && (
            <span className="h-3 w-3 rounded-full bg-green-500 ring-2 ring-green-400/50 animate-pulse" />
          )}
        </div>
      </div>
    </FloatingCard>
  );
}

CharacterAttribute.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.any.isRequired,
  isStatus: PropTypes.bool,
};

export default function SingleCharacter() {
  const { character } = useParams();
  const { result, isPending } = useFetch(`https://rickandmortyapi.com/api/character/${character}`);
  
  if (result) {
    delete result.episode;
    delete result.created;
    delete result.url;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute top-20 -left-24 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-blob" />
        <div className="absolute top-40 -right-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute -bottom-32 left-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-blob animation-delay-4000" />
      </div>

      <div className="relative">
        <Header name={result ? result.name : "Loading..."} />
        
        <main className="container mx-auto px-4 py-8">
          <Show when={!isPending} fallback={
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-green-400 animate-spin" />
            </div>
          }>
            {/* Character Image */}
            <FloatingCard className="mb-8 overflow-hidden max-w-2xl mx-auto">
              <div className="relative aspect-square md:aspect-[16/9]">
                <img 
                  className="w-full h-full object-cover"
                  src={result?.image}
                  alt={result?.name}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
                    {result?.name}
                  </h2>
                </div>
              </div>
            </FloatingCard>

            {/* Character Details */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <For each={result || []}>
                {(value, key) => {
                  if (key === "image" || key === "name") return null;
                  return (
                    <CharacterAttribute
                      key={key}
                      label={key}
                      value={value}
                      isStatus={key === "status"}
                    />
                  );
                }}
              </For>
            </div>
          </Show>
        </main>
      </div>
    </div>
  );
}