import Header from "@/components/team/header";
import Card from "@/components/team/card";
import Info from "@/components/team/details";
import Question from "@/components/get_in_touch/form-questions";

export default function Home() {
  return (
    <div className="bg-background">
      <title>Team - Breeze '26</title>
      <div className="pt-16 px-8 md:pt-20 xl:pt-24">
        <Header />
      </div>
      <div className="flex flex-wrap my-16 gap-20 justify-center px-[40px]">
        {Info.slice(0, 2).map((details) => (
          <Card
            key={details.key}
            name={details.name}
            img={details.img}
            title={details.title}
          />
        ))}
      </div>
      <div className="flex flex-wrap my-16 gap-20 justify-center px-[40px]">
        {Info.slice(2, 4).map((details) => (
          <Card
            key={details.key}
            name={details.name}
            img={details.img}
            title={details.title}
          />
        ))}
      </div>
      <div className="flex flex-wrap my-16 gap-20 justify-center px-[40px]">
        {Info.slice(4).map((details) => (
          <Card
            key={details.key}
            name={details.name}
            img={details.img}
            title={details.title}
          />
        ))}
      </div>
      <div className="bg-[#ECECEC]">
        <Question />
      </div>
    </div>
  );
}
