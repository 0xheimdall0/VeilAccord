"use client";

import * as React from "react";
import Link from "next/link";
import { ConnectButton } from "@mysten/dapp-kit";
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
                <NavigationMenuTrigger className="text-white text-lg font-semibold">Features</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] bg-white">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <Link
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-slate-50 to-slate-100 p-6 no-underline outline-none focus:shadow-md"
                          href="/"
                        >
                          <div className="mb-2 mt-4 text-lg font-medium text-gray-900">
                            Job search
                          </div>
                          <p className="text-sm leading-tight text-slate-600">
                            The perfect place to hire and get hired.
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    {components.map((component) => (
                      <ListItem
                        key={component.title}
                        title={component.title}
                        href={component.href}
                      >
                        {component.description}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </li>
          </ul>
        </div>
        <div className="flex-1" />
        <div className="flex items-center justify-end">
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
    <li>
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
    </li>
  );
});
ListItem.displayName = "ListItem";