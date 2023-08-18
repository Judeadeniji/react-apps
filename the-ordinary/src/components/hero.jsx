const Hero = (() => (
  <section className="w-full mt-3 md:mt-14 md:mb-40">
    <div className="relative flex flex-col w-full">
      <div className="absolute flex-grow left-0 right-0 top-0 bottom-0">
        <img className="w-full rounded flex-grow h-full md:h-[440px]" src="" alt="Hero Background" width="100%" height="100%" />
      </div>
      <div className="container mx-auto px-4 py-12 md:py-20 relative z-10">
        <div className="md:flex md:flex-row md:items-center">
          <div className="md:w-1/3">
            <div className="mt-6 md:mt-12">
              <p className="font-bold text-2xl md:text-4xl">The</p>
              <p className="font-extrabold text-4xl md:text-8xl text-white">Ordinary</p>
            </div>
          </div>
          <div className="md:w-2/3"></div>
        </div>
      </div>
    </div>
  </section>
));

export default Hero;