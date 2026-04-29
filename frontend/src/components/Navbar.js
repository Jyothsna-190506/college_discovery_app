function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-4">
      <a className="navbar-brand" href="/">
        🎓 CollegeFinder
      </a>

      <div className="ms-auto">
        <a href="/login" className="btn btn-light me-2">
          Login
        </a>
        <a href="/register" className="btn btn-warning">
          Register
        </a>
      </div>
    </nav>
  );
}

export default Navbar;
