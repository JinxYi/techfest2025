export * from "./appbar";
export * from "./drawer";
export * from "./sidebar";

import { DrawerProvider } from "@/context/drawer-context";
import { Sidebar } from "./sidebar";
export const Layout = ({ children }: React.PropsWithChildren) => {
  return (
    <DrawerProvider>
      <Sidebar title="TechFest">{children}</Sidebar>
    </DrawerProvider>
  );
};
