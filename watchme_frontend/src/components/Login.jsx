import React from "react";
import GoogleLogin from "react-google-login";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";

import WatchVideo from "../assets/vid.mp4";
import { gapi } from "gapi-script";

import { client } from "../client";
import Swal from 'sweetalert2';
import 'animate.css';

const Login = () => {
  const navigate = useNavigate();

  const responseGoogle = (response) => {
    localStorage.setItem("user", JSON.stringify(response.profileObj));
    const { imageUrl, name, googleId } = response.profileObj;

    // saving the user detail to sanity
    const doc = {
      _id: response.profileObj.googleId,
      _type: "user",
      userName: response.profileObj.name,
      image: response.profileObj.imageUrl,
    };

    // create a client file to acces the sanity db
    client.createIfNotExists(doc).then(() => {
      Swal.fire({
        title: `Welcome ${name}`,
        text: "You are logged in",
        imageUrl: `${imageUrl}`,
        imageWidth: 200,
        imageHeight: 200,
        imageAlt: 'Custom image',
        showConfirmButton: false,
        timer: 2000,
        showClass: {
            popup: 'animate__animated animate__fadeInBottomLeft'
            },
            hideClass: {
            popup: 'animate__animated animate__fadeOutUp'
            }
    })
      navigate("/", { replace: true });
    });
  };

  gapi.load("client:auth2", () => {
    gapi.client.init({
      clientId: process.env.REACT_APP_GOOGLE_TOKEN,
      plugin_name: "chat",
    });
  });

  // login contianer
  return (
    <div className="flex justify-start items-center flex-col h-screen">
      <div className="relative w-full h-full">
        {/* login screen video */}
        <video
          src={WatchVideo}
          type="video/mp4"
          loop
          controls={false}
          muted
          autoPlay
          className="w-full h-full object-cover"
        />
      </div>

      {/* overlay for the video */}
      <div className="absolute flex-col flex justify-center items-center top-0 left-0 right-0 bottom-0 bg-blackOverlay">
        {/* login content */}


        {/* login Button */}
        <div className="shadow-2xl">
          <GoogleLogin
            clientId={process.env.REACT_APP_GOOGLE_TOKEN}
            render={(renderProps) => (
              <button
                type="button"
                className="bg-mainColor flex justify-center items-center p-2 rounded-lg cursor-pointer outline-none"
                onClick={renderProps.onClick}
                disabled={renderProps.disabled}
              >
                <FcGoogle className="mr-4" /> Sign in with Google
              </button>
            )}
            onSuccess={responseGoogle}
            onFailure={responseGoogle}
            cookiePolicy="single_host_origin"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
