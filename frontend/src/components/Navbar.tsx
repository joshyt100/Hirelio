import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
const Navbar: React.FC = () => {
  return (
    <div className="">
      <nav className="p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">CoverAI</h1>
        <div className="flex gap-2">
          <Link to="/cover-letter-generator">
            <Button variant="ghost" className=" border dark:border-gray-600">Generate</Button>
          </Link>
          <Link to="/saved">
            <Button variant="ghost" className="border dark:border-gray-600">Saved</Button>
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
