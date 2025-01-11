import { Link } from "react-router-dom";

type MyComponentProps = {
  name: string;
  link: string;
  onClick?: boolean;
};

const ButtonLink: React.FC<MyComponentProps> = ({ name, link, onClick = false }) => {
  const handleClick = () => {
    if (onClick) {
      window.location.reload(); // Reload stránky, pokud je `onClick` true
    }
  };
  return (
    <div className="relative inline-block z-20">
      <Link
        to={link}
        className="relative bg-[#D9D9D9] text-black border-2 border-black rounded-[30px] cursor-pointer inline-block font-semibold text-[18px] px-[30px] leading-[55px] text-center no-underline select-none mb-5 mt-3 ml-2 transition-transform duration-200 w-[200px]
        after:content-[''] after:absolute after:bg-[#E31838] after:rounded-[30px] after:inset-0 after:translate-x-[8px] after:translate-y-[8px] after:border-2 after:border-black after:-z-10 after:transition-transform after:duration-500 hover:after:translate-x-0 hover:after:translate-y-0 "
        onClick={(e) => {
          if (onClick) {
            e.preventDefault(); // Zabraň přesměrování, pokud je onClick true
            handleClick();
          }
        }}
      >
        {name}
      </Link>
    </div>
  );
};

export default ButtonLink;
