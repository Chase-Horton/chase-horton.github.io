import { Metadata } from "next";
import TikTokPage from "./tik-tok-component";

export const metadata: Metadata = {
    title: "tik_tok",
    description: "A visualization of the remainder of your life. Select your birthdate to see how long you've lived and how long remains, based on an average life expectancy of 90 years.",
};

export default function LifeToyPage() {
    return (
        <TikTokPage />
    );
}