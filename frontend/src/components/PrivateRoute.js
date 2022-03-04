import React from "react";
import { useSelector } from "react-redux";
import { Route, Navigate } from "react-router-dom";

export default function PrivateRoute({ element: Component, ...rest }) {
  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;

  return userInfo ? Component : <Navigate replace to="/signin" />;
}
