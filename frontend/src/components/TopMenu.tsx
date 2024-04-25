"use client";
import Image from "next/image";
import Link from "next/link";
import { Button, Drawer, ListItem, Menu, MenuItem, Stack } from "@mui/material";
import { MouseEventHandler, useState } from "react";
import { useTheme } from "next-themes";
import useSession from "@/hooks/useSession";

export default function () {
  const { session } = useSession();
  // const {data:session}=useSession();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const { theme, setTheme } = useTheme();
  const [drawerOpen, setDrawerOpen] = useState(false);
  // console.log(session)
  function toggleDrawerOpen() {
    setDrawerOpen(!drawerOpen);
  }
  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    setAnchorEl(e.currentTarget);
  }
  function handleClose() {
    setAnchorEl(null);
  }
  function themeOnClick(theme: string): MouseEventHandler<HTMLLIElement> {
    return function (e: React.MouseEvent<HTMLLIElement>) {
      setTheme(theme);
      handleClose();
      console.log(theme);
    };
  }
  return (
    <div className="h-[50px] w-full flex flex-row md:gap-2 sm:gap-0 items-center bg-black text-white dark:bg-white dark:text-black">
      <Link href="/" className="shrink-0 h-full mr-auto">
        <div className="h-full">
          <Image
            alt="Bing Resy"
            src="/img/logo.png"
            width={0}
            height={0}
            className="object-contain h-full w-auto"
            sizes="100vw"
          />
        </div>
      </Link>
      {!session && (
        <Link
          // href="/api/auth/signin"
          href="/login"
          className="h-full m-2 radius-2 hover:bg-[lightblue]"
          prefetch={true}
        >
          <Button className="h-full w-full text-inherit">Sign in</Button>
        </Link>
      )}
      {!session && (
        <Link
          // href="/api/auth/signup"
          href="/register"
          className="h-full m-2"
          prefetch={true}
        >
          <Button className="h-full w-full text-inherit">Create account</Button>
        </Link>
      )}
      <Button
        // aria-haspopup={true}
        className="h-full text-inherit"
        onClick={handleClick}
      >
        Themes
      </Button>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={themeOnClick("light")}>Light</MenuItem>
        <MenuItem onClick={themeOnClick("dark")}>Dark</MenuItem>
      </Menu>
      {session && (
        <>
          <Image
            src="/img/default_profile.png"
            alt="Account"
            width={0}
            height={0}
            sizes={"100vw"}
            className={`w-[35px] h-[35px] mr-2 aspect-square rounded-full dark:invert-0 invert`}
            onClick={toggleDrawerOpen}
          ></Image>
          <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawerOpen}>
            <Stack onClick={toggleDrawerOpen} spacing={0.2}>
              <Link href="/reservations" prefetch={false}>
                <ListItem className="hover:bg-[lightblue] hover:bg-opacity-30 transition-colors duration-500 ">
                  My Profile
                </ListItem>
              </Link>
              <Link href="/logout" prefetch={true}>
                <ListItem className="hover:bg-[lightblue] hover:bg-opacity-30 transition-colors duration-500 ">
                  Sign Out
                </ListItem>
              </Link>
            </Stack>
          </Drawer>
        </>
      )}
    </div>
  );
}
