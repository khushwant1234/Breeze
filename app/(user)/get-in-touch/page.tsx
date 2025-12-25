import MoreInfo from "@/components/get_in_touch/more-info";
import Box from "@/components/get_in_touch/box";
import Info from "@/components/get_in_touch/info";
import Question from "@/components/get_in_touch/form-questions";

export default function Home() {
  return (
    <div>
      <title>Contact Us - Breeze '25</title>
      <div className="pt-16 md:pt-20 xl:pt-24">
        <MoreInfo />
      </div>

      <div className=" flex flex-wrap  my-16 gap-20 justify-center px-[40px]">
        {Info.slice(0, 2).map((note) => (
          <Box
            key={note.key}
            name={note.name}
            img={note.img}
            number={note.number}
            email={note.email}
            title={note.title}
          />
        ))}
      </div>
      <div className=" flex flex-wrap  my-16 gap-20 justify-center px-[40px]">
        {Info.slice(2, 4).map((note) => (
          <Box
            key={note.key}
            name={note.name}
            img={note.img}
            number={note.number}
            email={note.email}
            title={note.title}
          />
        ))}
      </div>
      <div className="">
        <Question />
      </div>
    </div>
  );
}
