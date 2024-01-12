"use client";

import { redirect } from "next/navigation";
import { DEFAULT_PATH } from "./model/routes";


export default () => {
    redirect("/" + DEFAULT_PATH);
}