import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FaSearch, FaBars, FaTimes } from "react-icons/fa"; // Importing Font Awesome icons

// Styled Components

const NavbarContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0px;
  background-color: white;
  box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.1);
  height: 80px;

  @media (max-width: 768px) {
    justify-content: space-between;
    // width:100%;
  }
`;

const Logo = styled.div`
  width: 300px;
  height: 100%;
  display: flex;

  img {
    width: 300px;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  @media (max-width: 768px) {
    width: 180px; /* Reduce the width of the logo for small screens */

    img {
      width: 180px; /* Adjust the image width accordingly */
    }
  }
  @media (max-width: 900px) {
    width: 150px; /* Reduce the width of the logo for small screens */

    img {
      width: 150px; /* Adjust the image width accordingly */
    }
  }
`;

const RightContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  position: relative;

  @media (max-width: 768px) {
    display: none;
  }
`;

const Menu = styled.div`
  display: flex;
  gap: 15px;
  font-size: 15px;
  color: #333;
`;

const MenuItem = styled.div`
  cursor: pointer;
  padding: 10px 15px;
  border-radius: 5px;
  height: 30px;
  display: flex;
  align-items: center;
  transition: background-color 0.3s ease, color 0.3s ease;
  color: ${(props) => (props.active ? "white" : "#333")};
  background-color: ${(props) => (props.active ? "#b00000" : "transparent")};
  text-decoration: none;

  &:hover {
    background-color: #b00000;
    color: white;
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 50px;
  background-color: white;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.2);
  border-radius: 5px;
  z-index: 1000;
  display: ${(props) => (props.show ? "block" : "none")};
  padding: 10px 0;
  width: 180px;
`;

const DropdownItem = styled(Link)`
  display: block;
  padding: 10px 15px;
  color: #333;
  text-decoration: none;
  transition: background-color 0.3s ease, color 0.3s ease;

  &:hover {
    background-color: #b00000;
    color: white;
  }
`;
const DropdownMenuLogin = styled.div`
  position: absolute;
  top: 50px;
  background-color: white;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.2);
  border-radius: 5px;
  z-index: 1000;
  display: ${(props) => (props.show ? "block" : "none")};
  padding: 10px 0;
  width: 155px;
`;

const SearchInput = styled.input`
  padding: 8px;
  border: 1px solid #b00000;
  border-radius: 20px;
  outline: none;
  font-size: 14px;
  width: 200px; /* Set a default width */

  &:focus {
    border-color: rgb(158, 25, 18);
  }

  @media (max-width: 1024px) {
    width: 100px; /* Reduce width for small screens */
  }

  @media (max-width: 800px) {
    width: 150px; /* Reduce width for small screens */
  }
  @media (max-width: 400px) {
    width: 100px; /* Reduce width for small screens */
  }
`;

const Button = styled.button`
  padding: 0 18px;
  border-radius: 10px;
  background-color: white;
  height: 45px;
  border: 1px solid #b00000;
  color: #b00000;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover {
    background-color: white;
    border: 2px solid #b00000;
    color: #b00000;
  }

  &:active {
    transform: scale(0.95);
  }
  @media (max-width: 1024px) {
    width: 100px;
  }
`;

const ButtonBooknow = styled(Link)`
  padding: 10px 20px;
  margin-right: 10px;
  border-radius: 10px;
  border: 1px solid #b00000;
  background-color: #b00000;
  height: 25px;
  color: white;
  font-size: 16px;
  font-weight: 600;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;

  &:hover {
    background-color: rgb(158, 25, 18);
    border: 2px solid #b00000;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: translateY(1px);
    background-color: rgb(158, 25, 18);
  }
  @media (max-width: 1200px) {
    display: none;
  }
`;

const Sidebar = styled.div`
  position: fixed;
  top: 0;
  left: ${(props) => (props.open ? "0" : "-250px")};
  width: 250px;
  height: 100%;
  background-color: white;
  box-shadow: 2px 0px 10px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  z-index: 999;
  padding-top: 60px;
  display: flex;
  flex-direction: column;
`;

const SidebarMenuItem = styled(Link)`
  padding: 15px;
  text-decoration: none;
  color: #333;
  transition: background-color 0.3s ease, color 0.3s ease;
  &:hover {
    background-color: #b00000;
    color: white;
  }
`;

// const SidebarButton = styled.div`
//   padding: 13px;
//   cursor: pointer;
//   color: #b00000;
//   font-weight: bold;
//   text-align: left;
//   border-top: 1px solid #ddd;
//   &:hover {
//     background-color: #f8f8f8;
//   }
// `;

// const SidebarDropdown = styled.div`
//   display: ${(props) => (props.show ? "block" : "none")};
//   background-color: #f9f9f9;

//   padding: 3px;
// `;

// const SidebarDropdownItem = styled(Link)`
//   display: block;
//   padding: 10px;
//   color: #333;
//   text-decoration: none;
//   &:hover {
//     background-color: #b00000;
//     color: white;
//   }
// `;

const HamburgerIcon = styled.div`
  display: none;
  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    cursor: pointer;
    margin-left: 10px;
  }
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  position: relative;
`;

const SearchIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #b00000;
  font-size: 18px;
  cursor: pointer;
  padding: 5px;
  transition: color 0.3s ease;

  &:hover {
    color: rgb(158, 25, 18);
  }
`;

const MobileSearchContainer = styled.div`
  display: none;
  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    // margin-right: 10px;
    margin-left: 30px;
  }
