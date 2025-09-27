"use client";

import * as React from "react";
import Link from "next/link";
import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "./ui/navigation-menu";

const components: { title: string; href: string; description: string }[] = [
  {
    title: "Counter",
    href: "/counter",
    description: "View and interact with the counter component.",
  },
  {
    title: "Create Counter",
    href: "/create",
    description: "Create a new counter instance on the blockchain.",
  },
  {
    title: "About",
    href: "/about",
    description: "Learn more about this counter application.",
  },
];

export default function Navbar() {
  const currentAccount = useCurrentAccount();
  return (
    <NavigationMenu className="max-w-full p-4 bg-[#202c54] border-b border-gray-200">
      <div className="flex w-full items-center">
        <div className="flex items-center flex-1">
          <ul className="flex gap-5 ml-6 list-none p-0 m-0 items-center">
            <li className="list-none">
              <NavigationMenuItem>
                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                  <Link href="/" className="flex items-center font-semibold text-lg text-white">
                    <img src="/homepage_button.png" alt="Home" className="w-6 h-6" />
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </li>
            <li className="list-none">
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-white text-lg font-semibold">Get help</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-6 md:w-[350px] lg:w-[400px] bg-white">
                    <ListItem
                      title="How VeilAccord works"
                      href="/explainVA"
                    >
                      Learn how to use the platform and get the most out of your experience.
                    </ListItem>
                    <ListItem
                      title="FAQ / Help center"
                      href="/helpCenter"
                    >
                      Find answers to common questions or get support.
                    </ListItem>
                    <ListItem
                      title="About Us"
                      href="/aboutUs"
                    >
                      Discover our mission, vision, and the team behind VeilAccord.
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </li>
          </ul>
        </div>
        <div className="flex-1" />
        <div className="flex items-center justify-end gap-3">
          {currentAccount && (
            <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
              <Link href="/postJob" className="flex items-center font-semibold text-lg text-white">
                Post Job Offer
              </Link>
            </NavigationMenuLink>
          )}
          <ConnectButton />
        </div>
      </div>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <div>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={`block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-slate-100 hover:text-slate-900 focus:bg-slate-100 focus:text-slate-900 ${className}`}
          {...props}
        >
          <div className="text-sm font-medium leading-none text-gray-900">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-slate-600">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </div>
  );
});
ListItem.displayName = "ListItem";