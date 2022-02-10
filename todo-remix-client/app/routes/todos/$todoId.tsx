import React from "react";
import { LoaderFunction, useLoaderData } from "remix";

export const loader: LoaderFunction = async ({ request, params }) => {
  return {
    id: params.todoId,
  };
};

const TodoDetailRoute = () => {
  const data = useLoaderData<{ id: number }>();
  return (
    <>
      <div>Todo Detail</div>
      <div>id: {data.id}</div>
    </>
  );
};

export default TodoDetailRoute;
