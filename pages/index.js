import Head from 'next/head';
import { PrismaClient } from '@prisma/client';
import GridGuide from 'styleguide/grid-guide';

const Home = (props) => {
  console.log(props);

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

export async function getStaticProps() {
  const prisma = new PrismaClient();
  const inventory = await prisma.inventory.findMany();

  return {
    props: {
      inventory
    } // will be passed to the page component as props
  };
}

export default Home;
