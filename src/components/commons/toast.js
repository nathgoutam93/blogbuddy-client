import PropTypes from "prop-types";
import { HiOutlineClipboardCopy } from "react-icons/hi";

export default function Toast({ show, message }) {
  return (
    <div
      className={`${
        show ? "opacity-100 right-20" : "opacity-0 -right-10"
      } fixed bottom-20 p-4 flex justify-center items-center font-nunito text-white bg-green-500 rounded-xl space-x-2 z-50 transition-all pointer-events-none`}
    >
      <HiOutlineClipboardCopy size={35} className="text-white" />
      {message}
    </div>
  );
}

Toast.propTypes = {
  show: PropTypes.bool,
  message: PropTypes.string
};
