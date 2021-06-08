import React from "react";

export default function Heading({ coder_email, project_prefix, title }) {
  return (
    <div id="title">
      <div>
        <h1> {title} </h1>
      </div>
      <div>
        <a href="..">back</a>
        <a href={`/c/${project_prefix}/`}>home</a>
        <a href="/accounts/logout">logout</a>
      </div>
    </div>
  );
}
