import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { AppBar } from "@/components/layouts";
import { Drawer } from "@/components/layouts";
import { Link } from "react-router";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import ImageSearchIcon from "@mui/icons-material/ImageSearch";
import "./sidebar.css";

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 2),
  ...theme.mixins.toolbar,
}));

interface SidebarProps extends React.PropsWithChildren {
  title: string;
}

export function Sidebar({ title, children }: SidebarProps) {
  const routes = [
    { path: "/fact-check", name: "Fact Checker", icon: <FactCheckIcon /> },
    { path: "/deepfake-detection", name: "Deepfake Detector", icon: <ImageSearchIcon /> },
  ];

  const [open, setOpen] = React.useState(true);

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open} sx={{boxShadow: "none" ,backgroundColor: "#0e777a" , color:"#ffffff"}}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            {title}
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" 
        open={open} 
        sx={{ 
          "& .MuiDrawer-paper": { backgroundColor: "#ffffff" } ,
          
        }}>
        <DrawerHeader>
          <div className="card-photo"></div>
        </DrawerHeader>
        <DrawerHeader>
          <div className="card-title">JOHN DOE </div>
        </DrawerHeader>
        <List>
          {routes.map((route) => (
            <ListItem key={route.name} disablePadding sx={{ display: "block" ,marginLeft:"5%",  marginRight:"39%" }}>
              <ListItemButton
                component={Link}
                to={route.path}
                selected={location.pathname === route.path}
                sx={{ "&.Mui-selected": { backgroundColor: "#0e777a" , borderRadius: "50px", marginRight:"8%", color:"#ffffff"} }}
              >
                <ListItemIcon>{route.icon}</ListItemIcon>
                <ListItemText primary={route.name} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        {children}
      </Box>
      
    </Box>
  );
}
