const Footer = () => {
  return (
    <footer className="bg-light text-center text-lg-start fixed-footer py-2">
      <div className="text-center p-3" style={{ backgroundColor: "#f1f1f16f" }}>
        © {new Date().getFullYear()} Workout Tracker | FitStack Team
      </div>
    </footer>
  );
};

export default Footer;