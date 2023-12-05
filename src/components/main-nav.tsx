import React from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
} from "@nextui-org/react";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
const MainNav = () => {
  return (
    <Navbar>
      <NavbarBrand>
        <p className="font-bold text-inherit">Pradish AI✨</p>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link color="foreground" href="/">
            Home
          </Link>
        </NavbarItem>
        <NavbarItem isActive>
          <Link href="/upload-docs" >
            Upload Document
          </Link>
        </NavbarItem>
        <NavbarItem>
          
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
