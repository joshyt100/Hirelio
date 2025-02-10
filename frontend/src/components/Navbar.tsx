import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
const Navbar: React.FC = () => {
  return (
    <div className="">
      <nav className="p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">CoverAI</h1>
        <div className="flex gap-4">
          <Link to="/saved-cover-letters">
            <Button variant="ghost">Saved Cover Letters</Button>
          </Link>
          <Link to="/profile">
            <Button variant="ghost">Profile</Button>
          </Link>
          <Link to="/login">
            <Button>Login</Button>
          </Link>
        </div>
      </nav>
    </div>
  );
}


export default Navbar
