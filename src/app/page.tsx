"use client";

import React from "react";
import MainView from "./views/mainview";
import { redirect } from "next/navigation";


export default () => {
    redirect("/events");
}