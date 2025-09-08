import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="bg-white shadow p-4 text-center">
      <img src="/logo.png" alt="Company Logo" className="h-24 mx-auto" />
      <div className="w-full bg-[#a3cd39] py-2">
        <div className="flex justify-between items-center pl-8 pr-4">
          <p style={{ color: '#545454', fontFamily: 'Merriweather, serif' }}>Hello, John <Link to="/" className="text-[#545454] text-sm hover:underline" style={{ fontFamily: 'Merriweather, serif' }}>(Sign Out)</Link></p>
        </div>
      </div>
    </header>
  );
}

export default Header;
