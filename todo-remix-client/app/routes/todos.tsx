import React from "react";
import { Outlet } from "remix";

const TodosRoute = () => {
  return (
    <>
      <h3>Todos</h3>
      <div style={{ padding: "8px", border: "1px solid #ccc" }}>
        <Outlet />
      </div>
    </>
  );
};

export default TodosRoute;
