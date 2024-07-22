import React, { useState } from "react";
import { Link } from "react-router-dom";
import Control from "../assets/control.png";
import UploadFile from "../assets/uploadFileLogo.png";
import TableLogo from "../assets/tableLogo.png";
import ChartLogo from "../assets/chartLogo.png";
import PlotLogo from "../assets/plotLogo.png";

export default function Sidebar2({children}) {
  const [open, setOpen] = useState(true);

  const menus = [
    { name: "Upload File", link: "/uploadfile", src: UploadFile },
    { name: "Table", link: "/table", src: TableLogo },
    { name: "Chart", link: "/chart", src: ChartLogo },
    { name: "Plot", link: "/plot", src: PlotLogo },
  ];

  return (
    <section className="flex gap-6">
      <div className={`bg-white ${open ? "w-72" : "w-16"}`}>
      <div
        className={`bg-black ${open ? "w-72" : "w-16"} duration-500 text-gray-100 px-4 absolute`}
        style={{
          top: '25%',  // Starts from 25% of the viewport height
          bottom: '25%' // Ends at 75% of the viewport height
        }}
      >
        <div className="py-3 flex justify-end">
          <img
            src={Control}
            className={`cursor-pointer w-26 h-26 ${!open && "rotate-180"}`}
            onClick={() => setOpen(!open)}
          />
        </div>
        <div className="mt-4 flex flex-col gap-4 relative">
          {menus.map((menu, index) => (
            <Link
              to={menu.link}
              key={index}
              className="flex items-center text-sm gap-3.5 font-medium p-2 hover:bg-gray-800 rounded-md"
            >
              <img
                src={menu.src}
                alt={menu.name}
                className="w-5 h-5 bg-white dark:bg-white"
              />
              <h2
                style={{
                  transitionDelay: `${(index + 3) * 100}ms`,
                }}
                className={`whitespace-pre duration-500 ${!open && "opacity-0 translate-x-28 overflow-hidden"}`}
              >
                {menu.name}
              </h2>
            </Link>
          ))}
        </div>
      </div>
      </div>
      <div>{children}</div>
    </section>
  );
}
