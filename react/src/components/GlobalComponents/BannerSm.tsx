import { Link } from "react-router-dom";

function BannerSm({ title, url}: { title: string, url:string }) {
  return (
    <div className="w-full h-1/4 bg-[#1A1A1A] text-white grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        <Link to="/">
          <img
            src={url}
            alt="Logo"
            className="w-1/2 m-6"
          />
        </Link>
      <div className=" flex justify-center items-center lg:mb-0 mb-14">
        <h1 className="text-6xl font-bold">{title}</h1>
      </div>
    </div>
  );
}

export default BannerSm;
