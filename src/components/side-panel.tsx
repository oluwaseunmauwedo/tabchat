import React from "react"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarRail,
    SidebarSeparator,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { Croissant_One } from 'next/font/google';

export const kodeMono = Croissant_One({
    variable: "--font-kode-mono",
    subsets: ["latin"],
    weight: "400",
});


export function Sidepanel() {
    return (
        <Sidebar
            variant="inset"
            side="left"
            className="sp-sidebar"
        >
            <SidebarRail />
            <SidebarHeader className="sp-header">
                <div className="flex items-center justify-between px-4 py-3">


                    <div className={`sp-title text-9xl font-semibold tracking-tight ${kodeMono.className}`}>picflow</div>


                    <SidebarTrigger className="h-8 w-8 hover:bg-sidebar-accent/50 transition-colors rounded-lg" />
                </div>
            </SidebarHeader>

            <SidebarContent className="sp-content px-2 py-2">
                <SidebarGroup>
                    <SidebarGroupLabel className="sp-group-label px-2">
                        Navigation
                    </SidebarGroupLabel>

                    <SidebarGroupContent>
                        <SidebarMenu className="gap-1.5">
                            <SidebarMenuButton className="sp-button" tooltip="Home" data-active="true">
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" aria-hidden>
                                    <path d="M3 10.5l9-6 9 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M7 13v7h10v-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <span className="sp-label">Home</span>
                            </SidebarMenuButton>
                            <SidebarMenuButton className="sp-button" tooltip="Create">
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" aria-hidden>
                                    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <span className="sp-label">Create</span>
                            </SidebarMenuButton>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarSeparator />
            </SidebarContent>
        </Sidebar>
    )
}