import MobileNav from "./MobileNav"
import DesktopNav from "./DesktopNav"

const Header = () => {
  return (
    <header className="w-[100%] h-[8vh] lg:h-[14vh] z-[9999999999999999999] fixed top-0 bg-white">
      <MobileNav/>
      <DesktopNav/>
      
    </header>
  )
}

export default Header