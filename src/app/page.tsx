'use client';
import PropertyListing from "./components/PropertyListing";
import { useEffect, useState } from "react";

const fetchData = async () => {
  try {
    const response = await fetch("http://localhost:5000/api/properties", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("There was an error fetching the data:", error);
    return null;
  }
};


export default function Home() {

  const [initialListings, setInitialListings] = useState(null);

  useEffect(() => {
    const getData = async () => {
      const result = await fetchData();
      setInitialListings(result);
    };

    getData();
  }, []);

  if (!initialListings) {
    return <div>Loading...</div>;
  }

  return (
 <>
 <PropertyListing initialListings={initialListings}/>
 </>
  );
}
