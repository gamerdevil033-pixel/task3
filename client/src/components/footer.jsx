import '../App.css'
import { FaFacebookF } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaYoutube } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa";
import { FaPinterestP } from "react-icons/fa";
import { AiFillInstagram } from "react-icons/ai";

function Footer(){

  return (  
  <div className="footer overflow-hidden bg-[#333338] h-30 px-16 flex items-center justify-center cursor-pointer">

<div className="icons flex gap-4 w-[80%] justify-center">

  <div className="containersize-[3rem] flex justify-center items-center">
    <FaFacebookF size="3rem" className='hover:text-black hover:bg-white bg-black text-white p-2 transition-all duration-100 ease-linear rounded-full border-1 border-[#636363] hover:border-black'/>
  </div>

  <div className="containersize-[3rem] flex justify-center items-center">
    <FaXTwitter size="3rem" className='hover:text-black hover:bg-white bg-black text-white p-2 transition-all duration-100 ease-linear rounded-full border-1 border-[#636363] hover:border-black'/>
  </div>

   <div className="containersize-[3rem] flex justify-center items-center">
    <FaYoutube size="3rem" className='hover:text-black hover:bg-white bg-black text-white p-2 transition-all duration-100 ease-linear rounded-full border-1 border-[#636363] hover:border-black'/>
  </div>

   <div className="containersize-[3rem] flex justify-center items-center">
    <AiFillInstagram size="3rem" className='hover:text-black hover:bg-white bg-black text-white p-2 transition-all duration-100 ease-linear rounded-full border-1 border-[#636363] hover:border-black'/>
  </div>

  <div className="containersize-[3rem] flex justify-center items-center">
    <FaPinterestP size="3rem" className='hover:text-black hover:bg-white bg-black text-white p-2 transition-all duration-100 ease-linear rounded-full border-1 border-[#636363] hover:border-black'/>
  </div>
</div>

</div>)}

export default Footer;