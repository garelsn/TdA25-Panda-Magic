import { Link } from "react-router-dom";
function BannerSm({title}: {title: string}) {
  return (
    <div className="w-full h-1/4 bg-[#1A1A1A] text-white text-center p-2">
        <Link to="/">
            <img src="./Think-different-Academy_LOGO_oficialni-bile.svg" alt="" className="w-1/2 md:w-1/6 m-6"/>
        </Link>
        <h1 className="text-5xl font-bold mb-11" >{title}</h1>
        
    </div>
  );
}

export default BannerSm;
