import { useEffect, useState } from "react";
import {
  HiOutlineInformationCircle,
  HiOutlineBadgeCheck
} from "react-icons/hi";
import { BiError } from "react-icons/bi";
import PropTypes from "prop-types";

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
        show ? "right-4 opacity-100 lg:right-20" : "-right-10 opacity-0"
      } pointer-events-none fixed bottom-3/4 z-50 flex items-center justify-center space-x-2 rounded-xl p-4 font-nunito text-white transition-all lg:bottom-20`}
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
