import Styles from '../styles/home.module.css';

const Home = () => {
  return (
    <div
      className={`${Styles.bannerbg} h-screen overflow-hidden flex flex-col justify-center text-center`}
    >
      <div className="md:w-4/6 mx-auto flex flex-col space-y-4 justify-center items-center">
        <h1
          className={`${Styles.gradientTitle} text-5xl font-bold`}
          data-aos="fade-down"
          data-aos-duration="1500"
        >
          Welcome to BloomHub – Your Blossoming Haven!
        </h1>
        <p
          className="md:w-4/6 text-white font-semibold text-center"
          data-aos="fade-down"
          data-aos-duration="2000"
        >
          {' '}
          At BloomHub, immerse yourself in a world of vibrant blooms, curated to
          bring joy and elegance to every occasion. Our dedicated artisans craft
          enchanting arrangements that tell unique stories, making each visit a
          poetic celebration of nature's beauty. Explore our sanctuary of
          flowers and let BloomHub transform your moments with the language of
          petals.{' '}
        </p>
      </div>
    </div>
  );
};

export default Home;