`;

// Main Navbar component

function Navbar() {
  const [activeItem, setActiveItem] = useState(null);
  const [showDonateDropdown, setShowDonateDropdown] = useState(false);
  const [showEducationDropdown, setShowEducationDropdown] = useState(false);
  const [showLoginDropdown, setShowLoginDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const donateDropdownRef = useRef(null);
  const educationDropdownRef = useRef(null);
  const loginDropdownRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();

  const handleClickOutside = (event) => {
    if (
      donateDropdownRef.current &&
      !donateDropdownRef.current.contains(event.target)
    ) {
      setShowDonateDropdown(false);
    }
    if (
      educationDropdownRef.current &&
      !educationDropdownRef.current.contains(event.target)
    ) {
      setShowEducationDropdown(false);
    }
    if (
      loginDropdownRef.current &&
      !loginDropdownRef.current.contains(event.target)
    ) {
      setShowLoginDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setShowDonateDropdown(false);
    setShowEducationDropdown(false);
    setShowLoginDropdown(false);
  }, [location]);

  const handleDonateHover = () => {
    setShowDonateDropdown(true);
    setShowEducationDropdown(false);
  };

  const handleEducationHover = () => {
    setShowEducationDropdown(true);
    setShowDonateDropdown(false);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = () => {
    const routes = [
      {
        keywords: ["donation basics", "basics", "donation", "donate"],
        path: "/donation-basics",
      },
      {
        keywords: ["blood donation", "blood", "donate blood"],
        path: "/blood-donation",
      },
      {
        keywords: [
          "stem cell donation",
          "stem cells",
          "donate stem cells",
          "stemcells",
          "stemcell",
        ],
        path: "/stemcell-donation",
      },
      {
        keywords: ["check eligibility", "eligibility", "eligible"],
        path: "/check-eligibility",
      },
      {
        keywords: [
          "types and compatibility",
          "blood types",
          "compatibility",
          "types",
        ],
        path: "/types-and-compatibility",
      },
      {
        keywords: ["why donate blood", "why blood", "blood donation reason"],
        path: "/why-donate-blood",
      },
      {
        keywords: ["why donate stem cells", "why stemcells", " why stem cells"],
        path: "/why-donate-stemcells",
      },
      {
        keywords: ["faqs", "frequently asked questions", "questions"],
        path: "/faqs",
      },
      {
        keywords: ["join our team", "join team", "volunteer", "team"],
        path: "/JoinOurTeam",
      },
    ];

    const normalizedQuery = searchQuery.trim().toLowerCase();

    const matchedRoute = routes.find((route) =>
      route.keywords.some((keyword) => normalizedQuery.includes(keyword))
    );

    if (matchedRoute) {
      navigate(matchedRoute.path);
      setSearchQuery("");
    } else {
      alert("No matching page found.");
    }
  };

  // Function to handle sidebar item click and close the sidebar
  const handleSidebarItemClick = () => {
    setSidebarOpen(false); // Close the sidebar when an item is clicked
  };

  const handleLoginClick = (path) => {
    setSidebarOpen(false); // Close the sidebar
    setShowLoginDropdown(false); // Close the dropdown
    navigate(path); // Navigate to the respective page
  };

  return (
    <>
      <NavbarContainer>
        <Logo>
          <a href="/">
            <img src="/images/logo12.png" alt="Donation Logo" />
          </a>
        </Logo>
        <RightContainer>
          <Menu>
            <MenuItem
              onMouseEnter={handleDonateHover}
              active={activeItem === "Donate"}
            >
              Donate
            </MenuItem>
            <DropdownMenu ref={donateDropdownRef} show={showDonateDropdown}>
              <DropdownItem to="/donation-basics">Donation Basics</DropdownItem>
              <DropdownItem to="/blood-donation">Blood Donation</DropdownItem>
              <DropdownItem to="/stemcell-donation">
                Stem Cell Donation
              </DropdownItem>
              <DropdownItem to="/check-eligibility">
                Check Eligibility
              </DropdownItem>
            </DropdownMenu>

            <MenuItem
              onMouseEnter={handleEducationHover}
              active={activeItem === "Education"}
            >
              Education
            </MenuItem>
            <DropdownMenu
              ref={educationDropdownRef}
              show={showEducationDropdown}
            >
              <DropdownItem to="/types-and-compatibility">
                Types and Compatibility
              </DropdownItem>
              <DropdownItem to="/why-donate-blood">
                Why Donate Blood
              </DropdownItem>
              <DropdownItem to="/why-donate-stemcells">
                Why Donate Stem Cells
              </DropdownItem>
              {/* <DropdownItem to="/cancer-detection">
                Cancer Detection
              </DropdownItem> */}
              <DropdownItem to="/faqs">FAQs</DropdownItem>
            </DropdownMenu>

            <MenuItem
              as={Link}
              to="/JoinOurTeam"
              active={activeItem === "JoinOurTeam"}
            >
              Join Our Team
            </MenuItem>
          </Menu>
          <SearchContainer>
            <SearchInput
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearchSubmit();
              }}
            />
            <SearchIcon onClick={handleSearchSubmit}>
              <FaSearch />
            </SearchIcon>
          </SearchContainer>

          <div style={{ position: "relative" }}>
            <Button onClick={() => setShowLoginDropdown(!showLoginDropdown)}>
              Login / Register
            </Button>
            <DropdownMenuLogin ref={loginDropdownRef} show={showLoginDropdown}>
              <DropdownItem
                to="/login"
                onClick={() => setShowLoginDropdown(!showLoginDropdown)}
              >
                Login as Donor
              </DropdownItem>
              <DropdownItem to="/loginHospital">Login as Hospital</DropdownItem>
            </DropdownMenuLogin>
          </div>
          <ButtonBooknow as={Link} to="/login">
            Book Now
          </ButtonBooknow>
        </RightContainer>

        {/* Mobile Search */}
        <MobileSearchContainer>
          <SearchInput
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchChange}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearchSubmit();
            }}
          />
          <SearchIcon onClick={handleSearchSubmit}>
            <FaSearch />
          </SearchIcon>
          {/* Hamburger Icon */}
          <HamburgerIcon onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <FaTimes /> : <FaBars />}
          </HamburgerIcon>
        </MobileSearchContainer>
      </NavbarContainer>

      {/* Sidebar */}

      <Sidebar open={sidebarOpen}>
        {/* <SidebarButton onClick={() => setShowLoginDropdown(!showLoginDropdown)}>
          Login / Register
        </SidebarButton> */}
        {/* <SidebarDropdown  ref={loginDropdownRef} show={showLoginDropdown}>
  <SidebarDropdownItem
    to="/register"
    onClick={() => setSidebarOpen(false)}  // Close sidebar after navigation
  >
    Login/Register as Donor
  </SidebarDropdownItem>
  <SidebarDropdownItem
    to="/registerHospital"
    onClick={() => setSidebarOpen(false)}  // Close sidebar after navigation
  >
    Login/Register as Hospital
  </SidebarDropdownItem>
</SidebarDropdown> */}

        <SidebarMenuItem to="/login" onClick={handleSidebarItemClick}>
          Login as Donor{" "}
        </SidebarMenuItem>

        <SidebarMenuItem to="/loginHospital" onClick={handleSidebarItemClick}>
          Login as Hospital
        </SidebarMenuItem>
        <SidebarMenuItem to="/donation-basics" onClick={handleSidebarItemClick}>
          Donation Basics
        </SidebarMenuItem>
        <SidebarMenuItem to="/blood-donation" onClick={handleSidebarItemClick}>
          Blood Donation
        </SidebarMenuItem>
        <SidebarMenuItem
          to="/stemcell-donation"
          onClick={handleSidebarItemClick}
        >
          Stem Cell Donation
        </SidebarMenuItem>
        <SidebarMenuItem
          to="/check-eligibility"
          onClick={handleSidebarItemClick}
        >
          Check Eligibility
        </SidebarMenuItem>
        <SidebarMenuItem
          to="/types-and-compatibility"
          onClick={handleSidebarItemClick}
        >
          Types and Compatibility
        </SidebarMenuItem>
        <SidebarMenuItem
          to="/why-donate-blood"
          onClick={handleSidebarItemClick}
        >
          Why Donate Blood
        </SidebarMenuItem>
        <SidebarMenuItem
          to="/why-donate-stemcells"
          onClick={handleSidebarItemClick}
        >
          Why Donate Stem Cells
        </SidebarMenuItem>
        {/* <SidebarMenuItem
          to="/cancer-detection"
          onClick={handleSidebarItemClick}
        >
          Cancer Detection
        </SidebarMenuItem> */}
        <SidebarMenuItem to="/faqs" onClick={handleSidebarItemClick}>
          FAQs
        </SidebarMenuItem>
        <SidebarMenuItem to="/JoinOurTeam" onClick={handleSidebarItemClick}>
          Join Our Team
        </SidebarMenuItem>

        {/* Login/Register Button inside Sidebar
  <SidebarMenuItem as="div" onClick={() => { 
    setSidebarOpen(false); 
    navigate('/login'); // Navigate to Donor login
  }}>
    Login as Donor
  </SidebarMenuItem>
  <SidebarMenuItem as="div" onClick={() => { 
    setSidebarOpen(false); 
    navigate('/loginHospital'); // Navigate to Hospital login
  }}>
    Login as Hospital
  </SidebarMenuItem> */}
      </Sidebar>
    </>
  );
}

export default Navbar;









