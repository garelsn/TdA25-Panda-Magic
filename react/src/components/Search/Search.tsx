import React, { useEffect, useState } from "react";
import TaskFilter from "./components/TaskFilter";
import BannerSm from "../GlobalComponents/BannerSm";
const Search: React.FC = () => {
  
  const [data, setData] = useState<any[]>([]); // Všechny položky z API
  const [visibleData, setVisibleData] = useState<any[]>([]); // Aktuálně zobrazené položky
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const baseUrl = import.meta.env.VITE_REACT_APP_API_BASE_URL || "";
  const itemsPerPage = 10; // Počet položek, které se zobrazí najednou

  // Načítání dat z API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/v1/games`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        setData(result);
        setVisibleData(result.slice(0, itemsPerPage)); // Zobrazí první várku
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Funkce pro přidání dalších položek při scrollování
  const loadMoreItems = () => {
    setVisibleData((prevVisibleData) => {
      const nextIndex = prevVisibleData.length;
      return [
        ...prevVisibleData,
        ...data.slice(nextIndex, nextIndex + itemsPerPage),
      ];
    });
  };

  // Přidání event listeneru pro sledování scrollování
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 100
      ) {
        loadMoreItems();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll); // Cleanup listener
  }, [data]); // Sledování dat

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="h-screen relative">
    <BannerSm title="Seznam her" />
    <TaskFilter tasks={visibleData} />
    <div
      className="h-full absolute top-0 left-0 w-full -z-10"
      style={{
        background: "linear-gradient(to bottom, #141E34 15%, #375694 85%)",
      }}
    ></div>
  </div>
  );
};

export default Search;
