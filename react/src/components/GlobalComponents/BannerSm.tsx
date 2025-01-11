import { Link } from "react-router-dom";

function BannerSm({ title, url}: { title: string, url:string }) {
  return (
    <div className="w-full h-1/4 bg-[#1A1A1A] text-white p-2 text-center ">
      <div className="w-[25%]">
        <Link to="/">
          <img
            src={url}
            alt="Logo"
            className="w-1/2 md:w-1/2 m-6"
          />
        </Link>
      </div>
      <div className="">
        <h1 className="text-6xl font-bold">{title}</h1>
      </div>
    </div>
  );
}

export default BannerSm;
