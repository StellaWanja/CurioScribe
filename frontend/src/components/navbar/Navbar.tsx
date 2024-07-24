import React, { useState } from "react";
import Logo from "../../assets/logo.svg";
import { NavLink } from "react-router-dom";
import { styles } from "../../styles/styles";

const navLinks = [
  {
    id: "about",
    title: "About",
  },
  {
    id: "how-it-works",
    title: "How it Works",
  },
  {
    id: "contact",
    title: "Contact Us",
  },
];

const Navbar: React.FC = () => {
  const [active, setActive] = useState("");

  return (
    <nav
      className={`${styles.paddingX} py-5 bg-flash-white fixed top-0 w-full flex items-center z-20`}
    >
      <div className="w-full flex justify-between items-center mx-auto">
        <NavLink
          to="/"
          onClick={() => {
            setActive("");
            window.scrollTo(0, 0); //scroll to beginning of page
          }}
        >
          <img src={Logo} alt="curioscribe-logo" className="w-full h-9 object-contain" />
        </NavLink>
        <ul className="list-none hidden sm:flex flex-row gap-10 m-0 ">
          {navLinks.map((link) => {
            return (
              <li
                key={link.id}
                className={`${
                  active === link.title ? "text-lavender" : "text-raisin-black"
                } text-[18px] font-medium cursor-pointer duration-100 ease-in hover:text-[#878789]`}
                onClick={() => setActive(link.title)}
              >
                <a href={`#${link.id}`}>{link.title}</a>
              </li>
            );
          })}
        </ul>

        <div className="">
          <button>Sign Up</button>
          <button>Login</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
