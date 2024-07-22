import React, { useState } from "react";
import MainLayout from "../layouts/mainLayout";
import homePhoto from "../assets/homePhoto.png";
import { Link } from "react-router-dom";

export default function Login() {
  return (
    <MainLayout>
      <div className="bg-white dark:bg-gray-900 flex w-full h-full shadow-lg flex items-center justify-center mt-12">
        {/* form */}
        <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center">
          <h2 className="font-bold text-4xl text-black dark:text-white mb-2">
            Login
          </h2>
          <p className="text-sm text-black dark:text-white mb-8">
            If you are already a member, easily log in
          </p>

          <form action="" className="flex flex-col gap-6 w-full max-w-md">
            <input
              className="p-3 rounded-xl border text-lg"
              type="email"
              name="email"
              placeholder="Email"
            />
            <div className="relative">
              <input
                className="p-3 rounded-xl border w-full text-lg"
                type="password"
                name="password"
                placeholder="Password"
              />
            </div>
            {/* <button className="bg-green-500 text-white hover:bg-green-600 hover:border-green-600 rounded-xl py-3 text-lg ">
              Login
            </button> */}
            <Link to="/uploadFile" className="bg-green-500 text-white hover:bg-green-600 hover:border-green-600 rounded-xl py-3 text-lg text-center">
              Login
            </Link>
          </form>

          <div className="mt-8 text-sm flex justify-between items-center text-black dark:text-white">
            <p>Don't have an account?</p>
            <Link
              to="/register"
              className="py-2 px-5 bg-green-500 text-white hover:bg-green-600 hover:border-green-600 rounded-xl"
            >
              Register
            </Link>
          </div>
        </div>

        {/* image */}
        <div className="hidden md:block w-1/2 h-full">
          <img
            className="w-full h-full object-cover"
            src={homePhoto}
            alt="Login"
          />
        </div>
      </div>
    </MainLayout>
  );
}
