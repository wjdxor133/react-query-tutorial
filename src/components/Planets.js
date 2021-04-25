import React, { useState } from "react";
import { useQuery } from "react-query";
import Planet from "./Planet";

const fetchPlanets = async ({ queryKey }) => {
  const [, page] = queryKey;
  const res = await fetch(`http://swapi.dev/api/planets/?page=${page}`);
  return res.json();
};

const Planets = () => {
  const [page, setPage] = useState(1);
  const { data, isFetching, isPreviousData, status } = useQuery(
    ["planets", page],
    fetchPlanets,
    {
      keepPreviousData: true,
    }
  );
  console.log("data", data);

  return (
    <>
      <h2>Planets</h2>
      <h3>{status}</h3>

      {status === "loading" && <div>Loading data...</div>}
      {status === "error" && <div>Error fetching data</div>}
      {status === "success" && (
        <div>
          <button
            onClick={() => setPage((old) => Math.max(old - 1, 0))}
            disabled={page === 1}
          >
            Previous page
          </button>
          <span>{page}</span>
          <button
            onClick={() => {
              !isPreviousData && data.next && setPage((old) => old + 1);
            }}
            disabled={isPreviousData || !data.next}
          >
            Next page
          </button>
          <div>
            {data.results?.map((planet) => (
              <Planet key={planet.name} planet={planet} />
            ))}
          </div>
          {isFetching ? <span> Loading...</span> : null}{" "}
        </div>
      )}
    </>
  );
};

export default Planets;
