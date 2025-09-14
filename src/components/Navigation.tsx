import { useState } from "react";
import { NavLink } from "react-router-dom";
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Menu, X, Gift, BookOpen, Camera, Baby } from "lucide-react";
import { cn } from "@/lib/utils";

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    {
      title: "Votes",
      href: "/",
      icon: Baby,
      description: "Votez pour deviner le genre du bébé"
    },
    {
      title: "Liste de Naissance",
      href: "/cadeaux",
      icon: Gift,
      description: "Liste des cadeaux et réservations"
    },
    {
      title: "Livre d'Or",
      href: "/livre-or",
      icon: BookOpen,
      description: "Laissez vos messages et félicitations"
    },
    {
      title: "Galerie Photo",
      href: "/galerie",
      icon: Camera,
      description: "Photos et souvenirs de grossesse"
    }
  ];

  return (
    <>
      {/* Desktop Navigation */}
      <div className="hidden md:block">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="bg-gradient-to-r from-girl-secondary/20 to-boy-secondary/20 hover:from-girl-secondary/30 hover:to-boy-secondary/30 data-[state=open]:from-girl-secondary/30 data-[state=open]:to-boy-secondary/30">
                Navigation
              </NavigationMenuTrigger>
              <NavigationMenuContent className="bg-popover border shadow-md z-50">
                <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-2">
                  {navigationItems.map((item) => (
                    <li key={item.href}>
                      <NavigationMenuLink asChild>
                        <NavLink
                          to={item.href}
                          className={({ isActive }) =>
                            cn(
                              "block w-full select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-muted/80 focus:bg-muted/80",
                              isActive && "bg-gradient-to-r from-girl-secondary/30 to-boy-secondary/30"
                            )
                          }
                        >
                          <div className="flex items-center gap-2 text-sm font-medium leading-none">
                            <item.icon className="w-4 h-4" />
                            {item.title}
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            {item.description}
                          </p>
                        </NavLink>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="flex items-center gap-2"
        >
          {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          Menu
        </Button>

        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-card/95 backdrop-blur-md border-b shadow-lg z-50">
            <div className="p-4 space-y-2">
              {navigationItems.map((item) => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 p-3 rounded-lg transition-colors hover:bg-accent",
                      isActive && "bg-gradient-to-r from-girl-secondary/30 to-boy-secondary/30"
                    )
                  }
                >
                  <item.icon className="w-4 h-4" />
                  <div>
                    <div className="font-medium text-sm">{item.title}</div>
                    <div className="text-xs text-muted-foreground">{item.description}</div>
                  </div>
                </NavLink>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export { Navigation };