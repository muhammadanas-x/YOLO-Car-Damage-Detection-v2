import React from "react";
import { Unity, useUnityContext } from "react-unity-webgl";
import Navbar from "../../components/navbar";

const UNITYAPP = () => {
  const { unityProvider } = useUnityContext({
    loaderUrl: "build/webgl/WebGL repair.loader.js",
    dataUrl: "build/webgl/WebGL repair.data.br",
    frameworkUrl: "build/webgl/WebGL repair.framework.js.br",
    codeUrl: "build/webgl/WebGL repair.wasm.br",
  });

  return (
    <>      
    

      {/* Unity WebGL below the Navbar */}
        <Unity unityProvider={unityProvider} style={{ width: "100%", height: "100%" }} />
    
    </>
  );
};

export default UNITYAPP;
