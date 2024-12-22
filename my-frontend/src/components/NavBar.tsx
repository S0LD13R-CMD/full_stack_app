const Navbar: React.FC = () => {
    return (
      <nav className="navbar bg-base-100 shadow-md">
        <div className="flex-1">
          <a className="btn btn-ghost normal-case text-xl">Book Manager</a>
        </div>
        <div className="flex-none">
          <button className="btn btn-primary">Sign In</button>
        </div>
      </nav>
    );
  };
  
  export default Navbar;