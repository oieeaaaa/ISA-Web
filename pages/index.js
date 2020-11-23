import Head from 'next/head';
import GridGuide from 'styleguide/grid-guide';

const Home = () => {
  return (
    <div className="container">
      <Head>
        <title>Boilerplate</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      Hello World.
      <GridGuide />
    </div>
  );
};

export default Home;
