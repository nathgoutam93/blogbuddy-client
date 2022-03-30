import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import {
  HiOutlineInformationCircle,
  HiOutlineBadgeCheck
} from "react-icons/hi";
import { BiError } from "react-icons/bi";

export default function Toast({ show, type, message }) {
  const [color, setColor] = useState("#16de69");
  const [icon, setIcon] = useState(<HiOutlineInformationCircle size={35} />);

  useEffect(() => {
    switch (type) {
      case "info":
        setColor("#457aff");
        setIcon(<HiOutlineInformationCircle size={35} />);
        break;
      case "error":
        setColor("#c40000");
        setIcon(<BiError size={35} />);
        break;
      case "success":
        setColor("#16de69");
        setIcon(<HiOutlineBadgeCheck size={35} />);
        break;
      default:
        setColor("#16de69");
        setIcon(<HiOutlineBadgeCheck size={35} />);
        break;
    }
  }, [type]);

  return (
    <div
      style={{ backgroundColor: color }}
      className={`${
        show ? "opacity-100 right-4 lg:right-20" : "opacity-0 -right-10"
      } fixed bottom-3/4 lg:bottom-20 p-4 flex justify-center items-center font-nunito text-white rounded-xl space-x-2 z-50 transition-all pointer-events-none`}
    >
      {icon}
      {message}
    </div>
  );
}

Toast.propTypes = {
  show: PropTypes.bool,
  type: PropTypes.string,
  message: PropTypes.string
};
