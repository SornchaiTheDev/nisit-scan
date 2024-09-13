import { redirect } from "next/navigation";

function HomePage() {
  redirect("/auth/sign-in");
}

export default HomePage;
