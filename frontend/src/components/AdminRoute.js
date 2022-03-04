import React from "react";
import { useSelector } from "react-redux";
import { Route, Navigate } from "react-router-dom";

export default function AdminRoute({ element: Component, ...rest }) {
  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;

  return userInfo && userInfo.isAdmin ? (
    Component
  ) : (
    <Navigate replace to="/signin" />
  );
}
