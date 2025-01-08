import ButtonLink from "./ButtonLink";
function Home() {

  return (
    <div>
        <ButtonLink link="game" name="Nová hra"/>
        <ButtonLink link="search" name="Seznam her"/>
      <h1 className="text-3xl font-bold underline bg-pink-600">gamfe</h1>
    </div>
  );
}

export default Home;
