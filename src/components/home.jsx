import homePhoto from "../assets/homePhoto.png";
import MainLayout from "../layouts/mainLayout";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <MainLayout>
      <div className="flex flex-col lg:flex-row items-center justify-between mt-4 sm:mt-8 md:mt-12">
        <div className="text-black dark:text-white lg:max-w-xl">
          <h1 className="text-blue-800 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight sm:leading-normal">
            Videos Data
          </h1>
          <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold mt-2 sm:mt-3 md:mt-5">
            Find your watched video's data, Now and Here!
          </h3>
          <p className="text-sm sm:text-base mt-2 sm:mt-3 md:mt-5">
            Video Data offers a wide variety of videos accompanied with their
            new up-to-date data. Read, upload, and download your videos' data
            via our site.
          </p>
          <div className="mt-4 sm:mt-6 md:mt-10">
            <Link
              to="/login"
              className="bg-green-500 text-white rounded-full py-2 px-4 sm:py-3 sm:px-8 text-sm sm:text-base font-medium inline-block mr-4 hover:bg-green-600 hover:border-green-600 duration-300 dark:bg-green-600 dark:hover:bg-green-700"
            >
              Let's start
            </Link>
          </div>
        </div>
        <img
          className="w-full sm:w-3/4 md:w-2/3 lg:w-1/2 mt-4 lg:mt-0"
          src={homePhoto}
          alt="homePhoto"
        />
      </div>
    </MainLayout>
  );
}
