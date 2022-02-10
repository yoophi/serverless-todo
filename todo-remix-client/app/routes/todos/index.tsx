import React from "react";
import { Link } from "remix";

const TodosRoute = () => {
  return (
    <>
      <h1>Todos</h1>
      {[1, 2, 3].map((key) => (
        <li>
          <Link to={`/todos/${key}`}>Todo {key}</Link>
        </li>
      ))}
    </>
  );
};

export default TodosRoute;
