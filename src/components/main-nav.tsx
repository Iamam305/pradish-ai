import React from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
} from "@nextui-org/react";
import { UserButton } from "@clerk/nextjs";
const MainNav = () => {
  return (
    <Navbar>
      <NavbarBrand>
        <p className="font-bold text-inherit">Pradish AI✨</p>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link color="foreground" href="#">
            Features
          </Link>
        </NavbarItem>
        <NavbarItem isActive>
          <Link href="#" aria-current="page">
            Customers
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="#">
            Integrations
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
      
        <NavbarItem>
          <UserButton afterSignOutUrl="/" />
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
};

export default MainNav;
