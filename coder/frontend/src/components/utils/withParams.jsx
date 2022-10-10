import React, { Component } from "react";
import { useParams } from "react-router-dom";

export default function withParams(MyElement){
  return (props) => {
    const match = {
      params: useParams(),
    }
    return <MyElement match={match} {...props} />
  }
}
