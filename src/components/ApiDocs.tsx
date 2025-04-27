import React from "react";

export default function ApiDocs() {
  return (
    <iframe
      src="/swagger.html"
      title="API Documentation"
      style={{
        width: "100%",
        height: "100vh",
        border: "none",
        overflow: "auto",
      }}
    />
  );
}
