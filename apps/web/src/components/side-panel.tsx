"use client"
import React from "react"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarRail,
    SidebarSeparator,
    SidebarTrigger,
    useSidebar,
} from "@/components/ui/sidebar"
import { ModeToggle } from "@/components/mode-toggle"
import { usePathname, useRouter } from "next/navigation";
import { Button } from "./ui/button";
import Link from "next/link";

function SidebarThemeToggleWrapper() {
    const { state, setOpen, isMobile, setOpenMobile } = useSidebar()
    const handleClick = () => {
        if (isMobile) {
            setOpenMobile(true)
        } else if (state === "collapsed") {
            setOpen(true)
        }
    }
    return (
        <div onClick={handleClick}>
            <ModeToggle />
        </div>
    )
}

export function Sidepanel() {
    const router = useRouter();
    const pathname = usePathname();
    return (
        <Sidebar
            variant="inset"
            side="left"
            className="sp-sidebar overflow-hidden"
        >
            <SidebarRail />
            <SidebarHeader className="sp-header relative">
                
            <h1 className="text-5xl sm:text-6xl px-10 py-3 lg:text-2xl xl:text-3xl font-bold tracking-tight leading-[0.9]">
                <Link href="/">
                <span className="bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
                  picflow
                </span>
                </Link>
              </h1>
                <div className="absolute -top-2 -right-2 w-16 h-16 bg-sidebar rounded-bl-[2rem] border-l border-b border-border">
                    <div className="absolute top-3 right-3">
                        <SidebarThemeToggleWrapper />
                    </div>
                </div>
            </SidebarHeader>
  
        
            <SidebarContent className="sp-content px-2 py-2 overflow-hidden">
            <div className="flex items-center justify-end px-2 pb-2">
                <SidebarTrigger className="h-7 w-7 rounded-md hover:bg-muted transition-colors" />
            </div>
            <SidebarSeparator />
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu className="space-y-1">
                            <SidebarMenuButton onClick={() => router.push("/generate")} className="rounded-md" tooltip="Text to Image" data-active={pathname === "/generate"}>
                                <span>Generate Images</span>
                            </SidebarMenuButton>
                            <SidebarMenuButton onClick={() => router.push("/gallery")} className="rounded-md" tooltip="Image to Image" data-active={pathname === "/gallery"}>
                                <span>Gallery</span>
                            </SidebarMenuButton>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
               
            </SidebarContent>
            <SidebarFooter>
                    <Button onClick={() => router.push("/setting")} className="rounded-md" variant="outline" data-active={pathname === "/setting"}>
                        <span>Settings</span>
                    </Button>
            </SidebarFooter>
        </Sidebar>
    )
}
