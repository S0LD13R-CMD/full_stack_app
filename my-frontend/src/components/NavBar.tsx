
import { Component } from "react";

// Define a class component for t
class Navbar extends Component {
  render() {
    return (
      <nav className="navbar bg-base-100 shadow-md">
        <div className="flex-1">
          {/* Brand or title of the application */}
          <a className="btn btn-ghost normal-case text-xl">Book Manager</a>
        </div>
        <div className="flex-none">
          {/* Sign In button, could be linked to a sign-in function */}
          <button className="btn btn-primary">Sign In</button>
        </div>
      </nav>
    );
  }
}

export default Navbar;